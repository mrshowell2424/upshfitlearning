/**
 * What Word Parts promises, checked.
 *
 * The promise is narrow and worth defending: every word is one a child has
 * met in an article, the sentence shown is the one it appeared in, word for
 * word, and the split is true. The first two are mechanical and checked
 * here. The third is a person's judgement and lives in scripts/morphemes.mjs
 * -- what this can catch is a split that contradicts its own morpheme, which
 * is what a typo in that table looks like.
 *
 *   bun scripts/check-morphology.mjs
 */
import { readFileSync } from "node:fs";

const DATA = JSON.parse(readFileSync("scripts/reading-morphology.json", "utf8"));
const AR = JSON.parse(readFileSync("scripts/reading-articles.json", "utf8")).articles;

const MIN_WORDS = 4;

/** Every paragraph of every article, to check sentences against. */
const corpus = [];
const byId = new Map();
for (const a of AR) {
  byId.set(a.id, a);
  for (const level of ["lower", "higher"])
    for (const p of a[level]?.paras ?? []) corpus.push(p.text);
}

const whole = (text, word) =>
  new RegExp(`(^|[^A-Za-z])${word}([^A-Za-z]|$)`, "i").test(text);

const problems = [];
let words = 0;

for (const m of DATA.morphemes) {
  if (m.words.length < MIN_WORDS) {
    problems.push(`${m.form}: only ${m.words.length} words, needs ${MIN_WORDS}`);
  }

  const bare = m.form.replace(/-/g, "");

  for (const w of m.words) {
    words++;
    const where = `${m.form} ${w.word}`;

    if (!whole(w.sentence, w.word)) {
      problems.push(`${where}: its sentence does not contain the word`);
    }

    // Verbatim, not paraphrased. A sentence that is not a substring of some
    // paragraph was edited somewhere, and the teacher's "check it against
    // the article" stops being true.
    if (!corpus.some((t) => t.includes(w.sentence))) {
      problems.push(`${where}: sentence is not verbatim from any article`);
    }

    const article = byId.get(w.article.id);
    if (!article) problems.push(`${where}: article ${w.article.id} does not exist`);
    else if (article.title !== w.article.title) {
      problems.push(`${where}: article title does not match ${w.article.id}`);
    }

    // A root may stand alone as a word -- "graph" is both the root and a
    // word -- so only an affixed word is required to have a different base.
    if (w.base === w.word && m.kind !== "root") {
      problems.push(`${where}: base is the word itself`);
    }
    if (!w.means) problems.push(`${where}: no meaning`);

    // A typo in the table shows up as a word that does not carry its own
    // morpheme -- "-ment" listed against a word that does not end in ment.
    if (m.kind === "prefix" && !w.word.toLowerCase().startsWith(bare)) {
      problems.push(`${where}: does not begin with ${m.form}`);
    }
    if (m.kind === "suffix" && !w.word.toLowerCase().endsWith(bare)) {
      problems.push(`${where}: does not end with ${m.form}`);
    }
    if (m.kind === "root" && !w.word.toLowerCase().includes(bare)) {
      problems.push(`${where}: does not contain the root ${m.form}`);
    }
  }
}

console.log(`morphemes: ${DATA.morphemes.length}`);
console.log(`words:     ${words}`);

if (problems.length) {
  console.log(`\nproblems: ${problems.length}\n`);
  for (const p of problems) console.log("  " + p);
  process.exit(1);
}

console.log("\n✅ every word is attested, every sentence is the article's own");
