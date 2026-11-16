/**
 * Holds the writing types to their shape, so the page cannot be handed a
 * half-written one.
 *
 * The builder reads this file straight into the lesson: a missing grade is
 * a blank task in front of a class, and a frame with four steps is a
 * workbook that asks for five parts and gives room for four. Neither shows
 * up in a build or a test, so it shows up here.
 *
 *   bun run scripts/check-writing-types.mjs
 */
import { readFileSync } from "node:fs";

const W = JSON.parse(readFileSync("scripts/reading-writing-types.json", "utf8"));
const problems = [];
const fail = (m) => { if (problems.length < 40) problems.push(m); };

const grades = W.grades;
if (grades.length !== 13 || grades[0] !== "K" || grades[12] !== "12") {
  fail(`grades should run K to 12, got ${grades.join(",")}`);
}

// Every grade sits in exactly one band, or a task has no frame to go with it.
const seen = new Map();
for (const [band, gs] of Object.entries(W.bands)) {
  for (const g of gs) {
    if (seen.has(g)) fail(`grade ${g} is in both ${seen.get(g)} and ${band}`);
    seen.set(g, band);
  }
}
for (const g of grades) if (!seen.has(g)) fail(`grade ${g} is in no band`);

const labels = new Set();
const shorts = new Set();
for (const t of W.types) {
  for (const f of ["key", "label", "short", "blurb"]) {
    if (!t[f] || typeof t[f] !== "string") fail(`${t.key || "?"}: ${f} is missing`);
  }
  if (labels.has(t.label)) fail(`two types are called ${t.label}`);
  labels.add(t.label);
  // The short name is what fits on the chip; two the same is two chips a
  // teacher cannot tell apart.
  if (shorts.has(t.short)) fail(`two types are chipped ${t.short}`);
  shorts.add(t.short);
  if (t.short.length > 10) fail(`${t.key}: chip "${t.short}" is too long for the row`);

  for (const band of Object.keys(W.bands)) {
    const f = t.frame[band];
    if (!Array.isArray(f) || f.length !== 5) {
      fail(`${t.key} ${band}: ${f ? f.length : "no"} frame steps, should be 5`);
      continue;
    }
    for (const step of f) {
      if (!step.includes("______")) fail(`${t.key} ${band}: "${step.slice(0, 40)}" has nowhere to write`);
    }
  }

  for (const g of grades) {
    const task = t.tasks[g];
    if (!task) { fail(`${t.key}: no task for grade ${g}`); continue; }
    if (task.length < 25) fail(`${t.key} grade ${g}: task is too short to be an instruction`);
    const bad = (task.match(/\{[A-Z]+\}/g) || []).filter((x) => x !== "{T}" && x !== "{Q}");
    if (bad.length) fail(`${t.key} grade ${g}: unknown placeholder ${bad.join(" ")}`);
  }
}

console.log(`${W.types.length} kinds of writing: ${W.types.map((t) => t.label).join(", ")}.`);
console.log(`${W.types.length * grades.length} tasks, one per grade from K to 12, and ${W.types.length * Object.keys(W.bands).length} frames of five steps.`);
console.log(`\nproblems: ${problems.length}`);
if (problems.length) {
  problems.forEach((p) => console.error(`  ✗ ${p}`));
  process.exit(1);
}
console.log("✅ every type has a task at every grade and a frame in every band");
