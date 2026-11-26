/**
 * A word sort for every lesson: the columns, the words, and the odd ones out.
 *
 * WHY THIS EXISTS. 95% Group's weekly timing guide gives "Identify Pattern:
 * Sort Words" twelve minutes on Day 1 and five more on Day 2 -- seventeen
 * minutes, the largest single block in the week -- and the packet had nothing
 * for it. Every other component was covered: reading the words, building word
 * chains, writing them, transferring to text. Sorting was the gap.
 *
 * WHY SORTING IS NOT READING. The other sheets ask a child to read a word
 * that has the pattern. A sort asks a different question: does this word have
 * the pattern, and which one? That is categorising rather than decoding, and
 * it is what makes a pattern visible as a pattern. A child who can read
 * "rain" and "play" one after the other has not necessarily noticed that the
 * long a is spelled two ways.
 *
 * WHERE THE WORDS COME FROM. scripts/reading-spelling.json, which already
 * holds hand-authored words for each sub-pattern of each lesson, checked by
 * check-spelling against the place that lesson sits in the sequence. Using it
 * means the sort is made of the same words the dictation is, and that nothing
 * here needs checking twice.
 *
 * THE ODD ONES OUT are words the lesson has already taught that match none of
 * the columns. Without them a sort is a sorting exercise with no decision in
 * it -- every word goes somewhere, so a child can place them by elimination
 * once the last column is full. With them, each word has to be looked at.
 *
 *   bun run scripts/build-word-sort.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { unsafeRealWord } from "./lib/not-nonsense.mjs";

const SEQ = JSON.parse(readFileSync("scripts/reading-sequence.json", "utf8")).sequence;
const SPELL = JSON.parse(readFileSync("scripts/reading-spelling.json", "utf8")).patterns;
const SPLITS = JSON.parse(readFileSync("scripts/reading-skill-splits.json", "utf8"));

/** Four columns is a page. A lesson with more parts sorts the first four. */
const MAX_COLUMNS = 4;
const PER_COLUMN = 5;
const ODD_ONES = 4;

