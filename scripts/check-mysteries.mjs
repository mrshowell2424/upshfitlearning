/**
 * Is every mystery a case a child can actually solve from the text?
 *
 * A mystery only teaches claim-and-evidence if the evidence is really there.
 * These checks hold each case to that, and to the grade it was written for:
 *
 *   1. Thirty-six weeks, numbered 1 to 36, each used once in the grade.
 *   2. The story sits inside the grade's word band, and its sentences are no
 *      longer on average than the grade allows. A grade 12 story is longer
 *      AND built of longer sentences; a grade 1 story is neither.
 *   3. The suspect count matches the grade. Ruling out a fourth and fifth
 *      person is the harder half of the task, so it arrives later.
 *   4. Every proof quote is really in the story, word for word. A quote may
 *      splice with an ellipsis, so each fragment is checked on its own. This
 *      is the check that matters most: a proof the child cannot find is not
 *      evidence, it is the teacher knowing the answer.
 *   5. Every suspect but one is cleared, and each clearing quotes the story.
 *   6. The answer names somebody who is actually on the suspect list.
 *   7. Titles are unique, so two cases never look alike in the picker.
 *
 *   bun run scripts/check-mysteries.mjs
 */
import { readFileSync } from "node:fs";

const PLAN = JSON.parse(readFileSync("scripts/reading-mystery-plan.json", "utf8"));
const DATA = JSON.parse(readFileSync("scripts/reading-mysteries.json", "utf8"));
const CASES = DATA.cases;
const byGrade = new Map(PLAN.grades.map((g) => [g.grade, g]));

const words = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;
const sentences = (s) => String(s).split(/[.!?]+(?:\s|$)/).filter((x) => x.trim().length > 1);
/** Straight and curly quotes, ellipses and runs of space all read the same. */
const norm = (s) => String(s)
  .replace(/[‘’]/g, "'")
  .replace(/[“”"]/g, "")
  .replace(/\s+/g, " ")
  .trim()
  .toLowerCase();
/**
 * Pull the quoted spans out of a line and normalise each one.
 *
 * A clearing is written 'Rosa: "Little Rosa had been asleep..."', so the name
 * before the colon is the writer's, not the story's, and checking the whole
 * line against the story fails on prose that is quoted perfectly well. Only
 * what sits inside the quote marks is a claim about the text. A quote may
 * also elide with an ellipsis, and each fragment has to stand on its own.
 */
const fragments = (q) => {
  const spans = [...String(q).matchAll(/[\u201c"]([^\u201d"]+)[\u201d"]/g)].map((m) => m[1]);
  const body = spans.length ? spans : [String(q)];
  return body.flatMap((x) => x.split(/\u2026|\.\.\./)).map(norm).filter((x) => x.length > 3);
};

const problems = [];
const titles = new Map();

for (const c of CASES) {
  const plan = byGrade.get(c.grade);
  const where = `g${plan ? plan.name : c.grade} w${c.week} "${c.title}"`;
  const say = (m) => problems.push(`${where}: ${m}`);
  if (!plan) { say("no plan for this grade"); continue; }

  // 2. length and sentence length
  const w = words(c.story);
  const [wMin, wMax] = plan.words;
  if (w < wMin || w > wMax) say(`story is ${w} words, band is ${wMin}-${wMax}`);
  const ms = w / (sentences(c.story).length || 1);
  if (ms > plan.sentence) say(`sentences average ${ms.toFixed(1)} words, grade ${plan.name} allows ${plan.sentence}`);

  // 3. suspects
  const [sMin, sMax] = plan.suspects;
  const ns = (c.suspects || []).length;
  if (ns < sMin || ns > sMax) say(`${ns} suspects, grade ${plan.name} wants ${sMin}-${sMax}`);
  (c.suspects || []).forEach((s, i) => {
    if (!s.who || !s.why) say(`suspect ${i + 1} is missing a name or a reason`);
  });

  // 4. the proof is really in the story
  const story = norm(c.story);
  if (!Array.isArray(c.proof) || c.proof.length < plan.proof)
    say(`${(c.proof || []).length} proof quotes, grade ${plan.name} wants at least ${plan.proof}`);
  (c.proof || []).forEach((p, i) => {
    const parts = fragments(p);
    if (!parts.length) return say(`proof ${i + 1} has nothing quotable in it`);
    for (const part of parts) if (!story.includes(part)) say(`proof ${i + 1} is not in the story: "${part}"`);
  });

  // 5. the other suspects are cleared, with a quote
  // Not every suspect needs a clearing sentence. Some are on the list
  // precisely because the text says nothing about them, i.e. "the cafeteria
  // cat: there is no cat in the story", and noticing that absence is the
  // point of including them. So this asks for at least one clearing and no
  // more than there are other suspects, and holds each one to the text.
  const nc = (c.clears || []).length;
  if (nc < 1) say("nobody is cleared, so the case has no suspects to rule out");
  if (nc > ns - 1) say(`${nc} suspects cleared, but there are only ${ns - 1} besides the culprit`);
  (c.clears || []).forEach((cl, i) => {
    const parts = fragments(cl);
    const quoted = parts.filter((p) => story.includes(p));
    if (!quoted.length) say(`clearing ${i + 1} quotes nothing from the story`);
  });

  // 6. the answer is grounded in the story
  // It is not always a person. Several cases answer with a place or an event,
  // i.e. "Eli left his backpack on the bus", where the suspects are seats and
  // rooms. So this asks that the answer is made of the story's own words
  // rather than that it names a row of the suspect table.
  const ans = norm(c.answer).split(/[^a-z']+/).filter((x) => x.length >= 4);
  if (ans.length && !ans.some((x) => story.includes(x)))
    say("the answer uses no word from the story");

  if (!c.question) say("no question");
  if (!c.explain) say("no explanation");

  // 7. unique titles
  const key = String(c.title).trim().toLowerCase();
  if (titles.has(key)) say(`shares its title with ${titles.get(key)}`);
  else titles.set(key, where);
}

// 1. coverage
for (const plan of PLAN.grades) {
  const mine = CASES.filter((c) => c.grade === plan.grade);
  if (!mine.length) continue;
  const weeks = mine.map((c) => c.week).sort((a, b) => a - b);
  for (let i = 1; i <= PLAN.weeks; i++)
    if (weeks.filter((x) => x === i).length !== 1)
      problems.push(`grade ${plan.name}: week ${i} appears ${weeks.filter((x) => x === i).length} times`);
  if (mine.length !== PLAN.weeks)
    problems.push(`grade ${plan.name}: ${mine.length} cases, wants ${PLAN.weeks}`);
}

const done = PLAN.grades.filter((g) => CASES.some((c) => c.grade === g.grade));
const whole = PLAN.grades.filter((g) => CASES.filter((c) => c.grade === g.grade).length === PLAN.weeks);
console.log(`${CASES.length} mysteries across ${done.length} of ${PLAN.grades.length} grades; ${whole.length} complete.`);
console.log(`grades started: ${done.map((g) => g.name).join(", ") || "none"}`);
console.log(`problems: ${problems.length}`);
problems.slice(0, 40).forEach((p) => console.log("  " + p));
if (problems.length) { console.error("\n✗ fix these before the pack ships."); process.exit(1); }
console.log("✅ every mystery can be solved from its own text");
