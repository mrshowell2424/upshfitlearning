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

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(readFileSync(join(ROOT, "scripts", f), "utf8"));

const DATA = read("reading-spelling.json");
const BANKS = read("reading-part-words.json");

const problems = [];
const fail = (where, why) => problems.push(`${where}: ${why}`);

const REAL = new Map();
const FAKE = new Set();
for (const [k, v] of Object.entries(BANKS)) {
  if (k.startsWith("_")) continue;
  REAL.set(k, new Set(v.real || []));
  (v.fake || []).forEach((w) => FAKE.add(w.toLowerCase()));
}

const has = (sentence, word) =>
  new RegExp(`(^|[^a-z])${word.toLowerCase()}($|[^a-z])`, "i").test(sentence);

let words = 0;

for (const p of DATA.patterns) {
  if (!p.parts.length) fail(p.key, "no parts");

  for (const part of p.parts) {
    const bankKey = `${p.key}|${part.part}`;
    const bank = REAL.get(bankKey);
    if (!bank) fail(bankKey, "no bank of that name in reading-part-words.json");

    for (const { word, span } of part.words) {
      words++;

      // The word is the bank's, not something that drifted in.
      if (bank && !bank.has(word)) fail(bankKey, `"${word}" is not in that bank`);
      if (FAKE.has(word.toLowerCase())) {
        fail(bankKey, `"${word}" is a fake word -- those are a reading task, not a dictation one`);
      }

      // The span still points at the lesson.
      const fresh = spanOf(word, part.part);
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
];

for (const [word, part, typed, want] of VERDICTS) {
  const got = judgeSpelling(word, part, typed);
  if (got !== want) {
    fail("the check", `"${typed}" for "${word}" (${part}) is called "${got}", not "${want}"`);
  }
}

console.log(`patterns: ${DATA.patterns.length}`);
console.log(`words:    ${words}`);

if (problems.length) {
  console.log(`\n❌ ${problems.length}:`);
  problems.slice(0, 40).forEach((p) => console.log("   " + p));
  if (problems.length > 40) console.log(`   …and ${problems.length - 40} more`);
  process.exit(1);
}
console.log(`verdicts: ${VERDICTS.length} checked`);
console.log("\n✅ every span points at its own lesson, every sentence carries what it says,");
console.log("   and the tool still tells a pattern error apart from an error elsewhere");
