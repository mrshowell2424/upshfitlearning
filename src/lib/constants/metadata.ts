/**
 * The one place the brand suffix is spelled.
 *
 * Next appends a parent layout's `title.template` to a child's title -- but
 * only while every layout in between leaves the template alone. A layout
 * that sets `title` to a plain string resolves the title for its whole
 * subtree and takes the template with it, which is how /match/RL.4.6,
 * /lounge/[slug] and /resources/[id] briefly rendered their real names with
 * no brand on the end while their parents kept theirs.
 *
 * So any layout that both names itself and has children re-declares the
 * template, and takes it from here rather than retyping it -- the previous
 * round of this had nine pages spelling the suffix by hand, two of them with
 * the wrong dash.
 */
export const TITLE_TEMPLATE = "%s · Upshift Learning";

/** The brand card every page falls back to. */
export const OG_DEFAULT = "/og/default.png";

/**
 * A page that sets `openGraph` replaces its parent's rather than merging
 * into it, so naming an image would quietly drop siteName, type and locale.
 * This returns the whole object, which is also the only place the card
 * dimensions are written down.
 *
 * Cards are drawn by scripts/shoot-og-cards.mjs and live in public/og.
 */
export function ogCard(image: string, type: "website" | "article" = "website") {
  return {
    type,
    siteName: "Upshift Learning",
    locale: "en_US",
    images: [{ url: image, width: 1200, height: 630 }],
  };
}

/** The Twitter half of the same card. */
export function twitterCard(image: string) {
  return { card: "summary_large_image" as const, images: [image] };
}
