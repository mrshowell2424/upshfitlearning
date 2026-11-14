/**
 * Word Parts: the morphology strand, grounded in articles the class has read.
 *
 * Morphology is usually taught off a list -- here are ten -ment words, now
 * do the worksheet -- and it does not transfer, for the same reason syntax
 * taught on sentences about nothing does not transfer. A child meets
 * "settlement" in a text about a town, not on a list.
 *
 * So the morphemes and their analyses come from scripts/morphemes.mjs, which
 * is curated and hand-checked for the reasons written at the top of that
 * file, and this script does the other half: it keeps only the words that
 * actually turn up in one of the 350 articles, and attaches the sentence
 * each one appears in, verbatim. A teacher can point at the sentence. A
 * child has already met the word.
 *
 * What it refuses to do is pad. A curated word that appears nowhere is
 * dropped and reported, not kept with an invented example sentence. A
 * morpheme left with too few attested words is dropped whole and reported,
 * because four thin examples teach the strategy and two do not.
 *
 *   bun scripts/build-morphology.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { MORPHEMES } from "./morphemes.mjs";

const AR = JSON.parse(readFileSync("scripts/reading-articles.json", "utf8")).articles;

/** A morpheme needs this many attested words to be worth a teacher's time. */
const MIN_WORDS = 4;

const splitSentences = (t) =>
  t.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

/**
 * Every sentence in the corpus, with where it came from. Both Lexile levels,
 * because a word may only exist in the harder one -- and when both have it,
 * the lower version is the one a struggling reader can hold.
 */
const sentences = [];
for (const a of AR) {
  for (const level of ["lower", "higher"]) {
    for (const p of a[level]?.paras ?? []) {
      for (const s of splitSentences(p.text)) {
        sentences.push({ s, level, grade: a.grade, id: a.id, title: a.title });
      }
    }
  }
}

/** Whole word only: "load" must not match "loaded", "unload" or "payload". */
const has = (sentence, word) =>
  new RegExp(`(^|[^A-Za-z])${word}([^A-Za-z]|$)`, "i").test(sentence);

/**
 * The best sentence for a word: earliest grade first, then the lower Lexile,
 * then the shortest -- a child reading one sentence off a board should get
 * the shortest true one, not the first one found.
 */
function findSentence(word) {
  const hits = sentences.filter((h) => has(h.s, word));
  if (!hits.length) return null;
  hits.sort(
    (a, b) =>
      a.grade - b.grade ||
      (a.level === "lower" ? 0 : 1) - (b.level === "lower" ? 0 : 1) ||
      a.s.length - b.s.length,
  );
  return hits[0];
}

const gradeName = (g) =>
  g === 0 ? "K" : g === 1 ? "1st" : g === 2 ? "2nd" : g === 3 ? "3rd" : `${g}th`;

const out = [];
const missing = [];
const dropped = [];
const inflected = [];

