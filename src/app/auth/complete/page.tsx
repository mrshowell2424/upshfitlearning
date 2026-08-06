'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/auth'

/**
 * Completes the OAuth sign-in. This has to run in the browser: PKCE stores its
 * code verifier in local storage, so only the client that started the flow can
 * exchange the code for a session.
 */
function CompleteSignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const complete = async () => {
      if (!supabase?.auth?.exchangeCodeForSession) {
        setError('Sign-in is not configured on this environment.')
        return
      }

      const next = searchParams.get('next') || '/'
      const code = searchParams.get('code')
      const oauthError = searchParams.get('error_description') || searchParams.get('error')

      if (oauthError) {
        setError(oauthError)
        return
      }

      // supabase-js also auto-detects the session in the URL; getSession() picks
      // that up when the exchange has already happened.
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          setError(exchangeError.message)
          return
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setError('We could not complete your sign-in. Please try again.')
        return
      }

      router.replace(next)
    }

    complete().catch(err => {
      console.error('Auth completion error:', err)
      setError('We could not complete your sign-in. Please try again.')
    })
  }, [router, searchParams])

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-14 md:py-24 bg-gray-050 min-h-screen">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-hairline text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-charcoal mb-2">Sign-in failed</h1>
            <p className="text-sm text-text-muted mb-6">{error}</p>
            <a
              href="/auth/signin"
              className="inline-flex items-center justify-center rounded-lg bg-coral px-5 py-3 font-semibold text-white hover:bg-coral-press transition-colors"
            >
              Back to sign in
            </a>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-charcoal mb-2">Signing you in…</h1>
            <p className="text-sm text-text-muted">One moment.</p>
          </>
        )}
      </div>
    </main>
  )
}

function Waiting() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-14 md:py-24 bg-gray-050 min-h-screen">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-hairline text-center">
        <h1 className="text-2xl font-bold text-charcoal mb-2">Signing you in…</h1>
        <p className="text-sm text-text-muted">One moment.</p>
      </div>
    </main>
  )
}

export default function AuthCompletePage() {
  // useSearchParams needs a Suspense boundary for the build to prerender this
  return (
    <Suspense fallback={<Waiting />}>
      <CompleteSignIn />
    </Suspense>
  )
}
