import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * A connection is built per query, and never shared between requests.
 *
 * Two Cloudflare Workers constraints shape this:
 *
 *  1. Bindings and secrets only exist during a request, so DATABASE_URL cannot
 *     be read at module scope — it comes back undefined at isolate startup.
 *  2. A socket opened while handling one request cannot be used by another.
 *     Caching a client at module scope therefore works exactly once per
 *     isolate and throws for every request after it, which surfaces as an
 *     uncaught Worker exception rather than anything a call site can catch.
 *
 * So the client is created on each access to `db` and left to close itself
 * through idle_timeout. That costs a connection setup per query, which is the
 * price of the platform; Supavisor in transaction mode is built to absorb
 * exactly this pattern. If the added latency ever matters, Cloudflare
 * Hyperdrive is the way to pool without violating the second rule.
 *
 * Locally under Bun neither constraint applies, and this behaves the same.
 */
type Database = ReturnType<typeof drizzle<typeof schema>>;

function createDb(): Database {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // Same message as before, so existing try/catch call sites behave the same.
    throw new Error("DATABASE_URL environment variable is required");
  }

  const client = postgres(connectionString, {
    // Supavisor in transaction mode hands a different backend connection to
    // each statement, so prepared statements cannot be reused across them.
    prepare: false,
    // One socket per query, closing itself shortly after the query resolves.
    max: 1,
    idle_timeout: 5,
    max_lifetime: 30,
  });

  return drizzle(client, { schema });
}

export const db = new Proxy({} as Database, {
  get(_target, property) {
    const instance = createDb() as unknown as Record<string | symbol, unknown>;
    const value = instance[property];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

/**
 * Run several queries over one connection.
 *
 * `db` opens a connection per query, which is correct on Workers but costs a
 * TCP and TLS handshake each time — around two seconds. A route doing three
 * reads therefore spent six seconds connecting and almost none querying, which
 * reads to a teacher as a page that will not load.
 *
 * This keeps the per-request rule that Workers require while paying the setup
 * cost once. Use it anywhere a handler makes more than one read:
 *
 *   const { rows } = await withDb(async (tx) => ({ rows: await tx.select()... }))
 *
 * The connection is closed inside the request that opened it, so nothing is
 * left for a later request to trip over.
 */
export async function withDb<T>(fn: (database: Database) => Promise<T>): Promise<T> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const client = postgres(connectionString, { prepare: false, max: 1, idle_timeout: 5 });

  try {
    return await fn(drizzle(client, { schema }));
  } finally {
    await client.end({ timeout: 5 }).catch(() => {});
  }
}
