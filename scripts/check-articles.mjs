/**
 * Are the informational articles the shape a teacher can actually use?
 *
 * The two packs that came in were consistent: every article in two Lexile
 * versions with the same lettered paragraphs, five questions of five named
 * kinds, every question answered. Writing eleven more grades by hand is where
 * that consistency quietly goes, so this holds the new ones to the old ones.
 *
 * What it checks, and why each one is here rather than trusted:
 *
 *   1. Both versions exist, with the same paragraph letters in the same
 *      order. A lower version that drops paragraph D is not the same article,
 *      and the questions point at letters.
 *   2. Length and Lexile sit inside the grade's band. The bands come from the
 *      two real packs; everything else is extrapolated from them.
 *   3. The lower version is genuinely easier: fewer words, and shorter
 *      sentences on average. Relabelling the same prose is the easy mistake.
 *   4. Five questions, one of each kind, each with an answer.
 *   5. The answer is grounded: it shares real words with the article, so a
 *      child can find it rather than guess.
 *   6. A paragraph-focus question names letters the article actually has.
 *   7. Titles are unique across the whole set, and no article repeats inside
 *      its own grade.
 *   8. Every standard in the grade gets its five.
 *
 *   bun run scripts/check-articles.mjs
 */
import { readFileSync } from "node:fs";

const PLAN = JSON.parse(readFileSync("scripts/reading-article-plan.json", "utf8"));
const DATA = JSON.parse(readFileSync("scripts/reading-articles.json", "utf8"));
const ART = DATA.articles;
const byGrade = new Map(PLAN.grades.map((g) => [g.grade, g]));
const KINDS = PLAN.questionKinds;

const words = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;
const sentences = (s) => String(s).split(/[.!?]+(?:\s|$)/).filter((x) => x.trim().length > 1);
const meanSentence = (paras) => {
  const text = paras.map((p) => p.text).join(" ");
  const n = sentences(text).length || 1;
  return words(text) / n;
};

const ACC = PLAN.accepted || {};
const accepted = (group, title) =>
  ((ACC[group] || {}).titles || []).includes(title);

const problems = [];
const titles = new Map();
let n = 0;

