// @ts-nocheck
/**
 * Give a teacher All-Access by hand, without Stripe.
 *
 *   bun run scripts/grant-access.ts teacher@school.org 12
 *   bun run scripts/grant-access.ts teacher@school.org 3 "conference giveaway"
 *   bun run scripts/grant-access.ts teacher@school.org --revoke
 *   bun run scripts/grant-access.ts --list
 *
 * Months are counted from today, or from the existing expiry if the person is
 * already comped — so running it twice extends rather than resets.
 *
 * This writes comped_until, never tier. Stripe owns tier and status; if a
 * cancellation webhook later sets tier to free it will not disturb a comp.
 */
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

function usage(message?: string) {
  if (message) console.error(`\n✗ ${message}`);
  console.error(`
Usage:
  bun run scripts/grant-access.ts <email> <months> [note]
  bun run scripts/grant-access.ts <email> --revoke
  bun run scripts/grant-access.ts --list
`);
  process.exitCode = 1;
}

async function findUser(email: string) {
  const rows = await sql`
    select id, email from auth.users where lower(email) = lower(${email}) limit 1
  `;
  return rows[0] ?? null;
}

async function list() {
  const rows = await sql`
    select s.user_id, u.email, s.tier, s.status, s.comped_until, s.comp_note
    from public.subscriptions s
    left join auth.users u on u.id::text = s.user_id
    where s.comped_until is not null
    order by s.comped_until desc
  `;

  if (!rows.length) {
    console.log("No comped accounts.");
    return;
  }

  console.log(`${rows.length} comped account(s):\n`);
  for (const r of rows) {
    const until = new Date(r.comped_until);
    const live = until.getTime() > Date.now();
    console.log(
      `  ${live ? "✓" : "·"} ${(r.email ?? r.user_id).padEnd(34)} ` +
        `until ${until.toISOString().slice(0, 10)}` +
        `${live ? "" : "  (expired)"}${r.comp_note ? `  — ${r.comp_note}` : ""}`
    );
  }
}

async function revoke(email: string) {
  const user = await findUser(email);
  if (!user) return usage(`No account found for ${email}`);

  await sql`
    update public.subscriptions
    set comped_until = null, comp_note = null, updated_at = now()
    where user_id = ${user.id}
  `;
  console.log(`✓ Comp removed for ${user.email}`);
}

async function grant(email: string, months: number, note: string | null) {
  const user = await findUser(email);
  if (!user) {
    return usage(
      `No account found for ${email}. They need to sign in once before you can grant access.`
    );
  }

  const existing = await sql`
    select comped_until from public.subscriptions where user_id = ${user.id} limit 1
  `;

  // Extend from the current expiry when one is still running, so repeat grants
  // add up instead of quietly shortening someone's access.
  const current = existing[0]?.comped_until ? new Date(existing[0].comped_until) : null;
  const base = current && current.getTime() > Date.now() ? current : new Date();
  const until = new Date(base);
  until.setMonth(until.getMonth() + months);

  await sql`
    insert into public.subscriptions (user_id, tier, status, comped_until, comp_note, updated_at)
    values (${user.id}, 'free', 'active', ${until.toISOString()}, ${note}, now())
    on conflict (user_id) do update set
      comped_until = ${until.toISOString()},
      comp_note = ${note},
      updated_at = now()
  `;

  console.log(`✓ ${user.email} has All-Access until ${until.toISOString().slice(0, 10)}`);
  if (current && current.getTime() > Date.now()) {
    console.log(`  (extended from ${current.toISOString().slice(0, 10)})`);
  }
  if (note) console.log(`  note: ${note}`);
}

async function main() {
  const [first, second, third] = process.argv.slice(2);

  if (!first) return usage("Missing arguments");
  if (first === "--list") return list();
  if (second === "--revoke") return revoke(first);

  const months = Number(second);
  if (!Number.isInteger(months) || months <= 0) {
    return usage(`Months must be a positive whole number, got "${second ?? ""}"`);
  }

  return grant(first, months, third ?? null);
}

main()
  .catch((error) => {
    console.error("❌ failed:", error.message ?? error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sql.end();
  });
