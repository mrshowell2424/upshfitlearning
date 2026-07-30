import { readFileSync } from "fs";
import { resolve } from "path";
import Papa from "papaparse";
import { db } from "@/lib/db";
import { resources, articles } from "@/lib/db/schema";

// Skill inference regex patterns (from design/resources.js)
const skillPatterns = [
  { skill: "Textual Evidence", regex: /text evidence|citing text|quote|textual/i },
  { skill: "Inference", regex: /infer|inference|read between|implied/i },
  { skill: "Main Idea", regex: /main idea|central idea|summarize|summary/i },
  { skill: "Character", regex: /character|characterization/i },
  { skill: "Setting", regex: /setting|environment/i },
  { skill: "Theme", regex: /theme|moral|lesson/i },
  { skill: "Plot", regex: /plot|conflict|resolution/i },
  { skill: "Point of View", regex: /point of view|POV|perspective/i },
  { skill: "Vocabulary", regex: /vocab|word study|morphology|etymology/i },
  { skill: "Phonics", regex: /phonics|decoding|sound/i },
  { skill: "Fluency", regex: /fluency|reading rate|prosody/i },
  { skill: "Comprehension", regex: /comprehension|understand|literal/i },
  { skill: "Writing", regex: /writing|compose|draft|revise/i },
  { skill: "Grammar", regex: /grammar|syntax|sentence structure/i },
  { skill: "Spelling", regex: /spelling|spell/i },
  { skill: "Punctuation", regex: /punctuation|punctuate/i },
  { skill: "Belonging", regex: /belonging|community|inclusion/i },
  { skill: "Routines", regex: /routines|procedures|expectations/i },
  { skill: "Classroom Management", regex: /behavior|management|conduct/i },
  { skill: "SEL", regex: /SEL|social.*emotional|emotions|feelings/i },
  { skill: "Retrieval Practice", regex: /retrieval|review|quiz|recall/i },
  { skill: "Dual Coding", regex: /visual|image|diagram|graphic|represent/i },
  { skill: "Elaboration", regex: /elaborat|explain|expand|detail/i },
  { skill: "Interleaving", regex: /interleave|mix|variety/i },
  { skill: "Spaced Practice", regex: /spaced|distributed|space.*practice/i },
];

const gradeBandPatterns = [
  { band: "K-5", regex: /kindergarten|K|grade k|grade 1|grade 2|grade 3|grade 4|grade 5/i },
  { band: "K-8", regex: /K-8|all grades|any grade/i },
  { band: "2-6", regex: /grade 2|grade 3|grade 4|grade 5|grade 6.*2/i },
  { band: "3-8", regex: /grade 3|grade 4|grade 5|grade 6|grade 7|grade 8|upper/i },
  { band: "5-8", regex: /grade 5|grade 6|grade 7|grade 8|middle/i },
];

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function cleanSummary(text: string): string {
  if (!text) return "";
  // Remove URLs
  text = text.replace(/https?:\/\/[^\s]+/g, "");
  // Remove hashtags
  text = text.replace(/#\w+/g, "");
  // Remove emoji
  text = text.replace(/[\p{Emoji}]/gu, "");
  // Trim to first sentence, 30-150 chars
  const sentences = text.split(/[.!?]+/);
  let result = "";
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;
    if ((result + trimmed).length > 150) break;
    result = result ? `${result} ${trimmed}` : trimmed;
  }
  return result.length < 30 ? text.substring(0, 150).trim() : result;
}

function inferSkill(title: string, summary: string): { skill: string; inferred: boolean } {
  const combined = `${title} ${summary}`.toLowerCase();
  for (const { skill, regex } of skillPatterns) {
    if (regex.test(combined)) {
      return { skill, inferred: true };
    }
  }
  return { skill: "General", inferred: true };
}

function inferGradeBand(
  title: string,
  purpose: string,
  summary: string
): { band: string; inferred: boolean } {
  const combined = `${title} ${purpose} ${summary}`.toLowerCase();
  for (const { band, regex } of gradeBandPatterns) {
    if (regex.test(combined)) {
      return { band, inferred: true };
    }
  }
  return { band: "3-8", inferred: true };
}

function getFormat(url: string): string {
  if (!url) return "Link";
  if (url.includes("docs.google.com/presentation")) return "Slides";
  if (url.includes("docs.google.com/document")) return "Doc";
  if (url.includes("docs.google.com/spreadsheets")) return "Sheet";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "Video";
  if (url.includes("google.com/sites")) return "Guide";
  return "Link";
}

