// @ts-nocheck
/**
 * Shared seeding logic for drafted standard batches.
 *
 * Each batch script supplies only data; this handles the writes. Seeding is
 * idempotent so a batch can be re-run after edits: standards upsert on their
 * unique code, and unpacks and blueprints are cleared for the batch's codes
 * before reinsert (neither table has a unique constraint on standard_code, so
 * a plain insert would pile up duplicates).
 */
import { db } from "@/lib/db";
import { standards, standard_unpacks, lesson_blueprints } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

export async function seedStandardsBatch({ label, standardsData, unpacksData, blueprintsData }) {
  const codes = standardsData.map((s) => s.code);

  // A batch with a missing or mismatched unpack/blueprint would seed a standard
  // that renders as "not written up yet" — louder to fail here than in the UI.
  const unpackCodes = unpacksData.map((u) => u.standard_code);
  const blueprintCodes = blueprintsData.map((b) => b.standard_code);
  for (const [name, list] of [["unpacks", unpackCodes], ["blueprints", blueprintCodes]]) {
    const missing = codes.filter((c) => !list.includes(c));
    const orphaned = list.filter((c) => !codes.includes(c));
    if (missing.length || orphaned.length) {
      throw new Error(
        `${name} do not line up with standards — missing: [${missing}], orphaned: [${orphaned}]`
      );
    }
  }

  console.log(`🚀 ${label}: ${codes.length} standards\n`);

  console.log("📚 Standards");
  for (const standard of standardsData) {
    try {
      await db
        .insert(standards)
        .values(standard)
        .onConflictDoUpdate({
          target: standards.code,
          set: {
            name: standard.name,
            plain_reading: standard.plain_reading,
            learning_target: standard.learning_target,
            skills: standard.skills,
            science_tags: standard.science_tags,
            match_keys: standard.match_keys,
          },
        });
      console.log(`  ✓ ${standard.code}`);
    } catch (e) {
      console.log(`  ✗ ${standard.code}: ${(e as any).message?.substring(0, 120)}`);
    }
  }

  console.log("\n📖 Unpacks");
  await db.delete(standard_unpacks).where(inArray(standard_unpacks.standard_code, codes));
  for (const unpack of unpacksData) {
    try {
      await db.insert(standard_unpacks).values(unpack);
      console.log(`  ✓ ${unpack.standard_code}`);
    } catch (e) {
      console.log(`  ✗ ${unpack.standard_code}: ${(e as any).message?.substring(0, 120)}`);
    }
  }

  console.log("\n🎨 Blueprints");
  await db.delete(lesson_blueprints).where(inArray(lesson_blueprints.standard_code, codes));
  for (const blueprint of blueprintsData) {
    try {
      await db.insert(lesson_blueprints).values(blueprint);
      console.log(`  ✓ ${blueprint.standard_code}`);
    } catch (e) {
      console.log(`  ✗ ${blueprint.standard_code}: ${(e as any).message?.substring(0, 120)}`);
    }
  }

  console.log(`\n✨ ${label} complete`);

  // postgres-js holds its pool open, so the process never exits on its own.
  process.exit(0);
}
