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
