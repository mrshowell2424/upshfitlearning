import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (err) {
      console.error('Auth callback error:', err)
    }
  }

  return NextResponse.redirect(
    new URL('/auth/signin?error=authentication_failed', request.url)
  )
}
