import { NextRequest, NextResponse } from "next/server";
import { entitlementFromRequest } from "@/lib/auth/entitlement";
import {
  READING_PASS,
  READING_PASS_PATH,
  READING_PASS_MAX_AGE,
} from "@/lib/auth/reading-pass";

/**
 * Trades a verified session for the cookie that opens workbooks.
 *
 * The road map page calls this once, after its session resolves. See
 * lib/auth/reading-pass.ts for why a cookie is needed at all — in short, a
 * teacher opens a workbook by clicking a link, and a link cannot carry a
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
  response.cookies.set(READING_PASS, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: READING_PASS_PATH,
    maxAge: READING_PASS_MAX_AGE,
  });
  return response;
}
