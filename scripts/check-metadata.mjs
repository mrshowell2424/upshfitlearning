/**
 * Every page has to say what it is.
 *
 * 23 of the site's 34 routes once set no title at all and inherited one
 * generic line, so a teacher with five tabs open saw the same eleven
 * characters five times and a link pasted into a staff email previewed as
 * the site rather than the thing being shared.
 *
 * Fixing it introduced two faults of its own, which is why this exists as a
 * check rather than a one-off read-through:
 *
 *   A layout that sets `title` to a plain string takes the brand template
 *   with it, so every page beneath lost the suffix.
 *
 *   A layout that sets `title.default` gets the parent template applied to
 *   it, so writing the brand into the default spelled it twice.
 *
 * Both render perfectly well and both compile. Only the rendered <title>
 * shows them, so that is what this reads.
 *
 *   bun scripts/check-metadata.mjs            (expects a dev server on :3000)
 *   BASE=https://… bun scripts/check-metadata.mjs
 */

const BASE = process.env.BASE || "http://localhost:3000";
const BRAND = "Upshift Learning";

/** Redirects -- they never render a document of their own. */
const SKIP = new Set(["/videos", "/match/random"]);

const ROUTES = [
  "/", "/about", "/behavior", "/behavior/year", "/courses", "/pricing",
  "/sentence-lab", "/science-of-reading", "/science-of-reading/threads",
  "/science-of-reading/resources", "/fluency", "/vocabulary", "/math", "/pbl",
  "/learning-science", "/success", "/resources", "/reading", "/og-packs",
  "/design-thinking", "/lounge", "/planner", "/match",
  "/auth/signin", "/auth/signup", "/auth/login", "/auth/complete",
  // one of each dynamic shape, so generateMetadata is exercised too
  "/match/RL.4.6", "/match/grade/4", "/lounge/spaced-repetition",
];

const decode = (s) =>
  s.replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&")
   .replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const tag = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]).trim() : "";
};

const problems = [];
let checked = 0;

for (const route of ROUTES) {
  if (SKIP.has(route)) continue;

  let html;
  try {
    const res = await fetch(BASE + route, { redirect: "follow" });
    if (!res.ok) { problems.push([route, `HTTP ${res.status}`]); continue; }
    html = await res.text();
  } catch (err) {
    problems.push([route, `no response (${err.message})`]);
    continue;
  }

  checked++;
  const title = tag(html, /<title[^>]*>([^<]*)<\/title>/i);
  const desc = tag(html, /<meta name="description" content="([^"]*)"/i);

  if (!title) {
    problems.push([route, "no <title> at all"]);
  } else if (title.split(BRAND).length - 1 > 1) {
    problems.push([route, `brand twice: "${title}"`]);
  } else if (!title.includes(BRAND)) {
    problems.push([route, `no brand -- a parent layout ate the template: "${title}"`]);
  } else if (title.replace(`· ${BRAND}`, "").trim().length < 2) {
    problems.push([route, `brand only, no name of its own: "${title}"`]);
  }

  if (!desc) problems.push([route, "no description"]);
}

console.log(`routes checked: ${checked}`);

if (problems.length) {
  console.log(`\nproblems: ${problems.length}\n`);
  for (const [route, why] of problems) console.log(`  ${route.padEnd(32)} ${why}`);
  process.exit(1);
}

console.log("\n✅ every page names itself, once");
