import { createClient } from "@supabase/supabase-js";

/**
 * The project URL is not a secret — it's the host every Supabase request goes to,
 * so it's visible in the browser's network tab regardless. Falling back to it
 * keeps sign-in working if the build environment is missing the variable, which
 * is otherwise a silent failure: the client below only initializes when both
 * values are present, so a missing URL alone disables auth entirely.
 *
 * The key has no fallback on purpose. It's publishable and safe in a browser,
 * but it should still come from configuration, and rotating it must not require
 * a code change.
 */
const SUPABASE_URL_FALLBACK = "https://qiupwcnjwxirnnmizgvd.supabase.co";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL_FALLBACK;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// This will only be called at runtime when the variables are available
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
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
