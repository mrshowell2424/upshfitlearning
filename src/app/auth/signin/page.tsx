'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/auth'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

// supabase is a stub object when the Supabase env vars are absent, so calling
// .auth.* throws a bare TypeError. Check before using it and say so plainly.
const authReady = Boolean(supabase?.auth?.signInWithOAuth)
const NOT_CONFIGURED =
  'Sign-in is not available on this environment yet — the Supabase keys are missing.'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!authReady) {
      setError(NOT_CONFIGURED)
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push(next)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')

    if (!authReady) {
      setError(NOT_CONFIGURED)
      return
    }

    setLoading(true)

    try {
      // Carry the return path through the round trip
      const callback = new URL('/auth/callback', window.location.origin)
      if (next !== '/') callback.searchParams.set('next', next)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callback.toString(),
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      console.error('Google sign-in error:', err)
      setError('We could not reach Google sign-in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-5 md:px-8 py-14 md:py-24 bg-gray-050">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 border border-hairline">
            <h1 className="text-3xl font-bold text-charcoal mb-2">Sign in</h1>
            <p className="text-sm text-text-muted mb-8">
              Sign in to your Upshift Learning account
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full mb-6 bg-white border-2 border-border hover:bg-gray-50 text-charcoal px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3.01h3.86c2.26-2.09 3.56-5.17 3.56-8.88z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3.01c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a11.99 11.99 0 0 0 0 10.74l3.98-3.09z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.63l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
                </svg>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </div>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-hairline"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-muted">Or</span>
              </div>
            </div>

            {/* Email/Password Sign In */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-charcoal disabled:bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-charcoal disabled:bg-gray-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-coral hover:bg-coral-press text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-hairline">
              <p className="text-sm text-text-muted text-center">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-coral font-semibold hover:text-coral-press"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SignInPage() {
  // useSearchParams (for the ?next= return path) needs a Suspense boundary
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  )
}
