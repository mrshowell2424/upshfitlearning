import { describe, it, expect, beforeAll } from "vitest";
import { db } from "@/lib/db";
import { resources, standards } from "@/lib/db/schema";

describe("API Integration Tests", () => {
  beforeAll(async () => {
    // Seed test data
    await db.insert(standards).values([
      {
        code: "API.TEST.1",
        name: "API Test Standard",
        plain_reading: "For testing API endpoints",
        learning_target: "Test API functionality",
        skills: ["Testing"],
      },
    ]).onConflictDoNothing();

    await db.insert(resources).values([
      {
        title: "Test Resource 1",
        link_url: "https://example.com/resource1",
        summary: "A test resource for API testing",
        youtube_id: null,
        thumbnail_url: null,
        duration_minutes: 10,
        skills: ["Testing", "Assessment"],
        grades: ["Grade 5"],
      },
      {
        title: "Test Resource 2",
        link_url: "https://example.com/resource2",
        summary: "Another test resource",
        youtube_id: "testId123",
        thumbnail_url: "https://i.ytimg.com/vi/testId123/maxresdefault.jpg",
        duration_minutes: 15,
        skills: ["Testing"],
        grades: ["Grade 6"],
      },
    ]).onConflictDoNothing();
  });

  describe("Database operations", () => {
    it("retrieves standards from database", async () => {
      const standards_data = await db
        .select()
        .from(standards)
        .where((s) => s.code === "API.TEST.1");

      expect(standards_data.length).toBeGreaterThan(0);
      expect(standards_data[0].code).toBe("API.TEST.1");
      expect(standards_data[0].name).toBe("API Test Standard");
    });

    it("retrieves resources with proper fields", async () => {
      const res = await db
        .select()
        .from(resources)
        .where((r) => r.title === "Test Resource 1");

      expect(res.length).toBeGreaterThan(0);
      expect(res[0].title).toBe("Test Resource 1");
      expect(res[0].skills).toContain("Testing");
      expect(res[0].grades).toContain("Grade 5");
    });

    it("handles YouTube resources correctly", async () => {
      const res = await db
        .select()
        .from(resources)
        .where((r) => r.youtube_id === "testId123");

      expect(res.length).toBeGreaterThan(0);
      expect(res[0].youtube_id).toBe("testId123");
      expect(res[0].thumbnail_url).toContain("i.ytimg.com");
    });

    it("filters resources by skills", async () => {
      const allResources = await db.select().from(resources);
      const testingResources = allResources.filter((r) =>
        r.skills?.includes("Testing")
      );

      expect(testingResources.length).toBeGreaterThan(0);
    });

    it("filters resources by grades", async () => {
      const allResources = await db.select().from(resources);
      const grade5Resources = allResources.filter((r) =>
        r.grades?.includes("Grade 5")
      );

      expect(grade5Resources.length).toBeGreaterThan(0);
    });
  });

  describe("Data integrity", () => {
    it("preserves JSONB fields on insert", async () => {
      const res = await db
        .select()
        .from(resources)
        .where((r) => r.title === "Test Resource 2");

      expect(Array.isArray(res[0].skills)).toBe(true);
      expect(Array.isArray(res[0].grades)).toBe(true);
    });

    it("maintains URL structure", async () => {
      const res = await db
        .select()
        .from(resources)
        .where((r) => r.link_url === "https://example.com/resource1");

      expect(res[0].link_url).toMatch(/^https:\/\//);
    });
  });
});
