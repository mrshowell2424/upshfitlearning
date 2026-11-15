import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import { standards } from "@/lib/db/schema";

/**
 * These write rows into a real database and never take them out again --
 * the afterAll below is an empty comment -- so they are gated behind a
 * connection string named for testing and nothing else.
 *
 * Setting DATABASE_URL does not run them, deliberately. That variable
 * usually points at production, and the rows these insert (TEST.1.1,
 * API.TEST.1, "Test Resource 1") would land in the live tables and stay
 * there. Point TEST_DATABASE_URL at a scratch database to run them.
 */
const TEST_DB = process.env.TEST_DATABASE_URL;
if (TEST_DB) process.env.DATABASE_URL = TEST_DB;
const describeDb = TEST_DB ? describe : describe.skip;

describeDb("Search standards", () => {
  beforeAll(async () => {
    // Ensure test data exists
    await db.insert(standards).values([
      {
        code: "TEST.1.1",
        name: "Test standard one",
        plain_reading: "This is a test standard",
        learning_target: "Test learning target",
        skills: ["Testing", "Assessment"],
      },
    ]).onConflictDoNothing();
  });

  afterAll(async () => {
    // Cleanup would go here if needed
  });

  describe("Standard matching", () => {
    it("finds standards by exact code", async () => {
      const result = await db
        .select()
        .from(standards)
        .where((c) => c.code === "TEST.1.1");

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].code).toBe("TEST.1.1");
    });

    it("handles uppercase code variations", async () => {
      const code = "TEST.1.1".toUpperCase();
      const result = await db
        .select()
        .from(standards)
        .where((c) => c.code === code);

      expect(result.length).toBeGreaterThan(0);
    });
  });
});
