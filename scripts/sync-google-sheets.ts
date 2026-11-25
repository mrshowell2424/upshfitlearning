/**
 * Pull the resource rows out of the Google Sheet and into the table.
 *
 * AUTH IS AN API KEY, not a service account. The script was written against
 * google-spreadsheet v3, where auth was a method you called on the document
 * -- doc.useServiceAccountAuth({ client_email, private_key }). v4 takes auth
 * as the second constructor argument and has no such method, so under the
 * installed version this file could not run at all; the type suppression on
 * top of it was hiding a script that threw on its first statement.
 *
 * An API key is the right credential here because the sheet is public --
 * it has to be, since the site reads the same sheet through its CSV export
 * at runtime -- and because a key needs nothing installed, while a service
 * account needs google-auth-library, which google-spreadsheet lists as a peer
 * dependency and this project has never had.
 *
 *   GOOGLE_SHEETS_ID=...  GOOGLE_SHEETS_API_KEY=...  bun run scripts/sync-google-sheets.ts
 */
import { GoogleSpreadsheet } from "google-spreadsheet";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { resources } from "@/lib/db/schema";

const SHEET_ID = process.env.GOOGLE_SHEETS_ID || "";
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY || "";

async function syncGoogleSheets() {
  try {
    if (!SHEET_ID || !API_KEY) {
      console.error("❌ GOOGLE_SHEETS_ID and GOOGLE_SHEETS_API_KEY must both be set");
      process.exit(1);
    }
    const doc = new GoogleSpreadsheet(SHEET_ID, { apiKey: API_KEY });

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
            // excluded, not batch[0]. The set clause runs once per row that
            // conflicts, and naming the first row of the batch wrote its
            // summary, skill, grade band, format and date over whichever of
            // the other nine rows already existed. excluded is the row this
            // statement was trying to insert, which is the one meant.
            .onConflictDoUpdate({
              target: [resources.title, resources.youtube_id],
              set: {
                summary: sql`excluded.summary`,
                skill: sql`excluded.skill`,
                grade_band: sql`excluded.grade_band`,
                format: sql`excluded.format`,
                published_at: sql`excluded.published_at`,
              },
            });
          console.log(`  ${Math.min(i + batchSize, toInsert.length)}/${toInsert.length}`);
        } catch (e) {
          console.error(`Batch ${i}-${i + batchSize} failed:`, (e as Error).message?.substring(0, 100));
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
