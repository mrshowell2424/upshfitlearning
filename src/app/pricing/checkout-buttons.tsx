'use client'

import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'

/**
 * The Pro buttons, which need to know who is signed in.
 *
 * Access is granted by matching the Stripe payment's email to an account, so
 * the two must agree. Left to chance they often will not — people pay with a
 * personal address and sign in with a school one, and the payment cannot be
 * connected to anybody.
 *
 * So a signed-in teacher goes to Stripe with their email already filled in, and
 * a signed-out one is sent to create an account first. That makes the addresses
 * match by construction rather than by instruction.
 */
export function CheckoutButtons({
  monthlyUrl,
  annualUrl,
}: {
  monthlyUrl?: string
  annualUrl?: string
}) {
  const { user, isPremium, isLoading } = useAuth()

  // Nothing to sell to somebody who already has it
  if (!isLoading && isPremium) {
    return (
      <div className="mb-8">
        <div className="block w-full text-center px-6 py-3 rounded-xl font-semibold bg-gray-050 border border-hairline text-text-muted">
          You have All-Access
        </div>
      </div>
    )
  }

  // Without a checkout link configured, sign-up is the only sensible target
  if (!monthlyUrl) {
    return (
      <div className="mb-8">
        <Link
          href="/auth/signup"
          className="block w-full text-center px-6 py-3 rounded-xl font-semibold bg-coral hover:bg-coral-press text-white transition-colors"
        >
          Get All-Access
        </Link>
      </div>
    )
  }

  // Signed out: make the account first, so there is something to grant access to
  if (!isLoading && !user) {
    return (
      <div className="mb-8">
        <Link
          href="/auth/signup?next=/pricing"
          className="block w-full text-center px-6 py-3 rounded-xl font-semibold bg-coral hover:bg-coral-press text-white transition-colors"
        >
          Create an account to upgrade
        </Link>
        <p className="text-[13px] text-text-muted text-center mt-3">
          Takes a moment, and it is what we connect your subscription to.
        </p>
      </div>
    )
  }

  const withEmail = (url: string) =>
    user?.email ? `${url}?prefilled_email=${encodeURIComponent(user.email)}` : url

  // Stripe test links contain "/test_" and take no money. Saying so on the page
  // means a test link can never quietly stand in for a live one — the failure
  // would otherwise be invisible until someone noticed no payments arriving.
  const isTestMode = monthlyUrl.includes('/test_')

  return (
    <div className="mb-8">
      <a
        href={withEmail(monthlyUrl)}
        className="block w-full text-center px-6 py-3 rounded-xl font-semibold bg-coral hover:bg-coral-press text-white transition-colors"
      >
        {annualUrl ? 'Subscribe monthly' : 'Get All-Access'}
      </a>

      {annualUrl && (
        <a
          href={withEmail(annualUrl)}
          className="block w-full text-center px-6 py-3 mt-2 rounded-xl font-semibold text-sm text-charcoal border border-border-strong hover:bg-gray-050 transition-colors"
        >
          Or pay yearly — save $60
        </a>
      )}

      {isTestMode && (
        <p className="text-[12px] font-semibold text-center mt-3" style={{ color: 'var(--color-amber)' }}>
          Test mode — no payment will be taken
        </p>
      )}
    </div>
  )
}
