/**
 * Write the teaching sequence out as data, with words for each lesson.
 *
 * The order is derived in scripts/lib/sequence.mjs from the lesson
 * builder's own list. This writes it to scripts/reading-sequence.json so
 * a page can import it like any other content file, instead of a Next.js
 * route reaching into an HTML file and eval'ing a literal out of it.
 *
 * Each lesson also carries the words to say when it comes up as review,
 * and WHERE they came from, because that turned out to matter. The first
 * version of the review page fell back to the lesson's word ladder for
 * any lesson with no spelling bank, which looked fine and was wrong: a
 * ladder is a chain of one-sound changes, not a list of examples. The
 * ladder for the -dge lesson is one, on, in, it, at, sat, saw -- entirely
 * decodable at that point, entirely free of -dge. A teacher told to
 * review -dge with those words would reasonably conclude the site was
 * broken.
 *
 * So the sources, in order of preference:
 *
 *   spelling  the dictation bank, spread across the pattern's parts.
 *             Chosen for the pattern and already checked against its
 *             place in the sequence.
 *   pack      the OG pack's own speed/bank/read list for that concept.
 *   none      nothing honest to show. The page says so rather than
 *             filling the space.
 *
 *   bun scripts/build-sequence.mjs
 *
 * scripts/check-review.mjs re-derives the order and fails if this file
 * has drifted, and asserts the words really carry their pattern.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { deriveSequence } from "./lib/sequence.mjs";
import { LESSON_SPANS, lessonSpan } from "./lib/lesson-span.mjs";
import { packWords, widePool } from "./lib/pack-words.mjs";
import { EXTRA_LESSONS } from "./lib/extra-lessons.mjs";

/**
 * The Hub's own lessons carry their words in the row itself.
 *
 * They have no spelling bank and no OG pack -- there is no pack for "every
 * spelling of long a" -- so without this they came out of the sequence with
 * wordSource "none" and an empty list, which is the page saying it has nothing
 * honest to show. It has: the ten words are right there in field 6, chosen for
 * the lesson when it was written.
 */
const OWN = new Map(EXTRA_LESSONS.map((r) => [r[0], r[6]]));
const fromOwn = (key) => OWN.get(key) ?? null;


const SPELL = JSON.parse(readFileSync("scripts/reading-spelling.json", "utf8"));
const SPELL_BY_KEY = new Map(SPELL.patterns.map((p) => [p.key, p]));
const SPLITS = JSON.parse(readFileSync("scripts/reading-skill-splits.json", "utf8"));


const bare = (raw) => raw.toLowerCase().split("/").map((x) => x.replace(/-/g, "")).filter(Boolean);
const carries = (word, raw) =>
  bare(raw).some((b) =>
    b.includes("_") ? new RegExp(b.replace(/_/g, ".")).test(word.toLowerCase()) : word.toLowerCase().includes(b),
  );

/**
 * Is this word an example of this lesson?
 *
 * For a lesson with a span rule, the rule answers it -- and answers it
 * strictly, which is the point. Short a (CVC) was shipping pig, hen, mop,
 * bug, sit, red, hot and fun as its review words, because its pack covers
 * all five short vowels and nothing here looked at the vowel. A loose
 * substring test would not have caught that either: every one of those
 * words is in the pack and none of them holds an a.
 *
 * Lessons without a rule keep the loose test they had. Their words come
 * from a dictation bank that was already chosen for the pattern.
 */
const example = (key, w) =>
  LESSON_SPANS[key]
    ? Boolean(lessonSpan(key, w))
    : (SPLITS[key] ?? []).some((sub) => carries(w, sub));



const WANT = 10;

function fromSpelling(key) {
  const s = SPELL_BY_KEY.get(key);
  if (!s) return null;
  /*
   * One from each part in turn, rather than a fixed quota each.
   *
   * A quota wastes what a thin part cannot fill. The final-y lesson has
   * two parts and the second holds a single word -- crying, the one that
   * keeps its y -- so a quota of five each produced six words, and the
   * four that topped the list back up to ten came from the wider pack
   * shortest-first: fried, plied, spied. Those are not third-grade
   * review words. Taking turns gives the same balance where both parts
   * are full and spends nothing on a part that is empty.
   */
  // A word can belong to two parts -- telephone is both the tele part and
  // the phone part, biology is both bio and ology -- and listing it twice
  // reads as a mistake on a review sheet.
  const out = [];
  const seen = new Set();
  for (let i = 0; out.length < WANT; i++) {
    let added = false;
    for (const part of s.parts) {
      if (i >= part.words.length) continue;
      added = true;
      const w = part.words[i].word;
      if (out.length < WANT && !seen.has(w)) {
        seen.add(w);
        out.push(w);
      }
    }
    if (!added) break;
  }
  return out;
}

