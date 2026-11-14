import type { NextRequest } from "next/server";

/** Only the part of a request this needs, so it can be called with a stub. */
export type OriginRequest = Pick<NextRequest, "nextUrl"> | { nextUrl?: { origin?: string } };

/**
 * Where Stripe sends the customer back to.
 *
 * This used to be `${process.env.NEXT_PUBLIC_APP_URL}/success`, and that
 * variable is set nowhere -- not in .env.example, not in .env.local. So the
 * URL handed to Stripe was the literal string "undefined/success?...",
 * Stripe rejected it as not a URL, and sessions.create threw before it ever
 * returned a session. Every checkout failed at the first step, and the only
 * trace was a 500 saying "Failed to create checkout session".
 *
 * Three sources, in descending order of how much they can be trusted:
 *
 *   NEXT_PUBLIC_APP_URL, if it is set and is an absolute http(s) URL. This
 *   is the explicit answer and it wins.
 *
 *   Vercel's own environment, which the platform sets and a request cannot
 *   influence. The project's production domain first, then the
 *   deployment-specific one for previews.
 *
 *   request.nextUrl.origin, for local development only.
 *
 * Deliberately NOT the Host or X-Forwarded-Host header. A request can set
 * those, and this value becomes the page a paying customer is redirected to
 * with their session id in the query string -- so a spoofed header would be
 * a way to point somebody's completed checkout at somebody else's domain.
 * An origin that cannot be established is an error, not a guess.
 */
export function siteOrigin(request: OriginRequest): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/+$/, "");
  }
  if (configured) {
    throw new Error(
      `NEXT_PUBLIC_APP_URL is set to "${configured}", which is not an absolute ` +
        "http(s) URL. Stripe needs one, for example https://upshiftlearning.org",
    );
  }

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/^https?:\/\//i, "").replace(/\/+$/, "")}`;

  const origin = request.nextUrl?.origin;
  if (origin && /^https?:\/\/localhost(:\d+)?$/i.test(origin)) return origin;

  throw new Error(
    "Cannot work out this site's address for Stripe to return to. Set " +
      "NEXT_PUBLIC_APP_URL to the full site URL, for example " +
      "https://upshiftlearning.org",
  );
}
