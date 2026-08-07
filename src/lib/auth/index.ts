import { createClient } from "@supabase/supabase-js";

/**
 * Fallbacks for the two public Supabase values.
 *
 * Both are compiled into the browser bundle by design — the URL is the host
 * every request goes to, and the publishable key is Supabase's browser-side key.
 * Neither is a secret in the sense of a service-role key, and both are visible
 * to anyone using the site.
 *
 * They live here because the Cloudflare build doesn't receive them: NEXT_PUBLIC_*
 * values are inlined during `next build`, and the project's variables are set as
 * Worker runtime bindings, which arrive far too late. Without these, the client
 * below never initializes and sign-in fails with "the Supabase keys are missing".
 *
 * Two things to know:
 *  - This only stays safe while Row Level Security is enabled on every table.
 *    The publishable key grants exactly what your RLS policies allow.
 *  - Setting the environment variables at build time still overrides these, and
 *    is the better home for them — rotating the key then costs no commit.
 */
const SUPABASE_URL_FALLBACK = "https://qiupwcnjwxirnnmizgvd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY_FALLBACK =
  "sb_publishable_uejy_XnOpWbVZKrZ2Z_3Mg_5KRrZuKJ";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL_FALLBACK;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_PUBLISHABLE_KEY_FALLBACK;

// This will only be called at runtime when the variables are available
/**
 * PKCE rather than supabase-js's default implicit flow. Implicit returns the
 * access token AND the long-lived refresh token in the URL fragment, so they
 * land in the address bar and browser history. PKCE returns a single-use code
 * instead and keeps the tokens in the exchange response.
 *
 * The callback route and /auth/complete were already written for PKCE — they
 * call exchangeCodeForSession() on a `code` query param — so this makes the
 * client match what the rest of the sign-in path expects.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, { auth: { flowType: "pkce" } })
    : ({} as any);

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getSubscription(userId: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows returned
    console.error("Subscription fetch error:", error);
  }

  return data || { tier: "free", status: "active" };
}

export function isPremium(tier: string): boolean {
  return tier === "pro" || tier === "school";
}

export function canGenerateLessons(tier: string): boolean {
  return isPremium(tier);
}

export function canSaveResources(tier: string): boolean {
  return isPremium(tier);
}

export function canAccessPlanner(tier: string): boolean {
  return isPremium(tier);
}
