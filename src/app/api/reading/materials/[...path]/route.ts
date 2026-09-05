import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { mayReadMaterials } from "@/lib/auth/reading-pass";

/**
 * Serves a Basic Reading workbook to a signed-in teacher, and nobody else.
 *
 * These files used to live in public/, where the sign-in gate on the road map
 * was decoration — the page blurred, the files did not. They now sit outside
 * public/ and arrive only through here, so a link without an account is a 401
 * rather than a workbook.
 *
 * Each .dc.html asks for ./support.js and ./deck-stage.js as siblings, which
 * resolve back into this same route and are checked the same way. That is why
 * those runtime files are copied into every directory that holds pages.
 */
export const dynamic = "force-dynamic";

/** Outside public/ on purpose: nothing here is statically served. */
const ROOT = path.join(process.cwd(), "content-reading-materials");

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

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

  // Resolve first, then check the result is still inside ROOT. Comparing the
  // resolved paths catches ".." and encoded variants of it in one test, rather
  // than trying to enumerate what a traversal attempt might look like.
  const target = path.resolve(ROOT, ...segments.map((s) => decodeURIComponent(s)));
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let file: Buffer;
  try {
    file = await readFile(target);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "content-type": TYPES[path.extname(target).toLowerCase()] ?? "application/octet-stream",
      // Gated content must not sit in a shared cache. The browser may keep it
      // for the length of a lesson; nothing in between may keep it at all.
      "cache-control": "private, max-age=3600",
      "x-content-type-options": "nosniff",
    },
  });
}
