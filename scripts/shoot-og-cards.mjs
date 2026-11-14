/**
 * The link preview cards.
 *
 * A page shared into a staff email, a teacher group or a district newsletter
 * previews with whatever image the page declares, and the site declared
 * none -- so a link that now says what it opens still arrived as a bare
 * rectangle of text next to everything else in the feed.
 *
 * These are drawn rather than screenshotted. The page previews in
 * public/previews are 2400x2260, and a link card is 1.91:1, so using one
 * would mean handing Facebook a near-square image to crop to a horizontal
 * band -- an arbitrary slice of a screenshot, unreadable at card size.
 *
 * The type is the real Poppins the site ships, not a lookalike: next/font
 * has already downloaded it into .next, and a browser can load woff2 even
 * though satori (and so next/og) cannot. The weight-to-file map lives in
 * Next's own generated CSS, which is what gets parsed below. Baking it into
 * a PNG here means the font has to exist at generation time and never at
 * runtime.
 *
 *   bun run build && bun scripts/shoot-og-cards.mjs
 */

import { readFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/og");

/**
 * Imported by its path inside this project on purpose. A bare "playwright"
 * resolves to a browserless playwright-core out of bun's global cache when
 * this is run from anywhere but the repo root, and the failure reads
 * "Executable doesn't exist" rather than "wrong package".
 */
const { chromium } = await import(
  pathToFileURL(join(ROOT, "node_modules/playwright/index.mjs")).href
);

const BRAND = {
  ink: "#111111",
  mid: "#444444",
  paper: "#F7F6F4",
  coral: "#FF6A5B",
  pink: "#FF7DAE",
  lavender: "#B87DFF",
  teal: "#00B4A6",
};

/** Pull the weight -> woff2 map out of the CSS next/font generated. */
function poppinsFaces() {
  const chunks = join(ROOT, ".next/dev/static/chunks");
  if (!existsSync(chunks)) {
    throw new Error(
      "No .next/dev build to read fonts from. Start the dev server once " +
        "(bun run dev) so next/font downloads Poppins, then re-run.",
    );
  }

  const files = readdirSync(chunks).filter(
    (f) => f.includes("font_google_poppins") && f.endsWith(".css"),
  );
  if (!files.length) throw new Error("No Poppins CSS in .next/dev/static/chunks");

  const faces = [];
  for (const file of files) {
    const path = join(chunks, file);
    const css = readFileSync(path, "utf8");
    for (const block of css.split("@font-face")) {
      const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
      const url = block.match(/src:\s*url\("([^"]+)"\)/)?.[1];
      if (!weight || !url) continue;
      const abs = resolve(dirname(path), url);
      if (existsSync(abs)) faces.push({ weight, abs });
    }
  }
  if (!faces.length) throw new Error("Parsed the Poppins CSS but found no woff2 on disk");
  return faces;
}

/**
 * Embedded as data: URLs rather than linked as file:// ones. setContent
 * gives the page an opaque origin, which is not allowed to fetch a local
 * font -- the first run of this silently fell back to Helvetica and looked
 * close enough to pass at a glance, which is exactly the kind of wrong a
 * brand card should not be.
 */
const WEIGHTS = new Set(["500", "700", "800"]);
const faces = poppinsFaces().filter((f) => WEIGHTS.has(f.weight));
if (!faces.length) throw new Error("No Poppins at weights 500/700/800 on disk");

const fontCss = faces
  .map(({ weight, abs }) => {
    const b64 = readFileSync(abs).toString("base64");
    return (
      `@font-face{font-family:Poppins;font-style:normal;font-weight:${weight};` +
      `font-display:block;src:url(data:font/woff2;base64,${b64}) format("woff2")}`
    );
  })
  .join("\n");

const chevron = join(ROOT, "public/brand/chevron-coral-1024.png");
const chevronData = existsSync(chevron)
  ? `data:image/png;base64,${readFileSync(chevron).toString("base64")}`
  : null;

/**
 * One card per thing worth sharing on its own. `eyebrow` is the section a
 * teacher would say out loud, `title` is the page, `line` is why they would
 * open it -- the same three the page itself leads with.
 */
const CARDS = [
  { file: "default", eyebrow: "Upshift Learning", title: "Describe the lesson.\nGet the lesson.",
    line: "Lesson blueprints for every K–12 standard, built on what the research actually says.", accent: BRAND.coral },

  { file: "science-of-reading", eyebrow: "Science of Reading", title: "Every strand of the rope,\nwith the materials attached.",
    line: "Articles, mysteries, workbooks, fluency, vocabulary and sentence work.", accent: BRAND.teal },

  { file: "behavior", eyebrow: "Behavior Strategies", title: "Start from what you\ncan actually see.",
    line: "What it looks like, what is happening inside, what helps now, what builds the skill.", accent: BRAND.lavender },

  { file: "match", eyebrow: "Standards", title: "Every standard,\nunpacked and planned.",
    line: "Search a code or describe the lesson, and open the blueprint for any of them.", accent: BRAND.pink },

  { file: "sentence-lab", eyebrow: "Sentence Lab", title: "The answer key is\nnot an opinion.",
    line: "Nine minutes on how a sentence is built, from an article your class has read.", accent: BRAND.lavender },

  { file: "fluency", eyebrow: "Fluency", title: "A one-minute read,\nscored while they read it.",
    line: "Words correct per minute, accuracy and a prosody rating on any Upshift passage.", accent: BRAND.teal },

  { file: "writing", eyebrow: "Opinion Writing", title: "Argue from a text\nyou can read.",
    line: "Sixty-two prompts, each with a passage written at the pattern you are teaching.", accent: BRAND.coral },

  { file: "morphology", eyebrow: "Word Parts", title: "Read words nobody\ntaught you.",
    line: "Prefixes, suffixes and roots, on words your class has already met in an article.", accent: BRAND.teal },

  { file: "vocabulary", eyebrow: "Teach a Word", title: "Say it, use it, write it.",
    line: "A three-phase routine on every word in the article library.", accent: BRAND.coral },
];

const card = ({ eyebrow, title, line, accent }) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
${fontCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px}
body{font-family:Poppins,sans-serif;background:${BRAND.paper};
  display:flex;flex-direction:column;
  padding:60px 72px;position:relative;overflow:hidden}
.body{flex:1;display:flex;flex-direction:column;justify-content:center}
.edge{position:absolute;left:0;top:0;bottom:0;width:14px;background:${accent}}
.eyebrow{font-size:21px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:${accent}}
h1{font-size:64px;font-weight:800;letter-spacing:-1.6px;line-height:1.1;color:${BRAND.ink};
  white-space:pre-line;margin:22px 0 0;max-width:19ch}
.line{font-size:25px;font-weight:500;line-height:1.45;color:${BRAND.mid};max-width:46ch;margin:26px 0 0}
footer{display:flex;align-items:center;gap:16px}
footer img{width:46px;height:46px;object-fit:contain}
.word{font-size:26px;font-weight:800;color:${BRAND.ink};letter-spacing:-.4px}
.ramp{margin-left:auto;display:flex;gap:7px}
.ramp i{width:30px;height:9px;border-radius:9px;display:block}
</style></head><body>
  <div class="edge"></div>
  <div class="body">
    <div class="eyebrow">${eyebrow}</div>
    <h1>${title}</h1>
    <p class="line">${line}</p>
  </div>
  <footer>
    ${chevronData ? `<img src="${chevronData}" alt="">` : ""}
    <span class="word">Upshift Learning</span>
    <span class="ramp">
      <i style="background:${BRAND.coral}"></i><i style="background:${BRAND.pink}"></i>
      <i style="background:${BRAND.lavender}"></i><i style="background:${BRAND.teal}"></i>
    </span>
  </footer>
</body></html>`;

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});

for (const spec of CARDS) {
  await page.setContent(card(spec), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const path = join(OUT, `${spec.file}.png`);
  await page.screenshot({ path });
  console.log(`  ${spec.file}.png`.padEnd(28), spec.eyebrow);
}

await browser.close();
console.log(`\n${CARDS.length} cards -> public/og/ (1200x630 at 2x)`);
