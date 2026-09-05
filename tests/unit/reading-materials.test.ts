import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The gate on the Basic Reading workbooks.
 *
 * Supabase verification is not re-tested here — entitlement.ts carries that,
 * and it is the same call the premium route makes. What these cover is
 * everything around it: that a request with no credential is refused, that the
 * cookie a link navigation carries is found, that a verified request receives
 * the page, and that a database failure is not reported as a missing workbook.
 *
 * That last one is the case that cost real time: the route used to read from
 * disk and swallow every failure as a 404, so on Cloudflare Workers — which
 * have no filesystem — every workbook came back "Not found" while passing
 * locally. A lookup that fails now says so.
 */

const getUser = vi.fn();
const limit = vi.fn();

vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ auth: { getUser } }) }));
vi.mock("@/lib/db", () => ({
  db: { select: () => ({ from: () => ({ where: () => ({ limit }) }) }) },
  withDb: vi.fn(),
}));

const { GET } = await import("@/app/api/reading/materials/[...path]/route");
const { readingPassFromCookies, READING_PASS } = await import("@/lib/auth/reading-pass");

const signedIn = () =>
  getUser.mockResolvedValue({ data: { user: { id: "u1", email: "t@e.com" } }, error: null });

function req(cookie?: string, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/reading/materials/x", {
    headers: { ...(cookie ? { cookie } : {}), ...headers },
  }) as never;
}
const params = (...path: string[]) => ({ params: Promise.resolve({ path }) });
const WB = "Workbook L1-S01 i short i.dc.html";

const page = {
  path: WB,
  content: "<!DOCTYPE html><p>i says</p>",
  content_type: "text/html; charset=utf-8",
  bytes: 28,
};

describe("reading pass cookie", () => {
  it("finds the pass among other cookies", () => {
    expect(readingPassFromCookies(req(`a=1; ${READING_PASS}=abc; b=2`))).toBe("abc");
  });

  it("is null when no cookie header is sent", () => {
    expect(readingPassFromCookies(req())).toBeNull();
  });

  it("does not match a lookalike cookie name", () => {
    expect(readingPassFromCookies(req(`not_${READING_PASS}=abc`))).toBeNull();
  });
});

describe("GET /api/reading/materials", () => {
  beforeEach(() => {
    getUser.mockReset();
    limit.mockReset();
  });

  it("refuses a request carrying no credential", async () => {
    expect((await GET(req(), params(WB))).status).toBe(401);
  });

  it("refuses a pass Supabase does not recognise", async () => {
    getUser.mockResolvedValue({ data: null, error: { message: "bad token" } });
    expect((await GET(req(`${READING_PASS}=forged`), params(WB))).status).toBe(401);
  });

  it("does not reach the database before checking the credential", async () => {
    await GET(req(), params(WB));
    expect(limit).not.toHaveBeenCalled();
  });

  it("serves the workbook to a verified pass", async () => {
    signedIn();
    limit.mockResolvedValue([page]);
    const res = await GET(req(`${READING_PASS}=good`), params(WB));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(await res.text()).toContain("i says");
  });

  it("accepts a bearer token as well, for direct callers", async () => {
    signedIn();
    limit.mockResolvedValue([page]);
    const res = await GET(req(undefined, { authorization: "Bearer good" }), params(WB));
    expect(res.status).toBe(200);
  });

  it("rebuilds the path from its segments", async () => {
    signedIn();
    limit.mockResolvedValue([{ ...page, content: "runtime" }]);
    const res = await GET(
      req(`${READING_PASS}=good`),
      params("uploads", "Short vowels teaching roadmap", "support.js")
    );
    expect(res.status).toBe(200);
  });

  it("404s only when the workbook genuinely is not there", async () => {
    signedIn();
    limit.mockResolvedValue([]);
    expect((await GET(req(`${READING_PASS}=good`), params("nope.dc.html"))).status).toBe(404);
  });

  it("reports a database failure as unavailable, not as not-found", async () => {
    signedIn();
    limit.mockRejectedValue(new Error("connection refused"));
    const res = await GET(req(`${READING_PASS}=good`), params(WB));
    expect(res.status).toBe(503);
    expect(await res.text()).not.toContain("Not found");
  });

  it("keeps gated pages out of shared caches", async () => {
    signedIn();
    limit.mockResolvedValue([page]);
    const res = await GET(req(`${READING_PASS}=good`), params(WB));
    expect(res.headers.get("cache-control")).toContain("private");
  });
});
