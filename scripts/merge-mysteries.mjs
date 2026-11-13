/**
 * Fold the per-grade mystery files into scripts/reading-mysteries.json.
 *
 * A grade file replaces that grade wholesale, so running this twice is the
 * same as running it once, and a half-written grade cannot damage a finished
 * one. Cases come out sorted by grade and then by week, so the page walks
 * them from K upward.
 *
 *   bun run scripts/merge-mysteries.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const PLAN = JSON.parse(readFileSync("scripts/reading-mystery-plan.json", "utf8"));
const OUT = "scripts/reading-mysteries.json";
const current = JSON.parse(readFileSync(OUT, "utf8"));

const byGrade = new Map();
const partial = [];
for (const g of PLAN.grades) {
  const path = `scripts/mysteries/g${g.grade}.json`;
  if (!existsSync(path)) continue;
  const cases = JSON.parse(readFileSync(path, "utf8"));
  for (const c of cases) {
    if (c.grade !== g.grade) throw new Error(`${path} holds a grade ${c.grade} case`);
  }
  if (byGrade.has(g.grade)) throw new Error(`grade ${g.name} written twice`);
  // A grade in progress stays out of the store. Writing thirty-six weeks takes
  // several sittings, and a teacher picking grade 6 should not find nine weeks
  // and a gap. The gate would refuse it anyway; this keeps the half-written
  // grade from ever reaching the file in the first place.
  if (cases.length !== PLAN.weeks) {
    partial.push(`${g.name} (${cases.length}/${PLAN.weeks})`);
    continue;
  }
  byGrade.set(g.grade, cases);
}

const order = PLAN.grades.map((g) => g.grade);
const merged = order.flatMap((g) => (byGrade.get(g) || []).slice().sort((a, b) => a.week - b.week));
if (!merged.length) throw new Error("no grade files found; nothing to merge");

writeFileSync(OUT, JSON.stringify({
  _note: "One mystery a week for thirty-six weeks at every grade that has been written. Each case is a short story, a question, the suspects with what the text says about each, and the teacher answer with its proof quotes. A mystery is a claim-and-evidence task in disguise, which is why it sits beside the writing step and uses the same frame. Built by scripts/merge-mysteries.mjs from scripts/mysteries/g<N>.json; do not edit by hand.",
  source: current.source || "mystery-library.html",
  cases: merged,
}, null, 1) + "\n");

const done = order.filter((g) => byGrade.has(g));
console.log(`${merged.length} cases across ${done.length} grades: ${done.map((g) => PLAN.grades.find((x) => x.grade === g).name).join(", ")}`);
if (partial.length) console.log(`still being written, left out: ${partial.join(", ")}`);
