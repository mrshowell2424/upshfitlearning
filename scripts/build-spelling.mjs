/**
 * Dictation: the write side of the same phonics.
 *
 * Everything a child reads on this site has a reading task attached and no
 * writing one. Decoding and encoding are not the same skill and the second
 * is the harder of the two -- a child who reads "rain" has to choose
 * between ai, ay and a_e to spell it, and only spelling forces that choice.
 *
 * Nothing new is invented here. The word banks in reading-part-words.json
 * are already written, already checked against their place in the sequence
 * by check-word-sequence.mjs. This locates the lesson inside each word so
 * the tool can say WHERE a spelling went wrong, and finds each pattern a
 * sentence to dictate.
 *
 * Two deliberate omissions, both of which looked tempting:
 *
 *   The fake words are left out. They are a reading task. Dictating
 *   "naim" and marking the child wrong for writing "name" would be
 *   marking them wrong for knowing a spelling pattern, and there is no
 *   way to compute which spellings of a nonsense word are defensible.
 *
 *   Nothing here claims a word is irregular. That cannot be derived from
 *   a spelling -- "said" holds the letters ai and does not say them --
 *   and a guess at it would be wrong in exactly the cases that matter.
 *
 *   bun scripts/build-spelling.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(readFileSync(join(ROOT, "scripts", f), "utf8"));

const PART_WORDS = read("reading-part-words.json");
const PASSAGES = read("reading-passages.json").passages;
const WRITTEN = read("reading-third-sentences.json");
const SPLITS = read("reading-skill-splits.json");

import { spanOf } from "./lib/spelling-span.mjs";

/* ------------------------------------------------------------------ *
 * The sentence to dictate.
 * ------------------------------------------------------------------ */

/**
 * A sentence a child can hold long enough to write it. Under six words
 * teaches nothing about spacing or punctuation; past the ceiling what is
 * being measured is memory rather than spelling.
 *
 * The ceiling moves with the level, because the span a child can hold
 * does. Twelve is right for a second grader working through the basic
 * code; holding a fifth grader working on Latin roots to the same twelve
 * dropped six patterns that had perfectly good fourteen-word sentences
 * sitting in their own passages.
 */
const MIN_WORDS = 6;
const maxWords = (key) => {
  const m = /^og([1-5])-/.exec(key);
  return m && Number(m[1]) >= 3 ? 15 : 12;
};

const wordCount = (s) => s.trim().split(/\s+/).length;

/** Quotation marks have to balance, or the sentence was cut in half. */
function wholeSentence(s) {
  const pairs = [["“", "”"], ['"', '"']];
  for (const [open, close] of pairs) {
    const o = s.split(open).length - 1;
    const c = s.split(close).length - 1;
    if (open === close ? o % 2 !== 0 : o !== c) return false;
  }
  return /[.!?]$/.test(s.trim());
}

/**
 * Split a paragraph into sentences. "Mr Finch" has no full stop after Mr
 * in these passages, but a title that did would cut a sentence in two, so
 * the known ones are protected before the split and restored after.
 */
