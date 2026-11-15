/**
 * Do the heart words hold up?
 *
 * A heart word is a high-frequency word that decoding alone will not give
 * a child -- "said" is s-ai-d and the ai says /e/. The point of marking
 * one is that only PART of it has to be learned by heart. The rest is
 * decodable, and a child who is told to memorise the whole shape is being
 * taught the thing the science of reading corrected: that reading is
 * recognising words rather than working them out.
 *
 * So the invariant that matters is the one in check 4. Everything else
 * here is bookkeeping.
 *
 *   1. The list still matches the OG levels it came from. The words and
 *      their levels are the packs', not this file's, and if a level gains
 *      or loses a heart word this has to be told.
 *   2. Every span really is the letters it claims. The spans were marked
 *      by hand, and an off-by-one puts the heart over the wrong letter,
 *      which is worse than no heart at all.
 *   3. Spans are in order, inside the word, non-empty and do not overlap.
 *   4. No word is marked heart from end to end -- except the two that are
 *      one and two letters long, where there is nothing else to be. If a
 *      word has no decodable part then it is not a heart word, it is a
 *      word being memorised, and the mark is making a false promise.
 *   5. Every word says what its letters do instead. "Learn it by heart"
 *      is not a reason; a child can be told what the letters are doing.
 *
 * It also reports, without failing, where the sequence teaches a pattern
 * that would decode a word this list calls irregular. That is a content
 * question rather than a fault, and it is Stephanie's to settle.
 *
 *   bun scripts/check-heart-words.mjs
 */

import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const DATA = read("scripts/reading-heart-words.json");
const SEQ = read("scripts/reading-sequence.json").sequence;

const R = "content-reading-materials/og-packs/";
global.window = global;
new Function(readFileSync(R + "og-concepts.js", "utf8"))();
new Function(readFileSync(R + "og-pack-data.js", "utf8"))();

/** The authored list, straight from the packs. */
const fromPacks = new Map();
for (const l of global.OG_LEVELS || [])
  for (const w of l.heart || []) {
    const k = String(w).toLowerCase();
    const n = Number(l.level);
    if (!fromPacks.has(k) || fromPacks.get(k) > n) fromPacks.set(k, n);
  }

const problems = [];
const say = (m) => problems.push(m);

const mine = new Map(DATA.words.map((r) => [r.word, r]));

// 1. the list is the packs' list
for (const [w, lvl] of fromPacks) {
  if (!mine.has(w)) say(`"${w}" is a Level ${lvl} heart word in the packs and is missing here`);
  else if (mine.get(w).level !== lvl)
    say(`"${w}" is Level ${lvl} in the packs and Level ${mine.get(w).level} here`);
}
for (const w of mine.keys())
  if (!fromPacks.has(w)) say(`"${w}" is marked here and is not a heart word in any OG level`);

let marked = 0;
for (const r of DATA.words) {
  const w = r.word;
  const where = (m) => say(`${w}: ${m}`);

  if (!Array.isArray(r.hearts) || r.hearts.length === 0) {
    where("has no heart letters marked");
    continue;
  }
  if (!Array.isArray(r.letters) || r.letters.length !== r.hearts.length) {
    where("letters and hearts do not line up");
    continue;
  }

  let last = -1;
  let covered = 0;
  for (let i = 0; i < r.hearts.length; i++) {
    const [a, b] = r.hearts[i];
    // 3. inside the word, non-empty, in order, no overlap
    if (!(Number.isInteger(a) && Number.isInteger(b))) { where(`span ${i + 1} is not a pair of integers`); continue; }
    if (a < 0 || b > w.length) { where(`span ${i + 1} [${a},${b}) falls outside the word`); continue; }
    if (b <= a) { where(`span ${i + 1} [${a},${b}) is empty`); continue; }
    if (a < last) { where(`span ${i + 1} [${a},${b}) overlaps or runs backwards`); continue; }
    last = b;
    covered += b - a;
    // 2. the span really is those letters
    if (w.slice(a, b) !== r.letters[i])
      where(`span ${i + 1} [${a},${b}) is "${w.slice(a, b)}", but it is written down as "${r.letters[i]}"`);
    marked++;
  }

  // 4. something must be left to decode
  if (covered >= w.length && w.length > 2)
    where(`is marked heart from end to end — then it is not a heart word, it is a word being memorised`);

  // 5. a reason a child could be told
  if (!r.why || String(r.why).trim().length < 8) where("does not say what the letters do instead");
  if (/learn (it|this) by heart/i.test(r.why || "")) where('gives "learn it by heart" as the reason, which is not one');
}

/*
 * Reported, not failed: words a Level 5 lesson would decode.
 *
 * og5-09 teaches the aught and ought word families. caught, thought,
 * fought, bought and daughter are on the heart list at the same level.
 * Both cannot be right: if the family is taught then those words are
 * decodable and marking them heart tells a child to memorise what they
 * could work out.
 */
const FAMILY = [
  [/augh|ough/, "og5-09", "teaches the aught and ought families"],
  [/^w(ar|or)/, "og5-07", "teaches r-controlled wor"],
];
const tension = [];
for (const r of DATA.words) {
  for (const [re, key, what] of FAMILY) {
    if (!re.test(r.word)) continue;
    const lesson = SEQ.find((x) => x.key === key);
    if (lesson && lesson.level <= r.level) tension.push(`${r.word} (Level ${r.level}) — ${key} ${what}`);
  }
}

console.log(`${DATA.words.length} heart words across ${new Set(DATA.words.map((r) => r.level)).size} levels, ${marked} marked spans.`);
if (tension.length) {
  console.log(`\n${tension.length} words the sequence also teaches as a pattern — a content question, not a fault:`);
  tension.forEach((t) => console.log("  " + t));
}
console.log(`\nproblems: ${problems.length}`);
problems.slice(0, 40).forEach((x) => console.log("  " + x));
if (problems.length) {
  console.error("\n✗ fix these before the heart words ship.");
  process.exit(1);
}
console.log("✅ every heart word keeps a decodable part, and every mark is on the letters it names");
