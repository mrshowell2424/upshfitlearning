// @ts-nocheck
import { GoogleSpreadsheet } from "google-spreadsheet";
import { db } from "@/lib/db";
import { resources } from "@/lib/db/schema";

// Initialize Google Sheets API
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID || "");

async function syncGoogleSheets() {
  try {
    // Authenticate with service account
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, "\n") || "",
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    console.log(`📊 Found ${rows.length} rows in Google Sheet`);

    const toInsert = [];
    const seen = new Set<string>();

    for (const row of rows) {
      const title = row.get("Title")?.trim();
      const youtubeUrl = row.get("YouTube URL")?.trim();
      const linkUrl = row.get("Link URL")?.trim();
      const summary = row.get("Summary")?.trim();
      const purpose = row.get("Purpose")?.trim();
      const grade = row.get("Grade Band")?.trim();
      const skill = row.get("Skill")?.trim();
      const format = row.get("Format")?.trim();
      const publishedAt = row.get("Published")?.trim();

      if (!title || !youtubeUrl) continue;

      // Extract YouTube ID
      const youtubeId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
      if (!youtubeId) continue;

      // Dedup
      const key = `${title.toLowerCase()}|${youtubeId}`;
      if (seen.has(key)) continue;
      seen.add(key);

      // Parse date
      let publishedDate = null;
      if (publishedAt && publishedAt.match(/^\d{1,2}\/\d{1,2}\/\d{2,4}$/)) {
        const [m, d, y] = publishedAt.split("/").map(Number);
        const year = y > 100 ? y : 2000 + y;
        publishedDate = new Date(year, m - 1, d).toISOString().split("T")[0];
      }

      toInsert.push({
        title,
        purpose: purpose || "Unknown",
        youtube_id: youtubeId,
        link_url: linkUrl || null,
        summary: summary || "",
        skill: skill || "General",
        skill_is_inferred: false,
        grade_band: grade || "3-8",
        grade_band_is_inferred: false,
        format: format || "Video",
        published_at: publishedDate,
        is_free: true, // Google Sheets resources are free
      });
    }

    console.log(`✨ Upserting ${toInsert.length} resources...`);

    if (toInsert.length > 0) {
      const batchSize = 10;
      for (let i = 0; i < toInsert.length; i += batchSize) {
        const batch = toInsert.slice(i, i + batchSize);
        try {
          await db
            .insert(resources)
            .values(batch)
            .onConflictDoUpdate({
              target: [resources.title, resources.youtube_id],
              set: {
                summary: batch[0].summary,
                skill: batch[0].skill,
                grade_band: batch[0].grade_band,
                format: batch[0].format,
                published_at: batch[0].published_at,
              },
            });
          console.log(`  ${Math.min(i + batchSize, toInsert.length)}/${toInsert.length}`);
        } catch (e) {
          console.error(`Batch ${i}-${i + batchSize} failed:`, (e as any).message?.substring(0, 100));
        }
      }
    }

    const count = (await db.select().from(resources)).length;
    console.log(`✅ Resources: ${count} total rows`);
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
}

syncGoogleSheets();
