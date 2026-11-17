/**
 * Read the served page back out of the database.
 *
 * The seed printing a row count is not evidence that the right bytes landed:
 * it counts what it wrote, not what it wrote. This reads the row a teacher
 * actually gets and checks the things this session changed.
 */
import { db } from "@/lib/db";
import { reading_materials } from "@/lib/db/schema";
import { eq, like } from "drizzle-orm";

const PATH = "science-of-reading/resources.html";
const [row] = await db
  .select()
  .from(reading_materials)
  .where(eq(reading_materials.path, PATH));

if (!row) {
  console.error(`No row at ${PATH}`);
  process.exit(1);
}

const html = String(row.content);
/**
 * The pickers on this page are filled by its own script from D.arG and D.myG,
 * so the grades are not in the markup and checking the markup for them proves
 * nothing. Check the arrays the script reads, and that both selects label a
 * grade through gradeName rather than printing the raw number.
 */
const arG = html.match(/"arG":\s*\[([^\]]*)\]/)?.[1] ?? "";
const myG = html.match(/"myG":\s*\[([^\]]*)\]/)?.[1] ?? "";
const nums = (s: string) => s.split(",").map((x) => Number(x.trim())).filter((n) => !Number.isNaN(n));

const checks: [string, boolean, string][] = [
  ["reading serif loaded", html.includes("Source+Serif+4"), "the Google font link"],
  ["reading serif applied", html.includes("--read:"), "the --read custom property"],
  ["no dashed borders", !/border:[^;]*dashed/.test(html), "every rule solid"],
  ["articles cover K-6", [0, 1, 2, 3, 4, 5, 6].every((g) => nums(arG).includes(g)), `arG = [${arG}]`],
  ["mysteries cover K-6", [0, 1, 2, 3, 4, 5, 6].every((g) => nums(myG).includes(g)), `myG = [${myG}]`],
  ["grades named, not numbered", !html.includes("'Grade ' + g"), "kindergarten reads K, not Grade 0"],
  ["both selects use gradeName", (html.match(/gradeName\(g\)/g) || []).length >= 2, "articles and mysteries"],
];

console.log(`${PATH}`);
console.log(`  bytes in table: ${(Number(row.bytes) / 1024).toFixed(0)} KB`);
console.log(`  content type:   ${row.content_type}`);
console.log("");
let bad = 0;
for (const [name, ok, why] of checks) {
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${name.padEnd(24)} ${why}`);
  if (!ok) bad++;
}

/**
 * The page no longer carries the cases and the articles; it fetches them a
 * grade at a time out of data/ beside it. So the thing to read back is not
 * how many records are embedded -- that should now be none -- but that the
 * per-grade files reached the table, because the page is useless without
 * them and nothing else would notice they were missing.
 */
console.log("");
const embedded = (html.match(/"RI\.\w+\.\d+"/g) || []).length;
if (embedded > 0) {
  console.log(`  FAIL  ${embedded} article records are still inline; the page should fetch them`);
  bad++;
}
const shards = await db
  .select({ path: reading_materials.path, bytes: reading_materials.bytes })
  .from(reading_materials)
  .where(like(reading_materials.path, "science-of-reading/data/%"));
const kb = shards.reduce((a, r) => a + Number(r.bytes), 0) / 1024;
console.log(`  per-grade data files:       ${shards.length} (${kb.toFixed(0)} KB in all)`);
const grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
for (const kind of ["my", "ar"]) {
  const missing = grades.filter(
    (g) => !shards.some((r) => r.path === `science-of-reading/data/${kind}-g${g}.json`),
  );
  const ok = missing.length === 0;
  if (!ok) bad++;
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${kind === "my" ? "mysteries" : "articles"} per grade`.padEnd(32) +
    (ok ? "all 13 grades present" : `missing ${missing.join(", ")}`));
}

process.exit(bad ? 1 : 0);
