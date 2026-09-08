import { NextRequest, NextResponse } from "next/server";
import { mayReadMaterials } from "@/lib/auth/materials-pass";
import { DESIGN_GRADES } from "@/app/design-thinking/constants";
import { DESIGN_YEARS } from "@/app/design-thinking/weeks-data";

/**
 * One grade's Design Thinking year, to a signed-in teacher only.
 *
 * The page used to import the weeks directly, which put all 468 of them —
 * titles, driving questions and material links — into the client bundle and so
 * into the hands of anyone who opened the page signed out. The sign-in gate
 * blurred them; it did not withhold them.
 *
 * Serving them from here instead means an unauthenticated browser never
 * receives them. This is the same reasoning as /api/match/[code]/premium: gate
 * before serialising, because gating in the browser only decides what is
 * displayed.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await mayReadMaterials(request))) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const asked = request.nextUrl.searchParams.get("grade");
  const grade = DESIGN_GRADES.find((g) => g === asked);

  if (!grade) {
    return NextResponse.json({ error: "Unknown grade" }, { status: 400 });
  }

  return NextResponse.json(DESIGN_YEARS[grade], {
    // Per teacher, never in a shared cache — this is gated content.
    headers: { "cache-control": "private, max-age=300" },
  });
}
