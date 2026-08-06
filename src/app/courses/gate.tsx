'use client'

import { useAuth } from '@/providers/AuthProvider'

/**
 * Courses are All-Access only. Non-subscribers get the plans prompt instead of
 * the catalogue.
 *
 * Note this is a client-side gate, so it controls what is *shown*, not what is
 * *served*. It's honest UI, not an entitlement boundary — once billing is live,
 * anything genuinely private (course materials, the Classroom join code) should
 * come from a route that checks the subscription server-side.
 */
export function CoursesGate({ children }: { children: React.ReactNode }) {
  const { isPremium, isLoading } = useAuth()

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 px-5 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
        </div>
      </section>
    )
  }

  if (!isPremium) {
    return (
      <section className="py-12 md:py-16 px-5 md:px-8 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="border-2 border-teal rounded-2xl p-8 md:p-10 bg-white">
            <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-teal mb-4">
              All-Access
            </span>

            <h2 className="text-[22px] md:text-[26px] font-bold text-charcoal mb-3">
              Courses are part of All-Access
            </h2>

            <p className="text-text-body mb-6">
              All-Access members get every course at no extra cost, delivered
              through Google Classroom. Graduate credit is available separately
              through Malone University.
            </p>

            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg bg-coral px-6 min-h-[48px] font-semibold text-white hover:bg-coral-press transition-colors"
            >
              See plans
            </a>
          </div>
        </div>
      </section>
    )
  }

  return <>{children}</>
}
