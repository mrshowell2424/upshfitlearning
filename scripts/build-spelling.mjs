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
const EXTRA = read("reading-extra-words.json");
const WHATSAYS = read("reading-what-says.json").ws;

import { spanOf } from "./lib/spelling-span.mjs";
import { LESSON_SPANS, lessonSpan } from "./lib/lesson-span.mjs";
import { packWords, widePool } from "./lib/pack-words.mjs";

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
const banked = [...new Set(keys.map((k) => k.split("|")[0]))];

/*
 * Thirteen lessons with no word bank at all.
 *
 * reading-part-words.json covers forty-one lessons, so forty of the
 * sixty-two had dictation and twenty-one had none. The missing piece was
 * never the words -- every one of those lessons has ten in its OG pack
 * and ten more in reading-extra-words.json, and two sentences written for
 * dictation. What was missing was the span: which letters in "badge" are
 * the lesson. Without it the tool cannot tell a pattern error from a
 * slip, and that is the whole of what makes it more than a spelling test.
 *
 * lib/lesson-span.mjs now carries a span rule for thirteen of the
 * twenty-one. Those thirteen build their parts from the rule instead of
 * from a bank. The other eight still have none, because no substring is
 * their lesson -- syllable division is a boundary, the silent e rule is
 * about a letter nobody writes, and which a in panda is the schwa cannot
 * be read off the spelling.
 *
 * The words come from the OG pack and from the extra-words file, read
 * through lib/pack-words.mjs. Not from reading-sequence.json, which takes
 * a lesson's words from its dictation bank where one exists: reading it
 * here would be deriving these words from this file's own output.
 */
const ruled = Object.keys(LESSON_SPANS).filter((k) => !banked.includes(k));
const bases = [...banked, ...ruled];

/** Where the lesson sits in a word: the rule where there is one. */
const locate = (base, word, part) =>
  LESSON_SPANS[base] ? lessonSpan(base, word)?.span ?? null : spanOf(word, part);

const WANT = 10;

/**
 * Parts for a lesson with no bank: its pack words grouped by which of the
 * lesson's spellings each one is an example of. A word the rule cannot
 * place is not an example and is left out -- short a's pack covers all
 * five short vowels, so eight of its ten are other vowels -- and the list
 * is refilled from the wider pack fields rather than shipped short.
 */
function partsFromRule(base) {
  const byPart = new Map();
  const taken = new Set();
  const add = (w) => {
    const hit = lessonSpan(base, w);
    if (!hit || taken.has(w)) return false;
    taken.add(w);
    if (!byPart.has(hit.sub)) byPart.set(hit.sub, []);
    byPart.get(hit.sub).push({ word: w, span: hit.span });
    return true;
  };
  for (const w of packWords(base, Infinity) ?? []) {
    if (taken.size >= WANT) break;
    add(w);
  }
  for (const w of widePool(base).sort((a, b) => a.length - b.length || a.localeCompare(b))) {
    if (taken.size >= WANT) break;
    add(w);
  }
  return { parts: [...byPart.entries()].map(([part, words]) => ({ part, words })), taken };
}

const patterns = [];
const dropped = [];

for (const base of bases) {
  let parts = [];
  if (LESSON_SPANS[base] && !banked.includes(base)) {
    parts = partsFromRule(base).parts;
    if (!parts.length) {
      dropped.push(`${base} · no pack word is an example of its own lesson`);
      continue;
    }
  }
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

  /*
   * A second round, out of reading-extra-words.json.
   *
   * Ten more real words per skill and two more sentences, written so a
   * teacher running dictation twice in a week never repeats a word. They
   * arrive keyed by skill rather than by sub-pattern, so each word's own
   * sub has to be found before its span can be marked -- the span is
   * what lets the tool tell a pattern error from an error elsewhere, and
   * a second round without it would be a worse tool wearing the same
   * face.
   *
   * The made-up words in that file stay out, for the reason the first
   * round leaves them out: dictating a nonsense word and marking a child
   * wrong for spelling it the sensible way marks them wrong for knowing
   * a pattern.
   */
  const ex = EXTRA[base];
  let extra = null;
  if (ex && Array.isArray(ex.real) && ex.real.length) {
    const subs = SPLITS[base] ?? parts.map((p) => p.part);
    const ruleHere = Boolean(LESSON_SPANS[base]);
    const byPart = new Map();
    // Only the words the first round does not already have. The extra
    // file was written as "ten more words on the pattern", and across the
    // 62 skills 283 of its 620 turn out to be words the main bank already
    // holds -- for eight skills, all ten of them. A second round made of
    // those would be the first round with a different number on it, so
    // the overlap comes out here and the floor below decides whether what
    // is left is still a round.
    const already = new Set(parts.flatMap((q) => q.words.map((w) => w.word)));
    for (const w of ex.real) {
      if (already.has(w)) continue;
      // Longest matching sub first, so "ai" does not claim a word whose
      // lesson is really the longer spelling it sits inside.
      const sub = ruleHere
        ? lessonSpan(base, w)?.sub
        : [...subs]
            .sort((a, b) => b.replace(/-/g, "").length - a.replace(/-/g, "").length)
            .find((x) => spanOf(w, x));
      if (!sub) {
        dropped.push(`${base} · extra word ${w} · the lesson is not in the spelling`);
        continue;
      }
      if (!byPart.has(sub)) byPart.set(sub, []);
      byPart.get(sub).push({ word: w, span: locate(base, w, sub) });
    }
    const exParts = [...byPart.entries()].map(([part, words]) => ({ part, words }));
    const exAll = exParts.flatMap((p) => p.words.map((w) => w.word));
    const exSent = (ex.sent || []).find((t) => wholeSentence(t));
    // A round of two words is not a round. Where the extra list barely
    // survives span-matching -- blends, whose recorded sub-patterns cover
    // three of the many blends a word can start with -- no second round
    // is offered rather than a thin one.
    const MIN_ROUND = 5;
    if (exAll.length >= MIN_ROUND && exSent) {
      extra = {
        parts: exParts,
        sentence: {
          text: exSent,
          words: wordCount(exSent),
          carries: exAll.filter((w) => has(exSent, w)),
          source: "written for dictation",
        },
      };
    }
  }

  patterns.push({
    key: base,
    parts,
    sub: SPLITS[base] ?? parts.map((p) => p.part),
    sentence,
    ...(extra ? { extra } : {}),
    ...(WHATSAYS[base] ? { whatSays: WHATSAYS[base] } : {}),
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
const withExtra = patterns.filter((p) => p.extra);
const extraWords = withExtra.reduce((n, p) => n + p.extra.parts.reduce((m, q) => m + q.words.length, 0), 0);
console.log(`round two:  ${withExtra.length} patterns, ${extraWords} more words`);
console.log(`what says:  ${patterns.filter((p) => p.whatSays).length} patterns carry the sound drill`);
if (dropped.length) {
  console.log(`\ndropped ${dropped.length}:`);
  dropped.forEach((d) => console.log("   " + d));
}
