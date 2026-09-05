import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reading_materials } from "@/lib/db/schema";
import { mayReadMaterials } from "@/lib/auth/reading-pass";

/**
 * Serves a Basic Reading workbook to a signed-in teacher, and nobody else.
 *
 * The pages come from Postgres rather than from disk. This is not a
 * preference: production runs on Cloudflare Workers, where the deployed bundle
 * is a single worker.js with no filesystem behind it — probing the running
 * worker reported cwd as /bundle containing exactly one entry, and readdir on
 * the materials directory threw ENOENT. An earlier version of this route read
 * the files with node:fs and returned 404 for every workbook in production
 * while passing every test locally, because outputFileTracingIncludes means
 * nothing to a Worker bundle.
 *
 * content-reading-materials/ is still the source of truth; the table is filled
 * from it by scripts/seed-reading-materials.ts, which must be re-run whenever
 * the canvas is re-exported.
 *
 * Each .dc.html asks for ./support.js and ./deck-stage.js as siblings, which
 * resolve back into this route and are checked the same way. That is why those
 * runtime files are stored under every directory that holds pages.
 */
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  if (!(await mayReadMaterials(request))) {
    // No body worth inspecting — the point is that a signed-out caller gets
    // nothing, not that they get a nicer error.
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { path: segments } = await context.params;

  // Next hands these back decoded, but decoding again is harmless for these
  // names and keeps the route correct either way.
  const key = segments
    .map((s) => {
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    })
    .join("/");

  let row;
  try {
    [row] = await db
      .select()
      .from(reading_materials)
      .where(eq(reading_materials.path, key))
      .limit(1);
  } catch (error) {
    // A database failure is not a missing workbook, and saying "not found"
    // would send someone hunting for a file that is sitting right there.
    console.error("reading material lookup failed:", key, error);
    return NextResponse.json({ error: "Materials are temporarily unavailable" }, { status: 503 });
  }

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return new NextResponse(row.content, {
    headers: {
      "content-type": row.content_type,
      // Gated content must not sit in a shared cache. The browser may keep it
      // for the length of a lesson; nothing in between may keep it at all.
      "cache-control": "private, max-age=3600",
      "x-content-type-options": "nosniff",
    },
  });
}
