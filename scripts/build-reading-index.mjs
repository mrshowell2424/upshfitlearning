/**
 * The slim index of the articles, for pages that do not need the text.
 *
 * WHY THIS EXISTS. Production runs on Cloudflare Workers through OpenNext,
 * which compiles every route into a single Worker and evaluates the whole
 * thing before it serves a request. A Worker gets about 400ms of CPU for
 * that startup, and it is not configurable.
 *
 * scripts/reading-articles.json is 2.9 MB and eight pages imported it at
 * module scope, so every cold start parsed all of it. Add the mysteries,
 * the passages and the sentence lab and the Worker was parsing around 8 MB
 * before answering anything. It stopped making it: the live site returned
 * Cloudflare error 1102, "exceeded resource limits", intermittently — fine
 * when warm, dead on a cold start, which is why it looked random.
 *
 * Two thirds of that file is paragraph text, and most of the pages that
 * imported it never touched a paragraph. They wanted titles, grades,
 * standards, Lexiles and word counts. That is what this file is: the same
 * articles with the text taken out, 2.9 MB down to about 100 KB.
 *
 * It also carries the two things pages derived by walking every article —
 * the vocabulary list and a couple of counts — so no page has to read the
 * full file to produce a number.
 *
 * Pages that genuinely show an article's text still need the real file, and
 * they load it inside the request with await import() so it lands in a lazy
 * chunk rather than in the Worker's startup.
 *
 *   bun run scripts/build-reading-index.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const AR = JSON.parse(readFileSync("scripts/reading-articles.json", "utf8")).articles;
const MY = JSON.parse(readFileSync("scripts/reading-mysteries.json", "utf8")).cases;
const PASSAGEJSON = JSON.parse(readFileSync("scripts/reading-passages.json", "utf8"));
const PASSAGES = PASSAGEJSON.passages;
const LABJSON = JSON.parse(readFileSync("scripts/reading-sentence-lab.json", "utf8"));
const LAB = LABJSON.items;

/**
 * The articles that take a text feature as their subject.
 *
 * Kept here rather than in the page because the count is now computed here;
 * the two must not drift, and one copy cannot.
 */
const FEATURE_STANDARDS = [
  "RI.K.5", "RI.K.6", "RI.K.7",
  "RI.1.5", "RI.1.6", "RI.1.7",
  "RI.2.5", "RI.2.7",
  "RI.6.5", "RI.6.7",
];

/** Everything except the paragraphs. */
const articles = AR.map((a) => ({
  id: a.id,
  grade: a.grade,
  n: a.n,
  title: a.title,
  standard: a.standard,
  hi: { lexile: a.higher.lexile, words: a.higher.words },
  lo: { lexile: a.lower.lexile, words: a.lower.words },
}));

/**
 * Every word out of the articles' vocabulary questions.
 *
 * The question holds its definitions one per line, written "word: what it
 * means". This is the same parse /vocabulary was doing over the full file
 * on every cold start; doing it once at build time is the whole saving.
 */
const vocab = [];
for (const a of AR) {
  const v = a.questions.find((q) => q.kind === "vocabulary");
  if (!v) continue;
  for (const line of String(v.q).split("\n")) {
    const at = line.indexOf(":");
    if (at < 1) continue;
    const word = line.slice(0, at).trim();
    const def = line.slice(at + 1).trim();
    if (!word || !def) continue;
    vocab.push({
      word,
      def,
      grade: a.grade,
      standard: a.standard,
      from: a.title,
      id: `${a.id}-${word.toLowerCase().replace(/[^a-z]+/g, "-")}`,
    });
  }
}

const out = {
  _note:
    "The articles with their paragraphs removed, plus the vocabulary and counts that pages used to derive by walking the full file. Exists so that Cloudflare Workers does not parse 2.9 MB of article text on every cold start; see the header of scripts/build-reading-index.mjs. Generated; do not hand-edit. scripts/check-reading-index.mjs re-derives it from the articles and fails on drift.",
  articles,
  vocab,
  /**
   * Numbers the hub page used to compute by importing whole files.
   *
   * /science-of-reading imported the articles, the passages and the sentence
   * lab -- about 4.8 MB -- to show four figures on a card. They are counted
   * here once instead.
   */
  counts: {
    articles: AR.length,
    vocabWords: vocab.length,
    featureArticles: AR.filter((a) => FEATURE_STANDARDS.includes(a.standard)).length,
    passages: Object.values(PASSAGES).reduce((n, c) => n + Object.keys(c).length, 0),
    // Counted exactly as the hub page counted it, paragraph by paragraph.
    passageWords: Object.values(PASSAGES).reduce(
      (n, c) =>
        n +
        Object.values(c).reduce(
          (m, p) => m + p.paras.reduce((w, x) => w + x.split(/\s+/).filter(Boolean).length, 0),
          0,
        ),
      0,
    ),
    sentencePairs: LAB.filter((i) => i.combine.length || i.expand.length).length,
  },
};

