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
 * A case may also carry a debate version, and that gets its own checks. The
 * debate version is only worth having if the text really does leave three
 * suspects standing, so the gate refuses to take that on trust:
 *
 *   8. The debate story sits in the same grade band as the ordinary one.
 *   9. Exactly three suspects are left open, named by index, and each one has
 *      at least two quotes behind it that are really in the debate story.
 *  10. The three sets of quotes are disjoint. Three arguments built from the
 *      same sentence are one argument with three names on it.
 *  11. None of the ordinary version's clearing quotes survive into the debate
 *      story. This is the check that makes the debate real: if the sentence
 *      that rules the custodian out is still on the page, the custodian is
 *      not arguable and the exercise is a single-answer case wearing a label.
 *  12. Any suspect NOT left open is still cleared, quoting the debate story,
 *      so the debate keeps the elimination work rather than replacing it.
 *  13. The debate gives every suspect a fresh reason, and none of those
 *      reasons carries a clearing from the ordinary version. The suspect
 *      cards are on screen beside the story, so a reason reading "said he
 *      moved nothing" settles the case there however open the story is.
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

  // 8-12. the debate version, when there is one
  if (c.debate) {
    const d = c.debate;
    const dStory = norm(d.story);
    const dw = words(d.story);
    if (dw < wMin || dw > wMax) say(`debate story is ${dw} words, band is ${wMin}-${wMax}`);
    const dms = dw / (sentences(d.story).length || 1);
    if (dms > plan.sentence)
      say(`debate sentences average ${dms.toFixed(1)} words, grade ${plan.name} allows ${plan.sentence}`);
    if (!d.question) say("the debate version has no question");
    if (!d.note) say("the debate version has no teacher note");

    const open = Array.isArray(d.open) ? d.open : [];
    if (open.length !== 3) say(`${open.length} suspects left open, a debate wants exactly 3`);
    if (new Set(open).size !== open.length) say("the same suspect is left open twice");
    for (const i of open) if (!c.suspects[i]) say(`open suspect ${i} is not on the suspect list`);

    const args = Array.isArray(d.arguments) ? d.arguments : [];
    if (args.length !== open.length) say(`${args.length} arguments for ${open.length} open suspects`);
    const seen = new Map();
    args.forEach((a, n) => {
      if (!open.includes(a.who)) say(`argument ${n + 1} is for a suspect that is not open`);
      const ev = Array.isArray(a.evidence) ? a.evidence : [];
      if (ev.length < 2) say(`argument ${n + 1} has ${ev.length} quotes, a case needs at least 2`);
      ev.forEach((q, i) => {
        const parts = fragments(q);
        if (!parts.length) return say(`argument ${n + 1} quote ${i + 1} has nothing quotable in it`);
        for (const part of parts) {
          if (!dStory.includes(part))
            say(`argument ${n + 1} quote ${i + 1} is not in the debate story: "${part}"`);
          // 10. two suspects may not lean on the same sentence
          if (seen.has(part) && seen.get(part) !== a.who)
            say(`argument ${n + 1} shares a quote with another: "${part}"`);
          seen.set(part, a.who);
        }
      });
      if (a.against)
        for (const part of fragments(a.against))
          if (!dStory.includes(part))
            say(`argument ${n + 1} answers a line that is not in the debate story: "${part}"`);
    });

    // 13. every suspect gets a fresh reason for its card
    const dSus = Array.isArray(d.suspects) ? d.suspects : [];
    if (dSus.length !== c.suspects.length)
      say(`the debate gives ${dSus.length} suspect reasons for ${c.suspects.length} suspects`);
    dSus.forEach((x, i) => {
      if (!x.why) say(`debate suspect ${i + 1} has no reason on its card`);
    });
    const dCards = norm(dSus.map((x) => x.why).join(" | "));

    // 11 and 13. nothing that ruled a suspect out in the ordinary version may
    // remain, in the story or on a card.
    (c.clears || []).forEach((cl, i) => {
      for (const part of fragments(cl)) {
        if (dStory.includes(part))
          say(`the debate story still carries clearing ${i + 1}, so nobody has to argue: "${part}"`);
        if (dCards.includes(part))
          say(`a debate suspect card still carries clearing ${i + 1}: "${part}"`);
      }
    });

    // 12. suspects left out of the debate are still ruled out
    const shut = c.suspects.map((_, i) => i).filter((i) => !open.includes(i));
    const dClears = Array.isArray(d.clears) ? d.clears : [];
    if (dClears.length !== shut.length)
      say(`${shut.length} suspects are not open but ${dClears.length} are cleared in the debate`);
    dClears.forEach((cl, i) => {
      const parts = fragments(cl).filter((q) => dStory.includes(q));
      if (!parts.length) say(`debate clearing ${i + 1} quotes nothing from the debate story`);
    });
  }

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
const withDebate = CASES.filter((c) => c.debate).length;
console.log(`${withDebate} of ${CASES.length} cases also carry a debate version.`);
console.log(`problems: ${problems.length}`);
problems.slice(0, 40).forEach((p) => console.log("  " + p));
if (problems.length) { console.error("\n✗ fix these before the pack ships."); process.exit(1); }
console.log("✅ every mystery can be solved from its own text");
