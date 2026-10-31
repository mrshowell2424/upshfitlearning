/**
 * Rebuilds the Math Hub's Find the Error and Daily practice printables.
 *
 * The originals were laid out by a generator we do not have, and they put each
 * task on a single centred line that never wrapped: 49 of the 78 PDFs ran text
 * off both edges of the sheet, worst in grade 12, where a statistics prompt is
 * three times the width of the paper. A finished PDF cannot reflow, so the
 * only honest fix is to lay them out again.
 *
 * They are built from the hub's own PRAC and FTE tables — the same data the
 * on-screen workbook draws from — so the printable and the screen can never
 * drift apart. Layout is the workbook's: letter portrait, white sheet, rule
 * under the heading, name and date, page number at the foot.
 *
 * The tile printables are left alone. They were measured and they fit.
 *
 *   bun run scripts/build-math-printables.mjs
 *
 * Writes into content-reading-materials/math/printables/, which the seed then
 * carries into Postgres. Re-run the seed afterwards.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const HUB = path.join(ROOT, "content-reading-materials/math/math-hub.html");
const OUT = path.join(ROOT, "content-reading-materials/math/printables");

/** Pulls one of the hub's `var NAME = {...};` tables out of the export. */
function table(html, name) {
  const head = `var ${name} = `;
  const i = html.indexOf(head);
  if (i === -1) throw new Error(`${name} is not in the hub any more`);
  const j = html.indexOf(";\n", i);
  return JSON.parse(html.slice(i + head.length, j));
}

const html = readFileSync(HUB, "utf8");
const PRAC = table(html, "PRAC");
const FTE = table(html, "FTE");
const DATA = table(html, "DATA");

const gradeKey = (g) => (g === "Kindergarten" ? "k" : "g" + g.replace("Grade ", ""));

/** Grades in the order the hub lists them, each with its standards. */
const byGrade = new Map();
for (const [grade, code] of DATA) {
  if (!byGrade.has(grade)) byGrade.set(grade, []);
  byGrade.get(grade).push(code);
}

const esc = (s) =>
  String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

/**
 * Runs of two or more underscores stand for a space to write, the same as they
 * do in the hub. Left as literal underscores they look like a typo.
 */
const blanks = (s) =>
  esc(s).replace(/_{2,}/g, '<span class="blank"></span>');

const CSS = `
  @page { size: letter portrait; margin: 0.5in; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Poppins, system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #2F3E2E; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .sheet { width: 7.5in; min-height: 9.6in; display: flex; flex-direction: column; gap: 11px;
    break-after: page; page-break-after: always; }
  .sheet:last-child { break-after: auto; page-break-after: auto; }
  .top { display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
    border-bottom: 2px solid #2F3E2E; padding-bottom: 7px; }
  .title { font-size: 20px; font-weight: 800; }
  .meta { font-size: 12px; font-weight: 700; letter-spacing: .04em; color: #5B6B59; white-space: nowrap; }
  .name { display: flex; gap: 18px; align-items: baseline; font-size: 14px; }
  .field { display: flex; gap: 6px; align-items: baseline; flex: 1 1 auto; }
  .field.date { flex: 0 0 34%; }
  .rule { flex: 1; border-bottom: 1px solid #2F3E2E; height: 14px; }
  .dir { font-size: 13px; color: #5B6B59; }
  .body { display: flex; flex-direction: column; gap: 11px; flex: 1; }
  .q { font-size: 15px; line-height: 1.45; overflow-wrap: anywhere; }
  .q .n { font-weight: 700; }
  .work { border: 1px solid #2F3E2E; border-radius: 8px; padding: 8px; font-size: 12px;
    color: #5B6B59; min-height: 96px; }
  .row { display: flex; flex-direction: column; gap: 6px; padding-bottom: 8px;
    border-bottom: 1px solid #D7DED5; break-inside: avoid; page-break-inside: avoid; }
  .row:last-child { border-bottom: 0; }
  /* Find the Error gives one task the whole sheet, so the two answer boxes
     share whatever the prompt leaves rather than being set to a fixed height
     and hoping. A long grade 12 prompt eats into the boxes; it never runs off
     the page. */
  .fte .body { gap: 12px; }
  .fte .grow { flex: 1 1 0; display: flex; flex-direction: column; gap: 6px; min-height: 1.1in; }
  .fte .grow.solve { flex-grow: 1.4; }
  .fte .grow .work { flex: 1; min-height: 0; }
  /* Question left, answer box hard right. Wrapping the box onto its own line
     whenever the question ran long left the sheet looking ragged. */
  .short { display: flex; gap: 14px; align-items: center; }
  .short .q { flex: 1; }
  .shortbox { flex: 0 0 1.5in; height: 0.42in; border: 1px solid #2F3E2E; border-radius: 6px;
    display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; }
  .head { font-size: 15px; font-weight: 800; margin-top: 4px; }
  .blank { display: inline-block; width: 52px; border-bottom: 1.5px solid currentColor; }
  .ans { font-size: 13px; font-weight: 700; color: #1F7A5C; }
  .ans .lbl { color: #5B6B59; font-weight: 600; }
  .foot { margin-top: auto; padding-top: 8px; font-size: 10px; color: #5B6B59;
    display: flex; justify-content: space-between; }
`;

