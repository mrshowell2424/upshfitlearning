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
import { readdir, readFile } from "node:fs/promises";
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

/**
 * Stops a canvas page re-parsing itself once it is served over HTTP.
 *
 * dc-runtime's boot() does `if (!window.__resources) fetch(location.href)` and
 * re-parses the response as the page's template — a fallback for when the HTML
 * parser has mangled the markup. parseDcText() takes everything between the
 * first `<x-dc>` and the last `</x-dc>`, and in an export that inlines the
 * runtime the first match lands inside the runtime's own source, in the error
 * string `has no <x-dc> block`. So the whole runtime gets compiled as template:
 * the compiler's encodeCamelAttrs() rewrites ` rootName =` to
 * ` sc-camel-root-name =`, and the page renders its own source as text.
 *
 * It never bites on file:// because the browser blocks that fetch. It bites
 * every time on the site. Defining __resources skips the re-fetch; an empty
 * object is what a bundled export carries, and every other reader of it falls
 * back to the plain URL on a miss.
 *
 * Applied here rather than on disk so content-reading-materials/ stays the
 * untouched canvas export and a re-export cannot quietly reintroduce this.
 */
const RESOURCES_GUARD =
  "<script>/* skips dc-runtime's self-re-parse when served over HTTP */" +
  "window.__resources = window.__resources || {};</script>\n";

function guardInlinedRuntime(rel: string, html: string): string {
  if (!html.includes("GENERATED from dc-runtime")) return html;
  if (/window\.__resources\s*=/.test(html)) return html;
  const head = html.indexOf("<head>");
  if (head === -1) {
    console.log(`  ! ${rel} inlines the runtime but has no <head> to guard`);
    return html;
  }
  console.log(`  🛡 guarded ${rel}`);
  return html.slice(0, head + 6) + "\n" + RESOURCES_GUARD + html.slice(head + 6);
}

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
  const raw = await readFile(full, "utf8");
  const content = ext === ".html" ? guardInlinedRuntime(rel, raw) : raw;
  rows.push({
    path: rel,
    content,
    content_type: type,
    bytes: Buffer.byteLength(content, "utf8"),
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
