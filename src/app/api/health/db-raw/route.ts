import { NextResponse } from "next/server";
import postgres from "postgres";

/**
 * Deliberately bypasses src/lib/db — no drizzle, no shared client, no proxy.
 * Opens a connection, runs one query, closes it, all inside this request.
 *
 * If this succeeds while /api/health/db fails, the fault is connection reuse
 * across requests rather than the database or the network. Workers do not
 * allow I/O opened in one request to be used by another, so a client cached
 * at module scope works exactly once per isolate and throws thereafter.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    return NextResponse.json({ databaseUrlVisible: false }, { status: 503 });
  }

  let client: ReturnType<typeof postgres> | null = null;

  try {
    client = postgres(url, { prepare: false, max: 1, idle_timeout: 5 });
    const rows = await client`select count(*)::int as count from standards`;
    return NextResponse.json({
      strategy: "fresh client per request",
      connected: true,
      standardsRows: rows[0]?.count ?? 0,
    });
  } catch (error) {
    const err = error as { message?: string; name?: string; code?: string };
    return NextResponse.json(
      {
        strategy: "fresh client per request",
        connected: false,
        name: err?.name ?? null,
        code: err?.code ?? null,
        // Truncated so a driver error cannot echo the whole DSN back.
        message: (err?.message ?? String(error)).slice(0, 300),
      },
      { status: 503 }
    );
  } finally {
    // Close inside the request that opened it, or the socket outlives its owner.
    await client?.end({ timeout: 5 }).catch(() => {});
  }
}
