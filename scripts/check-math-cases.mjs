/**
 * Hold the maths reasoning cases to their rules.
 *
 * The cases are written by hand, which is the right way to get a situation
 * worth arguing about and the wrong way to get arithmetic you can trust. So
 * every solve case carries `chk`, an expression, and this re-derives the
 * answer from it with the same parser the generated practice uses -- a
 * hand-written tokeniser, not eval.
 *
 * The structural rules matter as much as the arithmetic, because the whole
 * claim of a solve case is that the numbers settle it:
 *
 *   - the answer must equal what `chk` works out to;
 *   - every number in `chk` must appear in the information given, or be
 *     declared in `uses` where the standard supplies it (the 100 in a
 *     percentage, the 10 in a place value);
 *   - every wrong option must be ruled out by a line a child can point to;
 *   - the decisive line must be gone from the debate version, so a debate
 *     is genuinely open rather than a solve case with the answer hidden;
 *   - every open position in the debate must have evidence for it and a
 *     line that argues against it. A position with no counter is not a
 *     debate, it is the answer.
 *
 *   bun run scripts/check-math-cases.mjs
 */
import { readFileSync } from "node:fs";
import { evalCheck, ratStr, sameAnswer } from "./lib/math-items.mjs";

const DATA = JSON.parse(readFileSync("scripts/math-cases.json", "utf8"));
const PREQ = JSON.parse(readFileSync("scripts/math-prerequisites.json", "utf8"));
const GRADES = DATA.grades;
const LEVEL = new Map(PREQ.sequence.map((r) => [r.key, r.level]));

const problems = [];
const seenId = new Set();
const seenTitle = new Set();

/** Every run of digits in a line, including fractions and decimals. */
const numbersIn = (s) => String(s).match(/\d+\/\d+|\d+\.\d+|\d+/g) || [];

