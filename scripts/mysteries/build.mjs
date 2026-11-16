/**
 * Expand a compact grade source into the shape the original thirty-six cases
 * use, so a mystery pack reads identically whatever grade it was written for.
 *
 * A case carries a lot that can be derived: the id, the week number, and the
 * emoji tag that goes with its setting. Writing those by hand thirty-six
 * times a grade across thirteen grades is where a week quietly goes missing.
 *
 *   import { gradeMysteries } from "./build.mjs"
 *   gradeMysteries(6, [ { t, tag, story, q, s: [...], who, proof, clears, explain } ])
 *
 * s is the suspect list, each { who, why }. who is the index of the culprit,
 * so the clears can be checked against everybody else. proof and clears are
 * quotes from the story and the gate holds them to it.
 *
 * A case may also carry d, the debate version of the same case. The ordinary
 * version has one answer and rules the rest out. The debate version tells the
 * same story with the deciding line withheld and the clearings replaced by
 * evidence that cuts both ways, so that three of the suspects can each be
 * argued for from the text and none of them can be argued for without it.
 *
 *   d: { story, q, why: [...], open: [0, 2, 3],
 *        for: [ { who, ev: [...], but }, ... ], clears: [...], note }
 *
 * why gives each suspect a fresh one-line reason, one per suspect in order.
 * The ordinary version's reasons cannot be reused, because several of them
 * are the clearing: the custodian's reason is "said he moved nothing", and
 * printing that on a card in the debate version rules him out before the
 * child has read a word. The gate checks these the same way it checks the
 * story.
 *
 * open names the three suspects left in play, by index into s. Each entry in
 * for carries the quotes that back that suspect and, where there is one, the
 * line a reader has to answer. Any suspect NOT in open is still ruled out,
 * and clears holds those quotes, so the debate keeps the elimination work and
 * adds the argument on top of it. The gate checks all of it against d.story.
 */
import { readFileSync, writeFileSync } from "node:fs";

const PLAN = JSON.parse(readFileSync("scripts/reading-mystery-plan.json", "utf8"));

export function gradeMysteries(n, cases) {
  const plan = PLAN.grades.find((g) => g.grade === n);
  if (!plan) throw new Error(`no plan for grade ${n}`);
  // A grade is written a few weeks at a time, so a short file is expected
  // while it is in progress. The merge keeps it out of the store and the gate
  // is what refuses to ship it, which is why this only says so.
  if (cases.length !== PLAN.weeks)
    console.warn(`  grade ${plan.name}: ${cases.length} of ${PLAN.weeks} weeks so far`);
  const out = cases.map((c, i) => {
    if (typeof c.who !== "number" || !c.s[c.who])
      throw new Error(`${c.t}: who must index into the suspect list`);
    return {
      id: `g${plan.name}-w${i + 1}`,
      grade: n,
      week: i + 1,
      tag: c.tag,
      title: c.t,
      story: String(c.story).trim(),
      question: c.q,
      suspects: c.s.map((x) => ({ who: x.who, why: x.why })),
      answer: c.answer || `${c.s[c.who].who.replace(/^\S+\s/, "")} did it.`,
      proof: c.proof,
      clears: c.clears,
      explain: c.explain,
      ...(c.d
        ? {
            debate: {
              story: String(c.d.story).trim(),
              question: c.d.q,
              suspects: c.d.why.map((w, j) => ({ who: c.s[j].who, why: w })),
              open: c.d.open,
              arguments: c.d.for.map((a) => ({
                who: a.who,
                evidence: a.ev,
                ...(a.but ? { against: a.but } : {}),
              })),
              clears: c.d.clears || [],
              note: c.d.note,
            },
          }
        : {}),
    };
  });
  writeFileSync(`scripts/mysteries/g${n}.json`, JSON.stringify(out, null, 1) + "\n");
  return out;
}
