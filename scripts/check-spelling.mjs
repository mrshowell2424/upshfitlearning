/**
 * Does the dictation data still say what it claims?
 *
 * The tool's whole value is that it can tell a child WHERE a spelling went
 * wrong -- inside the lesson, or somewhere earlier. That rests on one
 * number per word, the span of the pattern inside it, and a span that is
 * off by one marks the wrong letters and teaches the wrong thing while
 * looking perfectly fine on screen.
 *
 * So every span is recomputed here from the word and the pattern name, and
 * every sentence is checked against the words it claims to carry.
 *
 * It also refuses the two things the builder deliberately left out, because
 * both would be easy to add back without noticing they were wrong:
 * a fake word among the dictation words, and a word that is not in the
 * bank it came from.
 *
 *   bun scripts/check-spelling.mjs
 */

import { readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spanOf, judgeSpelling } from "./lib/spelling-span.mjs";
import { LESSON_SPANS, lessonSpan } from "./lib/lesson-span.mjs";
import { packWords, widePool } from "./lib/pack-words.mjs";

/*
 * Where the lesson should be. Thirteen patterns have no word bank and
 * are built from a span rule in lib/lesson-span.mjs instead, because a
 * substring is not the pattern for them: the -s suffix in desks is the
 * last s, and the soft letter in magic is the g. Those are recomputed
 * with the rule, everything else with spanOf, and the point either way
 * is that this file recomputes rather than trusts.
 */
const freshSpan = (key, word, part) =>
  LESSON_SPANS[key] ? lessonSpan(key, word)?.span ?? null : spanOf(word, part);


const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(readFileSync(join(ROOT, "scripts", f), "utf8"));

const DATA = read("reading-spelling.json");
const BANKS = read("reading-part-words.json");
const EXTRA = read("reading-extra-words.json");
const WHATSAYS = read("reading-what-says.json").ws;

const problems = [];
const fail = (where, why) => problems.push(`${where}: ${why}`);

const REAL = new Map();
const FAKE = new Set();
/** The second round's words and fakes, keyed by skill rather than by part. */
/*
 * Where a ruled pattern's words are allowed to come from.
 *
 * The banked patterns are held to their bank: every word has to be in
 * reading-part-words.json under that exact part, so nothing can drift
 * in. The thirteen ruled patterns have no bank, and the same guarantee
 * is owed: their words must be the OG pack's own, or the ones written
 * in reading-extra-words.json. Nothing may be invented here.
 */
const fromSource = (key) => {
  const ex = EXTRA[key] ?? {};
  return new Set([
    ...(packWords(key, Infinity) ?? []),
    ...widePool(key),
    ...(ex.real ?? []),
  ].map((w) => String(w).toLowerCase()));
};
const SOURCES = new Map(Object.keys(LESSON_SPANS).map((k) => [k, fromSource(k)]));

const EXTRA_REAL = new Map();
for (const [k, v] of Object.entries(EXTRA)) {
  if (k.startsWith("_")) continue;
  EXTRA_REAL.set(k, new Set(v.real || []));
  (v.fake || []).forEach((w) => FAKE.add(String(w).toLowerCase()));
  for (const w of Object.values(v.fix || {})) FAKE.add(String(w).toLowerCase());
}
for (const [k, v] of Object.entries(BANKS)) {
  if (k.startsWith("_")) continue;
  REAL.set(k, new Set(v.real || []));
  (v.fake || []).forEach((w) => FAKE.add(w.toLowerCase()));
}

const has = (sentence, word) =>
  new RegExp(`(^|[^a-z])${word.toLowerCase()}($|[^a-z])`, "i").test(sentence);

let words = 0;
let extraWords = 0;
let drills = 0;

