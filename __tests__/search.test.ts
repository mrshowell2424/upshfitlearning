import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import { standards } from "@/lib/db/schema";

describe("Search standards", () => {
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
