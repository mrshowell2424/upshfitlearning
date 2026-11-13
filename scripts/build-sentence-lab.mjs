/**
 * Sentence Lab: the language-structure strand, built out of the two Lexile
 * versions of articles we already wrote.
 *
 * Language structure looked like the one strand with nothing behind it, and
 * that was wrong. Every article exists at two Lexiles, and the difference
 * between them is almost entirely syntax: 349 of the 350 pairs carry longer
 * sentences on the higher side and 271 carry fewer of them. The lower version
 * is the kernel and the higher version is the same content combined and
 * expanded, which is to say somebody already wrote the answer key.
 *
 * So this extracts two kinds of pair, per paragraph, by comparing the two
 * versions:
 *
 *   combine -- the higher version says it in strictly fewer sentences. The
 *     lower sentences are the task, the higher sentences are the key.
 *   expand  -- the sentence counts match, so the sentences align one to one,
 *     and the higher sentence is at least four words longer. The lower
 *     sentence is the kernel, the higher one shows what got added.
 *
 * Nothing is paraphrased or invented. Every string in the output is verbatim
 * from an article, which is the whole reason this is cheap and the whole
 * reason it is trustworthy -- a teacher can check any answer key against the
 * article it came from.
 */
import { readFileSync, writeFileSync } from "node:fs";

const AR = JSON.parse(readFileSync("scripts/reading-articles.json", "utf8")).articles;

/** Split on sentence end. Good enough: these texts have no abbreviations. */
const sents = (t) =>
  t
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

const words = (s) => s.split(/\s+/).filter(Boolean).length;

/** How many pairs of each kind to keep. More than this is noise in a lesson. */
const KEEP_COMBINE = 2;
const KEEP_EXPAND = 3;

/** Expansion has to be visible to be worth teaching. */
const MIN_EXPAND_LIFT = 4;

const items = [];
const barren = [];

for (const a of AR) {
  const lo = Object.fromEntries(a.lower.paras.map((p) => [p.label, p.text]));
  const combine = [];
  const expand = [];

  for (const p of a.higher.paras) {
    const lab = p.label;
    if (!(lab in lo)) continue;
    const ls = sents(lo[lab]);
    const hs = sents(p.text);

    if (ls.length > hs.length && hs.length >= 1 && ls.length >= 2) {
      combine.push({ para: lab, from: ls, to: hs });
    } else if (ls.length === hs.length) {
      for (let i = 0; i < ls.length; i++) {
        if (ls[i] !== hs[i] && words(hs[i]) >= words(ls[i]) + MIN_EXPAND_LIFT) {
          expand.push({ para: lab, kernel: ls[i], expanded: hs[i] });
        }
      }
    }
  }

  // The biggest collapse teaches the most, so rank before trimming.
  combine.sort((x, y) => y.from.length - y.to.length - (x.from.length - x.to.length));
  expand.sort((x, y) => words(y.expanded) - words(y.kernel) - (words(x.expanded) - words(x.kernel)));

  /**
   * The stem for because / but / so. It has to be a short, plain statement a
   * child can extend three ways, so take the shortest lower sentence with at
   * least four words that is not itself a question.
   */
  const allLower = a.lower.paras.flatMap((p) => sents(p.text));
  const stem =
    allLower
      .filter((s) => words(s) >= 4 && words(s) <= 12 && !s.endsWith("?"))
      .sort((x, y) => words(x) - words(y))[0] ?? null;

  const keptC = combine.slice(0, KEEP_COMBINE);
  const keptE = expand.slice(0, KEEP_EXPAND);
  if (!keptC.length && !keptE.length) barren.push(`G${a.grade} ${a.title}`);

  items.push({
    id: a.id,
    grade: a.grade,
    n: a.n,
    title: a.title,
    standard: a.standard,
    combine: keptC,
    expand: keptE,
    stem,
  });
}

const withWork = items.filter((i) => i.combine.length || i.expand.length);

/**
 * The gate. These pairs are derived, not written, so the day somebody edits
 * the Lexile versions towards each other the lessons quietly vanish. Better
 * to fail the build than to serve a page of empty exercises.
 */
const FLOOR = 0.8;
const ratio = withWork.length / items.length;
if (ratio < FLOOR) {
  console.error(
    `Only ${withWork.length} of ${items.length} articles (${(ratio * 100).toFixed(1)}%) yield a ` +
      `sentence pair, below the ${FLOOR * 100}% floor.\n` +
      `The two Lexile versions have drifted together, or the splitter broke. ` +
      `Check a few articles by hand before touching this threshold.`,
  );
  process.exit(1);
}

const out = {
  _note:
    "Sentence-combining and sentence-expansion pairs, extracted by " +
    "scripts/build-sentence-lab.mjs from the two Lexile versions of each " +
    "article. Do not hand-edit: every string here is verbatim from " +
    "reading-articles.json, and editing one here would make the answer key " +
    "disagree with the article it came from.",
  source:
    "Sentence combining and expanding a kernel with when, where and why are " +
    "the routines in Judith Hochman and Natalie Wexler's The Writing " +
    "Revolution, and because/but/so is theirs. The sentences are ours, and " +
    "so is the idea of taking the answer key from the harder Lexile version.",
  routine: [
    {
      key: "combine",
      name: "Combine",
      minutes: 4,
      what: "Two or three short sentences, one idea. Put them together without losing anything.",
      why: "A reader who can only write short sentences reads long ones as a list of facts. Combining is the same skill from the other side.",
    },
    {
      key: "expand",
      name: "Expand",
      minutes: 3,
      what: "One plain sentence. Add when, where, how or why — not another sentence.",
      why: "The kernel is already true. What gets added is where the meaning lives, and this is the move that shows that.",
    },
    {
      key: "bso",
      name: "Because · but · so",
      minutes: 2,
      what: "One stem, finished three ways. Each conjunction forces a different kind of thinking.",
      why: "Two minutes, and it reveals whether a child understood the text at all. Because asks for a cause, but asks for a tension, so asks for a result.",
    },
  ],
  items,
};

writeFileSync("scripts/reading-sentence-lab.json", JSON.stringify(out, null, 1) + "\n");

const cPairs = items.reduce((s, i) => s + i.combine.length, 0);
const ePairs = items.reduce((s, i) => s + i.expand.length, 0);
console.log("wrote scripts/reading-sentence-lab.json");
console.log(`  articles with at least one pair: ${withWork.length} of ${items.length}`);
console.log(`  combining pairs kept:            ${cPairs}`);
console.log(`  expansion pairs kept:            ${ePairs}`);
console.log(`  articles with a because/but/so stem: ${items.filter((i) => i.stem).length}`);
if (barren.length) {
  console.log(`\n  ${barren.length} articles yield no pair (their two versions differ by word choice`);
  console.log("  only, which is a fine thing for an article to do):");
  for (const b of barren.slice(0, 6)) console.log("    " + b);
  if (barren.length > 6) console.log(`    ... and ${barren.length - 6} more`);
}
