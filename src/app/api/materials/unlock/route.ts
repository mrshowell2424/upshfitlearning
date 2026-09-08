import { NextRequest, NextResponse } from "next/server";
import { entitlementFromRequest } from "@/lib/auth/entitlement";
import {
  MATERIALS_PASS,
  MATERIALS_PASS_PATH,
  MATERIALS_PASS_MAX_AGE,
} from "@/lib/auth/materials-pass";

/**
 * Trades a verified session for the cookie that opens gated materials.
 *
 * Each road map page calls this once, after its session resolves. See
 * lib/auth/materials-pass.ts for why a cookie is needed at all — in short, a
 * teacher opens a material by clicking a link, and a link cannot carry a
 * bearer token.
 *
 * The token is verified here before the cookie is issued, so this hands out
 * nothing that the caller did not already prove.
 */
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { userId } = await entitlementFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  // Verified above, so it is safe to hand back as the pass.
  const token = request.headers.get("authorization")!.split(" ")[1].trim();

  const response = NextResponse.json({ ok: true });
  response.cookies.set(MATERIALS_PASS, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: MATERIALS_PASS_PATH,
    maxAge: MATERIALS_PASS_MAX_AGE,
  });
  return response;
}
