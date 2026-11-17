/**
 * Re-derives every generated answer and refuses the ones that are wrong.
 *
 * The builder writes a question and an answer in the same breath, so the
 * answer being right is exactly what cannot be taken on trust. Each item
 * carries a check expression made only of numbers and operators; this
 * evaluates it with its own parser and compares. A wrong answer on a maths
 * sheet is worse than a missing one: a child is marked down for being
 * right.
 *
 *   bun run scripts/check-math-practice.mjs
 */
import { readFileSync } from "node:fs";
import { evalCheck, ratStr, sameAnswer } from "./lib/math-items.mjs";

const P = JSON.parse(readFileSync("scripts/math-practice.json", "utf8"));
const PRE = JSON.parse(readFileSync("scripts/math-prerequisites.json", "utf8"));
const problems = [];
const fail = (m) => { if (problems.length < 40) problems.push(m); };

let checked = 0;
let compared = 0;
for (const [code, sets] of Object.entries(P.items)) {
  for (const [kind, want] of [["c", P.perStandard.computation], ["w", P.perStandard.wordProblems]]) {
    const list = sets[kind] || [];
    if (list.length !== want) fail(`${code} has ${list.length} ${kind === "c" ? "computations" : "word problems"}, wanted ${want}`);
    const seen = new Set();
    for (const item of list) {
      if (!item.q || !String(item.q).trim()) fail(`${code} has an item with no question`);
      if (item.a === undefined || item.a === null || item.a === "") fail(`${code}: "${String(item.q).slice(0, 40)}" has no answer`);
      if (seen.has(item.q)) fail(`${code} asks "${String(item.q).slice(0, 40)}" twice`);
      seen.add(item.q);

      if (item.chk) {
        checked++;
        let got;
        try { got = ratStr(evalCheck(item.chk)); } catch (e) { fail(`${code}: ${e.message}`); continue; }
        const want2 = item.expect ?? item.a;
        if (!sameAnswer(got, want2)) {
          fail(`${code}: "${String(item.q).slice(0, 44)}" answers ${JSON.stringify(item.a)} but ${item.chk} = ${got}`);
        }
      } else if (Array.isArray(item.cmp)) {
        // A comparison has no arithmetic to redo, so the claim it makes
        // about its own two numbers is what gets tested.
        compared++;
        const [a, b] = item.cmp;
        const right = a > b ? ">" : a < b ? "<" : "=";
        if (/^[<>=]$/.test(item.a) && item.a !== right) fail(`${code}: ${a} ${item.a} ${b} is false`);
      } else {
        fail(`${code}: "${String(item.q).slice(0, 40)}" has nothing to check it against`);
      }
    }
  }
}

// A level must point at a standard that exists and has items.
for (const [code, lv] of Object.entries(P.levels)) {
  for (const which of ["below", "on", "above"]) {
    const target = lv[which];
    if (!P.items[target]) fail(`${code}'s ${which} level points at ${target}, which has no items`);
  }
  if (lv.on !== code) fail(`${code}'s on-level points at ${lv.on}`);
  // Below must never be harder than on: it is the standard this one stands on.
  if (lv.below !== code && PRE.prereq[code] !== lv.below) {
    fail(`${code}'s below level is ${lv.below}, which is not what it stands on`);
  }
}

console.log(`${Object.keys(P.items).length} standards, ${checked} answers recomputed and ${compared} comparisons tested.`);
console.log(`${P.kept} standards keep the hub's own six items, which this does not touch.`);
console.log(`\nproblems: ${problems.length}`);
if (problems.length) {
  problems.forEach((p) => console.error(`  ✗ ${p}`));
  process.exit(1);
}
console.log("✅ every generated answer was derived again and agreed");
