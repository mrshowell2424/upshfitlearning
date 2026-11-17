/**
 * Holds the maths prerequisite map to the rules a review page depends on.
 *
 * check-generated re-runs the builder and compares, which catches drift and
 * nothing else: if the derivation were wrong both sides would agree and
 * both would be wrong. These are the claims the map has to satisfy
 * whatever produced it, and the one that matters most is the last: a
 * prerequisite that points forward would send a class to revise something
 * they have not been taught.
 *
 *   bun run scripts/check-math-prerequisites.mjs
 */
import { readFileSync } from "node:fs";
import { GRADES, parse } from "./build-math-prerequisites.mjs";

const M = JSON.parse(readFileSync("scripts/math-prerequisites.json", "utf8"));
const HUB = readFileSync("content-reading-materials/math/math-hub.html", "utf8");
const head = "var DATA = ";
const DATA = JSON.parse(HUB.slice(HUB.indexOf(head) + head.length, HUB.indexOf(";\n", HUB.indexOf(head))));

const gradeOf = new Map(DATA.map(([g, c]) => [c, g]));
const rank = (c) => GRADES.indexOf(gradeOf.get(c));
const problems = [];
const fail = (m) => { if (problems.length < 40) problems.push(m); };

// Every standard the hub teaches is accounted for, one way or the other.
for (const [, code] of DATA) {
  const has = Object.prototype.hasOwnProperty.call(M.prereq, code);
  if (!has && !M.roots.includes(code)) fail(`${code} has neither a prerequisite nor a place among the roots`);
  if (has && M.roots.includes(code)) fail(`${code} is both a root and has a prerequisite`);
  if (!parse(code)) fail(`${code} is not a code this map can read`);
}

for (const [code, pre] of Object.entries(M.prereq)) {
  if (!gradeOf.has(code)) fail(`${code} is not taught in this hub`);
  if (!gradeOf.has(pre)) fail(`${code} stands on ${pre}, which this hub does not teach`);
  if (code === pre) fail(`${code} stands on itself`);
  // The whole point. A review that reaches forward is not a review.
  if (gradeOf.has(code) && gradeOf.has(pre) && rank(pre) > rank(code)) {
    fail(`${code} (${gradeOf.get(code)}) stands on ${pre} (${gradeOf.get(pre)}), which comes later`);
  }
}

// No chain may loop, or a review page following it would never stop.
for (const code of Object.keys(M.prereq)) {
  const seen = new Set([code]);
  let at = M.prereq[code];
  while (at) {
    if (seen.has(at)) { fail(`the chain from ${code} loops at ${at}`); break; }
    seen.add(at);
    at = M.prereq[at];
  }
}

for (const grade of M.grades) {
  const pool = M.spiral[grade] || [];
  if (!pool.length) fail(`${grade} has nothing in its spiral pool`);
  for (const c of pool) {
    if (gradeOf.get(c) !== grade) fail(`${grade}'s pool holds ${c}, which is ${gradeOf.get(c)}`);
  }
  if (new Set(pool).size !== pool.length) fail(`${grade}'s pool repeats a standard`);
}

const crossGrade = Object.entries(M.prereq).filter(([c, p]) => gradeOf.get(c) !== gradeOf.get(p));
console.log(`${DATA.length} standards: ${Object.keys(M.prereq).length} stand on an earlier one, ${M.roots.length} are where a strand begins.`);
console.log(`${crossGrade.length} reach back into an earlier grade, which is where a gap in a class usually is.`);
console.log(`\nproblems: ${problems.length}`);
if (problems.length) {
  problems.forEach((p) => console.error(`  ✗ ${p}`));
  process.exit(1);
}
console.log("✅ every standard is placed, nothing points forward, and no chain loops");