function page({ title, meta, dir, bodyHtml, foot, withName, cls }) {
  return `<section class="sheet${cls ? " " + cls : ""}">
  <div class="top"><div class="title">${esc(title)}</div><div class="meta">${esc(meta)}</div></div>
  ${withName ? `<div class="name"><div class="field"><span>Name:</span><span class="rule"></span></div><div class="field date"><span>Date:</span><span class="rule"></span></div></div>` : ""}
  ${dir ? `<div class="dir">${esc(dir)}</div>` : ""}
  <div class="body">${bodyHtml}</div>
  <div class="foot"><span>${esc(foot)}</span><span class="pageno"></span></div>
</section>`;
}

/** Find the Error — one task to a sheet, with room to answer both questions. */
function findTheError(grade, codes, key) {
  const sheets = [];
  for (const code of codes) {
    for (const [i, task] of (FTE[code] || []).entries()) {
      const [prompt, why, correct] = task;
      sheets.push(
        page({
          title: "Find the Error",
          meta: `${grade} · ${code}`,
          withName: true,
          dir: "Analyze the student's work below. Identify the error, then solve the problem correctly.",
          cls: "fte",
          bodyHtml:
            `<div class="q">${blanks(prompt)}</div>` +
            `<div class="row grow"><div class="q"><span class="n">1.</span> What did the student do wrong? Why do you think they made this error?</div>` +
            `<div class="work"></div></div>` +
            `<div class="row grow solve"><div class="q"><span class="n">2.</span> Solve the problem correctly. Show all of your work.</div>` +
            `<div class="work"></div></div>` +
            (key
              ? `<div class="ans"><span class="lbl">The error:</span> ${esc(why)}</div>` +
                (correct ? `<div class="ans"><span class="lbl">Correct answer:</span> ${esc(correct)}</div>` : "")
              : ""),
          foot: `${code} · task ${i + 1}${key ? " · ANSWER KEY" : ""}`,
        })
      );
    }
  }
  return sheets;
}

/** Daily practice — four computation problems and two word problems. */
function practice(grade, codes, key) {
  const sheets = [];
  for (const code of codes) {
    const p = PRAC[code];
    if (!p) continue;
    const comp = (p.c || [])
      .map(
        (q, i) =>
          `<div class="row"><div class="short"><span class="q"><span class="n">${i + 1}.</span> ${blanks(q)}</span>` +
          `<span class="shortbox">${key ? esc(p.ac[i] ?? "") : ""}</span></div></div>`
      )
      .join("");
    const word = (p.w || [])
      .map(
        (q, i) =>
          `<div class="row"><div class="q"><span class="n">${(p.c || []).length + i + 1}.</span> ${blanks(q)}</div>` +
          `<div class="work" style="min-height:1.25in">Show your work and answer.</div>` +
          (key ? `<div class="ans"><span class="lbl">Answer:</span> ${esc(p.aw[i] ?? "")}</div>` : "") +
          `</div>`
      )
      .join("");
    sheets.push(
      page({
        title: `${grade} Practice`,
        meta: `Standard ${code}`,
        withName: true,
        dir: "",
        bodyHtml: `<div class="head">Computation</div>${comp}<div class="head">Word problems</div>${word}`,
        foot: `${code}${key ? " · ANSWER KEY" : ""}`,
      })
    );
  }
  return sheets;
}

function doc(sheets) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>${sheets.join("\n")}</body></html>`;
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page1 = await browser.newPage();

let wrote = 0;
let shrunk = 0;
for (const [grade, codes] of byGrade) {
  const k = gradeKey(grade);
  for (const [name, build] of [
    [`${k}`, findTheError],
    [`practice_${k}`, practice],
  ]) {
    for (const key of [false, true]) {
      const sheets = build(grade, codes, key);
      if (!sheets.length) continue;
      await page1.setContent(doc(sheets), { waitUntil: "load" });
      await page1.evaluate(() => document.fonts.ready);
      // Number the sheets, then shrink any that still run long. Nothing should
      // need it — the boxes are sized to leave room — but a sheet that spills
      // would cost a blank page, so it is checked rather than assumed.
      const over = await page1.evaluate(() => {
        const all = [...document.querySelectorAll(".sheet")];
        all.forEach((s, i) => {
          s.querySelector(".pageno").textContent = `${i + 1} of ${all.length}`;
        });
        const max = 9.6 * 96;
        // Measured with the floor removed: a sheet is 9.6in tall whether or
        // not it has the content to fill it, so measuring it as-is reports
        // every page as overlong and scales all of them.
        all.forEach((s) => (s.style.minHeight = "0"));
        const hs = all.map((s) => s.scrollHeight);
        all.forEach((s) => (s.style.minHeight = ""));
        let n = 0;
        all.forEach((s, i) => {
          if (hs[i] > max) {
            s.style.zoom = String(Math.max(0.6, max / hs[i] - 0.005));
            n++;
          }
        });
        return n;
      });
      shrunk += over;
      await page1.pdf({
        path: path.join(OUT, `${name}_${key ? "key" : "student"}.pdf`),
        format: "Letter",
        printBackground: true,
        margin: { top: "0.5in", bottom: "0.5in", left: "0.5in", right: "0.5in" },
      });
      wrote++;
      process.stdout.write(`\r  ✓ ${wrote} files`);
    }
  }
}
console.log(`\n✅ rebuilt ${wrote} printables${shrunk ? `, ${shrunk} sheets scaled to fit` : ", none needed scaling"}`);
await browser.close();
