/**
 * What each maths standard is built on.
 *
 * The reading side has had this since the spiral review was written:
 * reading-prerequisites.json says what today's lesson stands on, and that
 * one fact is what lets the review page decide itself rather than asking a
 * teacher to decide it again every evening. Maths had nothing of the kind —
 * 305 standards listed by grade, in no order, with no answer to "what does
 * a child need before this one".
 *
 * Most of it is derivable, because the codes carry it. 4.NBT.5 follows
 * 4.NBT.4, and the first NBT standard of grade 4 follows the last of grade
 * 3. Both of those are mechanical and both are right.
 *
 * What is not mechanical is where a domain begins, changes name, or picks
 * up from a different one: fractions start in grade 3 and stand on grade 2
 * partitioning, ratios start in grade 6 and stand on grade 5 fractions,
 * algebra in grade 9 stands on grade 8 expressions and equations. Those are
 * written down in LINEAGE below, which is the part a person has to get
 * right and the part a reviewer should read.
 *
 *   bun run scripts/build-math-prerequisites.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const HUB = "content-reading-materials/math/math-hub.html";

/** One of the hub's `var NAME = {...};` tables. The hub is the source. */
function table(html, name) {
  const head = `var ${name} = `;
  const i = html.indexOf(head);
  if (i === -1) throw new Error(`${name} is not in the hub any more`);
  const j = html.indexOf(";\n", i);
  return JSON.parse(html.slice(i + head.length, j));
}

const html = readFileSync(HUB, "utf8");
const DATA = table(html, "DATA");

/**
 * What each domain is called, lifted from the hub.
 *
 * Carried into the generated file so a page can say "Number and
 * Operations — Fractions" without parsing half a megabyte of HTML to find
 * out. The hub stays the source; this is a copy that a checker re-derives.
 */
const DOMAIN_NAMES = (() => {
  const head = "var DOMAIN_NAMES = ";
  const i = html.indexOf(head);
  if (i === -1) throw new Error("the hub no longer names its domains");
  const body = html.slice(i + head.length, html.indexOf("};", i) + 1);
  const out = {};
  for (const m of body.matchAll(/([A-Za-z-]+)\s*:\s*"([^"]+)"/g)) out[m[1]] = m[2];
  if (!Object.keys(out).length) throw new Error("could not read the domain names");
  return out;
})();

/** Grades in teaching order, as the hub names them. */
export const GRADES = [
  "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
];

/** K-8 codes are grade.DOMAIN.n; high school is CATEGORY.DOMAIN.n. */
export function parse(code) {
  const m = String(code).match(/^(K|\d{1,2}|[A-Z])\.([A-Z]+)\.(\d+)$/);
  if (!m) return null;
  // The domain is the letters alone, so NBT in grade 1 and NBT in grade 4
  // are one strand that runs through the grades rather than four unrelated
  // ones. Keying it per grade is what left 1.OA.1 and 2.NBT.1 standing on
  // nothing: each grade's domain began again from scratch.
  //
  // High school codes carry their category in the first field -- A.SSE,
  // G.CO -- so there the strand is both fields together.
  // K is a grade, not a conceptual category. Letting it match the
  // high-school test put kindergarten in a strand of its own, so grade 1
  // began from nothing in every domain.
  const highSchool = /^[A-Z]$/.test(m[1]) && m[1] !== "K";
  return {
    band: m[1],
    domain: highSchool ? `${m[1]}.${m[2]}` : m[2],
    start: `${m[1]}.${m[2]}`,
    n: Number(m[3]),
  };
}

/**
 * Where a domain comes from when it is not simply itself a year younger.
 *
 * Each line is a claim about mathematics, not about spelling: the left is a
 * domain as it first appears, the right is the domain a child has to have
 * met to stand a chance at it. These are the ones worth arguing about, so
 * they are the ones written down.
 */
export const LINEAGE = {
  // Fractions begin by partitioning shapes, which is grade 2 geometry.
  "3.NF": "2.G",
  // Multiplying and dividing starts from equal groups in grade 2 addition.
  "3.OA": "2.OA",
  // Ratio is fraction thinking applied to two quantities.
  "6.RP": "5.NF",
  // The number system in grade 6 extends grade 5 place value and fractions.
  "6.NS": "5.NF",
  // Expressions generalise the arithmetic patterns of grade 5.
  "6.EE": "5.OA",
  // Statistics begins with measurement and data.
  "6.SP": "5.MD",
  // Functions are built on grade 7 proportional relationships.
  "8.F": "7.RP",
  // Grade 8 geometry is transformation work standing on grade 7 geometry.
  "8.G": "7.G",
  // Grade 8 irrationals extend grade 7 rational arithmetic.
  "8.NS": "7.NS",
  // High school. Algebra stands on grade 8 expressions and equations.
  "A.SSE": "8.EE",
  "A.APR": "8.EE",
  "A.CED": "8.EE",
  "A.REI": "8.EE",
  // Functions formalise what grade 8 introduced.
  "F.IF": "8.F",
  "F.BF": "8.F",
  "F.LE": "8.F",
  "F.TF": "G.SRT",
  // Geometry formalises grade 8 transformations and similarity.
  "G.CO": "8.G",
  "G.SRT": "G.CO",
  "G.C": "G.CO",
  "G.GPE": "G.CO",
  "G.GMD": "G.CO",
  "G.MG": "G.GMD",
  // Complex numbers extend the real number system.
  "N.CN": "8.NS",
  // Statistics and probability stand on grade 7 and 8 data work.
  "S.ID": "8.SP",
  "S.IC": "S.ID",
  "S.CP": "7.SP",
  "S.MD": "S.CP",
};

