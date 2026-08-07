import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * The connection is built on first use, not when this module is evaluated.
 *
 * That matters on Cloudflare Workers: bindings and secrets are only exposed
 * per request, so anything read at module scope sees an empty process.env.
 * Reading DATABASE_URL at import time therefore always came back undefined in
 * production, the client was never created, and every query threw — silently,
 * because the call sites catch and fall back to an empty state. Locally under
 * Bun the variable is present at import time, so the same code worked fine.
 *
 * Building lazily means the read happens inside a request, where the value
 * actually exists. The instance is cached afterwards, so an isolate still only
 * ever opens one pool.
 */
type Database = ReturnType<typeof drizzle<typeof schema>>;

let cached: Database | null = null;

function createDb(): Database {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // Same message as before, so existing try/catch call sites behave the same.
    throw new Error("DATABASE_URL environment variable is required");
  }

  const client = postgres(connectionString, {
    // Supavisor in transaction mode (port 6543) hands a different backend
    // connection to each statement, so prepared statements cannot be reused.
    prepare: false,
  });

  cached = drizzle(client, { schema });
  return cached;
}

function getDb(): Database {
  return cached ?? createDb();
}

export const db = new Proxy({} as Database, {
  get(_target, property) {
    const instance = getDb() as unknown as Record<string | symbol, unknown>;
    const value = instance[property];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