const fromPack = (key) => packWords(key, WANT);


/*
 * Top up a list that does not reach all of its lesson's sub-patterns.
 *
 * A consonant-le list of table, bubble, circle, bicycle, candle, handle,
 * jungle, eagle, apple, purple is a good list and has no -tle word in it,
 * so a teacher reviewing consonant-le never says "little". One word per
 * missing sub-pattern, pulled from the wider pack fields and filtered
 * through the dictionary, fixes that without disturbing what was already
 * chosen.
 */
function topUp(key, words) {
  const subs = SPLITS[key];
  if (!subs || !subs.length) return { words, topped: 0 };
  const rule = LESSON_SPANS[key];
  const holds = (w, sub) => (rule ? lessonSpan(key, w)?.sub === sub : carries(w, sub));
  const missing = subs.filter((sub) => !words.some((w) => holds(w, sub)));

  const pool = widePool(key).filter((w) => example(key, w));
  const out = [...words];
  let topped = 0;
  for (const sub of missing) {
    const pick = pool
      .filter((w) => holds(w, sub) && !out.includes(w))
      // shortest first: a review word should be the plainest example of
      // its pattern, not the longest one in the pack.
      .sort((a, b) => a.length - b.length || a.localeCompare(b))[0];
    if (pick) {
      out.push(pick);
      topped++;
    }
  }
  /*
   * Refill what the sieve took out. A lesson whose list was mostly not
   * its own pattern comes out of the filter short -- short a keeps cat
   * and map out of ten -- and a review list of two words is not one.
   * Same pool, same shortest-first rule as above.
   */
  for (const w of pool.sort((a, b) => a.length - b.length || a.localeCompare(b))) {
    if (out.length >= WANT) break;
    if (!out.includes(w)) {
      out.push(w);
      topped++;
    }
  }
  return { words: out, topped };
}

let toppedTotal = 0;
let sieved = 0;
const seq = deriveSequence().map((r) => {
  const raw = fromSpelling(r.key) ?? fromPack(r.key) ?? fromOwn(r.key) ?? [];
  const source = fromSpelling(r.key)
    ? "spelling"
    : fromPack(r.key)
      ? "pack"
      : fromOwn(r.key)
        ? "lesson"
        : "none";
  // Keep only the words that really are examples of this lesson.
  const base = raw.filter((w) => example(r.key, w) || !SPLITS[r.key]?.length);
  sieved += raw.length - base.length;
  if (!base.length) return { ...r, words: [], wordSource: "none" };
  const { words, topped } = topUp(r.key, base);
  toppedTotal += topped;
  return { ...r, words, wordSource: topped ? `${source}+pool` : source };
});

const out = {
  _note:
    "The interleaved teaching sequence: Basic Reading patterns and OG concepts in the single order a teacher works down, each with the words to use when it comes up as review. Generated by scripts/build-sequence.mjs; do not hand-edit. scripts/check-review.mjs fails if this has drifted from the source.",
  sequence: seq,
};

writeFileSync("scripts/reading-sequence.json", JSON.stringify(out, null, 2) + "\n", "utf8");

const bySource = seq.reduce((m, r) => ((m[r.wordSource] = (m[r.wordSource] || 0) + 1), m), {});
console.log("wrote scripts/reading-sequence.json");
console.log(`  ${seq.length} lessons in order`);
console.log(`  words from: ${Object.entries(bySource).map(([s, n]) => `${s} ${n}`).join(", ")}`);
console.log(`  ${sieved} words dropped for not being examples of their own lesson`);
console.log(`  ${toppedTotal} words added to reach sub-patterns the pack list missed, or to refill`);
const none = seq.filter((r) => r.wordSource === "none").map((r) => r.key);
if (none.length) console.log(`  no words for: ${none.join(", ")}`);
