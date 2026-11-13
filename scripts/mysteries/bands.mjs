/** Quick per-grade band read while a mystery pack is being written. */
import { readFileSync } from "node:fs";
const n = Number(process.argv[2]);
const PLAN = JSON.parse(readFileSync("scripts/reading-mystery-plan.json", "utf8"));
const plan = PLAN.grades.find((g) => g.grade === n);
const cases = JSON.parse(readFileSync(`scripts/mysteries/g${n}.json`, "utf8"));
const w = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;
const norm = (s) => String(s).replace(/[‘’]/g, "'").replace(/[“”"]/g, "")
  .replace(/\s+/g, " ").trim().toLowerCase();
const fragments = (q) => {
  const spans = [...String(q).matchAll(/[“"]([^”"]+)[”"]/g)].map((m) => m[1]);
  return (spans.length ? spans : [String(q)]).flatMap((x) => x.split(/…|\.\.\./))
    .map(norm).filter((x) => x.length > 3);
};
let bad = 0;
for (const c of cases) {
  const f = [];
  const n1 = w(c.story);
  const [lo, hi] = plan.words;
  if (n1 < lo || n1 > hi) f.push(`${n1}w outside ${lo}-${hi}`);
  const ms = n1 / (String(c.story).split(/[.!?]+(?:\s|$)/).filter((x) => x.trim().length > 1).length || 1);
  if (ms > plan.sentence) f.push(`${ms.toFixed(1)} w/sent over ${plan.sentence}`);
  const ns = c.suspects.length;
  if (ns < plan.suspects[0] || ns > plan.suspects[1]) f.push(`${ns} suspects`);
  if (c.proof.length < plan.proof) f.push(`${c.proof.length} proof`);
  const story = norm(c.story);
  c.proof.forEach((p, i) => { for (const x of fragments(p)) if (!story.includes(x)) f.push(`proof ${i + 1} not in story`); });
  c.clears.forEach((cl, i) => { if (!fragments(cl).some((x) => story.includes(x))) f.push(`clear ${i + 1} unquoted`); });
  if (c.clears.length < 1 || c.clears.length > ns - 1) f.push(`${c.clears.length} clears`);
  const ans = norm(c.answer).split(/[^a-z']+/).filter((x) => x.length >= 4);
  if (ans.length && !ans.some((x) => story.includes(x))) f.push("answer ungrounded");
  console.log(`w${String(c.week).padStart(2)} ${String(n1).padStart(3)}w ${ms.toFixed(0).padStart(2)}sp  ${c.title}${f.length ? "  ⟵ " + f.join("; ") : ""}`);
  if (f.length) bad++;
}
console.log(`\n${cases.length} cases, ${bad} with problems`);
