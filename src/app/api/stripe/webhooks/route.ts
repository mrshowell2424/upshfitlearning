// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { withDb } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { grantAccessUntil, recordPendingGrant } from "@/lib/access";

/**
 * Stripe events, turned into access.
 *
 * Three things were wrong with the previous version and all three would have
 * failed silently:
 *
 *  1. It verified signatures with constructEvent, which is synchronous and
 *     needs Node crypto. On Workers that throws, so every event would have been
 *     rejected while Stripe quietly retried.
 *  2. Cancellation and update handlers read subscription.metadata.userId, but
 *     that metadata was only ever set on the checkout session. Both handlers
 *     did nothing, so a cancelled subscriber kept access forever.
 *  3. Nothing handled renewal, so a monthly subscription granted access once.
 *
 * Access is stored as a date. A cancellation therefore needs no scheduled job:
 * we already hold the date they have paid through, and access ends there.
 */
export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

/** Stripe sends seconds; everything downstream wants a Date. */
const fromUnix = (seconds?: number | null) =>
  typeof seconds === "number" ? new Date(seconds * 1000) : null;

/**
 * The period end for a subscription, wherever this API version keeps it.
 * Newer versions moved it onto the subscription items.
 */
function periodEndOf(subscription: Stripe.Subscription): Date | null {
  return (
    fromUnix(subscription.current_period_end) ??
    fromUnix(subscription.items?.data?.[0]?.current_period_end) ??
    null
  );
}

/**
 * Grant to a user id when checkout carried one, and otherwise park it against
 * the email for whoever signs in with it next.
 */
async function applyAccess(params: {
  userId?: string | null;
  email?: string | null;
  until: Date;
  note: string;
  customerId?: string | null;
  subscriptionId?: string | null;
}) {
  const { userId, email, until, note, customerId, subscriptionId } = params;

  if (userId) {
    await grantAccessUntil({
      userId,
      until,
      note,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    });
    return `granted to user ${userId} until ${until.toISOString()}`;
  }

  if (email) {
    await recordPendingGrant({
      email,
      until,
      note,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    });
    return `no account for ${email} yet — parked until they sign in`;
  }

  return "no user id and no email on the event; nothing to grant";
}

/** Find the account behind a Stripe customer, for events that carry no id. */
async function userIdForCustomer(customerId?: string | null) {
  if (!customerId) return null;

  const rows = await withDb((tx) =>
    tx
      .select({ user_id: subscriptions.user_id })
      .from(subscriptions)
      .where(eq(subscriptions.stripe_customer_id, customerId))
      .limit(1)
  );

  return rows[0]?.user_id ?? null;
}

export async function POST(request: NextRequest) {
  // Named individually, so a misconfiguration says which half is missing
  // instead of failing as a generic signature error.
  const missing = [
    !process.env.STRIPE_SECRET_KEY && "STRIPE_SECRET_KEY",
    !webhookSecret && "STRIPE_WEBHOOK_SECRET",
  ].filter(Boolean);

  if (missing.length) {
    console.error(`Stripe webhook not configured; missing ${missing.join(" and ")}`);
    return NextResponse.json(
      { error: "Webhook not configured", missing },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  let stripe: Stripe;

  try {
    stripe = stripeClient();
    // Async, because Workers have Web Crypto rather than Node's.
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      /* Paid. Grant access to the end of the period they have bought. */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!session.subscription) {
          return NextResponse.json({ received: true, note: "not a subscription" });
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const until = periodEndOf(subscription);
        if (!until) throw new Error("subscription had no period end");

        // client_reference_id is set on the checkout URL, so most payments
        // arrive already attached to an account.
        const note = await applyAccess({
          userId: session.client_reference_id,
          email: session.customer_details?.email || session.customer_email,
          until,
          note: "stripe subscription",
          customerId: subscription.customer as string,
          subscriptionId: subscription.id,
        });

        console.log("checkout.session.completed:", note);
        break;
      }

      /* Renewed. Push the date out; grantAccessUntil never shortens it. */
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
          (invoice.subscription as string) ||
          invoice.lines?.data?.[0]?.subscription ||
          null;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const until = periodEndOf(subscription);
        if (!until) break;

        const userId =
          subscription.metadata?.userId ||
          (await userIdForCustomer(subscription.customer as string));

        const note = await applyAccess({
          userId,
          email: invoice.customer_email,
          until,
          note: "stripe renewal",
          customerId: subscription.customer as string,
          subscriptionId: subscription.id,
        });

        console.log("invoice.paid:", note);
        break;
      }

      /*
       * Cancelled. Deliberately leaves the date alone — they paid through it,
       * so access runs out on its own. Only the status changes, which is what
       * stops it renewing.
       */
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId =
          subscription.metadata?.userId ||
          (await userIdForCustomer(subscription.customer as string));

        if (userId) {
          await withDb((tx) =>
            tx
              .update(subscriptions)
              .set({ status: "canceled", updated_at: new Date() })
              .where(eq(subscriptions.user_id, userId))
          );
          console.log(
            `customer.subscription.deleted: ${userId} keeps access to the end of the paid period`
          );
        }
        break;
      }

      /* Status changes — past_due, paused, reactivated. */
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId =
          subscription.metadata?.userId ||
          (await userIdForCustomer(subscription.customer as string));
        if (!userId) break;

        const until = periodEndOf(subscription);

        await withDb((tx) =>
          tx
            .update(subscriptions)
            .set({
              status: subscription.status,
              ...(until ? { current_period_end: until } : {}),
              updated_at: new Date(),
            })
            .where(eq(subscriptions.user_id, userId))
        );

        // An active subscription with a later period end is a renewal by
        // another name, so honour it.
        if (subscription.status === "active" && until) {
          await grantAccessUntil({
            userId,
            until,
            note: "stripe subscription",
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
          });
        }

        console.log(`customer.subscription.updated: ${userId} is ${subscription.status}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Webhook handler failed for ${event.type}:`, message);
    // A 500 makes Stripe retry, which is what we want for a transient failure.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
