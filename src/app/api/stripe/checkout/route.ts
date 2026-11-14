// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { siteOrigin } from "@/lib/utils/site-origin";

/**
 * Built per request, on fetch rather than Node's http module — the same two
 * faults that stopped the webhook granting access after a real payment. The
 * key must be read inside the handler because on Workers the environment is
 * bound to the request, and the SDK must be put on fetch because its default
 * transport never returns here.
 */
function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, {
    httpClient: Stripe.createFetchHttpClient(),
    timeout: 8000,
    maxNetworkRetries: 1,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, email } = await request.json();

    if (!priceId || !userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const stripe = stripeClient();
    const origin = siteOrigin(request);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      client_reference_id: userId,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Checkout error:", error);
    // The generic message hid a configuration fault for months: every
    // failure read the same whether Stripe was down or the return URL was
    // the word "undefined". The reason goes to the log either way; a
    // configuration problem is also worth saying out loud, because it is
    // the operator who can fix it and nobody else will see the log.
    const reason = error instanceof Error ? error.message : "";
    const isConfig = /NEXT_PUBLIC_APP_URL|STRIPE_SECRET_KEY|site's address/.test(reason);
    return NextResponse.json(
      { error: isConfig ? reason : "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
