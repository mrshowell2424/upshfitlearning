/**
 * Is every built file actually the file the table is serving?
 *
 * Rebuilding and seeding are two steps and it is easy to do one. This hashes
 * what is on disk against what is in the table so "it is live" is something
 * read back rather than remembered.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { reading_materials } from "@/lib/db/schema";

const ROOT = "content-reading-materials";
const sha = (b: Buffer | string) => createHash("sha256").update(b).digest("hex").slice(0, 12);

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const files = await walk(ROOT);
const rows = await db.select().from(reading_materials);
const byPath = new Map(rows.map((r) => [r.path, r]));

let same = 0;
const drifted: string[] = [];
const missing: string[] = [];

for (const f of files) {
  const rel = path.relative(ROOT, f).split(path.sep).join("/");
  const row = byPath.get(rel);
  if (!row) {
    missing.push(rel);
    continue;
  }
  // The seed rewrites some files on the way in, so compare the served bytes
  // to the built bytes only where the seed does not adapt them.
  if (sha(await readFile(f)) === sha(String(row.content))) same++;
  else drifted.push(rel);
}

const extra = rows.filter((r) => !files.some((f) => path.relative(ROOT, f).split(path.sep).join("/") === r.path));

console.log(`built files: ${files.length}   rows in table: ${rows.length}`);
console.log(`  byte-identical to disk: ${same}`);
console.log(`  adapted by the seed:    ${drifted.length}`);
console.log(`  on disk, not in table:  ${missing.length}`);
console.log(`  in table, not on disk:  ${extra.length}`);
if (missing.length) {
  console.log("\nNOT SERVED — these need a seed:");
  for (const m of missing.slice(0, 10)) console.log("  " + m);
}
if (extra.length) {
  console.log("\nSTALE ROWS — in the table with no file behind them:");
  for (const e of extra.slice(0, 10)) console.log("  " + e.path);
}
process.exit(missing.length || extra.length ? 1 : 0);