for (const m of MORPHEMES) {
  let words = [];
  for (const [word, base, means, note] of m.words) {
    if (!means) throw new Error(`${m.form} ${word} has no meaning in morphemes.mjs`);

    const hit = findSentence(word);
    if (!hit) {
      missing.push(`${m.form} ${word}`);
      continue;
    }
    words.push({
      word,
      base,
      note: note ?? null,
      // Written out per word in the table, never generated. One gloss per
      // morpheme reads fluently and is wrong often enough to matter -- see
      // the note at the top of morphemes.mjs.
      means,
      grade: hit.grade,
      gradeName: gradeName(hit.grade),
      article: { id: hit.id, title: hit.title },
      level: hit.level,
      sentence: hit.s,
    });
  }

  /**
   * Drop a word that is only an inflected form of another word already in
   * the same list. "reader" and "readers" teach one thing between them, and
   * a list padded with -s and -ed forms looks longer than it is while giving
   * a child the same problem five times. The inflected form survives only
   * when its own base is not attested.
   */
  const have = new Set(words.map((w) => w.word));
  const inflectionOf = (w) => {
    // Each ending gets its own candidate. Writing this as one alternation,
    // /(es|s)$/, tried "es" first and turned "interstates" into
    // "interstat" -- so the real stem was never looked for and the plural
    // shipped beside its own singular.
    for (const stem of [
      w.replace(/ies$/, "y"),
      w.replace(/es$/, ""),
      w.replace(/s$/, ""),
      w.replace(/ed$/, ""),
      w.replace(/ed$/, "e"),
      w.replace(/ing$/, ""),
      w.replace(/ing$/, "e"),
      w.replace(/d$/, ""),
    ]) {
      if (stem !== w && have.has(stem)) return stem;
    }
    return null;
  };
  const kept = [];
  for (const w of words) {
    const stem = inflectionOf(w.word);
    if (stem) inflected.push(`${m.form} ${w.word} (already have ${stem})`);
    else kept.push(w);
  }
  words = kept;

  words.sort((a, b) => a.grade - b.grade || a.word.localeCompare(b.word));

  if (words.length < MIN_WORDS) {
    dropped.push(`${m.form} (${words.length} attested, needs ${MIN_WORDS})`);
    continue;
  }

  out.push({
    key: m.key,
    form: m.form,
    kind: m.kind,
    means: m.means,
    grade: words[0].grade,
    gradeName: words[0].gradeName,
    words,
  });
}

const data = {
  _note:
    "Built by scripts/build-morphology.mjs from scripts/morphemes.mjs and the " +
    "350 articles. Every word here appears in an article; every sentence is " +
    "verbatim from one. Do not hand-edit -- edit the morpheme table and rebuild.",
  source: "scripts/morphemes.mjs + scripts/reading-articles.json",
  routine: [
    {
      key: "break",
      name: "Break it",
      minutes: 1,
      what: "Cover the part. Read what is left. Is that a word you know?",
      why: "The child does the splitting, not the teacher. A part that is pointed out is a fact; a part that is found is a strategy they can use on the next word.",
    },
    {
      key: "mean",
      name: "Mean it",
      minutes: 2,
      what: "The part means this. The base means that. So what does the whole word mean?",
      why: "Two knowns and an unknown, which is a problem a child can solve. This is the step that turns a word they have never seen into one they can work out.",
    },
    {
      key: "build",
      name: "Build it",
      minutes: 2,
      what: "Same part, different base. Say another word that uses it, then one that does not exist -- and say why it does not.",
      why: "Generating is harder than recognising, and the word that does not work is where the learning is. It is the difference between knowing ten words that happen to share a part and owning the part itself.",
    },
  ],
  morphemes: out,
};

writeFileSync("scripts/reading-morphology.json", JSON.stringify(data, null, 1) + "\n");

const total = out.reduce((s, m) => s + m.words.length, 0);
console.log("wrote scripts/reading-morphology.json");
console.log(`  morphemes kept:  ${out.length} of ${MORPHEMES.length}`);
console.log(`  words attested:  ${total} of ${MORPHEMES.reduce((s, m) => s + m.words.length, 0)}`);

const byGrade = {};
for (const m of out) for (const w of m.words) byGrade[w.gradeName] = (byGrade[w.gradeName] ?? 0) + 1;
console.log("  by grade:       ", Object.entries(byGrade).map(([g, n]) => `${g} ${n}`).join("  "));

if (dropped.length) {
  console.log(`\n  ${dropped.length} morpheme(s) dropped for too few attested words:`);
  for (const d of dropped) console.log("    " + d);
}
if (inflected.length) {
  console.log(`\n  ${inflected.length} inflected form(s) pruned, their base is already in the list:`);
  for (const w of inflected.slice(0, 10)) console.log("    " + w);
  if (inflected.length > 10) console.log(`    ... and ${inflected.length - 10} more`);
}
if (missing.length) {
  console.log(`\n  ${missing.length} curated word(s) appear in no article, so they are not shipped:`);
  for (const w of missing.slice(0, 12)) console.log("    " + w);
  if (missing.length > 12) console.log(`    ... and ${missing.length - 12} more`);
}
