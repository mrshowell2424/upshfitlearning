/**
 * Checks the PLL skill map against the lesson sequence.
 *
 * The map is hand-written, so these are the things a hand can get wrong:
 *
 *   1. Does every Hub lesson key in it exist? A typo points a teacher at a
 *      lesson that is not there, and the picker would simply not find it.
 *   2. Is every PLL skill number there, once? Basic is 2.1 to 5.12, Advanced
 *      6.1 to 9.8, Multisyllable 10.1 to 15.3 -- 75 lessons, which is the
 *      figure 95% Group's own implementation guide gives. A gap means a
 *      teacher looks up their group's skill and finds nothing.
 *   3. Is a skill listed twice, pointing two ways?
 *
 * It also reports what the Hub does not cover, which is the part of this map
 * worth reading: a skill with no lesson is a hole in the sequence, and naming
 * it is more use than hiding it.
 *
 *   bun run scripts/check-pll-skills.mjs
 */
import { readFileSync } from "node:fs";
import { PLL_SKILLS, pllSet, skillsForLesson } from "./lib/pll-skills.mjs";

const SEQ = JSON.parse(readFileSync("scripts/reading-sequence.json", "utf8")).sequence;
const keys = new Set(SEQ.map((l) => l.key));
const name = Object.fromEntries(SEQ.map((l) => [l.key, l.name]));

const problems = [];
const seen = new Set();
for (const [skill, label, key, partial] of PLL_SKILLS) {
  if (!/^\d{1,2}\.\d{1,2}$/.test(skill)) problems.push(`"${skill}" is not a skill number`);
  if (seen.has(skill)) problems.push(`skill ${skill} is listed more than once`);
  seen.add(skill);
  if (!label) problems.push(`skill ${skill} has no name`);
  if (key !== null && !keys.has(key)) {
    problems.push(`skill ${skill} points at "${key}", which is not a lesson`);
  }
  if (partial && partial !== "partial") problems.push(`skill ${skill}: unknown note "${partial}"`);
  if (partial && key === null) problems.push(`skill ${skill} is marked partial and has no lesson`);
}

// The counts 95% Group's own guide gives for each set.
const want = { Basic: 32, Advanced: 25, Multisyllable: 18 };
const got = { Basic: 0, Advanced: 0, Multisyllable: 0 };
for (const [skill] of PLL_SKILLS) got[pllSet(skill)] += 1;
for (const set of Object.keys(want)) {
  if (got[set] !== want[set]) {
    problems.push(`${set} has ${got[set]} skills, and the PLL guide says ${want[set]}`);
  }
}

const covered = PLL_SKILLS.filter((r) => r[2]);
const full = covered.filter((r) => !r[3]);
const partials = covered.filter((r) => r[3]);
const none = PLL_SKILLS.filter((r) => !r[2]);

console.log(`${PLL_SKILLS.length} PLL skills: Basic ${got.Basic}, Advanced ${got.Advanced}, Multisyllable ${got.Multisyllable}.`);
console.log(`${full.length} have a Hub lesson, ${partials.length} are partly covered, ${none.length} are not covered.`);
if (none.length) {
  console.log("\nnot covered by any lesson:");
  for (const [skill, label] of none) console.log(`   ${skill}  ${label}`);
}
if (partials.length) {
  console.log("\npartly covered — the lesson teaches some of the skill, not all of it:");
  for (const [skill, label, key] of partials) {
    console.log(`   ${skill}  ${label}  →  ${name[key]}`);
  }
}
const lessonsWith = SEQ.filter((l) => skillsForLesson(l.key).length).length;
console.log(`\n${lessonsWith} of ${SEQ.length} lessons answer to at least one PLL skill.`);
console.log(`problems: ${problems.length}`);
problems.slice(0, 30).forEach((x) => console.log("  " + x));
if (problems.length) {
  console.error("\n✗ fix these before the map ships.");
  process.exit(1);
}
console.log("✅ every skill number is there once, and every lesson it names exists");
