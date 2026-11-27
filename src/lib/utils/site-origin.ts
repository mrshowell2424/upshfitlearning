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

/**
 * The site's own address, for metadata that has to be absolute: Open Graph
 * images, canonical URLs, the sitemap.
 *
 * Same order of trust as siteOrigin above, minus the request -- metadata is
 * built without one, and in the sitemap's case at build time. The important
 * difference is that this one never throws. siteOrigin guards a payment
 * redirect, where a wrong answer sends a paying customer somewhere else and
 * refusing is the right move. This guards a preview card. A page that fails
 * to render because its link preview could not be addressed would be a far
 * worse bug than a link preview with a localhost URL in it, so the last
 * resort here is a fallback rather than an error.
 *
 * This site is NOT on Vercel. It is served by Cloudflare through OpenNext,
 * so VERCEL_PROJECT_PRODUCTION_URL is never set and that branch can never
 * fire -- which left localhost as the production answer. The warning below
 * described the result exactly and nobody saw it: the live sitemap carried
 * 396 localhost URLs, robots.txt pointed search engines at
 * http://localhost:3000/sitemap.xml, and every og:image on the site was a
 * localhost address, so no social card could ever render an image.
 *
 * So production falls back to the real host rather than to localhost. The
 * proper fix is still NEXT_PUBLIC_APP_URL, which wins over this and is the
 * only thing that makes a second domain or a preview deployment correct;
 * this is the floor under it, not a replacement for it.
 */
/** Where this site actually lives. See the Deployment section of CLAUDE.md. */
const PRODUCTION_HOST = "https://hub.upshiftlearning.com";

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/+$/, "");
  }

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/^https?:\/\//i, "").replace(/\/+$/, "")}`;

  // A production build reaching here has neither the explicit variable nor
  // Vercel's, which on Cloudflare is every production build. Returning
  // localhost here is what put localhost in the sitemap, in robots.txt and
  // in every og:image, so production gets the real host instead.
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[site-origin] NEXT_PUBLIC_APP_URL is not set, so absolute URLs fall " +
        `back to ${PRODUCTION_HOST}. Set it to the real site address -- the ` +
        "sitemap, robots.txt and every link preview are built from it, and " +
        "this fallback cannot know about a second domain or a preview build.",
    );
    return PRODUCTION_HOST;
  }

  return `http://localhost:${process.env.PORT || 3000}`;
}
