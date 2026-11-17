/**
 * Add authored cases to their grade files.
 *
 * The cases are written in batches and the grade files already hold the ones
 * written before, so this appends rather than replacing: it refuses a case
 * whose id is already there, and keeps each file sorted by id so a later
 * diff is readable.
 *
 *   bun run scripts/add-math-cases.mjs <batch.json>
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const batchPath = process.argv[2];
if (!batchPath) throw new Error("usage: bun run scripts/add-math-cases.mjs <batch.json>");
const batch = JSON.parse(readFileSync(batchPath, "utf8"));

const byGrade = new Map();
for (const c of batch) {
  if (!byGrade.has(c.grade)) byGrade.set(c.grade, []);
  byGrade.get(c.grade).push(c);
}

let added = 0;
for (const [g, cases] of [...byGrade.entries()].sort((a, b) => a[0] - b[0])) {
  const path = `scripts/math-cases/g${g}.json`;
  const have = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : [];
  const ids = new Set(have.map((c) => c.id));
  for (const c of cases) {
    if (ids.has(c.id)) throw new Error(`${path} already holds ${c.id}`);
    if (c.grade !== g) throw new Error(`${c.id} says grade ${c.grade}`);
    have.push(c);
    ids.add(c.id);
    added++;
  }
  have.sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
  writeFileSync(path, JSON.stringify(have, null, 1) + "\n");
  console.log(`g${g}: ${cases.length} added, ${have.length} total`);
}
console.log(`${added} cases added from ${batchPath}`);
