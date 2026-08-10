import Link from 'next/link'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { CheckoutButtons } from './checkout-buttons'
import { COURSE_COUNT } from '@/app/courses/courses-data'
import { RESOURCE_TOTAL, STANDARD_TOTAL } from '@/lib/constants/totals'

/**
 * Rendered per request so the checkout links are read at runtime.
 *
 * NEXT_PUBLIC_* values are normally inlined during the build, which means a
 * link set in the hosting dashboard only takes effect on the next rebuild —
 * and silently falls back to sign-up until then. Reading them here, in a server
 * component that renders per request, makes a Payment Link change take effect
 * as soon as it is saved, with no build and no stale page in between.
 *
 * The buttons themselves stay a client component, because they need the
 * session to prefill the payment email.
 */
export const dynamic = 'force-dynamic'

/**
 * Fallback checkout links.
 *
 * These live here because NEXT_PUBLIC_CHECKOUT_URL has repeatedly failed to
 * reach the deployed Worker, and a missing link fails silently — the button
 * still renders, it just sends people to sign-up instead of to Stripe. The same
 * thing happened with the Supabase keys, and the same answer applies: a
 * publicly visible value belongs somewhere reliable.
 *
 * Payment Links are public URLs by design — anyone clicking Upgrade sees them —
 * so there is nothing here that was not already going to the browser.
 *
 * Setting the environment variables still wins, and is the better home once
 * they work. A link containing "/test_" is labelled as test mode wherever it is
 * shown, so a test URL can never quietly stand in for a live one.
 */
const CHECKOUT_URL_FALLBACK = 'https://buy.stripe.com/test_fZucMZ2t5bAG5Oi3x4f3a01'

// The yearly link. CheckoutButtons withholds a yearly link whose environment
// does not match the monthly one above, because selling a $120 subscription
// through an environment the webhook is not listening to would take the money
// and grant nothing. Both are sandbox links, so the yearly button shows.
//
// The live yearly link is https://buy.stripe.com/6oU5kx5GSdjE0n56W6afS02 —
// swap both to live together, never one at a time.
const CHECKOUT_URL_ANNUAL_FALLBACK = 'https://buy.stripe.com/test_bJebIV5FhfQW7Wq2t0f3a02'

export default function PricingPage() {
  const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL || CHECKOUT_URL_FALLBACK
  const CHECKOUT_URL_ANNUAL =
    process.env.NEXT_PUBLIC_CHECKOUT_URL_ANNUAL || CHECKOUT_URL_ANNUAL_FALLBACK

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Have a proper look around',
      features: [
        `Every one of ${STANDARD_TOTAL} standards, with its lesson blueprint`,
        'Search the full resource library',
        "Teacher's Lounge articles",
        'No card, no trial period, no expiry',
      ],
      cta: 'Get Started',
      ctaHref: '/auth/signup',
      highlighted: false,
    },
    {
      name: 'All-Access',
      price: '$15',
      period: '/month or $120/year',
      description: 'Everything, for one teacher',
      features: [
        `Unpack any of ${STANDARD_TOTAL} standards — verbs, vocabulary, the learning ladder`,
        `All ${RESOURCE_TOTAL.toLocaleString()} resources, matched to the standard you are teaching`,
        `All ${COURSE_COUNT} courses, delivered through Google Classroom`,
        'Common misconceptions, and what to do about each one',
      ],
      // Rendered by CheckoutButtons, which needs the session to prefill the
      // payment email and to avoid selling to somebody who already has access.
      checkout: true,
      highlighted: true,
    },
    {
      name: 'School',
      price: 'Custom',
      description: 'For a team teaching the same standards',
      features: [
        'Everything in All-Access, for everyone',
        'One invoice instead of twenty',
        'Shared planning across a grade level or department',
        'Onboarding for your staff',
        'A person to email, not a form',
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
              The lesson blueprint for every standard is free, and always will be.
              All-Access opens the deconstruction, the matched resources and the
              courses.
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
                  q: 'How soon do I get access after paying?',
                  a: 'Within a day, usually much sooner. We switch All-Access on by hand at the moment, so sign in with the same email address you paid with — that is how we connect the two.',
                },
                {
                  q: 'Is there a free trial?',
                  a: `There is no trial, because there is no need for one. The lesson blueprint for all ${STANDARD_TOTAL} standards is free permanently, no card required. Upgrade whenever the rest becomes worth it to you.`,
                },
                {
                  q: 'How do school licences work?',
                  a: 'School plans are priced on how many teachers you have and what you need. Email hello@upshiftlearning.org and you will get a person, not a quote form.',
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
