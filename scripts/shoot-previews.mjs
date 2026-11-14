/**
 * Preview shots for the hub cards.
 *
 * Every card in a hub grid shows a band off the top of the page it links to,
 * cropped to 20:7 by the card itself. The shots used to be taken by hand,
 * which is why the three newest pages had no card at all -- they shipped, and
 * then sat unreachable from the grid because nobody took their photograph.
 *
 * So this takes them, repeatably, against the running dev server:
 *
 *   bun run dev                       # in another terminal
 *   bun scripts/shoot-previews.mjs    # all of them
 *   bun scripts/shoot-previews.mjs threads sentence-lab
 *
 * Two things matter and are easy to get wrong:
 *
 *   The gate. Most of these pages sit behind SignInGate, which blurs its
 *   children for a visitor without an account. A blurred screenshot looks
 *   like a broken image rather than a locked page, so this sets the preview
 *   tier in localStorage before the first paint -- the same bypass the
 *   toggle uses -- and then checks the shot is not blurred by failing if the
 *   gate's own panel is still on the page.
 *
 *   The scale. The card crops a 20:7 window out of the top of the shot, so
 *   the shot has to be the same shape every time or `focus` stops meaning
 *   the same thing from one card to the next. Viewport 1200x1130 at 2x, to
 *   match reading-resources.png, which is the sharpest of the existing set.
 */
import { chromium } from "playwright";
import { existsSync } from "node:fs";

const BASE = process.env.PREVIEW_BASE ?? "http://localhost:3000";

/** width x height in CSS pixels, doubled on disk. */
const VIEW = { width: 1200, height: 1130 };
const SCALE = 2;

/**
 * Every preview whose page is a Next page on this site. The other three --
 * the workbook, the resources page and the OG pack -- are served out of the
 * materials table as standalone HTML with no site chrome of their own, which
 * is why they were never in a script and why they already look right.
 */
const SHOTS = [
  { name: "threads", path: "/science-of-reading/threads?t=water" },
  { name: "sentence-lab", path: "/sentence-lab?g=3" },
  { name: "ef-year", path: "/behavior/year?w=1" },
  { name: "fluency", path: "/fluency" },
  { name: "teach-a-word", path: "/vocabulary" },
];

const asked = process.argv.slice(2);
const todo = asked.length ? SHOTS.filter((s) => asked.includes(s.name)) : SHOTS;

if (asked.length && todo.length !== asked.length) {
  const known = SHOTS.map((s) => s.name).join(", ");
  console.error(`Unknown shot. Known shots: ${known}`);
  process.exit(1);
}

const res = await fetch(BASE).catch(() => null);
if (!res?.ok) {
  console.error(`No server at ${BASE}. Start it with: bun run dev`);
  process.exit(1);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: VIEW,
  deviceScaleFactor: SCALE,
  // Nothing here should animate into place mid-shot, but a page that honours
  // reduced motion settles faster and more predictably.
  reducedMotion: "reduce",
});

// Before the first script on the page, so the gate never renders blurred.
await ctx.addInitScript(() => {
  try {
    localStorage.setItem("upshift:preview-tier", "pro");
  } catch {
    /* private window; the gate check below will catch it */
  }
});

const page = await ctx.newPage();
const problems = [];

for (const shot of todo) {
  const url = BASE + shot.path;
  const out = `public/previews/${shot.name}.png`;
  const resp = await page.goto(url, { waitUntil: "networkidle" });

  if (!resp || resp.status() >= 400) {
    problems.push(`${shot.name}: ${url} returned ${resp ? resp.status() : "nothing"}`);
    continue;
  }

  // The gate's panel carries this exact line, and nothing else on the site
  // does. If it is on the page, the bypass did not take and the shot
  // underneath it is blurred.
  const gated = await page.locator("text=No card, no trial period, no expiry.").count();
  if (gated) {
    problems.push(`${shot.name}: still behind the sign-in gate, so the shot would be blurred`);
    continue;
  }

  // The card showing this shot already sits under the site navigation, so a
  // nav bar inside the picture is the same bar twice. Out go the header, the
  // footer and the dev-server indicator, and the page's own first words
  // become the first thing in frame -- which is what the other previews on
  // the grid show, because the pages behind them have no site chrome at all.
  await page.addStyleTag({
    content: "header, footer, nextjs-portal { display: none !important }",
  });

  await page.screenshot({ path: out, clip: { x: 0, y: 0, ...VIEW } });
  console.log(`  ${out.padEnd(34)} ${VIEW.width * SCALE}x${VIEW.height * SCALE}`);
}

await browser.close();

if (problems.length) {
  console.error("\nnot shot:");
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}

for (const s of todo) {
  if (!existsSync(`public/previews/${s.name}.png`)) {
    console.error(`${s.name}.png was not written`);
    process.exit(1);
  }
}
console.log(`\n${todo.length} preview${todo.length === 1 ? "" : "s"} shot.`);