const TITLES = ["Mr.", "Mrs.", "Ms.", "Dr.", "St.", "a.m.", "p.m."];
function sentencesOf(para) {
  let s = para;
  TITLES.forEach((t, i) => (s = s.split(t).join(`\u0000${i}\u0000`)));
  const out = s
    .split(/(?<=[.!?])["”]?\s+/)
    .map((x) => {
      TITLES.forEach((t, i) => (x = x.split(`\u0000${i}\u0000`).join(t)));
      return x.trim();
    })
    .filter(Boolean);
  return out;
}

/** Whole word only: "rain" must not match "raining" or "brain". */
const has = (sentence, word) =>
  new RegExp(`(^|[^a-z])${word.toLowerCase()}($|[^a-z])`, "i").test(sentence);

/**
 * The best sentence in a pattern's own passage: the one carrying the most
 * words of the lesson, at the lowest grade that has one, nearest ideal
 * length. A dictation sentence that holds three words of the pattern is
 * teaching the pattern; one that holds a single word is teaching a word.
 */
function sentenceFromPassage(key, bankWords) {
  const p = PASSAGES[key];
  if (!p) return null;
  const MAX_WORDS = maxWords(key);
  const cands = [];
  for (const level of ["g2", "g3", "g4"]) {
    const lv = p[level];
    if (!lv) continue;
    for (const para of lv.paras || []) {
      for (const s of sentencesOf(para)) {
        if (!wholeSentence(s)) continue;
        const n = wordCount(s);
        if (n < MIN_WORDS || n > MAX_WORDS) continue;
        const carried = bankWords.filter((w) => has(s, w));
        if (!carried.length) continue;
        cands.push({ text: s, level, title: lv.title, carried, words: n });
      }
    }
  }
  if (!cands.length) return null;
  const rank = { g2: 0, g3: 1, g4: 2 };
  cands.sort(
    (a, b) =>
      b.carried.length - a.carried.length ||
      rank[a.level] - rank[b.level] ||
      Math.abs(a.words - 9) - Math.abs(b.words - 9),
  );
  const best = cands[0];
  return {
    text: best.text,
    words: best.words,
    carries: best.carried,
    source: `${best.title} · ${best.level.replace("g", "")}${
      best.level === "g2" ? "nd" : best.level === "g3" ? "rd" : "th"
    } grade`,
  };
}

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

const keys = Object.keys(PART_WORDS).filter((k) => !k.startsWith("_"));
const bases = [...new Set(keys.map((k) => k.split("|")[0]))];

const patterns = [];
const dropped = [];

for (const base of bases) {
  const parts = [];
  for (const k of keys.filter((x) => x.split("|")[0] === base)) {
    const raw = k.split("|")[1];
    if (!raw) continue;
    const words = [];
    for (const w of PART_WORDS[k].real || []) {
      const span = spanOf(w, raw);
      if (!span) {
        dropped.push(`${k} · ${w} · the lesson is not in the spelling`);
        continue;
      }
      words.push({ word: w, span });
    }
    if (words.length) parts.push({ part: raw, words });
  }
  if (!parts.length) continue;

  const all = parts.flatMap((p) => p.words.map((w) => w.word));

  // The hand-written sentence wins where there is one: those were built to
  // pack the pattern in deliberately, and a sentence found in a passage
  // can only carry what the story happened to need.
  const written = WRITTEN[base];
  const sentence = written
    ? {
        text: written,
        words: wordCount(written),
        carries: all.filter((w) => has(written, w)),
        source: "written for dictation",
      }
    : sentenceFromPassage(base, all);

  if (!sentence) {
    dropped.push(
      `${base} · its passage has no sentence of ${MIN_WORDS}-${maxWords(base)} words ` +
        `carrying a word of the pattern`,
    );
    continue;
  }

  patterns.push({
    key: base,
    parts,
    sub: SPLITS[base] ?? parts.map((p) => p.part),
    sentence,
  });
}

const out = {
  _note:
    "Dictation built from the word banks in reading-part-words.json. Each " +
    "word carries the span of the lesson inside it, so a wrong spelling can " +
    "be told apart from a wrong lesson. Sentences are the hand-written ones " +
    "where they exist and the pattern's own passage otherwise. Built by " +
    "scripts/build-spelling.mjs, checked by scripts/check-spelling.mjs.",
  _omitted:
    "The fake words are not here: they are a reading task, and there is no " +
    "defensible way to mark a dictated nonsense word. Nothing here says a " +
    "word is irregular, because that cannot be read off a spelling.",
  patterns,
};

writeFileSync(join(ROOT, "scripts", "reading-spelling.json"), JSON.stringify(out, null, 1));

const words = patterns.reduce((n, p) => n + p.parts.reduce((m, q) => m + q.words.length, 0), 0);
const fromPassage = patterns.filter((p) => p.sentence.source !== "written for dictation").length;
console.log(`patterns:  ${patterns.length}`);
console.log(`parts:     ${patterns.reduce((n, p) => n + p.parts.length, 0)}`);
console.log(`words:     ${words}`);
console.log(`sentences: ${patterns.length - fromPassage} written, ${fromPassage} from the pattern's own passage`);
if (dropped.length) {
  console.log(`\ndropped ${dropped.length}:`);
  dropped.forEach((d) => console.log("   " + d));
}
