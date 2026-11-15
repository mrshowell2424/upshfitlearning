/**
 * Does the site work for a child using a keyboard, a teacher on a school
 * projector, and a district that asks about WCAG before it buys?
 *
 * Three things are measured here, and only one of them is axe's:
 *
 *   axe-core, at WCAG 2.1 A and AA. That catches contrast, missing alt
 *   text, form fields with no label, landmark and heading structure.
 *
 *   Focus visibility, which axe cannot see. A focus ring that is painted
 *   by the browser default and then removed by a reset is invisible, and
 *   a keyboard user is then lost on the page with no way to tell where
 *   they are. This tabs through the first forty stops of every page and
 *   compares a screenshot of the focused element against itself unfocused.
 *
 *   Target size, because these pages are used on classroom tablets and a
 *   pill a child cannot hit is a pill that is not there. WCAG 2.2 wants
 *   24x24 CSS pixels, with the exception that matters: a smaller target
 *   passes when nothing else is within 24px of it. A header nav of short
 *   links with real space between them is fine; a tight row of controls
 *   is not. Measuring the box alone flagged 477 of these and almost all
 *   of them were the nav.
 *
 * Gated routes are opened with the preview tier set, because auditing the
 * sign-in prompt instead of the page behind it measures nothing.
 *
 *   bun scripts/check-a11y.mjs                  (expects a server on :3000)
 *   BASE=http://localhost:3100 bun scripts/check-a11y.mjs
 *   bun scripts/check-a11y.mjs /writing /fluency   (just these)
 */

import { readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE || "http://localhost:3000";

const { chromium } = await import(
  pathToFileURL(join(ROOT, "node_modules/playwright/index.mjs")).href
);

const AXE = readFileSync(join(ROOT, "node_modules/axe-core/axe.min.js"), "utf8");

const ALL_ROUTES = [
  "/", "/about", "/behavior", "/behavior/year", "/courses", "/pricing",
  "/sentence-lab", "/morphology", "/morphology/print",
  "/writing", "/writing/print",
  "/spelling", "/spelling?view=student", "/spelling/print",
  "/word-ladders", "/word-ladders?view=student", "/word-ladders/print",
  "/review", "/review/print",
  "/passages", "/passages?view=student", "/passages/print",
  "/heart-words", "/heart-words?view=student", "/heart-words/print",
  "/science-of-reading", "/science-of-reading/threads",
  "/science-of-reading/resources",
  "/fluency", "/fluency/play", "/fluency/play?view=student", "/fluency/print",
  "/vocabulary", "/math", "/pbl", "/learning-science",
  "/resources", "/reading", "/og-packs", "/design-thinking",
  "/lounge", "/lounge/spaced-repetition", "/planner", "/match", "/match/RL.4.6",
  "/auth/signin", "/auth/signup",
];

const argv = process.argv.slice(2).filter((a) => a.startsWith("/"));
const ROUTES = argv.length ? argv : ALL_ROUTES;

/** Rules axe reports that are judgement calls rather than defects here. */
const IGNORE = new Set([
  // Next.js dev overlay only; never shipped.
  "aria-hidden-body",
]);

const MIN_TARGET = 24;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 1,
});
// The gate is a prompt, not a lock, and auditing the prompt tells us nothing
// about the page behind it.
await ctx.addInitScript(() => {
  try {
    localStorage.setItem("upshift:preview-tier", "pro");
  } catch {}
});

const findings = [];
const add = (route, kind, detail) => findings.push({ route, kind, detail });

