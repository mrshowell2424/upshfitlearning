'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/auth'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/signin')
        }, 2000)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center px-8 py-24 bg-gray-050">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl p-8 border border-hairline text-center">
              <div className="text-5xl mb-4">✓</div>
              <h1 className="text-3xl font-bold text-charcoal mb-2">Check your email</h1>
              <p className="text-sm text-text-muted mb-8">
                We sent a confirmation link to <strong>{email}</strong>. Click it to verify your account.
              </p>
              <p className="text-xs text-text-muted">
                Redirecting to sign in...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-8 py-24 bg-gray-050">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 border border-hairline">
            <h1 className="text-3xl font-bold text-charcoal mb-2">Create account</h1>
            <p className="text-sm text-text-muted mb-8">
              Join Upshift Learning and access resources
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full mb-6 bg-white border-2 border-border hover:bg-gray-50 text-charcoal px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing up...' : 'Continue with Google'}
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-hairline"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-muted">Or</span>
              </div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-charcoal disabled:bg-gray-50"
                  required
                />
              </div>

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
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-hairline">
              <p className="text-sm text-text-muted text-center">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="text-coral font-semibold hover:text-coral-press"
                >
                  Sign in
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
