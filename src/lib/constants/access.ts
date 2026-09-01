/**
 * Whether anything on this site costs money.
 *
 * Everything is free for now. The Stripe wiring underneath is intact and
 * tested — a real payment does grant access through the webhook — so turning
 * charging back on is this one constant rather than a rebuild.
 *
 * While it is false:
 *   · the Plans page is unlinked and redirects to the home page
 *   · every signed-in account gets All-Access, client and server alike
 *   · the upgrade prompts ask for a free account instead of a card
 *
 * Signing in is still required for the All-Access half. That is not a price —
 * accounts are free — it is what keeps a record of who is using this, and what
 * a subscription would eventually attach to. Setting FREE_REQUIRES_ACCOUNT to
 * false opens everything to signed-out visitors too.
 */
export const PAYMENTS_ENABLED = false

/** With payments off, whether the free content still sits behind a sign-in. */
export const FREE_REQUIRES_ACCOUNT = true