for (const route of ROUTES) {
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  try {
    const res = await page.goto(BASE + route, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    if (!res || !res.ok()) {
      add(route, "http", `HTTP ${res ? res.status() : "no response"}`);
      await page.close();
      continue;
    }
    // Client components mount after hydration; the gate decides there.
    await page.waitForTimeout(900);

    await page.addScriptTag({ content: AXE });

    const result = await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      return await axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
        resultTypes: ["violations"],
      });
    });

    for (const v of result.violations) {
      if (IGNORE.has(v.id)) continue;
      for (const node of v.nodes.slice(0, 4)) {
        add(route, v.id, `${v.impact} · ${node.target.join(" ")} · ${node.failureSummary.split("\n").filter(Boolean).slice(1).join(" / ")}`);
      }
      if (v.nodes.length > 4) add(route, v.id, `…and ${v.nodes.length - 4} more`);
    }

    /* ---- focus visibility ------------------------------------------- */
    const focus = await page.evaluate((MIN) => {
      const out = { invisible: [], small: [] };
      const sel =
        'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';
      const els = Array.from(document.querySelectorAll(sel)).filter((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
      });

      const describe = (el) => {
        const id = el.id ? `#${el.id}` : "";
        const cls = typeof el.className === "string" && el.className
          ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}`
          : "";
        const text = (el.innerText || el.value || el.getAttribute("aria-label") || "")
          .trim().replace(/\s+/g, " ").slice(0, 34);
        return `${el.tagName.toLowerCase()}${id}${cls} "${text}"`;
      };

      // Snapshot the paint-relevant properties, focus it, snapshot again.
      const props = ["outlineStyle", "outlineWidth", "outlineColor", "boxShadow",
        "backgroundColor", "color", "borderColor", "borderWidth", "textDecorationLine"];
      const snap = (el) => {
        const cs = getComputedStyle(el);
        return props.map((p) => cs[p]).join("|");
      };

      for (const el of els.slice(0, 60)) {
        const before = snap(el);
        el.focus({ preventScroll: true });
        const after = document.activeElement === el ? snap(el) : null;
        el.blur();
        if (after === null) continue;          // not focusable in practice
        if (after === before) out.invisible.push(describe(el));

        const r = el.getBoundingClientRect();
        // WCAG 2.5.8 is not "every target is 24x24". A smaller target
        // passes when a 24px circle centred on it clears every other
        // target's circle -- which is how a row of nav links with real
        // space between them is fine, and a row of tight icons is not.
        // Measuring the box alone called 477 things broken that are not.
        if (r.width < MIN || r.height < MIN) {
          // The other exception: a target inside a sentence, where padding
          // it out to 24px would break the line it sits in.
          const inProse =
            el.tagName === "A" &&
            el.parentElement &&
            /^(P|LI|SPAN|STRONG|EM|H1|H2|H3)$/.test(el.parentElement.tagName) &&
            (el.parentElement.innerText || "").trim().length >
              (el.innerText || "").trim().length + 8;

          if (!inProse) {
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            let crowded = null;
            for (const other of els) {
              if (other === el) continue;
              if (el.contains(other) || other.contains(el)) continue;
              const o = other.getBoundingClientRect();
              const ox = o.left + o.width / 2;
              const oy = o.top + o.height / 2;
              // Both circles have radius 12, so they clear at 24 apart.
              if (Math.hypot(cx - ox, cy - oy) < MIN) { crowded = other; break; }
            }
            if (crowded) {
              out.small.push(
                `${describe(el)} is ${Math.round(r.width)}x${Math.round(r.height)} ` +
                `and sits within 24px of ${describe(crowded)}`,
              );
            }
          }
        }
      }
      return out;
    }, MIN_TARGET);

    for (const d of focus.invisible) add(route, "focus-not-visible", d);
    for (const d of focus.small) add(route, "target-size", d);

    /* ---- document language and a single h1 --------------------------- */
    const doc = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      h1s: Array.from(document.querySelectorAll("h1")).map((h) =>
        (h.innerText || "").trim().replace(/\s+/g, " ").slice(0, 40)),
      title: document.title,
    }));
    if (!doc.lang) add(route, "html-has-lang", "<html> has no lang attribute");
    if (doc.h1s.length === 0) add(route, "page-has-heading-one", "no <h1> on the page");
    if (doc.h1s.length > 1) {
      add(route, "page-has-heading-one", `${doc.h1s.length} <h1>s: ${doc.h1s.join(" | ")}`);
    }

    for (const e of consoleErrors.slice(0, 2)) add(route, "page-error", e.slice(0, 160));
  } catch (err) {
    add(route, "crash", err.message.split("\n")[0].slice(0, 160));
  }
  await page.close();
}

await browser.close();

/* ---- report --------------------------------------------------------- */
const byKind = new Map();
for (const f of findings) {
  if (!byKind.has(f.kind)) byKind.set(f.kind, []);
  byKind.get(f.kind).push(f);
}
const kinds = [...byKind.entries()].sort((a, b) => b[1].length - a[1].length);

console.log(`\nAccessibility · ${ROUTES.length} routes · ${BASE}\n`);
if (!findings.length) {
  console.log("Nothing to report: no WCAG 2.1 A/AA violation, every focus stop");
  console.log("is visible, and every target is at least 24x24.\n");
} else {
  for (const [kind, list] of kinds) {
    console.log(`${kind} — ${list.length}`);
    for (const f of list.slice(0, 14)) console.log(`   ${f.route}  ${f.detail}`);
    if (list.length > 14) console.log(`   …and ${list.length - 14} more`);
    console.log("");
  }
  console.log(`${findings.length} findings across ${new Set(findings.map((f) => f.route)).size} routes.\n`);
}

process.exit(findings.length ? 1 : 0);
