import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { resources, standards } from "@/lib/db/schema";

/**
 * Integration tests against a real database.
 *
 * They are gated behind a connection string named for testing, and nothing
 * else. Setting DATABASE_URL does not run them, deliberately: that variable
 * usually points at production, and these insert rows. Point
 * TEST_DATABASE_URL at a scratch database to run them.
 *
 * This file was written against a `resources` table that does not exist.
 * It inserted `skills` and `grades` as arrays, plus `duration_minutes` and
 * `thumbnail_url`; the real table has `skill` and `grade_band` as single
 * text columns and has neither of the other two. It also filtered with
 * `.where((r) => r.title === "...")`, which is a JavaScript arrow where
 * drizzle wants an SQL expression -- it compares a column object to a
 * string, so it is false every time and filters nothing. None of that was
 * ever going to run. It is written against the real schema below.
 */
const TEST_DB = process.env.TEST_DATABASE_URL;
if (TEST_DB) process.env.DATABASE_URL = TEST_DB;
const describeDb = TEST_DB ? describe : describe.skip;

const STANDARD_CODE = "API.TEST.1";
const RESOURCE_ONE = "Test Resource 1";
const RESOURCE_TWO = "Test Resource 2";

describeDb("API Integration Tests", () => {
  beforeAll(async () => {
    await db
      .insert(standards)
      .values([
        {
          code: STANDARD_CODE,
          name: "API Test Standard",
          plain_reading: "For testing API endpoints",
          learning_target: "Test API functionality",
          skills: ["Testing"],
        },
      ])
      .onConflictDoNothing();

    await db
      .insert(resources)
      .values([
        {
          title: RESOURCE_ONE,
          link_url: "https://example.com/resource1",
          summary: "A test resource for API testing",
          purpose: "Testing",
          youtube_id: null,
          skill: "Testing",
          grade_band: "3-5",
          format: "Link",
          is_free: true,
        },
        {
          title: RESOURCE_TWO,
          link_url: "https://example.com/resource2",
          summary: "Another test resource",
          purpose: "Testing",
          youtube_id: "testId12345",
          skill: "Assessment",
          grade_band: "6-8",
          format: "Video",
          is_free: false,
        },
      ])
      .onConflictDoNothing();
  });

  afterAll(async () => {
    // Put back what this file put in. Leaving these behind is how a test
    // row becomes a permanent row.
    await db.delete(resources).where(eq(resources.title, RESOURCE_ONE));
    await db.delete(resources).where(eq(resources.title, RESOURCE_TWO));
    await db.delete(standards).where(eq(standards.code, STANDARD_CODE));
  });

  describe("Database operations", () => {
    it("retrieves standards from database", async () => {
      const rows = await db
        .select()
        .from(standards)
        .where(eq(standards.code, STANDARD_CODE));

      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0].code).toBe(STANDARD_CODE);
      expect(rows[0].name).toBe("API Test Standard");
    });

    it("retrieves resources with proper fields", async () => {
      const rows = await db
        .select()
        .from(resources)
        .where(eq(resources.title, RESOURCE_ONE));

      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0].title).toBe(RESOURCE_ONE);
      expect(rows[0].skill).toBe("Testing");
      expect(rows[0].grade_band).toBe("3-5");
    });

    it("handles YouTube resources correctly", async () => {
      const rows = await db
        .select()
        .from(resources)
        .where(eq(resources.youtube_id, "testId12345"));

      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0].youtube_id).toBe("testId12345");
      expect(rows[0].format).toBe("Video");
    });

    it("filters resources by skill", async () => {
      const rows = await db
        .select()
        .from(resources)
        .where(eq(resources.skill, "Testing"));

      expect(rows.length).toBeGreaterThan(0);
      expect(rows.every((r) => r.skill === "Testing")).toBe(true);
    });

    it("filters resources by grade band", async () => {
      const rows = await db
        .select()
        .from(resources)
        .where(eq(resources.grade_band, "3-5"));

      expect(rows.length).toBeGreaterThan(0);
      expect(rows.every((r) => r.grade_band === "3-5")).toBe(true);
    });
  });

  describe("Data integrity", () => {
    it("preserves the jsonb array on a standard", async () => {
      const rows = await db
        .select()
        .from(standards)
        .where(eq(standards.code, STANDARD_CODE));

      expect(Array.isArray(rows[0].skills)).toBe(true);
      expect(rows[0].skills).toContain("Testing");
    });

    it("maintains URL structure", async () => {
      const rows = await db
        .select()
        .from(resources)
        .where(eq(resources.link_url, "https://example.com/resource1"));

      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0].link_url).toMatch(/^https:\/\//);
    });

    it("keeps the free flag as a boolean", async () => {
      const rows = await db
        .select()
        .from(resources)
        .where(eq(resources.title, RESOURCE_ONE));

      expect(typeof rows[0].is_free).toBe("boolean");
      expect(rows[0].is_free).toBe(true);
    });
  });
});
