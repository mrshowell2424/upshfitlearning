/**
 * Checks the continuum review word pools before they reach a child.
 *
 * Four questions per word, because each has been got wrong at least once
 * while this was being built:
 *
 *   1. Is a word filed as real actually a real word?
 *   2. Is a word filed as made-up actually not one? Three earlier passes at
 *      this said yes and were wrong -- sup, wilt and ted came from the first,
 *      stat, chem and gov from the second, kup, blak and stek from the third.
 *   3. Does the word carry the pattern of the skill it is filed under? A
 *      silent-e review full of words without a silent e teaches nothing.
 *   4. Is it unique within its skill, so the five days do not repeat a word?
 *
 *   bun run scripts/check-continuum-review.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { CONCEPTS } from "./lib/continuum-pools.mjs";
import { unsafeWord, looksReal } from "./lib/not-nonsense.mjs";

const SHORT = new Set(JSON.parse(readFileSync("scripts/lib/real-short-words.json", "utf8")).words);

/**
 * The Hub's own reading content, as evidence that a word is real.
 *
 * web2 lists base forms, so it has foot but not feet, blow but not blew, and
 * no compounds: seashell and became are missing from it and are plainly real.
 * Using the reading corpus to PROVE a word real is sound, which is the
 * opposite direction from using it to prove one made up -- that was tried,
 * and it both missed real words and blocked genuine nonsense.
 */
const CORPUS = new Set();
for (const f of ["scripts/reading-sequence.json", "scripts/reading-heart-words.json",
  "scripts/reading-spelling.json", "scripts/reading-multisyllabic.json",
  "scripts/reading-sight-words.json", "scripts/reading-word-ladders.json"]) {
  if (!existsSync(f)) continue;
  for (const m of readFileSync(f, "utf8").toLowerCase().matchAll(/\b[a-z]{2,14}\b/g)) CORPUS.add(m[0]);
}

/** web2 keeps base forms only, so try the obvious inflections of one. */
function realBySuffix(w, dict) {
  const bases = [];
  if (/s$/.test(w)) bases.push(w.slice(0, -1));
  if (/es$/.test(w)) bases.push(w.slice(0, -2));
  if (/ed$/.test(w)) bases.push(w.slice(0, -2), w.slice(0, -1));
  if (/ing$/.test(w)) bases.push(w.slice(0, -3), w.slice(0, -3) + "e");
  if (/er$/.test(w)) bases.push(w.slice(0, -2), w.slice(0, -1));
  if (/y$/.test(w)) bases.push(w.slice(0, -1));
  return bases.some((b) => b.length > 1 && dict.has(b));
}

/**
 * A compound of two real words is a real word: seashell, sailboat, football.
 *
 * The first part may be as short as two letters, because became is be + came
 * and a three-letter floor missed it.
 */
function realAsCompound(w, dict) {
  for (let i = 2; i <= w.length - 2; i++) {
    if (dict.has(w.slice(0, i)) && dict.has(w.slice(i))) return true;
  }
  return false;
}

function isRealWord(w, dict) {
  if (dict && dict.has(w)) return true;
  if (SHORT.has(w) || CORPUS.has(w)) return true;
  if (!dict) return true;
  return realBySuffix(w, dict) || realAsCompound(w, dict);
}

/**
 * The full dictionary, for the multisyllabic words the vendored short list
 * cannot cover. It lives outside the repo, so a machine without it still runs
 * every other check and says which one it skipped rather than passing quietly.
 */
const SYSTEM_DICT = "/usr/share/dict/words";
let FULL = null;
if (existsSync(SYSTEM_DICT)) {
  FULL = new Set(
    readFileSync(SYSTEM_DICT, "utf8").split("\n").map((w) => w.trim().toLowerCase()).filter(Boolean),
  );
}

/**
 * Vowel groups, as a rough syllable count.
 *
 * A consonant-le ending counts as its own syllable even though it holds no
 * vowel letter: "cable" and "purple" are two syllables, and counting vowel
 * groups alone called them one, which failed every word in P14 and P15.
 */
const syllables = (w) => {
  const s = w.toLowerCase();
  const consonantLe = /[^aeiou]le$/.test(s);
  const n = (s.replace(/e$/, "").match(/[aeiouy]+/g) || []).length;
  return consonantLe ? n + 1 : n;
};

