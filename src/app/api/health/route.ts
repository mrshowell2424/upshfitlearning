// @ts-nocheck
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { standards, standard_unpacks, lesson_blueprints } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { getResources } from "@/lib/utils/resources";

/**
 * One place that says whether the site's data sources are actually working.
 *
 * This exists because every page that reads data catches its own errors and
 * renders an empty state, which means a dead dependency and an empty one look
 * identical from outside. That is not hypothetical: the database had never
 * once connected in production and nothing anywhere said so — the standard
 * pages simply read "we don't have this standard written up yet", which is
 * also what they say when a standard genuinely has not been written.
 *
 * Every check reports its own status so a single failure names itself rather
 * than taking the whole report down with it. The HTTP status is 200 only when
 * nothing is failing, so an uptime monitor pointed here needs no parsing.
 */
export const dynamic = "force-dynamic";

type CheckStatus = "ok" | "failing" | "not-configured";

interface Check {
  name: string;
  status: CheckStatus;
  detail?: string;
  /** Numbers worth watching over time — row counts, library size. */
  metrics?: Record<string, number>;
  ms?: number;
}

/** Runs a check, timing it and turning a throw into a failing result. */
async function check(name: string, fn: () => Promise<Omit<Check, "name" | "ms">>): Promise<Check> {
  const started = Date.now();
  try {
    const result = await fn();
    return { name, ...result, ms: Date.now() - started };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      name,
      status: "failing",
      // Truncated so a driver error cannot echo a connection string back.
      detail: message.slice(0, 200),
      ms: Date.now() - started,
    };
  }
}

async function checkDatabase(): Promise<Omit<Check, "name" | "ms">> {
  if (!process.env.DATABASE_URL) {
    return {
      status: "failing",
      detail: "DATABASE_URL is not readable at request time — check it is set as a Worker secret",
    };
  }

  const [standardCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(standards);
  const [unpackCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(standard_unpacks);
  const [blueprintCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(lesson_blueprints);

  const metrics = {
    standards: standardCount?.n ?? 0,
    unpacks: unpackCount?.n ?? 0,
    blueprints: blueprintCount?.n ?? 0,
  };

  // A standard without an unpack or blueprint renders as "not written up yet",
  // so a drift between these counts is a content bug hiding as an empty state.
  if (metrics.standards === 0) {
    return { status: "failing", detail: "Connected, but the standards table is empty", metrics };
  }

  const incomplete =
    metrics.standards - Math.min(metrics.unpacks, metrics.blueprints);

  return {
    status: "ok",
    detail: incomplete > 0 ? `${incomplete} standard(s) missing an unpack or blueprint` : undefined,
    metrics,
  };
}

async function checkResourceLibrary(): Promise<Omit<Check, "name" | "ms">> {
  const resources = await getResources();

  if (!resources?.length) {
    return {
      status: "failing",
      detail: "Resource library loaded zero items — the Google Sheet may be unreachable or empty",
      metrics: { resources: 0 },
    };
  }

  return { status: "ok", metrics: { resources: resources.length } };
}

async function checkAuth(): Promise<Omit<Check, "name" | "ms">> {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qiupwcnjwxirnnmizgvd.supabase.co";

  const response = await fetch(`${url}/auth/v1/settings`, {
    headers: {
      apikey:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        "sb_publishable_uejy_XnOpWbVZKrZ2Z_3Mg_5KRrZuKJ",
    },
  });

  if (!response.ok) {
    return { status: "failing", detail: `Supabase auth returned ${response.status}` };
  }

  const settings = await response.json();

  if (!settings?.external?.google) {
    return { status: "failing", detail: "Google sign-in is disabled in Supabase" };
  }

  return { status: "ok" };
}

async function checkCheckout(): Promise<Omit<Check, "name" | "ms">> {
  // The pricing page falls back to a link in the source, so a missing variable
  // is not an outage — but a test link live in production is worth flagging.
  const monthly = process.env.NEXT_PUBLIC_CHECKOUT_URL;

  if (!monthly) {
    return { status: "not-configured", detail: "Using the checkout link compiled into the source" };
  }

  if (monthly.includes("/test_")) {
    return { status: "not-configured", detail: "Checkout is a Stripe TEST link — no money will be taken" };
  }

  return { status: "ok" };
}

export async function GET() {
  const checks = await Promise.all([
    check("database", checkDatabase),
    check("resource-library", checkResourceLibrary),
    check("auth", checkAuth),
    check("checkout", checkCheckout),
  ]);

  const failing = checks.filter((c) => c.status === "failing");

  return NextResponse.json(
    {
      status: failing.length ? "failing" : "ok",
      failing: failing.map((c) => c.name),
      checks,
    },
    { status: failing.length ? 503 : 200 }
  );
}
