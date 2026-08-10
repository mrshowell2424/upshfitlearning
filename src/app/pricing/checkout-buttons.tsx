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

  /**
   * Carries the account into Stripe: the email so the payment is made with the
   * address they signed in under, and client_reference_id so the webhook can
   * grant access without matching on email at all. Without the id a payment
   * arrives with nothing but an address, and has to wait for that person to
   * sign in before it can be honoured.
   */
  const withAccount = (url: string) => {
    const params = new URLSearchParams()
    if (user?.email) params.set('prefilled_email', user.email)
    if (user?.id) params.set('client_reference_id', user.id)
    const query = params.toString()
    return query ? `${url}?${query}` : url
  }

  // Stripe test links contain "/test_" and take no money. Saying so on the page
  // means a test link can never quietly stand in for a live one — the failure
  // would otherwise be invisible until someone noticed no payments arriving.
  const modeOf = (url: string) => (url.includes('/test_') ? 'sandbox' : 'live')
  const isTestMode = modeOf(monthlyUrl) === 'sandbox'

  /**
   * A yearly link in the other Stripe environment is worse than no yearly link
   * at all, so it is withheld rather than shown.
   *
   * The webhook that turns a payment into access is registered against one
   * environment. A payment made in the other succeeds, takes the money, and
   * fires events nothing is listening for — the teacher is charged and stays
   * locked out. Mixing them also makes the notice below lie: it is decided by
   * the monthly link, so a sandbox monthly beside a live yearly would promise
   * "no payment will be taken" above a button charging $120.
   */
  const yearlyUrl =
    annualUrl && modeOf(annualUrl) === modeOf(monthlyUrl) ? annualUrl : undefined

  return (
    <div className="mb-8">
      <a
        href={withAccount(monthlyUrl)}
        className="block w-full text-center px-6 py-3 rounded-xl font-semibold bg-coral hover:bg-coral-press text-white transition-colors"
      >
        {yearlyUrl ? 'Subscribe monthly' : 'Get All-Access'}
      </a>

      {yearlyUrl && (
        <a
          href={withAccount(yearlyUrl)}
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