function rng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13; x >>>= 0;
    x ^= x >> 17;
    x ^= x << 5; x >>>= 0;
    return x / 4294967296;
  };
}
function shuffled(list, seed) {
  const r = rng(seed);
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const spellOf = (key) => SPELL.find((p) => p.key === key);
// The word as it was written, punctuation off but capitals kept: the
// possessive lesson sorts Sam's and Kim's, and lowercasing those made the
// sheet look like a mistake. Matching and de-duplication fold case
// themselves, through fold() below.
const clean = (w) => String(w).replace(/[^A-Za-z']/g, "");
/*
 * A word fit for a pile drawn from everything taught so far.
 *
 * Plain and lowercase. The possessive lesson's words carry a capital and an
 * apostrophe because that is its pattern, and the piles below reach back
 * through every lesson, so Kim's and Sam's turned up on nine later sheets --
 * seven as odd ones out and two in a "not this pattern" column.
 */
const plain = (w) => /^[a-z]+$/.test(w);
const fold = (w) => String(w).toLowerCase();
// An apostrophe is allowed because the possessive lesson sorts dog's against
// dogs, and a filter that drops anything with one left that lesson with no
// words at all.
const usable = (w) => /^[A-Za-z]['A-Za-z]*[A-Za-z]$/.test(w) && /[A-Za-z]{2}/.test(w)
  && !unsafeRealWord(fold(w));

/**
 * Does this word belong in this column?
 *
 * The same test the lesson picker uses for its sub-focuses: a part may be
 * written as alternatives, spec/spect, and _ stands for the letter a silent e
 * jumps over, as in a_e.
 */
function inColumn(part, word) {
  return String(part)
    .split("/")
    .map((a) => a.replace(/[^a-zA-Z_']/g, ""))
    .filter(Boolean)
    .some((a) => new RegExp(a.replace(/_/g, "[a-z]"), "i").test(word));
}

const out = [];
const taught = [];
const noSort = [];

for (const lesson of SEQ) {
  const seed = 4100 + SEQ.indexOf(lesson) * 37;
  const sp = spellOf(lesson.key);
  const parts = sp ? sp.parts : null;

  let columns = [];
  if (parts && parts.length >= 2) {
    /*
     * The lesson's own sub-patterns, with the dictation bank's words.
     *
     * A WORD GOES TO THE MOST SPECIFIC COLUMN THAT MATCHES IT, because the
     * columns are not always exclusive. "biology" is bio and ology both, and
     * a sort where one word has two right answers marks a child wrong for
     * being right. The first version dropped any such word, which emptied
     * four columns outright: every "eigh" word also matches "ei", and every
     * "-est" word also matches "-es", so under a drop rule those columns had
     * nothing left. The longest matching label is the one the word is really
     * an example of.
     */
    const labels = parts.slice(0, MAX_COLUMNS).map((x) => x.part);
    const bestFor = (w) => labels
      .filter((l) => inColumn(l, w))
      .sort((a2, b2) => b2.length - a2.length)[0];
    columns = parts.slice(0, MAX_COLUMNS).map((x) => ({
      label: x.part,
      // A grapheme, so the checker may test the words against it.
      kind: "pattern",
      words: x.words.map((w) => clean(w.word))
        .filter((w) => usable(w) && bestFor(w) === x.part)
        .slice(0, PER_COLUMN),
    }));
    /*
     * Unless the labels turn out not to be graphemes at all.
     *
     * "Final y rule (changing)" has parts "i" and "y", and both letters are
     * in most of its words -- crying has a y and an i. They are the two
     * outcomes of a rule, not two spellings to tell apart, so no test on the
     * letters can file a word correctly and the filter above emptied the "y"
     * column. Where that happens the authored words stand as written and the
     * headings are marked as prose, which is what they are.
     */
    if (columns.some((c) => !c.words.length)) {
      columns = parts.slice(0, MAX_COLUMNS).map((x) => ({
        label: x.part,
        kind: "name",
        words: x.words.map((w) => clean(w.word)).filter(usable).slice(0, PER_COLUMN),
      }));
    }
  } else {
    /*
     * A lesson with one part, or none the spelling bank knows, sorts the
     * other way: has the pattern, or does not. That is still the question
     * the component asks, and for a single-pattern lesson it is the only
     * form the question can take.
     */
    const own = [
      ...(lesson.words || []),
      ...(parts ? parts[0].words.map((w) => w.word) : []),
    ].map(clean).filter(usable);
    const has = [...new Set(own)].slice(0, PER_COLUMN + 1);
    // Plain lowercase, for the same reason the odd ones are: this column is
    // drawn from everything taught, and the possessive lesson's Kim's and
    // Sam's reached the "not this pattern" pile of two later sorts that way.
    // A lesson's OWN column keeps whatever it authored -- the possessive
    // sort still sorts Sam's against beds, which is what it is for.
    const hasnt = shuffled(
      [...new Set(taught)].filter((w) => plain(w) && !own.some((x) => fold(x) === fold(w))), seed + 3)
      .slice(0, PER_COLUMN + 1);
    if (!has.length || !hasnt.length) { noSort.push(lesson.key); taught.push(...own); continue; }
    // Prose headings, not graphemes: "Possessive 's" and "not this pattern"
    // are the names of two piles, and there is no regex that tests a word
    // against them. Marked so the checker tests everything else and does not
    // try to read them as spellings.
    columns = [
      { label: lesson.name.replace(/\s*\(.*\)$/, "").slice(0, 22), kind: "name", words: has },
      { label: "not this pattern", kind: "name", words: hasnt },
    ];
  }

  const inAny = (w) => columns.some((c) => c.kind === "pattern" && inColumn(c.label, w))
    || columns.some((c) => c.words.some((x) => fold(x) === fold(w)));

  /*
   * Odd ones out: already taught, and in none of the columns.
   *
   * Only where the columns are patterns. A sort that already has a "not this
   * pattern" column does not want them: that column and a NONE OF THESE box
   * are the same pile asked for twice, so every odd word would have two right
   * answers and the sheet would mark one of them wrong.
   */
  const wantsOdd = columns.every((c) => c.kind === "pattern");
  /*
   * An odd one out is a plain lowercase word.
   *
   * The possessive lesson's words are allowed an apostrophe, because that is
   * its pattern -- but they are drawn from what has been taught, so Kim's and
   * Sam's leaked out of it into the odd pile of seven later sorts, where a
   * capitalised name with an apostrophe is not a word to hand a child cold.
   * Seven sheets had one. A column may still hold whatever its lesson
   * authored; this is only about the pile that is there to be rejected.
   */
  const odd = (wantsOdd ? shuffled([...new Set(taught)].filter(plain), seed + 7) : [])
    .filter((w) => usable(w) && !inAny(w)
      && !columns.some((c) => c.words.some((x) => fold(x) === fold(w))))
    .slice(0, ODD_ONES);

  const all = columns.flatMap((c) => c.words);
  out.push({
    key: lesson.key,
    name: lesson.name,
    level: lesson.level,
    columns,
    odd,
    /** Every word on the sheet, mixed, which is the order it is printed in. */
    bank: shuffled([...all, ...odd], seed + 11),
  });

  taught.push(...all);
}

writeFileSync(
  "scripts/reading-word-sort.json",
  JSON.stringify(
    {
      _note:
        "One word sort for each lesson: the columns it sorts into, the words that go in each, and the odd ones out that go in none. 95% Group's weekly timing guide gives word sorting seventeen minutes a week, the largest block in the lesson, and it is the one component that asks whether a word HAS the pattern rather than asking a child to read a word that does. Words come from scripts/reading-spelling.json, so they are the same hand-authored, sequence-checked words the dictation uses. The odd ones out are words already taught that match no column, so the sort cannot be finished by elimination. Generated by scripts/build-word-sort.mjs; do not hand-edit.",
      perColumn: PER_COLUMN,
      maxColumns: MAX_COLUMNS,
      oddOnes: ODD_ONES,
      lessons: out,
    },
    null,
    1,
  ) + "\n",
);

console.log(`${out.length} word sorts`);
const cols = out.reduce((s, l) => s + l.columns.length, 0);
console.log(`  ${cols} columns, ${out.reduce((s, l) => s + l.bank.length, 0)} words to sort`);
const thin = out.filter((l) => l.odd.length < ODD_ONES);
if (thin.length) {
  console.log(`\n${thin.length} sorts have fewer than ${ODD_ONES} odd ones out (nothing taught yet matches none of the columns):`);
  console.log(`   ${thin.map((l) => l.key).join(", ")}`);
}
if (noSort.length) {
  console.log(`\n⚠ ${noSort.length} lessons could not make a sort at all: ${noSort.join(", ")}`);
}
