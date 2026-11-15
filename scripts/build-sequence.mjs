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

const R = "content-reading-materials/og-packs/";
global.window = global;
new Function(readFileSync(R + "og-concepts.js", "utf8"))();
new Function(readFileSync(R + "og-pack-data.js", "utf8"))();
const PACKS = global.OG_PACKS;

const SPELL = JSON.parse(readFileSync("scripts/reading-spelling.json", "utf8"));
const SPELL_BY_KEY = new Map(SPELL.patterns.map((p) => [p.key, p]));
const SPLITS = JSON.parse(readFileSync("scripts/reading-skill-splits.json", "utf8"));

/*
 * The same system dictionary the ladder check uses, for the same reason.
 * The wider pack fields are worth reaching into when the short list
 * misses a sub-pattern, but some of them carry the made-up words from
 * the real-or-fake exercises -- proll, mandle, jicture, interblate -- and
 * a review sheet telling a teacher to read "mandle" is worse than one
 * that is merely incomplete.
 */
const DICT = new Set(
  readFileSync("/usr/share/dict/words", "utf8")
    .split("\n")
    .map((w) => w.trim())
    .filter((w) => w && w === w.toLowerCase()),
);
const realWord = (w) => DICT.has(w) || DICT.has(w.replace(/'s$/, "")) || DICT.has(w.replace(/-/g, ""));

const bare = (raw) => raw.toLowerCase().split("/").map((x) => x.replace(/-/g, "")).filter(Boolean);
const carries = (word, raw) =>
  bare(raw).some((b) =>
    b.includes("_") ? new RegExp(b.replace(/_/g, ".")).test(word.toLowerCase()) : word.toLowerCase().includes(b),
  );

/** Every real word anywhere in a pack's word fields. */
const WIDE_FIELDS = ["speed", "bank", "read", "read2", "lists"];
function widePool(id) {
  const p = PACKS[id];
  if (!p) return [];
  const out = new Set();
  for (const f of WIDE_FIELDS) {
    const v = p[f];
    if (!v) continue;
    for (const item of Array.isArray(v) ? v : [v]) {
      if (typeof item !== "string") continue;
      for (const w of item.split(/[^A-Za-z'-]+/)) {
        const lw = w.toLowerCase();
        if (lw.length > 1 && realWord(lw)) out.add(lw);
      }
    }
  }
  return [...out];
}

/** Basic Reading patterns and the OG pack that covers the same ground. */
const PACK_FOR_BASIC = {
  "cvc-a": "1-01",
  "cvc-mix": "1-01",
  dig: "1-05",
  floss: "1-07",
  vce: "1-08",
  blends: "1-09",
  vccv: "1-12",
  vccvce: "1-12",
  "ng-nk": "2-01",
  y: "2-02",
  "ck-tch": "2-03",
  "ar-or": "2-04",
  "ai-ay": "2-05",
  "ee-ea": "2-05",
  "oa-ow": "2-05",
};

const WANT = 10;

function fromSpelling(key) {
  const s = SPELL_BY_KEY.get(key);
  if (!s) return null;
  const out = [];
  const per = Math.ceil(WANT / s.parts.length);
  for (const part of s.parts) for (const w of part.words.slice(0, per)) out.push(w.word);
  return out.slice(0, WANT);
}

function fromPack(key) {
  const id = key.startsWith("og") ? key.slice(2) : PACK_FOR_BASIC[key];
  const p = id && PACKS[id];
  if (!p) return null;
  for (const field of ["speed", "bank", "read"]) {
    const v = p[field];
    if (Array.isArray(v) && v.length) {
      const words = [...new Set(v.map((w) => String(w).trim()).filter((w) => /^[a-zA-Z'-]+$/.test(w)))];
      if (words.length) return words.slice(0, WANT);
    }
  }
  return null;
}

const packId = (key) => (key.startsWith("og") ? key.slice(2) : PACK_FOR_BASIC[key]);

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
  const missing = subs.filter((sub) => !words.some((w) => carries(w, sub)));
  if (!missing.length) return { words, topped: 0 };

  const pool = widePool(packId(key));
  const out = [...words];
  let topped = 0;
  for (const sub of missing) {
    const pick = pool
      .filter((w) => carries(w, sub) && !out.includes(w))
      // shortest first: a review word should be the plainest example of
      // its pattern, not the longest one in the pack.
      .sort((a, b) => a.length - b.length || a.localeCompare(b))[0];
    if (pick) {
      out.push(pick);
      topped++;
    }
  }
  return { words: out, topped };
}

let toppedTotal = 0;
const seq = deriveSequence().map((r) => {
  const base = fromSpelling(r.key) ?? fromPack(r.key) ?? [];
  const source = fromSpelling(r.key) ? "spelling" : fromPack(r.key) ? "pack" : "none";
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
console.log(`  ${toppedTotal} words added to reach sub-patterns the pack list missed`);
const none = seq.filter((r) => r.wordSource === "none").map((r) => r.key);
if (none.length) console.log(`  no words for: ${none.join(", ")}`);