for (const c of DATA.cases) {
  const at = `${c.id}`;
  const bad = (m) => problems.push(`${at}: ${m}`);

  if (seenId.has(c.id)) bad("two cases share this id");
  seenId.add(c.id);
  if (seenTitle.has(c.title)) bad(`title used twice: ${c.title}`);
  seenTitle.add(c.title);

  if (!GRADES[c.grade]) bad(`grade ${c.grade} is not a grade`);
  if (!LEVEL.has(c.code)) bad(`${c.code} is not a standard the hub teaches`);
  else if (LEVEL.get(c.code) !== GRADES[c.grade]) {
    bad(`${c.code} is a ${LEVEL.get(c.code)} standard on a ${GRADES[c.grade]} case`);
  }

  // The solve version.
  if (!Array.isArray(c.given) || c.given.length < 3) bad("fewer than three lines of information");
  if (!Array.isArray(c.options) || c.options.length < 3) bad("fewer than three candidate answers");
  const values = (c.options || []).map((o) => o.value);
  if (new Set(values).size !== values.length) bad("two candidate answers have the same value");
  if (!(c.answer >= 0 && c.answer < (c.options || []).length)) bad("the answer is not one of the options");

  let want = null;
  try {
    want = evalCheck(c.chk);
  } catch (e) {
    bad(`cannot read the check expression: ${c.chk} (${e.message})`);
  }
  if (want && c.options?.[c.answer]) {
    const got = c.options[c.answer].value;
    if (!sameAnswer(ratStr(want), got)) {
      bad(`the check says ${ratStr(want)} but the answer is ${got}`);
    }
  }

  // Every number the check uses has to be a number the problem gave.
  //
  // A slash inside the expression is division, not a fraction, so 25/100 is
  // the 25 and the 100 of a percentage and both have to be accounted for
  // separately. A case may still declare the whole "3/2" in `uses` where it
  // really is one number -- one and a half metres, written as a fraction.
  const givenNums = new Set((c.given || []).flatMap(numbersIn).concat(numbersIn(c.question || "")));
  const allowed = new Set((c.uses || []).map(String));
  const known = (n) => givenNums.has(n) || allowed.has(n);
  for (const tok of numbersIn(c.chk)) {
    if (known(tok)) continue;
    const parts = tok.includes("/") ? tok.split("/") : [tok];
    const missing = parts.filter((p) => !known(p));
    if (missing.length) {
      bad(`the check uses ${missing.join(" and ")}, which is nowhere in the information given and is not declared in "uses"`);
    }
  }

  const lineOk = (i, where) => {
    if (!(Number.isInteger(i) && i >= 0 && i < (c.given || []).length)) bad(`${where} points at line ${i}, which does not exist`);
  };
  for (const i of c.proof || []) lineOk(i, "proof");
  for (const i of c.decider || []) lineOk(i, "decider");
  if (!(c.decider || []).length) bad("no decider: nothing is named as the line that settles it");
  if (!(c.proof || []).length) bad("no proof lines");

  // Every wrong answer needs a reason tied to a line.
  const ruled = new Map();
  for (const r of c.rules_out || []) {
    lineOk(r.because, "rules_out");
    if (!(r.option >= 0 && r.option < (c.options || []).length)) bad(`rules_out names option ${r.option}, which does not exist`);
    if (r.option === c.answer) bad("rules_out rules out the answer");
    if (!r.why || r.why.length < 20) bad(`the reason for option ${r.option} is too thin to say in class`);
    ruled.set(r.option, true);
  }
  for (let i = 0; i < (c.options || []).length; i++) {
    if (i !== c.answer && !ruled.has(i)) bad(`option ${i} (${c.options[i].value}) is never ruled out`);
  }
  if (!c.explain || c.explain.length < 40) bad("no explanation worth reading");

  // The debate version.
  const d = c.debate;
  if (!d) { bad("no debate version"); continue; }
  const dl = (i, where) => {
    if (!(Number.isInteger(i) && i >= 0 && i < (d.given || []).length)) bad(`debate ${where} points at line ${i}, which does not exist`);
  };
  if (!Array.isArray(d.given) || d.given.length < 3) bad("the debate gives fewer than three lines");
  if (!Array.isArray(d.options) || d.options.length < 2) bad("the debate offers fewer than two answers");
  const dvals = (d.options || []).map((o) => o.value);
  if (new Set(dvals).size !== dvals.length) bad("two debate answers have the same value");
  if (!Array.isArray(d.open) || d.open.length < 2) bad("fewer than two positions are open, so there is nothing to debate");

  // What makes the debate open, named rather than assumed.
  //
  // A case opens one of two ways. Either the line that settled it is gone,
  // and `opened_by` is null -- then it really has to be gone. Or a new fact
  // has been added that the solve version did not have, and `opened_by`
  // points at it -- then it has to be genuinely new, and it has to be used,
  // because a fact nobody argues from has not opened anything.
  //
  // The first draft of this check demanded the first form and failed nine
  // cases out of thirteen. It was wrong: adding a fact is usually the better
  // way to open a case, because the arithmetic stays intact and the argument
  // moves to what the numbers mean. The rule now asks which way, and holds
  // the case to the one it claims.
  const dgiven = new Set((d.given || []).map((s) => String(s).trim()));
  if (d.opened_by === null || d.opened_by === undefined) {
    for (const i of c.decider || []) {
      const line = (c.given || [])[i];
      if (line && dgiven.has(String(line).trim())) {
        bad(`opened_by is null, but the debate still carries the line that settles it: "${line}"`);
      }
    }
  } else {
    dl(d.opened_by, "opened_by");
    const line = (d.given || [])[d.opened_by];
    if (line && new Set((c.given || []).map((s) => String(s).trim())).has(String(line).trim())) {
      bad(`opened_by points at a line the solve version already had: "${line}"`);
    }
    const cited = (d.arguments || []).some(
      (a) => (a.evidence || []).includes(d.opened_by) || a.against === d.opened_by,
    );
    if (!cited) bad("the line said to open the debate is never argued from or against");
  }

  const argued = new Map();
  for (const a of d.arguments || []) {
    if (!(a.option >= 0 && a.option < (d.options || []).length)) bad(`a debate argument names option ${a.option}, which does not exist`);
    if (!Array.isArray(a.evidence) || !a.evidence.length) bad(`option ${a.option} is argued with no evidence`);
    for (const i of a.evidence || []) dl(i, "evidence");
    dl(a.against, "against");
    if (!a.why || a.why.length < 30) bad(`the argument for option ${a.option} is too thin`);
    argued.set(a.option, true);
  }
  for (const i of d.open || []) {
    if (!(i >= 0 && i < (d.options || []).length)) bad(`open names option ${i}, which does not exist`);
    else if (!argued.has(i)) bad(`option ${i} is open but nobody argues it`);
  }
  if (!d.note || d.note.length < 40) bad("no teacher note on the debate");
  if (!d.question?.length) bad("the debate has no question");
}

const byGrade = new Map();
for (const c of DATA.cases) byGrade.set(c.grade, (byGrade.get(c.grade) || 0) + 1);

console.log(`${DATA.cases.length} maths cases, ${byGrade.size} grades.`);
for (const g of [...byGrade.keys()].sort((a, b) => a - b)) {
  const cs = DATA.cases.filter((c) => c.grade === g);
  console.log(`  ${GRADES[g].padEnd(13)} ${cs.map((c) => `${c.code} ${c.title}`).join("; ")}`);
}
const used = DATA.cases.filter((c) => (c.uses || []).length);
if (used.length) {
  console.log("\nNumbers brought in by the standard rather than the problem:");
  for (const c of used) console.log(`  ${c.id}  ${c.uses.join(", ")}`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log("\nEvery solve answer re-derived; every debate position argued and countered.");
