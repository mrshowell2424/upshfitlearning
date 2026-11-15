/**
 * The files that say they were taken from the articles -- were they?
 *
 * Four files are built out of reading-articles.json and each one states,
 * in its own header, that it holds the articles' own words:
 *
 *   reading-sentence-lab.json   "every string here is verbatim from
 *                                reading-articles.json, and editing one
 *                                here would make the answer key disagree
 *                                with the article it came from"
 *   reading-fluency-play.json   "Every line is verbatim from one"
 *   reading-threads.json        which thread each article belongs to
 *   scripts/articles/g*.json    the five grades built from a source file
 *
 * None of those claims was checked by anything. They are all true today,
 * which is the reason to check them: a claim that is true and unverified
 * is a claim that will be false later and still look fine. The sentence
 * lab is the sharp one -- it prints a kernel and an expanded sentence
 * side by side as an answer key, and if an article is edited afterwards
 * the key quietly starts teaching a sentence that is no longer in the
 * text a child is holding.
 *
 * The generated grade files are the same hazard in the other direction.
 * Nothing merges scripts/articles/gN.json into reading-articles.json, so
 * editing a source file and rebuilding changes the generated copy and
 * not the one the site serves. The two agree now; this is what says so.
 *
 * It also checks the articles' own numbers, which nothing did: a stored
 * word count has to match the prose it counts. That is how the field
 * this check replaced went wrong -- labelled_words sat beside words in
 * all 700 versions and had stopped matching in 200 of them.
 *
 *   bun scripts/check-from-articles.mjs
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const ART = read("scripts/reading-articles.json").articles;
const SL = read("scripts/reading-sentence-lab.json");
const FP = read("scripts/reading-fluency-play.json");
const TH = read("scripts/reading-threads.json");

const problems = [];
const say = (m) => problems.push(m);

/** Every string anywhere in the articles, as one haystack. */
const strings = (v, out = []) => {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, out));
  return out;
};
/*
 * Curly and straight quotes are the same quote. The articles use curly
 * apostrophes and some of the derived files were written with straight
 * ones; treating those as different text would report every contraction
 * as a missing sentence and bury the one that really went missing.
 */
const norm = (s) =>
  String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();
const HAY = norm(strings(ART).join(" \u0001 "));

// 1. the articles' own word counts
let versions = 0;
for (const a of ART)
  for (const v of ["higher", "lower"]) {
    const s = a[v];
    if (!s) continue;
    versions++;
    const real = s.paras.reduce((n, p) => n + String(p.text).trim().split(/\s+/).filter(Boolean).length, 0);
    if (s.words !== real) say(`${a.id} ${v}: says ${s.words} words and its paragraphs hold ${real}`);
  }

// 2. the sentence lab is the articles' own sentences
let labStrings = 0;
for (const it of SL.items ?? [])
  for (const pair of [...(it.combine ?? []), ...(it.expand ?? [])])
    for (const key of ["kernel", "expanded", "a", "b", "combined"]) {
      if (!pair[key]) continue;
      labStrings++;
      if (!HAY.includes(norm(pair[key])))
        say(`sentence lab ${it.id}: "${pair[key]}" is in no article, and the answer key says it is`);
    }

// 3. the fluency game's lines are the articles' own lines
let playLines = 0;
for (const [band, arr] of Object.entries(FP.lines ?? {}))
  for (const line of arr) {
    const t = typeof line === "string" ? line : line.text ?? line.line;
    if (!t) continue;
    playLines++;
    if (!HAY.includes(norm(t))) say(`fluency play, band ${band}: "${t}" is in no article`);
  }

// 4. every article has a thread, and every thread is one of the named ones
const ids = new Set(ART.map((a) => a.id));
const threads = new Set((TH.threads ?? []).map((t) => t.key ?? t.id ?? t.name));
for (const [id, thread] of Object.entries(TH.assign ?? {})) {
  if (!ids.has(id)) say(`threads: "${id}" is given a thread and is not an article`);
  if (!threads.has(thread)) say(`threads: "${id}" is put in "${thread}", which is not one of the threads`);
}
const homeless = [...ids].filter((id) => !(id in (TH.assign ?? {})));
if (homeless.length)
  say(`threads: ${homeless.length} articles belong to no thread — ${homeless.slice(0, 6).join(", ")}`);

/*
 * 5. the generated grade files still match what the site serves
 *
 * Read off the directory rather than listed here. A hardcoded list is a
 * thing to forget on the day grade 8 is written, and forgetting it would
 * leave the new grade as the only one nobody compares.
 */
const files = existsSync("scripts/articles")
  ? readdirSync("scripts/articles").filter((f) => /^g\d+\.json$/.test(f)).sort()
  : [];
if (!files.length) say("scripts/articles holds no generated grade files at all");
let generated = 0;
for (const file of files) {
  const path = `scripts/articles/${file}`;
  for (const a of read(path)) {
    generated++;
    const live = ART.find((x) => x.id === a.id);
    if (!live) {
      say(`${file} holds ${a.id}, which reading-articles.json does not serve`);
    } else if (JSON.stringify(a) !== JSON.stringify(live)) {
      say(
        `${a.id} differs between ${file} and reading-articles.json — ` +
          `the grade was rebuilt and scripts/merge-articles.mjs was not run`,
      );
    }
  }
}

console.log(`${ART.length} articles, ${versions} versions, their word counts measured against their own prose.`);
console.log(`${labStrings} sentence-lab strings and ${playLines} fluency lines checked back to the article they claim.`);
console.log(`${Object.keys(TH.assign ?? {}).length} thread assignments; ${generated} generated articles compared with the served ones.`);
console.log(`\nproblems: ${problems.length}`);
problems.slice(0, 40).forEach((x) => console.log("  " + x));
if (problems.length) {
  console.error("\n✗ fix these before the articles ship.");
  process.exit(1);
}
console.log("✅ every derived line is the article's own, and nothing generated has drifted from what is served");
