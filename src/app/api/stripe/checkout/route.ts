// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