for (const p of DATA.patterns) {
  if (!p.parts.length) fail(p.key, "no parts");

  for (const part of p.parts) {
    const bankKey = `${p.key}|${part.part}`;
    const bank = REAL.get(bankKey);
    const ruled = SOURCES.get(p.key);
    if (!bank && !ruled) fail(bankKey, "no bank of that name in reading-part-words.json");

    for (const { word, span } of part.words) {
      words++;

      // The word is the bank's -- or, for a ruled pattern, the pack's --
      // and not something that drifted in.
      if (bank && !bank.has(word)) fail(bankKey, `"${word}" is not in that bank`);
      if (!bank && ruled && !ruled.has(word.toLowerCase()))
        fail(bankKey, `"${word}" is in neither the OG pack nor the extra-words file`);
      if (FAKE.has(word.toLowerCase())) {
        fail(bankKey, `"${word}" is a fake word -- those are a reading task, not a dictation one`);
      }

      // The span still points at the lesson.
      const fresh = freshSpan(p.key, word, part.part);
      if (!fresh) {
        fail(bankKey, `"${word}" no longer contains ${part.part}`);
      } else if (fresh[0] !== span[0] || fresh[1] !== span[1]) {
        fail(
          bankKey,
          `"${word}" marks ${span.join("-")} but ${part.part} is at ${fresh.join("-")} ` +
            `(it would highlight "${word.slice(span[0], span[1])}")`,
        );
      }
      if (span[0] < 0 || span[1] > word.length || span[0] >= span[1]) {
        fail(bankKey, `"${word}" has a span outside the word`);
      }
    }
  }

  // The sentence.
  const s = p.sentence;
  if (!s || !s.text) {
    fail(p.key, "no sentence to dictate");
    continue;
  }
  if (!/[.!?]$/.test(s.text.trim())) {
    fail(p.key, `the sentence does not end in a full stop, question mark or exclamation: "${s.text}"`);
  }
  for (const [open, close] of [["“", "”"], ['"', '"']]) {
    const o = s.text.split(open).length - 1;
    const c = s.text.split(close).length - 1;
    if (open === close ? o % 2 !== 0 : o !== c) {
      fail(p.key, `the sentence has an unclosed quotation mark: "${s.text}"`);
    }
  }
  if (s.text.trim().split(/\s+/).length !== s.words) {
    fail(p.key, `the sentence says ${s.words} words and has ${s.text.trim().split(/\s+/).length}`);
  }
  if (!s.carries.length) {
    fail(p.key, `the sentence carries no word of the pattern: "${s.text}"`);
  }
  const all = new Set(p.parts.flatMap((x) => x.words.map((w) => w.word)));
  for (const w of s.carries) {
    if (!all.has(w)) fail(p.key, `the sentence claims to carry "${w}", which is not one of its words`);
    if (!has(s.text, w)) fail(p.key, `the sentence claims to carry "${w}" and does not contain it`);
  }

  /*
   * The second round, held to the same standard as the first.
   *
   * It exists so a teacher can run dictation twice in a week without
   * repeating a word, which only works if it really does not repeat one
   * -- so that is checked rather than assumed. Every word still has to
   * be a real word out of the extra bank, still has to carry its own
   * lesson at the span it claims, and still has to be absent from round
   * one. A second round that shared words with the first would be the
   * same round wearing a different number.
   */
  if (p.extra) {
    const bank = EXTRA_REAL.get(p.key);
    if (!bank) fail(p.key, "has a second round and no extra bank of that name");
    const seen = new Set();
    for (const part of p.extra.parts) {
      if (!p.sub.includes(part.part))
        fail(p.key, `second round has a part "${part.part}" that is not one of this lesson's`);
      for (const { word, span } of part.words) {
        extraWords++;
        if (bank && !bank.has(word)) fail(p.key, `second round: "${word}" is not in the extra bank`);
        if (FAKE.has(word.toLowerCase()))
          fail(p.key, `second round: "${word}" is a made-up word -- those are a reading task`);
        if (all.has(word)) fail(p.key, `second round repeats "${word}" from the first`);
        if (seen.has(word)) fail(p.key, `second round lists "${word}" twice`);
        seen.add(word);
        const fresh = freshSpan(p.key, word, part.part);
        if (!fresh) fail(p.key, `second round: "${word}" does not contain ${part.part}`);
        else if (fresh[0] !== span[0] || fresh[1] !== span[1])
          fail(
            p.key,
            `second round: "${word}" marks ${span.join("-")} but ${part.part} is at ${fresh.join("-")}`,
          );
      }
    }
    const e = p.extra.sentence;
    if (!e || !e.text) fail(p.key, "second round has no sentence");
    else {
      if (!/[.!?]$/.test(e.text.trim()))
        fail(p.key, `the second round's sentence does not end in a stop: "${e.text}"`);
      if (e.text.trim() === s.text.trim())
        fail(p.key, "the second round's sentence is the first round's sentence");
      if (e.text.trim().split(/\s+/).length !== e.words)
        fail(p.key, `the second round's sentence says ${e.words} words and has ${e.text.trim().split(/\s+/).length}`);
      for (const w of e.carries) {
        if (!seen.has(w)) fail(p.key, `the second round's sentence claims to carry "${w}", not one of its words`);
        if (!has(e.text, w)) fail(p.key, `the second round's sentence claims to carry "${w}" and does not`);
      }
    }
  }

  /*
   * The sound drill. It is printed as "What says /x/?" with the spelling
   * on the answer key, so each line has to have both halves.
   */
  if (p.whatSays) {
    drills++;
    const fromFile = WHATSAYS[p.key];
    if (!fromFile) fail(p.key, "carries a sound drill that is not in reading-what-says.json");
    else if (JSON.stringify(fromFile) !== JSON.stringify(p.whatSays))
      fail(p.key, "its sound drill has drifted from reading-what-says.json");
    for (const line of p.whatSays) {
      if (!/\u2192/.test(line)) fail(p.key, `sound drill line has no spelling after it: "${line}"`);
      const [sound, spelling] = String(line).split("\u2192").map((x) => x.trim());
      if (!sound || !/^\/.*\/$/.test(sound)) fail(p.key, `sound drill line does not name a sound: "${line}"`);
      if (!spelling) fail(p.key, `sound drill line names no spelling: "${line}"`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * What the tool tells a teacher
 * ------------------------------------------------------------------ *
 *
 * The page imports judgeSpelling from the same file this does, so these
 * assert the behaviour a child actually meets rather than a copy of it.
 * They live here rather than only in tests/unit/dictation.test.ts because
 * that suite does not currently run: vitest 1.6's worker pool fails under
 * Bun before it collects a single file, on every test in the repo. The
 * test is written and will run the day that is fixed; until then this is
 * what guards the rule.
 *
 * Two of these are here because they were wrong once:
 *
 *   "triin" and "trian" for "train" both look like slips elsewhere and
 *   are not: in one, ii stands where ai goes; in the other the two
 *   letters are there in the wrong order, and the order is the lesson.
 *
 *   The rule this replaced called "submitt" a child who does not know
 *   the root mit. They wrote mit perfectly and doubled a consonant.
 */
const VERDICTS = [
  // [word, pattern, what the child wrote, what they should be told]
  ["rain", "ai", "rain", "right"],
  ["cake", "a_e", "Cake", "right"],
  ["rain", "ai", "  rain  ", "right"],

  ["rain", "ai", "rane", "lesson"],
  ["rain", "ai", "rayn", "lesson"],
  ["train", "ai", "triin", "lesson"],
  ["train", "ai", "trian", "lesson"],
  ["paint", "ai", "paynt", "lesson"],
  ["cake", "a_e", "caik", "lesson"],
  ["unlock", "un-", "onlock", "lesson"],

  ["train", "ai", "traip", "elsewhere"],
  ["train", "ai", "chrain", "elsewhere"],
  ["paint", "ai", "paind", "elsewhere"],
  ["cake", "a_e", "scake", "elsewhere"],
  ["unlock", "un-", "unlok", "elsewhere"],
  ["submit", "mit/miss", "submitt", "elsewhere"],
  ["rain", "ai", "rainn", "elsewhere"],

  /*
   * An affix has a place. A child who writes "desk" for "desks" has not
   * written the -s suffix, and the test used to ask only whether the
   * letter appeared anywhere in what they wrote -- so desk, which ends
   * in k and holds an s, was called a correct -s with a mistake
   * somewhere else. Same for "particul" against particular.
   *
   * "sing" for "singing" stays "elsewhere" on purpose: sing really does
   * end in -ing, so the suffix spelling is not what went wrong. What
   * went wrong is a dropped syllable, which this tool does not claim to
   * judge.
   */
  ["desks", "-s", "desk", "lesson"],
  ["desks", "-s", "desks", "right"],
  ["particular", "-ar", "particul", "lesson"],
  ["jumping", "-ing", "jumpin", "lesson"],
  ["singing", "-ing", "sing", "elsewhere"],
  ["unlock", "un-", "lock", "lesson"],
];

for (const [word, part, typed, want] of VERDICTS) {
  const got = judgeSpelling(word, part, typed);
  if (got !== want) {
    fail("the check", `"${typed}" for "${word}" (${part}) is called "${got}", not "${want}"`);
  }
}

const withExtra = DATA.patterns.filter((x) => x.extra).length;
console.log(`patterns: ${DATA.patterns.length}`);
console.log(`words:    ${words} in the first list, ${extraWords} more across ${withExtra} patterns`);
console.log(`drills:   ${drills} patterns carry a what-says sound drill`);

if (problems.length) {
  console.log(`\n❌ ${problems.length}:`);
  problems.slice(0, 40).forEach((p) => console.log("   " + p));
  if (problems.length > 40) console.log(`   …and ${problems.length - 40} more`);
  process.exit(1);
}
console.log(`verdicts: ${VERDICTS.length} checked`);
console.log("\n✅ every span points at its own lesson, every sentence carries what it says,");
console.log("   and the tool still tells a pattern error apart from an error elsewhere");
