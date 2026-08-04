import { describe, it, expect } from "vitest";
import { isPremium, canGenerateLessons, canSaveResources, canAccessPlanner } from "@/lib/auth";

describe("Auth helpers", () => {
  describe("isPremium", () => {
    it("returns true for pro tier", () => {
      expect(isPremium("pro")).toBe(true);
    });

    it("returns true for school tier", () => {
      expect(isPremium("school")).toBe(true);
    });

    it("returns false for free tier", () => {
      expect(isPremium("free")).toBe(false);
    });
  });

  describe("canGenerateLessons", () => {
    it("allows pro users to generate lessons", () => {
      expect(canGenerateLessons("pro")).toBe(true);
    });

    it("allows school users to generate lessons", () => {
      expect(canGenerateLessons("school")).toBe(true);
    });

    it("prevents free users from generating lessons", () => {
      expect(canGenerateLessons("free")).toBe(false);
    });
  });

  describe("canSaveResources", () => {
    it("allows pro users to save resources", () => {
      expect(canSaveResources("pro")).toBe(true);
    });

    it("prevents free users from saving resources", () => {
      expect(canSaveResources("free")).toBe(false);
    });
  });

  describe("canAccessPlanner", () => {
    it("allows pro users to access planner", () => {
      expect(canAccessPlanner("pro")).toBe(true);
    });

    it("prevents free users from accessing planner", () => {
      expect(canAccessPlanner("free")).toBe(false);
    });
  });
});
