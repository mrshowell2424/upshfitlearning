// @ts-nocheck
/**
 * Access paid for before an account existed.
 *
 * The checkout flow asks people to sign in first, and attaches their user id to
 * the Stripe session — so most payments land with an account to grant. But some
 * will not: a link forwarded to a colleague, a payment finished on a phone
 * after signing up on a laptop, a card entered with a different email. Without
 * somewhere to put those, the webhook would have money and nobody to give
 * access to, and the teacher would be left staring at a free account.
 *
 * A row here is claimed the first time that email signs in, then marked used
 * rather than deleted, so a payment is still traceable afterwards.
 *
 * Safe to re-run.
 *
 *   bun run scripts/add-pending-grants.ts
 */
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

async function main() {
  console.log("→ creating pending_grants");

  await sql`
    create table if not exists public.pending_grants (
      id uuid primary key default gen_random_uuid(),
      email text not null,
      access_until timestamptz not null,
      note text,
      stripe_customer_id text,
      stripe_subscription_id text,
      claimed_at timestamptz,
      claimed_by text,
      created_at timestamptz not null default now()
    )
  `;

  // Looked up by email on every sign-in that lacks access, so it wants an index.
  await sql`
    create index if not exists pending_grants_email_idx
      on public.pending_grants (lower(email))
      where claimed_at is null
  `;

  // No policies: this table is written by the Stripe webhook and read by
  // server code holding the direct connection. A browser has no business
  // seeing who has paid, so RLS with no policy is exactly right.
  await sql`alter table public.pending_grants enable row level security`;

  const columns = await sql`
    select column_name from information_schema.columns
    where table_name = 'pending_grants' order by ordinal_position
  `;

  console.log("\ncolumns:", columns.map((c) => c.column_name).join(", "));
  console.log("\n✨ done");
}

main()
  .catch((error) => {
    console.error("❌ migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sql.end();
  });
