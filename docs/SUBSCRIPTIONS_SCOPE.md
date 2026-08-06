# Subscriptions & Billing — Scope

Audit date: 2026-08-06. Every claim below was checked against the code, not assumed.

## Correction to an earlier statement

I previously said renewals "won't happen" because the webhook wasn't wired. That
was too pessimistic — `src/app/api/stripe/webhooks/route.ts` exists, verifies the
signature, and handles the right three events. The real problem is narrower and
more specific: **two of its three handlers can never fire correctly**, and nothing
in the UI reaches checkout in the first place. Details in Blockers 1 and 2.

## What already works

| Piece | Where | State |
|---|---|---|
| `subscriptions` table | `src/lib/db/schema.ts` | Well modelled — `user_id` unique, `tier`, `stripe_customer_id`, `stripe_subscription_id`, `status`, `current_period_start/end` |
| Checkout session creation | `src/app/api/stripe/checkout/route.ts` | Real Stripe call, `mode: "subscription"` |
| Webhook receiver | `src/app/api/stripe/webhooks/route.ts` | Signature verified; handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`; upserts on conflict |
| Read path | `src/lib/auth/index.ts` → `getSubscription()` | Reads the table, defaults to `{tier:'free'}` |
| Tier logic | `isPremium(tier)` → `pro` \| `school` | Correct |
| Client access | `AuthProvider` → `useSubscription()` | Exposes `isPremium`, `canAccessPlanner`, etc. |

So the data model and the plumbing are sound. The gaps are at the two ends:
getting a user *into* checkout, and keeping their state correct *after*.

## Blockers, in the order they break a real purchase

### 1. Nothing on the pricing page reaches checkout — hard blocker
`src/app/pricing/page.tsx` CTAs are `/auth/signup`, `/auth/signin`, and a
`mailto:`. `/api/stripe/checkout` is never called from anywhere in the app.
No Stripe Price IDs are configured in `.env.example` or referenced in code.

**Consequence:** there is no path from "I want to pay" to Stripe. No money can be
collected today.

### 2. Renewals and cancellations silently no-op — hard blocker
`handleSubscriptionUpdated` and `handleSubscriptionDeleted` both start with:

```ts
const userId = subscription.metadata?.userId
if (!userId) return
```

Checkout sets `metadata: { userId }` on the **Checkout Session**, not on the
**Subscription**. Stripe does not copy session metadata onto the subscription, so
`subscription.metadata.userId` is always `undefined` and both handlers return
immediately.

**Consequence:** the first payment records fine (that handler uses
`client_reference_id`), but every renewal, cancellation, and status change after
that is dropped. A cancelled subscriber keeps premium access forever.

**Fix:** two options, and I'd do both —
- pass `subscription_data: { metadata: { userId } }` when creating the session, and
- look the row up by `stripe_subscription_id` instead of trusting metadata, so it
  also works for anyone who subscribed before the fix.

### 3. `success_url` is malformed — hard blocker
`success_url` interpolates `process.env.NEXT_PUBLIC_APP_URL`, which is **not in
`.env.example`** and not set. The URL becomes `"undefined/success..."`, which
Stripe rejects, so `checkout.sessions.create` throws before returning a session.

### 4. `/success` doesn't exist
No `src/app/success` directory. Even with a valid URL, a paying customer lands on
a 404 immediately after handing over money.

### 5. No admin view of members
`src/app/admin/` has no files, though `CLAUDE.md` documents `/admin/dashboards`.
There is no way to see who is subscribed, on what tier, or whose payment failed.

### 6. No customer portal
Subscribers cannot update a card, see invoices, or cancel. Needs a
`billing_portal.sessions.create` route plus a link in the UI. Without it,
cancellation requests come to you by email and must be done by hand in Stripe.

### 7. `invoice.payment_failed` is not handled
A failed renewal is only reflected via `customer.subscription.updated`, which is
broken per Blocker 2. So a lapsed card leaves the user premium indefinitely.

### 8. Premium gates are barely applied
`isPremium` is used in exactly two places: home-page search routing
(`src/app/page.tsx`) and the standard detail teaser (`src/app/match/[code]/client.tsx`).

- `/planner` has **no gate at all**, despite `CLAUDE.md` listing it "Premium only"
- the "Upgrade to All-Access" button on a paid resource has no `onClick` — it's dead

**Consequence:** even with billing working, there's little to buy — most premium
surface is currently free.

## Decisions needed from you

These change what gets built, so I need answers before Phase 2:

1. **Price and interval.** Pricing page says Pro is $9/mo — is that final, and is
   there an annual option? Annual changes the Stripe Price setup.
2. **Free trial?** If yes, how many days. Affects checkout config and gating.
3. **What exactly is paid?** Right now nearly everything is free. Confirm the
   line: planner, lesson generation, paid resources, All-Access standards?
4. **School tier.** Keep it as `mailto:` (manual invoicing) for now, or build
   seat-based billing? Manual is much cheaper to ship.
5. **Failed payment grace period.** Cut access immediately on `past_due`, or
   allow N days?

## Build plan

**Phase 1 — make one real purchase possible.** Blockers 1–4. Create the Stripe
product and Price, add `NEXT_PUBLIC_APP_URL` and `STRIPE_PRICE_PRO` to env, wire
the pricing CTA to checkout, build `/success`, fix the metadata/lookup bug.
Verify end-to-end in Stripe test mode with a test card.

**Phase 2 — keep state correct over time.** Blockers 2 (lookup half), 6, 7.
Customer portal route + link, `invoice.payment_failed` and `invoice.paid`
handling, grace-period rule from decision 5.

**Phase 3 — enforce and observe.** Blockers 5, 8. Apply the gates to whatever
decision 3 settles on, wire the dead upgrade button, build an admin members list
(email, tier, status, renews_at) behind an admin check.

Phase 1 is the one that changes anything commercially — until it ships, revenue is
zero regardless of the rest.

## Interim: make yourself premium today

No code needed. Get your Supabase auth user id (Supabase dashboard →
Authentication → Users → copy the UUID), then run in the Supabase SQL editor:

```sql
insert into subscriptions (user_id, tier, status)
values ('<your-auth-uuid>', 'pro', 'active')
on conflict (user_id) do update
  set tier = 'pro', status = 'active';
```

Sign out and back in — `AuthProvider` reads the subscription on load, so
`isPremium` will be true. That's also the honest answer to "where do I track
this": the `subscriptions` table, by hand, until Phase 3 gives it a UI.

One thing to confirm while you're in there: RLS on `subscriptions` should let a
user **read** only their own row and **never write** it. `getSubscription()` reads
client-side with the anon key, so a permissive write policy would let anyone
grant themselves `tier: 'pro'`.
