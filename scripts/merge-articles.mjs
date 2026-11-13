/**
 * Fold the hand-written grade files into scripts/reading-articles.json.
 *
 * Grades 3 and 4 came out of the two source packs verbatim and stay where
 * they are. Every other grade is written a grade at a time into
 * scripts/articles/g<N>.json, because fifty articles is as much as can be
 * held in one head at once and a grade that is half done should not be able
 * to break the grade before it.
 *
 * A grade file replaces that grade wholesale rather than appending, so
 * running this twice is the same as running it once. Order in the store
 * follows the plan, so the seed walks K upward.
 *
 *   bun run scripts/merge-articles.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";

const STORE = "scripts/reading-articles.json";
const DIR = "scripts/articles";

const data = JSON.parse(readFileSync(STORE, "utf8"));
const plan = JSON.parse(readFileSync("scripts/reading-article-plan.json", "utf8"));
const order = new Map(plan.grades.map((g, i) => [g.grade, i]));

const files = existsSync(DIR)
  ? readdirSync(DIR).filter((f) => /^g\d+\.json$/.test(f)).sort()
  : [];

const written = new Map(); // grade -> articles
for (const f of files) {
  const one = JSON.parse(readFileSync(`${DIR}/${f}`, "utf8"));
  const list = Array.isArray(one) ? one : one.articles;
  if (!Array.isArray(list) || !list.length) throw new Error(`${f}: no articles`);
  const grades = [...new Set(list.map((a) => a.grade))];
  if (grades.length !== 1) throw new Error(`${f}: mixes grades ${grades.join(", ")}`);
  if (written.has(grades[0])) throw new Error(`grade ${grades[0]} written twice`);
  written.set(grades[0], list);
}

const kept = data.articles.filter((a) => !written.has(a.grade));
const all = [...kept, ...[...written.values()].flat()];
all.sort((a, b) => (order.get(a.grade) - order.get(b.grade)) || (a.n - b.n));

data.articles = all;
data.source = [...new Set([
  ...(data.source || []),
  ...files.map((f) => `scripts/articles/${f}`),
])];
writeFileSync(STORE, JSON.stringify(data, null, 1) + "\n");

const by = new Map();
for (const a of all) by.set(a.grade, (by.get(a.grade) || 0) + 1);
console.log(`${all.length} articles in the store`);
for (const g of plan.grades) {
  const n = by.get(g.grade) || 0;
  if (n) console.log(`  grade ${g.name.padEnd(2)} ${String(n).padStart(3)}${n === plan.perGrade ? "" : "  (incomplete)"}`);
}
