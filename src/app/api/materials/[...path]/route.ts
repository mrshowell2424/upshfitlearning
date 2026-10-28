import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reading_materials } from "@/lib/db/schema";
import { mayReadMaterials } from "@/lib/auth/materials-gate";

/**
 * Serves a gated teaching material to a signed-in teacher, and nobody else.
 *
 * Both road maps come through here — Basic Reading workbooks at the root of the
 * store, Design Thinking slides and workbooks under design-thinking/.
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

/**
 * What a teacher sees instead of {"error":"Sign in required"}.
 *
 * Plain inline HTML because this is served by the route, not rendered by the
 * app — there is no layout, no Tailwind, and no client bundle here.
 */
const LOCKED_PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sign in to open this</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#FAF7F2;
    color:#24303D;font:500 16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;padding:24px}
  main{max-width:30rem;background:#fff;border:3px solid #E4DED4;border-left:10px solid #2F7A8C;
    border-radius:16px;padding:28px 30px}
  h1{margin:6px 0 10px;font-size:25px;font-weight:800;line-height:1.15}
  p{margin:0 0 10px;color:#6B7480}
  .eyebrow{font-size:11px;font-weight:800;letter-spacing:.12em;color:#2F7A8C}
  a{display:inline-block;margin-top:12px;background:#24303D;color:#fff;text-decoration:none;
    font-weight:700;padding:11px 20px;border-radius:11px}
</style></head>
<body><main>
  <div class="eyebrow">SIGN IN REQUIRED</div>
  <h1>This one is for signed-in teachers</h1>
  <p>Materials are free, but not anonymous — an account is all it takes.</p>
  <p>If you are already signed in, your pass has expired. Go back to the page
     you came from, reload it, and the link will open.</p>
  <a href="/science-of-reading">Back to Science of Reading</a>
</main></body></html>`;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  if (!(await mayReadMaterials(request))) {
    // A material is opened by clicking a link, so a refused request usually
    // lands in a fresh tab in front of a teacher — who, more often than not,
    // is signed in and has simply arrived with no pass, or with an expired
    // one. Handing them raw JSON tells them nothing and reads like a broken
    // site. Anything not asking for a page still gets the bare 401.
    const wantsPage = (request.headers.get("accept") || "").includes("text/html");
    if (!wantsPage) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }
    return new NextResponse(LOCKED_PAGE, {
      status: 401,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
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