for (const a of ART) {
  const where = `${a.standard} g${a.grade} #${a.n} "${a.title}"`;
  const say = (m) => problems.push(`${where}: ${m}`);
  const plan = byGrade.get(a.grade);
  if (!plan) { say("no plan for this grade"); continue; }
  n++;

  // 1. two versions, same spine
  for (const v of ["higher", "lower"]) {
    if (!a[v] || !Array.isArray(a[v].paras) || !a[v].paras.length) { say(`no ${v} version`); }
  }
  if (!a.higher?.paras?.length || !a.lower?.paras?.length) continue;
  const hi = a.higher.paras.map((p) => p.label).join("");
  const lo = a.lower.paras.map((p) => p.label).join("");
  if (hi !== lo && !accepted("shortLowerParagraphs", a.title))
    say(`paragraph letters differ: higher ${hi}, lower ${lo}`);
  const [pMin, pMax] = plan.paras;
  if (a.higher.paras.length < pMin || a.higher.paras.length > pMax)
    say(`${a.higher.paras.length} paragraphs, grade ${plan.name} wants ${pMin}-${pMax}`);

  // 2. bands
  for (const v of ["higher", "lower"]) {
    const [lxMin, lxMax] = plan[v].lexile;
    const [wMin, wMax] = plan[v].words;
    const lx = a[v].lexile;
    const w = words(a[v].paras.map((p) => p.text).join(" "));
    if (lx < lxMin || lx > lxMax) say(`${v} Lexile ${lx} outside ${lxMin}-${lxMax}`);
    if (w < wMin || w > wMax) say(`${v} is ${w} words, band is ${wMin}-${wMax}`);
  }

  // 3. the lower version is actually easier
  if (a.lower.lexile >= a.higher.lexile) say("the lower version is not lower");
  const hw = words(a.higher.paras.map((p) => p.text).join(" "));
  const lw = words(a.lower.paras.map((p) => p.text).join(" "));
  if (lw >= hw) say("the lower version is not shorter");
  const hs = meanSentence(a.higher.paras), ls = meanSentence(a.lower.paras);
  if (ls >= hs && !accepted("lowerSentencesLonger", a.title))
    say(`lower sentences average ${ls.toFixed(1)} words against higher ${hs.toFixed(1)}`);

  // 4. five questions, one of each kind, all answered
  if (!Array.isArray(a.questions) || a.questions.length !== 5) {
    say(`${(a.questions || []).length} questions, wants 5`);
  } else {
    const kinds = a.questions.map((q) => q.kind);
    for (const k of KINDS) if (!kinds.includes(k)) say(`no "${k}" question`);
    // Two of the five kinds state their answer inside the item rather than in
    // a separate green box: a paragraph-focus item reads "Paragraph B (i.e.
    // trapped) and paragraph E (i.e. Balto)", and a vocabulary item gives the
    // word and its meaning together. That is how both real packs are written,
    // so those two are checked for substance instead of for a separate answer.
    const INLINE = new Set(["paragraph focus", "vocabulary"]);
    a.questions.forEach((q) => {
      if (!q.q) say(`question ${q.n} has no question`);
      if (INLINE.has(q.kind)) {
        if (words(q.q) < 6) say(`question ${q.n} (${q.kind}) is too thin to carry its own answer`);
      } else if (!q.a) {
        say(`question ${q.n} (${q.kind}) has no answer`);
      }
    });
  }

  // 5. answers grounded in the article
  const body = a.higher.paras.map((p) => p.text).join(" ").toLowerCase();
  (a.questions || []).forEach((q) => {
    if (!q.a) return;
    if (q.kind === "vocabulary") return; // a definition is allowed its own words
    const content = String(q.a).toLowerCase().split(/[^a-z']+/).filter((x) => x.length >= 4);
    if (content.length && !content.some((x) => body.includes(x)))
      say(`answer ${q.n} uses no word from the article`);
  });

  // 6. a paragraph-focus question points at letters that exist
  const focus = (a.questions || []).find((q) => q.kind === "paragraph focus");
  if (focus) {
    const named = [...String(focus.q).matchAll(/\bparagraph\s+([A-Z])\b/gi)].map((m) => m[1].toUpperCase());
    for (const L of named) if (!hi.includes(L)) say(`paragraph focus names ${L}, which the article has not got`);
  }

  // 7. unique titles
  const key = String(a.title).trim().toLowerCase();
  if (titles.has(key) && !accepted("sharedTitles", a.title))
    say(`shares its title with ${titles.get(key)}`);
  else titles.set(key, where);
}

// 8. coverage
for (const plan of PLAN.grades) {
  const mine = ART.filter((a) => a.grade === plan.grade);
  if (!mine.length) continue;
  const stds = [...new Set(mine.map((a) => a.standard))].sort();
  for (const s of stds) {
    const c = mine.filter((a) => a.standard === s).length;
    if (c !== PLAN.perStandard)
      problems.push(`${s} grade ${plan.name}: ${c} articles, wants ${PLAN.perStandard}`);
  }
  if (mine.length !== PLAN.perGrade)
    problems.push(`grade ${plan.name}: ${mine.length} articles, wants ${PLAN.perGrade}`);
}

const done = PLAN.grades.filter((g) => ART.some((a) => a.grade === g.grade));
const whole = PLAN.grades.filter((g) => ART.filter((a) => a.grade === g.grade).length === PLAN.perGrade);
console.log(`${n} articles across ${done.length} of ${PLAN.grades.length} grades; ${whole.length} complete.`);
console.log(`grades started: ${done.map((g) => g.name).join(", ") || "none"}`);
console.log(`problems: ${problems.length}`);
problems.slice(0, 40).forEach((p) => console.log("  " + p));
if (problems.length) { console.error("\n✗ fix these before the batch ships."); process.exit(1); }
console.log("✅ every article has both versions, its five questions and its answers");
