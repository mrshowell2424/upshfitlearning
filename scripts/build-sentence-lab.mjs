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

const toks = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

/**
 * Words that carry the sentence's content, which is to say everything that
 * is not grammar. Deliberately a short list: it only has to be good enough
 * to tell "the same sentence with more in it" from "a different sentence".
 */
const STOP = new Set(
  ("a an and the is are was were be been it its this that these those to of in on at for with " +
    "as by from or but so not no do does did have has had he she they them his her their you " +
    "your we our i my if then than there here what when where which who whom how all any each " +
    "more most other some such only own same too very can will just")
    .split(" "),
);

/**
 * How much of the kernel survives into the longer sentence, as a fraction of
 * its content words.
 *
 * Expansion is found by lining the two versions of a paragraph up sentence
 * by sentence, which assumes the harder version rewrote each sentence in
 * place. Sometimes it did not -- it merged two and added a third, and the
 * paragraph still has the same number of sentences, so the alignment holds
 * and position three on one side faces something unrelated on the other:
 *
 *   They were taught to roll the bristles between their lips.
 *   A dial has small numbers, and a sharp tip was the only way to fill them.
 *
 * That shipped, as an answer key. A key that shows a different sentence is
 * worse than no exercise at all, so a pair now has to keep most of what it
 * started with. This is not a demand that nothing changed -- "The fur comes
 * and goes" becoming "A coat of fur comes and goes with the year" is the
 * lesson -- only that the sentence is still about what it was about.
 */
const kept = (lower, higher) => {
  const c = toks(lower).filter((w) => !STOP.has(w) && w.length > 1);
  if (!c.length) return 1;
  const h = new Set(toks(higher));
  return c.filter((w) => h.has(w)).length / c.length;
};

/** Below this, the two sentences are not two versions of each other. */
const MIN_KEPT = 0.7;

/** How many pairs of each kind to keep. More than this is noise in a lesson. */
const KEEP_COMBINE = 2;
const KEEP_EXPAND = 3;

/**
 * Expansion has to be visible to be worth teaching -- and visible is a
 * proportion, not a word count.
 *
 * This was a flat four words, which is a different lesson at either end of
 * the school. Four words on a six-word kindergarten sentence nearly doubles
 * it; four on an eighteen-word sixth-grade sentence is a rounding error. The
 * flat rule therefore threw away almost every kindergarten pair -- the K tab
 * offered 15 of its 50 articles, and the ones it refused looked like this:
 *
 *   A bear finds a cave in winter.
 *   A bear finds a cave or a hole in winter.
 *
 * which is exactly the lesson, three words short of qualifying.
 *
 * So: at least two words longer, and at least thirty per cent longer. The
 * floor keeps a one-word swap out, the proportion makes the rule mean the
 * same thing in every grade. It is stricter than the old one on long
 * sentences, where a four-word addition genuinely does not read as an
 * expansion, and those articles keep their combining pairs regardless.
 */
const minExpandLift = (kernelWords) => Math.max(2, Math.ceil(0.3 * kernelWords));

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
        if (
          ls[i] !== hs[i] &&
          words(hs[i]) - words(ls[i]) >= minExpandLift(words(ls[i])) &&
          kept(ls[i], hs[i]) >= MIN_KEPT
        ) {
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
/**
 * Raised from 0.8 when the expansion rule stopped being a flat word count:
 * coverage went from 299 of 350 to 344, so a floor of 0.8 would no longer
 * notice a third of the pairs disappearing. This leaves real headroom and
 * still fails loudly if the two Lexile versions start drifting together.
 */
const FLOOR = 0.92;
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
