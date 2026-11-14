/**
 * What the writing page promises, checked.
 *
 * Two promises, and they fail in different ways.
 *
 * The frame on the page and the frame the AI coach talks a child through
 * have to be the same eight phrases. They cannot be generated from one
 * another -- the coach prompt is prose, not data -- so they are written
 * twice, and the only thing standing between that and drift is this. A page
 * that says "I believe" while the coach asks for "I think" is two frames,
 * and the child is the one who finds out.
 *
 * And every set needs both halves. A prompt with no passage is a question
 * with nothing to argue from; a passage with no prompt is just a decodable.
 *
 *   bun scripts/check-writing.mjs
 */
import { readFileSync } from "node:fs";

const SETS = JSON.parse(readFileSync("scripts/reading-writing-passages.json", "utf8"));
const COACH = JSON.parse(readFileSync("scripts/reading-ai-writing-coach.json", "utf8"));
const coachText = COACH.lines.join("\n");

// Read the frame out of the TypeScript rather than importing it, so this
// stays a plain script with no build step behind it.
const frameSrc = readFileSync("src/app/writing/frame.ts", "utf8");
const starters = [...frameSrc.matchAll(/starter:\s*"([^"]+)"/g)].map((m) => m[1]);
const names = [...frameSrc.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);

const problems = [];

if (starters.length !== 8) problems.push(`frame.ts has ${starters.length} starters, expected 8`);

for (const s of starters) {
  if (!coachText.includes(s)) {
    problems.push(`frame starter is not in the coach prompt any more: "${s}"`);
  }
}
for (const n of names) {
  if (!coachText.includes(n)) {
    problems.push(`frame step name is not in the coach prompt any more: "${n}"`);
  }
}

// The placeholders the page fills. If one is renamed in the prompt the page
// silently stops filling it and ships a literal {PASSAGE} to a child.
for (const ph of ["{GRADES}", "{SKILL}", "{TITLE}", "{PASSAGE}", "{QUESTION}", "{WRITING}"]) {
  if (!coachText.includes(ph)) problems.push(`the coach prompt no longer contains ${ph}`);
}

let sets = 0;
for (const [key, set] of Object.entries(SETS)) {
  sets++;
  if (!set.prompt?.trim()) problems.push(`${key}: no prompt`);
  if (!set.passage?.trim()) problems.push(`${key}: no passage`);
  if (set.prompt && !/\?$/.test(set.prompt.trim())) {
    problems.push(`${key}: the prompt is not a question — "${set.prompt}"`);
  }
  // A passage a child cannot find two different defensible claims in is not
  // an opinion prompt, and the shortest ones are where that goes wrong.
  const words = (set.passage ?? "").split(/\s+/).filter(Boolean).length;
  if (words < 60) problems.push(`${key}: passage is only ${words} words`);
}

console.log(`writing sets: ${sets}`);
console.log(`frame steps:  ${starters.length}`);

if (problems.length) {
  console.log(`\nproblems: ${problems.length}\n`);
  for (const p of problems) console.log("  " + p);
  process.exit(1);
}

console.log("\n✅ every set has both halves, and the frame matches the coach prompt");
