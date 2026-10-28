import { entitlementFromToken, bearerToken } from "@/lib/auth/entitlement";
import { materialsPassFromCookies } from "@/lib/auth/materials-pass";

/**
 * Whether this request may read a material. Server only.
 *
 * Accepts the cookie a link navigation carries, or a bearer token for anything
 * calling the route directly. Both end at the same verification.
 *
 * This is deliberately apart from materials-pass.ts, which holds the cookie's
 * name and lifetime and nothing else. A browser needs those facts — the page
 * component that trades the token has to know when to refresh — and importing
 * them used to drag this check, and through it Supabase, Drizzle and the
 * postgres driver, into the client bundle. Turbopack stops that with "Can't
 * resolve 'fs'". Keep the credential and the check in separate files.
 */
export async function mayReadMaterials(request: Request): Promise<boolean> {
  const token = materialsPassFromCookies(request) ?? bearerToken(request);
  if (!token) return false;
  const { userId } = await entitlementFromToken(token);
  // An account is the bar here, not a paid tier — the road maps are free, they
  // simply are not anonymous.
  return Boolean(userId);
}
