// @ts-nocheck
/**
 * Loads the Basic Reading workbooks into Postgres.
 *
 * Production runs on Cloudflare Workers, whose bundle has no filesystem, so
 * the pages cannot be read off disk there. They are served from the
 * reading_materials table instead, and this is what fills it.
 *
 * content-reading-materials/ remains the source of truth. Re-run this after a
 * canvas re-export and after copying the new pages in:
 *
 *   bun --env-file=.env.local run scripts/seed-reading-materials.ts
 *
 * Idempotent — rows upsert on path, and anything no longer on disk is removed
 * so a renamed page does not linger as a row nothing links to.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { reading_materials } from "@/lib/db/schema";
import { inArray, sql } from "drizzle-orm";

const ROOT = path.join(process.cwd(), "content-reading-materials");

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (!entry.name.startsWith(".")) out.push(full);
  }
  return out;
}

const files = await walk(ROOT);
console.log(`📚 ${files.length} files under content-reading-materials/\n`);

const rows = [];
for (const full of files) {
  const rel = path.relative(ROOT, full).split(path.sep).join("/");
  const ext = path.extname(full).toLowerCase();
  const type = TYPES[ext];
  if (!type) {
    console.log(`  – skipped (not a text type): ${rel}`);
    continue;
  }
  const content = await readFile(full, "utf8");
  rows.push({
    path: rel,
    content,
    content_type: type,
    bytes: (await stat(full)).size,
  });
}

// Chunked because a single statement carrying every workbook exceeds what the
// driver will send in one go.
const CHUNK = 25;
let written = 0;
for (let i = 0; i < rows.length; i += CHUNK) {
  const batch = rows.slice(i, i + CHUNK);
  await db
    .insert(reading_materials)
    .values(batch)
    .onConflictDoUpdate({
      target: reading_materials.path,
      set: {
        content: sql`excluded.content`,
        content_type: sql`excluded.content_type`,
        bytes: sql`excluded.bytes`,
        updated_at: new Date(),
      },
    });
  written += batch.length;
  process.stdout.write(`\r  ✓ ${written}/${rows.length}`);
}
console.log();

const keep = rows.map((r) => r.path);
const existing = await db.select({ path: reading_materials.path }).from(reading_materials);
const stale = existing.map((r) => r.path).filter((p) => !keep.includes(p));
if (stale.length) {
  await db.delete(reading_materials).where(inArray(reading_materials.path, stale));
  console.log(`  🧹 removed ${stale.length} rows no longer on disk`);
}

const total = rows.reduce((n, r) => n + r.bytes, 0);
console.log(`\n✅ ${written} materials in the table, ${(total / 1_048_576).toFixed(1)} MB`);
process.exit(0);