const C = "bcdfghjklmnpqrstvwxz";
const PATTERN = {
  P2: (w) => /^[a-z]{2,4}$/.test(w) && (w.match(/[aeiou]/g) || []).length === 1 && !/e$/.test(w)
    && !/(ai|ay|ee|ea|oa|oe|ue|ui|ow|ou|oo|au|aw|ew|oi|oy)/.test(w),
  P3: (w) => new RegExp(`(^[${C}]{2}|[${C}]{2}$)`).test(w)
    && !/(ch|sh|th|wh|ck|ng|ph)/.test(w),
  P4: (w) => /(ch|sh|th|wh|ck|ng|ph)/.test(w),
  P5: (w) => new RegExp(`[aeiou][${C}]e$`).test(w) && syllables(w) === 1,
  P6: (w) => /(ai|ay|ee|ea|oa|oe|ue|ui)/.test(w),
  P7: (w) => /(ea|ow|ou|oo|au|aw|ew|oi|oy)/.test(w),
  P8: (w) => /(ar|or|er|ir|ur)/.test(w) && syllables(w) === 1,
  P9: (w) => /(kn|wr|mb$|gn|dge|tch|ph|ce|ci|cy|ge|gi|gy)/.test(w),
  P10: (w) => syllables(w) >= 2 && new RegExp(`[aeiou][${C}]{2,3}[aeiou]`).test(w),
  P11: (w) => syllables(w) >= 2 && new RegExp(`[aeiou][${C}]e$`).test(w),
  P12: (w) => syllables(w) >= 2,
  P13: (w) => syllables(w) >= 2 && /(ai|ay|ee|ea|oa|oe|ue|ui|ow|ou|oo|au|aw|ew|oi|oy|igh)/.test(w),
  P14: (w) => new RegExp(`[${C}]le$`).test(w) && syllables(w) >= 2,
  P15: (w) => syllables(w) >= 2 && /(ar|or|er|ir|ur)/.test(w),
};

const problems = [];
const seenFake = new Map();
let realCount = 0, fakeCount = 0;

for (const c of CONCEPTS) {
  if (c.kind === "letters") {
    if (c.letters.length !== 26) problems.push(`${c.id}: ${c.letters.length} letters, expected 26`);
    continue;
  }
  const test = PATTERN[c.id];
  if (!test) { problems.push(`${c.id}: no pattern test`); continue; }

  const within = new Set();
  for (const w of [...c.real, ...c.fake]) {
    if (within.has(w)) problems.push(`${c.id}: "${w}" appears twice in the skill`);
    within.add(w);
  }

  for (const w of c.real) {
    realCount++;
    if (!isRealWord(w, FULL)) problems.push(`${c.id} real "${w}": not in the dictionary`);
    if (!test(w)) problems.push(`${c.id} real "${w}": does not carry the ${c.id} pattern`);
  }

  for (const w of c.fake) {
    fakeCount++;
    if (looksReal(w, SHORT)) problems.push(`${c.id} made-up "${w}": IS A REAL WORD`);
    if (FULL && FULL.has(w)) problems.push(`${c.id} made-up "${w}": IS A REAL WORD (dictionary)`);
    if (unsafeWord(w)) problems.push(`${c.id} made-up "${w}": unsafe string`);
    if (!test(w)) problems.push(`${c.id} made-up "${w}": does not carry the ${c.id} pattern`);
    const prev = seenFake.get(w);
    if (prev) problems.push(`${c.id} made-up "${w}": already used in ${prev}`);
    else seenFake.set(w, c.id);
  }
}

console.log(`${CONCEPTS.length} skills · ${realCount} real words · ${fakeCount} made-up words`);
console.log(FULL ? `dictionary: ${FULL.size} words from ${SYSTEM_DICT}` : `⚠ ${SYSTEM_DICT} not found — the "is it real" check was SKIPPED`);

if (problems.length) {
  console.error(`\n❌ ${problems.length} problems:\n`);
  for (const p of problems) console.error(`   – ${p}`);
  process.exit(1);
}
console.log("\n✅ every word is real or made-up as filed, carries its skill's pattern, and is unique.");
