import { describe, it, expect, afterEach } from "vitest";
import { siteOrigin } from "@/lib/utils/site-origin";

/**
 * The origin Stripe is told to send a paying customer back to.
 *
 * The case that matters most is the one that shipped: no environment at all,
 * and the old code quietly produced the string "undefined/success?...". It
 * has to throw now, because a wrong return URL is not something to recover
 * from silently -- Stripe rejects it and the only trace is a 500.
 */
const KEYS = ["NEXT_PUBLIC_APP_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL"] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

function clear() {
  for (const k of KEYS) delete process.env[k];
}

const req = (origin?: string) => ({ nextUrl: origin ? { origin } : undefined });

describe("siteOrigin", () => {
  it("uses NEXT_PUBLIC_APP_URL when it is set", () => {
    clear();
    process.env.NEXT_PUBLIC_APP_URL = "https://upshiftlearning.org";
    expect(siteOrigin(req("http://localhost:3000"))).toBe("https://upshiftlearning.org");
  });

  it("drops a trailing slash, so the path is not doubled", () => {
    clear();
    process.env.NEXT_PUBLIC_APP_URL = "https://upshiftlearning.org/";
    expect(siteOrigin(req())).toBe("https://upshiftlearning.org");
  });

  it("refuses a NEXT_PUBLIC_APP_URL that is not an absolute URL", () => {
    clear();
    process.env.NEXT_PUBLIC_APP_URL = "upshiftlearning.org";
    expect(() => siteOrigin(req())).toThrow(/absolute/);
  });

  it("falls back to the Vercel production domain", () => {
    clear();
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "upshiftlearning.org";
    expect(siteOrigin(req())).toBe("https://upshiftlearning.org");
  });

  it("prefers the production domain over the deployment one", () => {
    clear();
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "upshiftlearning.org";
    process.env.VERCEL_URL = "upshift-abc123.vercel.app";
    expect(siteOrigin(req())).toBe("https://upshiftlearning.org");
  });

  it("uses the deployment domain on a preview", () => {
    clear();
    process.env.VERCEL_URL = "upshift-abc123.vercel.app";
    expect(siteOrigin(req())).toBe("https://upshift-abc123.vercel.app");
  });

  it("allows localhost in development", () => {
    clear();
    expect(siteOrigin(req("http://localhost:3000"))).toBe("http://localhost:3000");
  });

  /**
   * The security case. This value is where a completed checkout lands, with
   * the session id in the query string, so it must never come from anything
   * the caller controls -- a Host header included.
   */
  it("refuses an origin that is not localhost and not configured", () => {
    clear();
    expect(() => siteOrigin(req("https://attacker.example"))).toThrow(/NEXT_PUBLIC_APP_URL/);
  });

  it("throws rather than returning undefined when nothing is set", () => {
    clear();
    expect(() => siteOrigin(req())).toThrow(/Cannot work out this site's address/);
  });
});
