/**
 * Walk the site and fail if anything is unreachable.
 *
 * This existed as a throwaway in a temp directory, which is the same as not
 * existing: it found nothing twice. Here it is a check like the others, so
 * it can run before a push.
 *
 *   bun run dev                   # in another terminal
 *   bun scripts/check-links.mjs
 *
 * What it does, and what it deliberately does not:
 *
 *   It follows internal links from the home page outward, and reports the
 *   page that linked a broken one -- a bare list of dead URLs sends you
 *   hunting for who pointed at them.
 *
 *   It checks images as well as pages, because a card whose picture 404s
 *   still renders as a page that "works". Preview shots are referenced
 *   through next/image, so the markup carries /_next/image?url=... and that
 *   is what gets fetched: the real request a browser makes, not the file
 *   path we hoped it would resolve to.
 *
 *   It signs in through the preview tier, so gated pages are crawled rather
 *   than counted as one blurred page with no links on it.
 *
 *   It does not crawl every query string. One page with seven grades and
 *   fifty articles is thousands of URLs that all run the same code, so each
 *   path is visited a few times at most and the rest are taken on trust.
 */
import { chromium } from "playwright";

const BASE = process.env.CHECK_BASE ?? "http://localhost:3000";
const MAX_PAGES = Number(process.env.CHECK_MAX ?? 250);
/** How many URLs to follow for any one route. */
const PER_ROUTE = 4;

/**
 * The route a URL belongs to, with its variable parts folded away.
 *
 * Capping by literal path does not work here: /match/RL.4.6 and
 * /match/RI.2.1 are different paths and the same page, and there are several
 * hundred of them. The first run of this walked 250 pages and never left the
 * standards. Anything that looks like an identifier rather than a word
 * becomes :id, and four of each route is plenty -- they all run the same
 * code, and a fifth proves nothing the fourth did not.
 */
const routeOf = (url) => {
  const path = url.split("?")[0];
  return path
    .split("/")
    .map((seg) =>
      // A standard code (RL.4.6), a uuid, a number, or anything else with a
      // digit or a dot in it: not a route name.
      /\d/.test(seg) || /^[0-9a-f-]{8,}$/i.test(seg) ? ":id" : seg,
    )
    .join("/");
};

const res = await fetch(BASE).catch(() => null);
if (!res?.ok) {
  console.error(`No server at ${BASE}. Start it with: bun run dev`);
  process.exit(1);
}

const browser = await chromium.launch();
const ctx = await browser.newContext();
await ctx.addInitScript(() => {
  try {
    localStorage.setItem("upshift:preview-tier", "pro");
  } catch {
    /* ignore */
  }
});
const page = await ctx.newPage();

const seen = new Set();
const perRoute = new Map();
const queue = [["/", "(the start)"]];
const broken = [];
const reached = [];

/** Images are fetched once each, however many pages show them. */
const assetSeen = new Map();

while (queue.length && reached.length < MAX_PAGES) {
  const [url, from] = queue.shift();
  if (seen.has(url)) continue;
  seen.add(url);

  /*
   * Twice before giving up. The first request to a route on a dev server
   * compiles it, which on the heavier pages takes longer than any sensible
   * timeout -- and a slow first compile is not a broken link. The second
   * attempt hits a warm route, so a page that fails both times is failing
   * for a reason worth printing.
   */
  let status = 0;
  let failure = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 45000 });
      status = r?.status() ?? 0;
      failure = null;
      break;
    } catch (e) {
      failure = String(e.message).split("\n")[0];
    }
  }
  if (failure) {
    broken.push([url, "no response", from, failure]);
    continue;
  }
  if (status >= 400 || status === 0) {
    broken.push([url, status, from, ""]);
    continue;
  }
  reached.push(url);

  const found = await page.evaluate(() => ({
    links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
    images: [...document.querySelectorAll("img[src]")].map((i) => i.getAttribute("src")),
  }));

  for (const href of found.links) {
    if (!href || !href.startsWith("/") || href.startsWith("//")) continue;
    const clean = href.split("#")[0];
    if (!clean || seen.has(clean)) continue;
    // API routes answer to fetch, not to a browser, and several of them are
    // POST only -- a GET returning 405 is correct and would read as a break.
    if (clean.startsWith("/api/")) continue;
    const route = routeOf(clean);
    const n = perRoute.get(route) ?? 0;
    if (n >= PER_ROUTE) continue;
    perRoute.set(route, n + 1);
    queue.push([clean, url]);
  }

  for (const src of found.images) {
    if (!src || !src.startsWith("/") || src.startsWith("//")) continue;
    if (assetSeen.has(src)) continue;
    assetSeen.set(src, url);
  }
}

// Images, after the walk, so one request covers every page that shows it.
for (const [src, from] of assetSeen) {
  let status = 0;
  try {
    const r = await ctx.request.get(BASE + src, { timeout: 20000 });
    status = r.status();
  } catch (e) {
    broken.push([src, "no response", from, String(e.message).split("\n")[0]]);
    continue;
  }
  if (status >= 400) broken.push([src, status, from, ""]);
}

await browser.close();

console.log(`pages reached:  ${reached.length}`);
console.log(`images checked: ${assetSeen.size}`);
if (reached.length >= MAX_PAGES) {
  console.log(`\nStopped at the ${MAX_PAGES}-page limit, so this was not the whole site.`);
  console.log("Raise it with CHECK_MAX if the site has grown past it.");
}

if (!broken.length) {
  console.log("\n✅ every link and image on the site answers");
  process.exit(0);
}

console.log(`\nbroken: ${broken.length}`);
for (const [url, status, from, note] of broken) {
  console.log(`  ${String(status).padStart(11)}  ${url}`);
  console.log(`               linked from ${from}${note ? `  (${note})` : ""}`);
}
process.exit(1);
