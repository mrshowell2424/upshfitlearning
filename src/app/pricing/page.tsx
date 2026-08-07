'use client'

import Link from 'next/link'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { CheckoutButtons } from './checkout-buttons'

/**
 * Where the Pro button sends people.
 *
 * A Stripe Payment Link, set as a build variable. Deliberately not the
 * half-built checkout API: a hosted link needs no keys, no webhook and no
 * success page, and access is granted by hand afterwards with
 * scripts/grant-access.ts. That is the right amount of machinery for the first
 * handful of customers, and it can be swapped for real checkout later without
 * touching this page.
 *
 * Unset — as in local development — the button falls back to sign-up, so the
 * page is never broken by a missing variable.
 */
const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL

/**
 * The annual price is a second Payment Link, because a link is tied to exactly
 * one price in Stripe. Set it and the Pro card offers both; leave it unset and
 * the card shows monthly alone, so half-finished setup never puts a dead button
 * in front of a teacher.
 */
const CHECKOUT_URL_ANNUAL = process.env.NEXT_PUBLIC_CHECKOUT_URL_ANNUAL

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for exploring',
      features: [
        '200 curated resources',
        'Read-only access',
        "Teacher's Lounge articles",
        'Basic standard matching',
      ],
      cta: 'Get Started',
      ctaHref: '/auth/signup',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$15',
      period: '/month or $120/year',
      description: 'For active teachers',
      features: [
        'All 2,688+ resources',
        'Generate lessons in 4 formats',
        'Save & organize resources',
        'Advanced search & filtering',
        'Priority support',
      ],
      // Rendered by CheckoutButtons, which needs the session to prefill the
      // payment email and to avoid selling to somebody who already has access.
      checkout: true,
      highlighted: true,
    },
    {
      name: 'School',
      price: 'Custom',
      description: 'For teams & districts',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Admin dashboard',
        'Bulk resource management',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      ctaHref: 'mailto:hello@upshiftlearning.org',
      highlighted: false,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-14 md:py-24 px-5 md:px-8 bg-gradient-to-br from-gray-050 to-white border-b border-hairline">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-opacity-10 rounded-full" style={{backgroundColor: 'rgba(255, 106, 91, 0.1)'}}>
              <span className="text-xs font-bold tracking-wide text-coral uppercase">Transparent Pricing</span>
            </div>
            <h1 className="text-5xl font-bold text-charcoal mb-4">
              Simple, fair pricing
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Choose the plan that works for you. All plans include access to our full learning science library.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-14 md:py-24 px-5 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-3xl p-8 border-2 transition-all ${
                    plan.highlighted
                      ? 'border-coral bg-white shadow-xl scale-105'
                      : 'border-hairline bg-gray-050 hover:border-charcoal'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="inline-block mb-4 px-3 py-1 bg-coral text-white text-xs font-bold rounded-full">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-charcoal mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-text-muted mb-6">
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-charcoal">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-sm text-text-muted">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  {plan.checkout ? (
                    <CheckoutButtons
                      monthlyUrl={CHECKOUT_URL}
                      annualUrl={CHECKOUT_URL_ANNUAL}
                    />
                  ) : (
                    <Link
                      href={plan.ctaHref ?? '/auth/signup'}
                      className={`block w-full text-center px-6 py-3 rounded-xl font-semibold mb-8 transition-colors ${
                        plan.highlighted
                          ? 'bg-coral hover:bg-coral-press text-white'
                          : 'bg-white border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  )}

                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="text-teal text-lg flex-shrink-0">✓</span>
                        <span className="text-sm text-text-body">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-24 px-5 md:px-8 bg-gray-050">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-charcoal mb-12 text-center">
              Frequently asked questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: 'Can I change plans anytime?',
                  a: 'Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'Is there a free trial?',
                  a: 'Our free plan gives you access to 200 resources permanently. Upgrade to Pro anytime to unlock everything.',
                },
                {
                  q: 'How do school licenses work?',
                  a: 'School plans are customized based on your district size and needs. Contact hello@upshiftlearning.org for pricing.',
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied.',
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-hairline">
                  <h3 className="font-semibold text-charcoal mb-2">{item.q}</h3>
                  <p className="text-sm text-text-body">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