async function seedResources() {
  console.log("📊 Reading resources CSV...");
  const csvPath = resolve("design_handoff_upshift_hub/data/Howell Resources - Resources.csv");
  const csvContent = readFileSync(csvPath, "utf-8");

  const results = Papa.parse(csvContent, {
    header: false,
    dynamicTyping: false,
    skipEmptyLines: true,
  });

  const rows = results.data as string[][];
  const seen = new Set<string>();
  const toInsert: typeof resources.$inferInsert[] = [];

  console.log(`📝 Processing ${rows.length} rows...`);

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 7) continue;

    const title = row[2]?.trim();
    const purpose = row[3]?.trim();
    const url = row[5]?.trim();
    const summary_raw = row[6]?.trim();

    // Skip if no title
    if (!title) continue;

    // Extract YouTube ID
    const youtube_id = extractYoutubeId(url);

    // Skip if no YouTube ID (we're prioritizing video resources)
    if (!youtube_id) continue;

    // Dedup on lower(title) + youtube_id
    const dedup_key = `${title.toLowerCase()}|${youtube_id}`;
    if (seen.has(dedup_key)) continue;
    seen.add(dedup_key);

    const summary = cleanSummary(summary_raw);
    const { skill, inferred: skill_inferred } = inferSkill(title, summary);
    const { band: grade_band, inferred: grade_inferred } = inferGradeBand(title, purpose, summary);
    const format = getFormat(url);

    // Parse date (col 1, M/D/YY format)
    const date_str = row[1]?.trim();
    let published_at: Date | null = null;
    if (date_str && date_str.match(/^\d{1,2}\/\d{1,2}\/\d{2}$/)) {
      const [m, d, y] = date_str.split("/").map(Number);
      published_at = new Date(2000 + y, m - 1, d);
    }

    toInsert.push({
      title,
      purpose,
      youtube_id,
      link_url: url,
      summary,
      skill,
      skill_is_inferred: skill_inferred,
      grade_band,
      grade_band_is_inferred: grade_inferred,
      format,
      published_at: published_at,
      is_free: false, // Will update manually
    });
  }

  console.log(`✨ Inserting ${toInsert.length} resources...`);
  if (toInsert.length > 0) {
    await db.insert(resources).values(toInsert);
  }

  const count = (await db.select().from(resources)).length;
  console.log(`✅ Resources: ${count} rows`);

  // Quick validation: show 5 newest
  const newest = (await db.select().from(resources).orderBy().limit(5)) as any[];
  console.log("📌 Sample (5 newest):");
  newest.forEach((r: any) => {
    console.log(
      `  - "${r.title}" (${r.skill}, ${r.grade_band}) [inferred: skill=${r.skill_is_inferred}, grade=${r.grade_band_is_inferred}]`
    );
  });
}

async function seedArticles() {
  console.log("📰 Reading articles CSV...");
  const csvPath = resolve(
    "design_handoff_upshift_hub/data/Howell Resources - Substack.csv"
  );
  const csvContent = readFileSync(csvPath, "utf-8");

  const results = Papa.parse(csvContent, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true,
  });

  const rows = results.data as any[];
  const toInsert: typeof articles.$inferInsert[] = [];

  console.log(`📝 Processing ${rows.length} articles...`);

  for (const row of rows) {
    const title = row.title?.trim();
    const slug = row.slug?.trim();
    const category = row.category?.trim();
    const date_str = row.date?.trim();

    if (!title || !slug) continue;

    let published_at: Date | null = null;
    if (date_str && date_str.match(/^\d{4}-\d{2}-\d{2}$/)) {
      published_at = new Date(date_str);
    }

    toInsert.push({
      title,
      slug,
      category,
      published_at,
      is_featured: false,
      cover_image: null,
    });
  }

  console.log(`✨ Inserting ${toInsert.length} articles...`);
  if (toInsert.length > 0) {
    await db.insert(articles).values(toInsert);
  }

  const count = (await db.select().from(articles)).length;
  console.log(`✅ Articles: ${count} rows`);
}

async function main() {
  try {
    console.log("🚀 Seeding database...\n");
    await seedResources();
    console.log();
    await seedArticles();
    console.log("\n✨ Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
