import { NextResponse } from "next/server";

/**
 * TEMPORARY. Reports what the deployed runtime can actually do, so the workbook
 * route can be fixed against fact rather than guesswork. Reports capabilities
 * only — no environment values, no file contents. Delete once answered.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const out: Record<string, unknown> = {};

  out.runtime = typeof (globalThis as Record<string, unknown>).EdgeRuntime !== "undefined"
    ? "edge"
    : typeof process !== "undefined" && process.versions?.node
      ? `node ${process.versions.node}`
      : "unknown";
  out.hasNavigatorUA = (globalThis as { navigator?: { userAgent?: string } }).navigator?.userAgent ?? null;

  try {
    out.cwd = process.cwd();
  } catch (e) {
    out.cwd = `threw: ${(e as Error).message}`;
  }

  try {
    const { readdir } = await import("node:fs/promises");
    const path = await import("node:path");
    const root = path.join(process.cwd(), "content-reading-materials");
    out.materialsDir = root;
    const entries = await readdir(root);
    out.fileCount = entries.length;
    out.sample = entries.slice(0, 3);
    out.fsWorks = true;
  } catch (e) {
    out.fsWorks = false;
    out.fsError = `${(e as Error).name}: ${(e as Error).message}`;
  }

  try {
    const { readdir } = await import("node:fs/promises");
    out.cwdListing = (await readdir(process.cwd())).slice(0, 25);
  } catch (e) {
    out.cwdListing = `threw: ${(e as Error).message}`;
  }

  return NextResponse.json(out);
}
