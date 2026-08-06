import { NextRequest, NextResponse } from 'next/server'

/**
 * OAuth lands here because this is the URL allowlisted in Supabase, but the PKCE
 * code verifier lives in the browser's storage — the server has no way to
 * complete the exchange. So forward the query untouched to a client page that
 * can. Previously this route called exchangeCodeForSession() with the anon
 * client, which always failed and bounced people back to sign-in.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const target = new URL('/auth/complete', requestUrl.origin)
  target.search = requestUrl.search
  return NextResponse.redirect(target)
}
