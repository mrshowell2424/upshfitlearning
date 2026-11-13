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
    };
  });
  writeFileSync(`scripts/mysteries/g${n}.json`, JSON.stringify(out, null, 1) + "\n");
  return out;
}