writeFileSync("scripts/reading-articles-index.json", JSON.stringify(out) + "\n");

/**
 * The same treatment for the mysteries: what a picker needs, without the
 * story, the suspects or the debate version. 2.1 MB down to a few tens.
 */
const mysteries = {
  _note:
    "The mystery cases with their stories removed — enough to fill a grade and week picker, and nothing else. Generated by scripts/build-reading-index.mjs; do not hand-edit.",
  cases: MY.map((c) => ({
    id: c.id,
    grade: c.grade,
    week: c.week,
    tag: c.tag,
    title: c.title,
    hasDebate: Boolean(c.debate),
  })),
};
writeFileSync("scripts/reading-mysteries-index.json", JSON.stringify(mysteries) + "\n");

const myFull = readFileSync("scripts/reading-mysteries.json", "utf8").length;
const mySlim = JSON.stringify(mysteries).length;
console.log(`${mysteries.cases.length} mysteries`);
console.log(`  ${(myFull / 1024).toFixed(0)} KB of mysteries -> ${(mySlim / 1024).toFixed(0)} KB of index`);

/**
 * The passages and the sentence lab, the same way.
 *
 * Both pages build an index over their data as they load — the passages
 * page groups keys by lesson, the sentence lab collects its grades — and
 * neither needs a word of the text to do it. What they do need, they now
 * get from here; the text itself is loaded inside the request.
 */
const passageIndex = {
  _note:
    "Passage keys and per-level word counts, with the text removed, so /passages can group and label without parsing the whole file. Generated by scripts/build-reading-index.mjs; do not hand-edit.",
  levels: PASSAGEJSON.levels,
  keys: Object.keys(PASSAGES),
  // key -> level -> words, for the reading-level buttons.
  words: Object.fromEntries(
    Object.entries(PASSAGES).map(([k, byLevel]) => [
      k,
      Object.fromEntries(
        Object.entries(byLevel).map(([lv, p]) => [
          lv,
          p.paras.reduce((n, x) => n + x.split(/\s+/).filter(Boolean).length, 0),
        ]),
      ),
    ]),
  ),
  titles: Object.fromEntries(
    Object.entries(PASSAGES).map(([k, byLevel]) => [k, Object.values(byLevel)[0]?.title ?? ""]),
  ),
};
writeFileSync("scripts/reading-passages-index.json", JSON.stringify(passageIndex) + "\n");

const labIndex = {
  _note:
    "The sentence lab without its items' text: the routine, the source line and each item's grade, title and standard. Generated by scripts/build-reading-index.mjs; do not hand-edit.",
  source: LABJSON.source,
  routine: LABJSON.routine,
  items: LAB.map((i) => ({
    id: i.id,
    grade: i.grade,
    n: i.n,
    title: i.title,
    standard: i.standard,
    has: Boolean(i.combine.length || i.expand.length),
  })),
};
writeFileSync("scripts/reading-sentence-lab-index.json", JSON.stringify(labIndex) + "\n");

for (const [name, srcFile, slimObj] of [
  ["passages", "scripts/reading-passages.json", passageIndex],
  ["sentence lab", "scripts/reading-sentence-lab.json", labIndex],
]) {
  const a = readFileSync(srcFile, "utf8").length;
  const b = JSON.stringify(slimObj).length;
  console.log(`  ${(a / 1024).toFixed(0)} KB of ${name} -> ${(b / 1024).toFixed(0)} KB of index`);
}

const full = readFileSync("scripts/reading-articles.json", "utf8").length;
const slim = JSON.stringify(out).length;
console.log(`${articles.length} articles, ${vocab.length} vocabulary words`);
console.log(`  ${(full / 1024).toFixed(0)} KB of articles -> ${(slim / 1024).toFixed(0)} KB of index`);
console.log(`  counts: ${JSON.stringify(out.counts)}`);
