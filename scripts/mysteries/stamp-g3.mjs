/**
 * The original thirty-six cases were written for 2nd-4th, which centres on
 * grade 3. This stamps them as grade 3 verbatim rather than retyping them,
 * so the text a teacher has already used does not change under them.
 *
 *   bun run scripts/mysteries/stamp-g3.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const src = JSON.parse(readFileSync("scripts/reading-mysteries.json", "utf8"));
// After the first merge this file holds every grade, so re-running has to take
// grade 3's own cases back out rather than stamping the whole store as grade 3.
const all = src.cases || src;
const cases = all.some((c) => c.grade !== undefined)
  ? all.filter((c) => c.grade === 3)
  : all;
const out = cases.map((c) => ({
  id: `g3-w${c.week}`,
  grade: 3,
  week: c.week,
  tag: c.tag,
  title: c.title,
  story: c.story,
  question: c.question,
  suspects: c.suspects,
  answer: c.answer,
  proof: c.proof,
  clears: c.clears,
  explain: c.explain,
}));
writeFileSync("scripts/mysteries/g3.json", JSON.stringify(out, null, 1) + "\n");
console.log(`grade 3: ${out.length} cases stamped from the original set`);
