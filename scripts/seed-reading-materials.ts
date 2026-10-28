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
 * What the canvas exports is not quite what the site should serve.
 *
 * Each rule below is applied to the lesson builder on its way into the table,
 * so content-reading-materials/ stays exactly as the canvas wrote it and a
 * re-export cannot quietly undo any of this.
 *
 * Every rule is required. If one stops matching — because a re-export moved
 * the markup — the seed fails rather than shipping. That matters most for the
 * two it removes on privacy grounds: a silent no-match would put a folder of
 * unshared Drive links, and a list of children's first names, back in front
 * of every teacher on the site.
 */
type Adaptation = { name: string; apply: (html: string) => string };

/** Removes a whole element, counting nested tags, given where it starts. */
function cutElement(html: string, startAt: number, tag: string): string | null {
  const open = new RegExp(`<${tag}\\b`, "gi");
  const close = new RegExp(`</${tag}>`, "gi");
  let depth = 0;
  let i = startAt;
  while (i < html.length) {
    open.lastIndex = i;
    close.lastIndex = i;
    const o = open.exec(html);
    const c = close.exec(html);
    if (!c) return null;
    if (o && o.index < c.index) {
      depth++;
      i = o.index + o[0].length;
    } else {
      depth--;
      i = c.index + c[0].length;
      if (depth === 0) return html.slice(0, startAt) + html.slice(i);
    }
  }
  return null;
}

/** Cuts the element that holds `needle`, from its nearest enclosing `tag`. */
function cutAround(html: string, needle: string, tag: string): string | null {
  const at = html.indexOf(needle);
  if (at === -1) return null;
  const from = html.lastIndexOf(`<${tag}`, at);
  return from === -1 ? null : cutElement(html, from, tag);
}

const ADAPTATIONS: Adaptation[] = [
  {
    // dc-runtime's boot() re-fetches the page and re-parses it as the page's
    // own template, slicing from the first <x-dc> to the last </x-dc>. This
    // export inlines the runtime, so the first match lands inside the
    // runtime's source — in the string "has no <x-dc> block" — and half a
    // megabyte of runtime goes through the template compiler, which rewrites
    // ` rootName =` to ` sc-camel-root-name =` and paints it on screen.
    // Defining __resources skips that re-fetch. Invisible on file://, where
    // the browser blocks the fetch; certain on the site.
    name: "guard the inlined runtime against re-parsing itself",
    apply: (html) => {
      if (!html.includes("GENERATED from dc-runtime")) return html;
      if (/window\.__resources\s*=/.test(html)) return html;
      const head = html.indexOf("<head>");
      if (head === -1) return html;
      return (
        html.slice(0, head + 6) +
        "\n<script>/* skips dc-runtime's self-re-parse when served over HTTP */" +
        "window.__resources = window.__resources || {};</script>\n" +
        html.slice(head + 6)
      );
    },
  },
  {
    // Points at a sibling PLANS page that belongs to the canvas and was never
    // published, so on the site it is a link to a 404.
    name: "remove the Back to Plans button",
    apply: (html) => html.replace(/\s*<a\b[^>]*\bdata-back-plans\b[^>]*>[\s\S]*?<\/a>/gi, ""),
  },
  {
    // The reference folder behind the programme, shared with nobody. A
    // teacher who clicks it meets Google's request-access screen.
    name: "remove the Open Drive folder button",
    apply: (html) => cutAround(html, "Open Drive folder", "a") ?? html,
  },
  {
    // A grid of the same unshared Drive files — a wall of dead ends.
    name: "remove the ALL RESOURCES shelf",
    apply: (html) => {
      const label = ">ALL RESOURCES</div>";
      const at = html.indexOf(label);
      if (at === -1) return html;
      const start = html.lastIndexOf("<div", at);
      const grid = html.indexOf("<div", at + label.length);
      if (start === -1 || grid === -1) return html;
      const withoutGrid = cutElement(html, grid, "div");
      if (withoutGrid === null) return html;
      return cutElement(withoutGrid, start, "div") ?? html;
    },
  },
  {
    name: "remove the grade filter",
    apply: (html) => html.replace(/^[ \t]*OPT\('All grades',.*\r?\n/m, ""),
  },
  {
    // Real children's first names. They have no business on the site, and the
    // filter means nothing to a teacher who does not know them.
    name: "remove the student filter",
    apply: (html) => html.replace(/^[ \t]*OPT\('All students',.*\r?\n/m, ""),
  },
];

function adapt(rel: string, html: string): string {
  if (!html.includes("GENERATED from dc-runtime")) return html;
  let out = html;
  const missed: string[] = [];
  for (const rule of ADAPTATIONS) {
    const next = rule.apply(out);
    if (next === out) missed.push(rule.name);
    out = next;
  }
  if (missed.length) {
    console.error(`\n\u274c ${rel}: these adaptations no longer match the export:`);
    missed.forEach((m) => console.error(`     \u2013 ${m}`));
    console.error("   Nothing was written. Fix the rule in this script, or the export.\n");
    process.exit(1);
  }
  console.log(`  \u2713 adapted ${rel} (${ADAPTATIONS.length} rules)`);
  return out;
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
  const content = ext === ".html" ? adapt(rel, raw) : raw;
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
