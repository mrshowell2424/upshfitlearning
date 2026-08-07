import { withDb } from "@/lib/db";
import { subscriptions, pending_grants } from "@/lib/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";

/**
 * Writing and claiming access, in one place.
 *
 * Access is expressed as a date rather than a flag: `comped_until` holds the
 * moment it lapses, whatever put it there. That is what makes an end-of-period
 * cancellation trivial — Stripe tells us the date they have paid through, we
 * store it, and access ends there without anything having to run on the day.
 *
 * It also means a cancellation webhook writing tier "free" cannot take away
 * access somebody paid for, because the date lives in its own column.
 */

interface GrantOptions {
  userId: string;
  /** When access should lapse. */
  until: Date;
  note?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  status?: string;
}

/**
 * Give a user access until a date, never shortening what they already have.
 *
 * The guard matters on renewal: events can arrive late or out of order, and an
 * older invoice landing after a newer one must not claw back the month it
 * already extended into.
 */
export async function grantAccessUntil(options: GrantOptions): Promise<void> {
  const { userId, until, note, stripeCustomerId, stripeSubscriptionId, status } = options;

  await withDb(async (tx) => {
    await tx
      .insert(subscriptions)
      .values({
        user_id: userId,
        tier: "pro",
        status: status ?? "active",
        comped_until: until,
        comp_note: note ?? null,
        stripe_customer_id: stripeCustomerId ?? null,
        stripe_subscription_id: stripeSubscriptionId ?? null,
        current_period_end: until,
        updated_at: new Date(),
      })
      .onConflictDoUpdate({
        target: subscriptions.user_id,
        set: {
          tier: "pro",
          status: status ?? "active",
          // Only ever move the date forward.
          comped_until: sql`greatest(coalesce(${subscriptions.comped_until}, to_timestamp(0)), ${until.toISOString()}::timestamptz)`,
          comp_note: note ?? null,
          stripe_customer_id: stripeCustomerId ?? null,
          stripe_subscription_id: stripeSubscriptionId ?? null,
          current_period_end: until,
          updated_at: new Date(),
        },
      });
  });
}

/**
 * Record a payment we cannot attribute yet, to be claimed at first sign-in.
 */
export async function recordPendingGrant(options: {
  email: string;
  until: Date;
  note?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}): Promise<void> {
  await withDb(async (tx) => {
    await tx.insert(pending_grants).values({
      email: options.email.toLowerCase(),
      access_until: options.until,
      note: options.note ?? null,
      stripe_customer_id: options.stripeCustomerId ?? null,
      stripe_subscription_id: options.stripeSubscriptionId ?? null,
    });
  });
}

/**
 * Apply any unclaimed payment matching this email.
 *
 * Called whenever entitlement is checked, so a teacher who paid before signing
 * up gets access the moment they arrive rather than waiting on somebody to
 * notice. Returns the date access now runs to, or null if there was nothing.
 */
export async function claimPendingGrants(
  userId: string,
  email: string | null | undefined
): Promise<Date | null> {
  if (!email) return null;

  return withDb(async (tx) => {
    const waiting = await tx
      .select()
      .from(pending_grants)
      .where(
        and(
          eq(sql`lower(${pending_grants.email})`, email.toLowerCase()),
          isNull(pending_grants.claimed_at)
        )
      );

    if (!waiting.length) return null;

    // The furthest date wins — someone may have paid more than once.
    const furthest = waiting
      .map((row) => new Date(row.access_until))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    const withStripe = waiting.find((row) => row.stripe_customer_id);

    await tx
      .insert(subscriptions)
      .values({
        user_id: userId,
        tier: "pro",
        status: "active",
        comped_until: furthest,
        comp_note: withStripe?.note ?? "claimed at sign-in",
        stripe_customer_id: withStripe?.stripe_customer_id ?? null,
        stripe_subscription_id: withStripe?.stripe_subscription_id ?? null,
        current_period_end: furthest,
        updated_at: new Date(),
      })
      .onConflictDoUpdate({
        target: subscriptions.user_id,
        set: {
          tier: "pro",
          status: "active",
          comped_until: sql`greatest(coalesce(${subscriptions.comped_until}, to_timestamp(0)), ${furthest.toISOString()}::timestamptz)`,
          current_period_end: furthest,
          updated_at: new Date(),
        },
      });

    // Marked rather than deleted, so a payment stays traceable afterwards.
    for (const row of waiting) {
      await tx
        .update(pending_grants)
        .set({ claimed_at: new Date(), claimed_by: userId })
        .where(eq(pending_grants.id, row.id));
    }

    return furthest;
  });
}