const gradeOf = new Map();
const codesByDomain = new Map();
const order = [];
for (const [grade, code] of DATA) {
  gradeOf.set(code, grade);
  order.push(code);
  const p = parse(code);
  if (!p) continue;
  if (!codesByDomain.has(p.domain)) codesByDomain.set(p.domain, []);
  codesByDomain.get(p.domain).push(code);
}
// Within a strand, grade order first and number within the grade second.
for (const list of codesByDomain.values()) {
  list.sort((a, b) =>
    GRADES.indexOf(gradeOf.get(a)) - GRADES.indexOf(gradeOf.get(b)) || parse(a).n - parse(b).n);
}

const rank = (code) => GRADES.indexOf(gradeOf.get(code));

/**
 * The standard before this one.
 *
 * Within a domain the previous number is the answer and nothing else needs
 * saying. At the start of a domain, the search walks back through LINEAGE
 * until it finds a domain this hub actually teaches, so a missing link in
 * the chain does not silently become no prerequisite at all.
 */
function prereqOf(code) {
  const p = parse(code);
  if (!p) return null;
  const sameDomain = codesByDomain.get(p.domain) || [];
  const at = sameDomain.indexOf(code);
  if (at > 0) return sameDomain[at - 1];

  // First in its strand: the strand itself has to come from somewhere.
  let from = p.start;
  const seen = new Set([from, p.domain]);
  while (true) {
    const next = LINEAGE[from] || LINEAGE[p.domain];
    if (!next || seen.has(next)) return null;
    seen.add(next);
    const list = codesByDomain.get(next) || codesByDomain.get(String(next).split(".").pop());
    if (list && list.length) {
      // The last standard of that domain: the furthest a child will have got.
      const earlier = list.filter((c) => rank(c) < rank(code));
      if (earlier.length) return earlier[earlier.length - 1];
      if (list.length && rank(list[list.length - 1]) < rank(code)) return list[list.length - 1];
    }
    from = next;
  }
}

const prereq = {};
const roots = [];
for (const code of order) {
  const p = prereqOf(code);
  if (p && p !== code && rank(p) <= rank(code)) prereq[code] = p;
  else roots.push(code);
}

/**
 * What is going cold, per grade.
 *
 * The pool is the standards of that grade that the most later standards are
 * built on — counted rather than chosen, because "load-bearing" has a
 * meaning here: how much of what comes next stops working without it.
 */
const depended = new Map();
for (const [, p] of Object.entries(prereq)) depended.set(p, (depended.get(p) || 0) + 1);
const spiral = {};
for (const grade of GRADES) {
  const codes = order.filter((c) => gradeOf.get(c) === grade);
  const weight = (c) => depended.get(c) || 0;
  const byWeight = (a, b) => weight(b) - weight(a) || order.indexOf(a) - order.indexOf(b);
  // One from each strand before a second from any of them. Counting
  // dependants alone gave grade 4 a pool of five OA standards and nothing
  // else, because a sequential strand depends on itself all the way down —
  // a review pool that never leaves one domain is not a spiral.
  const strands = new Map();
  for (const c of codes) {
    const d = parse(c)?.domain ?? "?";
    if (!strands.has(d)) strands.set(d, []);
    strands.get(d).push(c);
  }
  const picked = [];
  for (const list of strands.values()) picked.push(list.slice().sort(byWeight)[0]);
  picked.sort(byWeight);
  for (const c of codes.slice().sort(byWeight)) {
    if (picked.length >= 6) break;
    if (!picked.includes(c)) picked.push(c);
  }
  spiral[grade] = picked.slice(0, 6);
}

writeFileSync(
  "scripts/math-prerequisites.json",
  JSON.stringify({
    _note:
      "What each maths standard is built on, and what is worth revisiting at each grade. Derived from the codes where the codes carry it, and from the LINEAGE table in scripts/build-math-prerequisites.mjs where a domain begins or changes. Generated; do not hand-edit. scripts/check-math-prerequisites.mjs re-derives it and holds it to its rules.",
    grades: GRADES,
    // The teaching order, and what to call each standard. A review page
    // needs both and should not have to work either out again.
    sequence: order.map((code) => {
      const p = parse(code);
      const letters = p ? p.domain.split(".").pop() : "";
      return {
        key: code,
        name: `${code} — ${DOMAIN_NAMES[letters] || letters}`,
        level: gradeOf.get(code),
      };
    }),
    prereq,
    spiral,
    roots,
  }, null, 1) + "\n",
);

console.log(`${order.length} standards, ${Object.keys(prereq).length} with a prerequisite.`);
console.log(`${roots.length} roots (nothing earlier in this hub): ${roots.join(", ")}`);
const crossGrade = Object.entries(prereq).filter(([c, p]) => gradeOf.get(c) !== gradeOf.get(p));
console.log(`${crossGrade.length} of them reach back into an earlier grade.`);
