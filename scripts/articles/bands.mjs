/** Quick per-grade band read while a grade is being written. */
import { readFileSync } from "node:fs";
const n = Number(process.argv[2]);
const PLAN = JSON.parse(readFileSync("scripts/reading-article-plan.json", "utf8"));
const plan = PLAN.grades.find((g) => g.grade === n);
const arts = JSON.parse(readFileSync(`scripts/articles/g${n}.json`, "utf8"));
const w = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;
const mean = (ps) => { const t = ps.map((p) => p.text).join(" ");
  const s = t.split(/[.!?]+(?:\s|$)/).filter((x) => x.trim().length > 1).length || 1;
  return w(t) / s; };
let bad = 0;
for (const a of arts) {
  const hw = w(a.higher.paras.map((p) => p.text).join(" "));
  const lw = w(a.lower.paras.map((p) => p.text).join(" "));
  const hm = mean(a.higher.paras), lm = mean(a.lower.paras);
  const flags = [];
  const [hMin, hMax] = plan.higher.words, [lMin, lMax] = plan.lower.words;
  if (hw < hMin || hw > hMax) flags.push(`higher ${hw}w outside ${hMin}-${hMax}`);
  if (lw < lMin || lw > lMax) flags.push(`lower ${lw}w outside ${lMin}-${lMax}`);
  if (lw >= hw) flags.push("lower not shorter");
  if (lm >= hm) flags.push(`lower sentences ${lm.toFixed(1)} vs ${hm.toFixed(1)}`);
  if (a.higher.paras.length !== a.lower.paras.length) flags.push("paragraph count differs");
  const [pMin, pMax] = plan.paras;
  if (a.higher.paras.length < pMin || a.higher.paras.length > pMax) flags.push(`${a.higher.paras.length} paragraphs`);
  const kinds = a.questions.map((q) => q.kind);
  for (const k of PLAN.questionKinds) if (!kinds.includes(k)) flags.push(`no ${k}`);
  const body = a.higher.paras.map((p) => p.text).join(" ").toLowerCase();
  a.questions.forEach((q) => {
    if (!q.a || q.kind === "vocabulary") return;
    const c = String(q.a).toLowerCase().split(/[^a-z']+/).filter((x) => x.length >= 4);
    if (c.length && !c.some((x) => body.includes(x))) flags.push(`answer ${q.n} ungrounded`);
  });
  const hiL = a.higher.paras.map((p) => p.label).join("");
  const focus = a.questions.find((q) => q.kind === "paragraph focus");
  if (focus) for (const m of String(focus.q).matchAll(/\bparagraph\s+([A-Z])\b/gi))
    if (!hiL.includes(m[1].toUpperCase())) flags.push(`focus names ${m[1]}`);
  console.log(`${a.standard} #${a.n} ${String(hw).padStart(3)}/${String(lw).padStart(3)}w  ${hm.toFixed(0)}/${lm.toFixed(0)}spw  ${a.title}${flags.length ? "  ⟵ " + flags.join("; ") : ""}`);
  if (flags.length) bad++;
}
console.log(`\n${arts.length} articles, ${bad} with problems`);
