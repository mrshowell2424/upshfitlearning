/**
 * Read the served page back out of the database.
 *
 * The seed printing a row count is not evidence that the right bytes landed:
 * it counts what it wrote, not what it wrote. This reads the row a teacher
 * actually gets and checks the things this session changed.
 */
import { db } from "@/lib/db";
import { reading_materials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
  ["mysteries cover K-5", [0, 1, 2, 3, 4, 5].every((g) => nums(myG).includes(g)), `myG = [${myG}]`],
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

// The counts the page itself carries, read back rather than assumed.
console.log("");
const articleRows = (html.match(/"RI\.\w+\.\d+"/g) || []).length;
console.log(`  article records embedded:   ${articleRows}`);

process.exit(bad ? 1 : 0);
