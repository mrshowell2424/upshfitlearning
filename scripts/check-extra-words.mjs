/**
 * Checks the authored word batches before they are allowed near a child.
 *
 * A wrong word in a decoding lesson is worse than a short list, and the eye
 * is bad at this: twenty-two of the sixty made-up words already shipping are
 * real English words, five of them common enough that a child would know —
 * dry, stay, flow, plow, mink — all printed "M" for made-up on the key.
 *
 * So every word is checked by machine:
 *   real words  must be in the dictionary and match the skill's pattern
 *   made-up     must NOT be in the dictionary, and must still match it
 *   sentences   must carry the pattern and not repeat one already in use
 *
 *   bun run scripts/check-extra-words.mjs
 *
 * Exits non-zero on any failure, so it can gate the seed.
 */
import { readFileSync } from "node:fs";

const EXTRA = JSON.parse(readFileSync("scripts/reading-extra-words.json", "utf8"));
const WORDS = new Set(
  readFileSync("/usr/share/dict/words", "utf8").split("\n").map((w) => w.trim().toLowerCase())
);

const C = "[bcdfghjklmnpqrstvwxyz]";
const V = "[aeiou]";

/**
 * What counts as on-pattern for each skill.
 *
 * Deliberately loose about word shape and strict about the grapheme: the
 * point of the check is that an ai lesson never shows an oa word, not that
 * every word is the same length.
 */
const PATTERN = {
  // Every vowel in the word, so a two-syllable non-word for a short a
  // lesson has short a in both halves and nothing else.
  "cvc-a": (w) => /[aeiou]/.test(w) && !/[eiou]/.test(w),
  "cvc-mix": (w) => /[ioue]/.test(w) && !/a/.test(w),
  dig: (w) => /sh|ch|th|wh/.test(w),
  floss: (w) => /(ff|ll|ss|zz)/.test(w),
  blends: (w) =>
    /^(bl|cl|fl|sl|st|dr|gr|sw|pl|tr|cr|br|fr|pr|sn|sp|sc|sk|sm|str)/.test(w) ||
    /(nd|st|mp|sk|nt|lt|lk|ft)$/.test(w),
  vce: (w) => new RegExp(`${V}${C}e`).test(w),
  vccv: (w) => new RegExp(`${V}${C}${C}${V}`).test(w),
  vccvce: (w) => new RegExp(`${V}${C}+${V}${C}e`).test(w) || new RegExp(`${V}${C}${C}`).test(w),
  "ng-nk": (w) => /(ng|nk)/.test(w),
  "ck-tch": (w) => /(ck|tch)/.test(w),
  y: (w) => /y$/.test(w),
  "ai-ay": (w) => /(ai|ay)/.test(w),
  "ee-ea": (w) => /(ee|ea)/.test(w),
  "oa-ow": (w) => /(oa|ow)/.test(w),
  "ar-or": (w) => /(ar|or)/.test(w),
};

/** A made-up word still has to be sayable: every chunk needs a vowel. */
const sayable = (w) => /[aeiouy]/.test(w) && !/[bcdfghjklmnpqrstvwxz]{4}/.test(w);

const problems = [];
const warnings = [];
const seenReal = new Set();
let realN = 0;
let fakeN = 0;
let sentN = 0;
let fixN = 0;

for (const [sid, v] of Object.entries(EXTRA)) {
  if (sid.startsWith("_")) continue;
  const fits = PATTERN[sid];
  if (!fits) {
    problems.push(`${sid}: no pattern test`);
    continue;
  }

  for (const w of v.real || []) {
    realN++;
    // web2 is an old list with gaps — it has fox and six and not box — so a
    // miss is something to look at, not something to fail on. The other
    // direction is reliable: if it is in there, it is a word.
    if (!WORDS.has(w.toLowerCase())) warnings.push(`${sid}: "${w}" is not in the dictionary — check by hand`);
    if (!fits(w)) problems.push(`${sid}: "${w}" does not match the pattern`);
    const key = sid + "|" + w;
    if (seenReal.has(key)) problems.push(`${sid}: "${w}" is listed twice`);
    seenReal.add(key);
  }

  for (const w of v.fake || []) {
    fakeN++;
    if (WORDS.has(w.toLowerCase())) problems.push(`${sid}: made-up "${w}" is a real word`);
    if (!fits(w)) problems.push(`${sid}: made-up "${w}" does not match the pattern`);
    if (!sayable(w)) problems.push(`${sid}: made-up "${w}" is not sayable`);
  }

  for (const [was, now] of Object.entries(v.fix || {})) {
    fixN++;
    if (!WORDS.has(was.toLowerCase()))
      problems.push(`${sid}: fix for "${was}" — but it was not a real word`);
    if (WORDS.has(now.toLowerCase())) problems.push(`${sid}: replacement "${now}" is a real word`);
    if (!fits(now)) problems.push(`${sid}: replacement "${now}" does not match the pattern`);
    if (!sayable(now)) problems.push(`${sid}: replacement "${now}" is not sayable`);
  }

  for (const s of v.sent || []) {
    sentN++;
    if (!/^[A-Z]/.test(s)) problems.push(`${sid}: sentence does not start with a capital — "${s}"`);
    if (!/[.!?]$/.test(s)) problems.push(`${sid}: sentence has no end mark — "${s}"`);
    const carries = s
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .some((w) => w.length > 1 && fits(w));
    if (!carries) problems.push(`${sid}: sentence carries no ${sid} word — "${s}"`);
  }
}

console.log(
  `checked ${realN} real words, ${fakeN} made-up words, ` +
    `${fixN} replacements and ${sentN} sentences across ` +
    `${Object.keys(EXTRA).filter((k) => !k.startsWith("_")).length} skills`
);
if (warnings.length) {
  console.log(`\n${warnings.length} to look at by eye:`);
  warnings.forEach((w) => console.log("   " + w));
}
if (problems.length) {
  console.error(`\n✗ ${problems.length} problems:`);
  problems.forEach((p) => console.error("   " + p));
  process.exit(1);
}
console.log("✅ every word checks out");
