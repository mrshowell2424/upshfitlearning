import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { standards } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/**
 * Reports whether the database is reachable from wherever this is running.
 *
 * Every page that reads the database catches its own errors and renders an
 * empty state, which means a broken connection looks identical to an empty
 * table. This endpoint is the one place that says which it is.
 *
 * It deliberately reports only the host and port — never the user, password,
 * or full connection string — so it is safe to hit from anywhere.
 */
export const dynamic = "force-dynamic";

function describeTarget(url: string | undefined) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return { host: parsed.hostname, port: parsed.port || "(default)" };
  } catch {
    return { host: "(unparseable)", port: "(unparseable)" };
  }
}

export async function GET() {
  const url = process.env.DATABASE_URL;

  const report: Record<string, unknown> = {
    databaseUrlVisible: Boolean(url),
    target: describeTarget(url),
    connected: false,
  };

  if (!url) {
    report.hint =
      "DATABASE_URL is not readable at request time. On Workers, check it is set as a Worker secret rather than only a build variable.";
    return NextResponse.json(report, { status: 503 });
  }

  try {
    const rows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(standards);
    report.connected = true;
    report.standardsRows = rows[0]?.count ?? 0;
    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Truncate rather than echo a driver error that may embed the DSN.
    report.error = message.slice(0, 200);
    report.hint =
      "DATABASE_URL is present but the query failed — a network or TLS failure here points at outbound connectivity from the Worker rather than configuration.";
    return NextResponse.json(report, { status: 503 });
  }
}
