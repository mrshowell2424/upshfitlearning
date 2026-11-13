/**
 * Expand a compact grade source into the shape the two original packs use.
 *
 * An article in a pack carries a lot that can be derived: paragraph letters,
 * word counts, the id, the running number, and the block of standard text
 * under the title. Writing all of that by hand fifty times a grade is how
 * a letter goes missing or a count stops matching its own prose, which is
 * exactly what went wrong in the packs that came in. So the source holds
 * only what a person has to decide, and this fills in the rest.
 *
 *   import { grade } from "./build.mjs"
 *   grade(5, [ { t, std, hi, lo, H: [...], L: [...], q: [...], note } ])
 *
 * H and L are the paragraphs in order; they are lettered A, B, C... to match.
 * std is the last number of the standard, so 3 means RI.5.3 in grade 5.
 * hi and lo are the two Lexiles. Word counts are measured, never stated.
 */
import { readFileSync, writeFileSync } from "node:fs";

const PLAN = JSON.parse(readFileSync("scripts/reading-article-plan.json", "utf8"));
const LETTERS = "ABCDEFGHIJ";
const count = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;

const paras = (list) =>
  list.map((text, i) => ({ label: LETTERS[i], text: String(text).trim() }));

const version = (lexile, list) => {
  const p = paras(list);
  const w = count(p.map((x) => x.text).join(" "));
  return { lexile, words: w, labelled_words: w, paras: p };
};

/** The block under the title: the standard, what it spirals, the lower band. */
export function standardText(code, text, spiral, lowBand) {
  return `Standard: ${text}\n Spiral: ${spiral}\n Lower range: LL ${lowBand[0]} – ${lowBand[1]}`;
}

export function grade(n, STD, articles) {
  const plan = PLAN.grades.find((g) => g.grade === n);
  if (!plan) throw new Error(`no plan for grade ${n}`);
  const out = articles.map((a, i) => {
    const code = `${plan.std}.${a.std}`;
    const s = STD[a.std];
    if (!s) throw new Error(`${code}: no standard wording`);
    return {
      id: `g${plan.name}-${i + 1}`,
      grade: n,
      n: i + 1,
      title: a.t,
      standard: code,
      standard_text: standardText(code, s.text, s.spiral, plan.lower.lexile),
      higher: version(a.hi, a.H),
      lower: version(a.lo, a.L),
      questions: a.q.map((x, j) => ({ n: j + 1, kind: x.k, q: x.q, a: x.a || "" })),
      note: a.note || "",
    };
  });
  writeFileSync(`scripts/articles/g${n}.json`, JSON.stringify(out, null, 1) + "\n");
  return out;
}
