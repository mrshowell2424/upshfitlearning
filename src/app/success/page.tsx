import Link from 'next/link'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

/**
 * Where Stripe sends a teacher after payment.
 *
 * Access is granted by hand at the moment rather than by webhook, so this page
 * has to do a job an instant-activation page would not: set the expectation
 * that there is a wait, and make clear that signing in with the same email is
 * what connects the payment to the account. Getting that wrong is the one way
 * this flow strands somebody.
 */
export const metadata = {
  title: 'Thanks for subscribing — Upshift Learning',
}

export default function SuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center px-5 md:px-8 py-14 md:py-24 bg-gray-050">
        <div className="w-full max-w-lg bg-white rounded-3xl p-8 md:p-10 border border-hairline">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: 'var(--color-teal)' }}
          >
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden="true"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h1 className="text-[28px] md:text-[32px] font-bold text-charcoal mb-3 leading-tight">
            Payment received — thank you
          </h1>

          <p className="text-[16px] text-text-body mb-8 leading-relaxed">
            You are all set on the billing side. One more step to get All-Access
            switched on for your account.
          </p>

          <div className="rounded-2xl bg-gray-050 border border-hairline p-6 mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-faint mb-3">
              What happens next
            </p>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="font-bold text-charcoal shrink-0">1.</span>
                <span className="text-[15px] text-text-body">
                  Sign in using <strong>the same email address you paid with</strong>.
                  That is how we connect your payment to your account.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-charcoal shrink-0">2.</span>
                <span className="text-[15px] text-text-body">
                  We switch All-Access on, usually within a day.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-charcoal shrink-0">3.</span>
                <span className="text-[15px] text-text-body">
                  Every standard opens up — the full deconstruction, matched
                  resources, and the generator.
                </span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/auth/signin"
              className="flex-1 text-center px-6 py-3 rounded-xl font-semibold text-white bg-coral hover:bg-coral-press transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/match"
              className="flex-1 text-center px-6 py-3 rounded-xl font-semibold text-charcoal border-2 border-charcoal hover:bg-charcoal hover:text-white transition-colors"
            >
              Browse standards
            </Link>
          </div>

          <p className="text-[13px] text-text-muted mt-8">
            Something not right? Email{' '}
            <a
              href="mailto:hello@upshiftlearning.org"
              className="font-semibold text-link-blue hover:underline"
            >
              hello@upshiftlearning.org
            </a>{' '}
            and we will sort it out.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
