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
import { syllables, hits, placeOf, keysAndPatterns, TRI } from "./build-multisyllabic.mjs";
import { unsafeWord, unsafeRealWord } from "./lib/not-nonsense.mjs";

const BANK = JSON.parse(readFileSync("scripts/reading-multisyllabic.json", "utf8"));
const HEART = new Set(
  JSON.parse(readFileSync("scripts/reading-heart-words.json", "utf8")).words
    .map((w) => w.word.toLowerCase()),
);
const DICT = new Set(
  readFileSync("/usr/share/dict/words", "utf8").split("\n").filter((w) => /^[a-z]+$/.test(w)),
);
/** Three-letter runs this site's own writing uses. A made-up word uses no other. */
const readable = (w) => {
  for (let i = 0; i + 3 <= w.length; i++) if (!TRI.has(w.slice(i, i + 3))) return false;
  return true;
};

const problems = [];
const fail = (key, msg) => { if (problems.length < 40) problems.push(`${key}: ${msg}`); };

const KEYS = keysAndPatterns();
let real = 0;
let fake = 0;
let one = 0;
let sentences = 0;

for (const [key, list] of Object.entries(BANK.words)) {
  const patterns = KEYS.get(key);
  if (!patterns || !patterns.length) { fail(key, "no pattern recorded for this key"); continue; }
  const skill = key.split("|")[0];
  const place = Object.fromEntries(patterns.map((q) => [q, placeOf(`${skill}|${q}`, q)]));
  const carries = (w) => patterns.some((q) => hits(q, w, place[q], `${skill}|${q}`));

  // 0. nothing here that cannot be printed in front of a class. The real
  // lists are judged on the whole word, the made-up list on any part of one:
  // a generator swapping interior consonants walks into words nobody chose,
  // and this bank shipped whoresome, accurape and turdulence as made-up
  // words, with sex in the x lesson's single-syllable list, until it was
  // asked. Nothing was asking.
  for (const f of ["real", "one"]) {
    for (const w of list[f] || []) if (unsafeRealWord(w)) fail(key, `${f} word "${w}" cannot be printed for a child`);
  }
  for (const w of list.fake || []) if (unsafeWord(w)) fail(key, `made-up word "${w}" cannot be printed for a child`);

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
  for (const w of list.one || []) {
    one++;
    if (syllables(w) !== 1) fail(key, `"${w}" is in the single-syllable list with ${syllables(w)}`);
    if (!carries(w)) fail(key, `"${w}" does not carry ${patterns.join("/")}`);
    if (!DICT.has(w)) fail(key, `"${w}" is not a word in the dictionary`);
    if (HEART.has(w)) fail(key, `"${w}" is a heart word, taught as an exception`);
  }
  // Sentences for the partner read: long enough to be worth reading, and
  // carrying at least two of the pattern's own words.
  for (const q of list.sent || []) {
    sentences++;
    const n = q.split(/\s+/).length;
    if (n < 6 || n > 18) fail(key, `sentence of ${n} words: "${q.slice(0, 40)}…"`);
    const ms = new Set(list.real.map((w) => w.toLowerCase()));
    const hit = new Set((q.toLowerCase().match(/[a-z']{3,}/g) || []).filter((w) => ms.has(w)));
    if (hit.size < 2) fail(key, `sentence carries ${hit.size} pattern words: "${q.slice(0, 40)}…"`);
  }
  for (const w of list.fake) {
    fake++;
    if (syllables(w) < 2) fail(key, `made-up "${w}" is one syllable`);
    if (!carries(w)) fail(key, `made-up "${w}" does not carry ${patterns.join("/")}`);
    // A made-up word that turns out to be real is the worst case here: the
    // answer key prints M beside a word the child reads correctly as real.
    if (DICT.has(w)) fail(key, `made-up "${w}" is a real English word`);
    if (list.real.includes(w)) fail(key, `made-up "${w}" is also in the real list`);
    // A child must have to decode it to know. clazsroom and clitped can be
    // thrown out on sight, so they test nothing.
    if (!readable(w)) fail(key, `made-up "${w}" uses a letter run English never writes`);
  }
}

const lists = Object.keys(BANK.words).length;
const thin = Object.entries(BANK.words).filter(([, l]) => l.real.length < 10).length;
console.log(`${lists} lists, ${real} multisyllabic, ${one} single-syllable and ${fake} made-up words, every one on its pattern.`);
console.log(`${sentences} partner-read sentences, each carrying two of its pattern\u2019s words.`);
console.log(`${thin} lists hold fewer than ten real words — English has few two-syllable words on those patterns.`);
console.log(`\nproblems: ${problems.length}`);
if (problems.length) {
  problems.forEach((p) => console.error(`  ✗ ${p}`));
  process.exit(1);
}
console.log("✅ every word is real where it should be, made up where it should be, and on its pattern");
