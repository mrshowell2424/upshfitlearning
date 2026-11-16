/**
 * Holds the multisyllabic bank to its four rules, word by word.
 *
 * scripts/check-generated.mjs already re-runs the builder and fails if the
 * committed file is not what it produces today. That catches drift and
 * nothing else: if the builder's own rules were wrong, both sides would
 * agree and both would be wrong. This checks the file against the rules
 * stated independently of how it was made, which is the part a re-run
 * cannot do.
 *
 *   bun run scripts/check-multisyllabic.mjs
 */
import { readFileSync } from "node:fs";
import { syllables, hits, placeOf, keysAndPatterns } from "./build-multisyllabic.mjs";

const BANK = JSON.parse(readFileSync("scripts/reading-multisyllabic.json", "utf8"));
const DICT = new Set(
  readFileSync("/usr/share/dict/words", "utf8").split("\n").filter((w) => /^[a-z]+$/.test(w)),
);

const problems = [];
const fail = (key, msg) => { if (problems.length < 40) problems.push(`${key}: ${msg}`); };

const KEYS = keysAndPatterns();
let real = 0;
let fake = 0;

for (const [key, list] of Object.entries(BANK.words)) {
  const patterns = KEYS.get(key);
  if (!patterns || !patterns.length) { fail(key, "no pattern recorded for this key"); continue; }
  const skill = key.split("|")[0];
  const place = Object.fromEntries(patterns.map((q) => [q, placeOf(`${skill}|${q}`, q)]));
  const carries = (w) => patterns.some((q) => hits(q, w, place[q], `${skill}|${q}`));

  // 1. a word may not appear twice in one list, which is the whole point.
  const seen = new Set();
  for (const w of list.real.concat(list.fake)) {
    if (seen.has(w)) fail(key, `"${w}" is in this list twice`);
    seen.add(w);
  }

  for (const w of list.real) {
    real++;
    if (syllables(w) < 2) fail(key, `"${w}" is one syllable`);
    if (!carries(w)) fail(key, `"${w}" does not carry ${patterns.join("/")}`);
    if (!w.includes("'") && !DICT.has(w)) fail(key, `"${w}" is not a word in the dictionary`);
  }
  for (const w of list.fake) {
    fake++;
    if (syllables(w) < 2) fail(key, `made-up "${w}" is one syllable`);
    if (!carries(w)) fail(key, `made-up "${w}" does not carry ${patterns.join("/")}`);
    // A made-up word that turns out to be real is the worst case here: the
    // answer key prints M beside a word the child reads correctly as real.
    if (DICT.has(w)) fail(key, `made-up "${w}" is a real English word`);
    if (list.real.includes(w)) fail(key, `made-up "${w}" is also in the real list`);
  }
}

const lists = Object.keys(BANK.words).length;
const thin = Object.entries(BANK.words).filter(([, l]) => l.real.length < 10).length;
console.log(`${lists} lists, ${real} real and ${fake} made-up words, all multisyllabic and on pattern.`);
console.log(`${thin} lists hold fewer than ten real words — English has few two-syllable words on those patterns.`);
console.log(`\nproblems: ${problems.length}`);
if (problems.length) {
  problems.forEach((p) => console.error(`  ✗ ${p}`));
  process.exit(1);
}
console.log("✅ every word is real where it should be, made up where it should be, and on its pattern");
