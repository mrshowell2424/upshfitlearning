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
/** A cold dev-server compile of a heavy page outruns a short timeout. */
const NAV_TIMEOUT = Number(process.env.CHECK_NAV_TIMEOUT ?? 60000);

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
/** Answered when asked directly, but the browser could not render it in time. */
const slow = [];
const reached = [];

/** Images are fetched once each, however many pages show them. */
const assetSeen = new Map();

while (queue.length && reached.length < MAX_PAGES) {
  const [url, from] = queue.shift();
  if (seen.has(url)) continue;
  seen.add(url);

  /*
   * Three attempts, with a pause, and then ask without the browser.
   *
   * This used to be two attempts back to back, on the reasoning that the
   * first compiles the route and the second finds it warm. A timeout does
   * not mean the compile finished, only that Playwright stopped waiting, so
   * the retry raced the same compile and lost the same way. It also left the
   * page sitting on chrome-error://, which is where "interrupted by another
   * navigation" came from: the retry collided with the aborted one.
   *
   * So: blank the page between attempts to clear that state, wait for the
   * compile rather than against it, and if the browser still cannot get
   * there, fetch the url directly. Three runs of this reported 2, 2 and 3
   * broken links, all different, every one of them answering 200 when asked
   * directly. A link check is about whether the url answers. If it does,
   * this is a page that was too slow to render, which is worth saying and
   * is not a broken link.
   */
  let status = 0;
  let failure = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) {
      await page.goto("about:blank").catch(() => {});
      await new Promise((r) => setTimeout(r, attempt * 3000));
    }
    try {
      const r = await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
      status = r?.status() ?? 0;
      failure = null;
      break;
    } catch (e) {
      failure = String(e.message).split("\n")[0];
    }
  }
  if (failure) {
    // The browser could not get there. Ask plainly before calling it broken.
    const direct = await ctx.request.get(BASE + url, { timeout: 30000 }).catch(() => null);
    if (direct && direct.status() < 400) {
      slow.push([url, direct.status(), from, failure]);
      continue;
    }
    broken.push([url, direct ? direct.status() : "no response", from, failure]);
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

/*
 * The sitemap, which a crawl from the home page cannot reach.
 *
 * This walks outward from "/", so it only ever sees what something links
 * to. /pricing was published in the sitemap and linked from nowhere -- the
 * Plans page came down and everything went free -- so it sat there as a 307
 * to the home page, told to search engines, and no crawl could find it.
 *
 * A sitemap is a list of pages asserted to be worth indexing. A redirect is
 * not one, and neither is a 404, so both are reported here.
 */
const sitemapProblems = [];
{
  const res = await fetch(`${BASE}/sitemap.xml`).catch(() => null);
  if (!res || !res.ok) {
    sitemapProblems.push(["/sitemap.xml", res ? res.status : "no response", "could not be read"]);
  } else {
    const xml = await res.text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    // Every hand-written route, and one of each generated shape.
    //
    // The first version of this collapsed a path to its shape by replacing
    // the last segment with *, which turns /pricing into /* -- and so does
    // /about, /math and every other top-level route. It checked one of the
    // 29 and skipped the rest, then reported the sitemap clean while the
    // route this was written to catch sat in it. A single-segment path is
    // its own shape; only a deeper one is a template worth sampling.
    const seenShape = new Set();
    const sample = urls.filter((u) => {
      const path = new URL(u).pathname;
      const shape = path.split("/").filter(Boolean).length > 1
        ? path.replace(/\/[^/]+$/, "/*")
        : path;
      if (seenShape.has(shape)) return false;
      seenShape.add(shape);
      return true;
    });
    for (const u of sample) {
      const r = await fetch(u, { redirect: "manual" }).catch(() => null);
      if (!r) sitemapProblems.push([u, "no response", "in the sitemap"]);
      else if (r.status >= 300 && r.status < 400)
        sitemapProblems.push([u, r.status, `in the sitemap but redirects to ${r.headers.get("location")}`]);
      else if (r.status >= 400) sitemapProblems.push([u, r.status, "in the sitemap"]);
    }
    console.log(`sitemap urls:   ${urls.length} (${sample.length} distinct shapes checked)`);
  }
}
for (const [url, status, note] of sitemapProblems) broken.push([url, status, "sitemap.xml", note]);

console.log(`pages reached:  ${reached.length}`);
console.log(`images checked: ${assetSeen.size}`);
if (reached.length >= MAX_PAGES) {
  console.log(`\nStopped at the ${MAX_PAGES}-page limit, so this was not the whole site.`);
  console.log("Raise it with CHECK_MAX if the site has grown past it.");
}

if (slow.length) {
  console.log(`\nslow to render, but they answer (${slow.length}):`);
  for (const [url, status, from, note] of slow) {
    console.log(`  ${String(status).padStart(11)}  ${url}`);
    console.log(`               linked from ${from}  (${note})`);
  }
  console.log("  These are not broken links. Raise CHECK_NAV_TIMEOUT if they persist.");
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
