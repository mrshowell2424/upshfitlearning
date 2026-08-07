import { createClient } from "@supabase/supabase-js";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hasAllAccess } from "@/lib/auth";

/**
 * Server-side entitlement, decided from a bearer token.
 *
 * The browser holds the session, so the only thing it can prove to us is a
 * Supabase access token. That token is verified against the auth server — not
 * merely decoded — and the tier is then read from our own database rather than
 * from anything the client sent. A caller can therefore prove who they are but
 * cannot assert what they are entitled to.
 *
 * This exists so paid content can be withheld before it is serialised into a
 * response. Gating in the browser only decides what gets displayed; by then the
 * content has already been delivered and is a devtools inspection away.
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qiupwcnjwxirnnmizgvd.supabase.co";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_uejy_XnOpWbVZKrZ2Z_3Mg_5KRrZuKJ";

export interface Entitlement {
  userId: string | null;
  allAccess: boolean;
}

const DENIED: Entitlement = { userId: null, allAccess: false };

/** Pull the bearer token out of an Authorization header, if there is one. */
export function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  if (!token || scheme.toLowerCase() !== "bearer") return null;
  return token.trim() || null;
}

export async function entitlementFromToken(token: string | null): Promise<Entitlement> {
  if (!token) return DENIED;

  let userId: string;

  try {
    // Verifies the token with Supabase rather than trusting its contents.
    const client = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await client.auth.getUser(token);
    if (error || !data?.user) return DENIED;
    userId = data.user.id;
  } catch {
    return DENIED;
  }

  try {
    const rows = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.user_id, userId))
      .limit(1);

    return { userId, allAccess: hasAllAccess(rows[0] ?? null) };
  } catch (error) {
    // A database failure must not hand out access it cannot verify.
    console.error("Entitlement lookup failed:", error);
    return { userId, allAccess: false };
  }
}

/** Convenience for route handlers. */
export function entitlementFromRequest(request: Request): Promise<Entitlement> {
  return entitlementFromToken(bearerToken(request));
}
