import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
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
