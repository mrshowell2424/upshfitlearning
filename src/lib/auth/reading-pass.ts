import { entitlementFromToken, bearerToken } from "@/lib/auth/entitlement";

/**
 * The credential that lets a browser open a Basic Reading workbook.
 *
 * The workbooks used to sit in public/, which meant the sign-in gate on the
 * page was decoration: anybody with a URL had the file. Moving them out from
 * under public/ fixes that, but creates a problem of its own — a workbook is
 * opened by clicking a link, and a link navigation sends cookies, not an
 * Authorization header. The bearer token that entitlement.ts expects is in
 * localStorage, where a navigation cannot reach it.
 *
 * So the page trades its token for a cookie once, at /api/reading/unlock, and
 * every later request for a file carries that cookie instead. The cookie holds
 * the Supabase access token itself and is verified against Supabase on each
 * request, exactly as a bearer token would be — it is a different delivery
 * mechanism for the same proof, not a weaker one. Nothing is signed by us,
 * so there is no new secret to configure or rotate.
 *
 * HttpOnly keeps it away from page scripts, and the path scope keeps it off
 * every other request the site makes.
 */
export const READING_PASS = "upshift_reading_pass";

/** Scoped to the one route that reads it. */
export const READING_PASS_PATH = "/api/reading";

/**
 * An hour. Long enough to teach from without re-unlocking, short enough that a
 * cookie copied off a shared machine stops working the same day. The page
 * re-unlocks on every visit, so a teacher never meets the expiry.
 */
export const READING_PASS_MAX_AGE = 60 * 60;

/** Read the pass out of a request's Cookie header. */
export function readingPassFromCookies(request: Request): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() !== READING_PASS) continue;
    return decodeURIComponent(part.slice(eq + 1).trim()) || null;
  }
  return null;
}

/**
 * Whether this request may read a workbook.
 *
 * Accepts the cookie a link navigation carries, or a bearer token for anything
 * calling the route directly. Both end at the same verification.
 */
export async function mayReadMaterials(request: Request): Promise<boolean> {
  const token = readingPassFromCookies(request) ?? bearerToken(request);
  if (!token) return false;
  const { userId } = await entitlementFromToken(token);
  // An account is the bar here, not a paid tier — the road map is free, it
  // simply is not anonymous.
  return Boolean(userId);
}
