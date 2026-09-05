import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The gate on the Basic Reading workbooks.
 *
 * Supabase verification itself is not re-tested here — entitlement.ts already
 * carries that, and it is the same call the premium route has been making. What
 * is new, and what these cover, is everything around it: that a request with no
 * credential is refused, that the cookie a link navigation carries is found and
 * verified, that a verified request actually receives the file, and that no
 * arrangement of ".." reaches outside the materials directory.
 */

const getUser = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ auth: { getUser } }),
}));
vi.mock("@/lib/db", () => ({ db: {}, withDb: vi.fn() }));

const { GET } = await import("@/app/api/reading/materials/[...path]/route");
const { readingPassFromCookies, READING_PASS } = await import("@/lib/auth/reading-pass");

const signedIn = () => getUser.mockResolvedValue({ data: { user: { id: "u1", email: "t@e.com" } }, error: null });
const signedOut = () => getUser.mockResolvedValue({ data: null, error: { message: "bad token" } });

function req(cookie?: string, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/reading/materials/x", {
    headers: { ...(cookie ? { cookie } : {}), ...headers },
  }) as never;
}

const params = (...path: string[]) => ({ params: Promise.resolve({ path }) });

describe("reading pass cookie", () => {
  it("finds the pass among other cookies", () => {
    expect(readingPassFromCookies(req(`other=1; ${READING_PASS}=abc; more=2`))).toBe("abc");
  });

  it("is absent when no cookie header is sent at all", () => {
    expect(readingPassFromCookies(req())).toBeNull();
  });

  it("does not mistake a different cookie for the pass", () => {
    expect(readingPassFromCookies(req(`not_${READING_PASS}=abc`))).toBeNull();
  });
});

describe("GET /api/reading/materials", () => {
  beforeEach(() => getUser.mockReset());

  it("refuses a request carrying no credential", async () => {
    const res = await GET(req(), params("Workbook L1-S01 i short i.dc.html"));
    expect(res.status).toBe(401);
  });

  it("refuses a pass Supabase does not recognise", async () => {
    signedOut();
    const res = await GET(req(`${READING_PASS}=forged`), params("Workbook L1-S01 i short i.dc.html"));
    expect(res.status).toBe(401);
  });

  it("serves the workbook to a verified pass", async () => {
    signedIn();
    const res = await GET(req(`${READING_PASS}=good`), params("Workbook L1-S01 i short i.dc.html"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    // Not merely a 200 — the actual workbook.
    expect(await res.text()).toContain("i says");
  });

  it("serves the sibling runtime a workbook page asks for", async () => {
    signedIn();
    const res = await GET(req(`${READING_PASS}=good`), params("support.js"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("javascript");
  });

  it("accepts a bearer token as well, for direct callers", async () => {
    signedIn();
    const res = await GET(
      req(undefined, { authorization: "Bearer good" }),
      params("Workbook L1-S01 i short i.dc.html")
    );
    expect(res.status).toBe(200);
  });

  it("never leaves the materials directory", async () => {
    signedIn();
    for (const attempt of [
      ["..", "package.json"],
      ["..", "..", "package.json"],
      ["%2e%2e", "package.json"],
      ["uploads", "..", "..", "package.json"],
    ]) {
      const res = await GET(req(`${READING_PASS}=good`), params(...attempt));
      expect(res.status, attempt.join("/")).toBe(404);
    }
  });

  it("keeps gated files out of shared caches", async () => {
    signedIn();
    const res = await GET(req(`${READING_PASS}=good`), params("Workbook L1-S01 i short i.dc.html"));
    expect(res.headers.get("cache-control")).toContain("private");
  });
});
