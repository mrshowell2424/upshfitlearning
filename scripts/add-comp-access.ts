// @ts-nocheck
/**
 * One-off migration for hand-granted access.
 *
 * Adds the two comp columns and — more importantly — the missing read policy
 * on subscriptions. Row level security was enabled on that table with no
 * policies at all, which meant every read returned nothing: getSubscription()
 * came back empty for every user, so nobody could ever be premium regardless
 * of what the row said.
 *
 * Only SELECT is granted, and only for the caller's own row. There is
 * deliberately no insert or update policy: writes belong to the Stripe webhook
 * and to scripts holding the direct connection, never to the browser. A user
 * who could write this table could simply make themselves Pro.
 *
 * Safe to re-run.
 *
 *   bun run scripts/add-comp-access.ts
 */
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

async function main() {
  console.log("→ adding comp columns");
  await sql`alter table public.subscriptions add column if not exists comped_until timestamptz`;
  await sql`alter table public.subscriptions add column if not exists comp_note text`;

  console.log("→ granting users read access to their own subscription");
  await sql`drop policy if exists "Users read own subscription" on public.subscriptions`;
  await sql`
    create policy "Users read own subscription"
      on public.subscriptions
      for select
      to authenticated
      using (auth.uid()::text = user_id)
  `;

  const columns = await sql`
    select column_name from information_schema.columns
    where table_name = 'subscriptions' and column_name in ('comped_until', 'comp_note')
  `;
  const policies = await sql`
    select policyname, cmd from pg_policies where tablename = 'subscriptions'
  `;

  console.log("\ncolumns added :", columns.map((c) => c.column_name).join(", ") || "(none)");
  console.log("policies now  :", policies.map((p) => `${p.policyname} [${p.cmd}]`).join(", "));
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
