'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { isStandardCode, standardHref } from '@/lib/utils/standards'
import { RESOURCE_TOTAL, STANDARD_TOTAL } from '@/lib/constants/totals'
import { PRINCIPLES } from '@/lib/constants/learning-science'

export default function Home() {
  const [searchInput, setSearchInput] = useState('')
  const router = useRouter()
  const { isPremium, isLoading } = useAuth()

  const handleSearch = (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return

    // A standard code goes straight to that standard's detail page, so the
    // deconstruction, blueprint, resources and generator are all right there.
    if (isStandardCode(trimmed)) {
      router.push(standardHref(trimmed))
      return
    }

    // Plain-language search: premium users get the resource library, everyone
    // else gets the standard matcher.
    if (isPremium) {
      router.push(`/resources?search=${encodeURIComponent(trimmed)}`)
    } else {
      router.push(`/match?q=${encodeURIComponent(trimmed)}`)
    }
  }

  const examples = [
    { code: 'RL.2.1', subject: 'ELA' },
    { code: 'RI.4.2', subject: 'ELA' },
    { code: 'L.5.4', subject: 'ELA' },
    { code: 'RL.6.3', subject: 'ELA' },
    { code: '2.NBT.B.5', subject: 'Math' },
    { code: '3.MD.A.1', subject: 'Math' },
    { code: '5.LS1.A', subject: 'Science' },
    { code: 'K.PS2.A', subject: 'Science' },
    { code: '3.5.C', subject: 'Social Studies' },
    { code: '4.4.B', subject: 'Social Studies' },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-24 px-5 md:px-8 bg-gradient-to-br from-gray-050 to-white">
          <div className="relative max-w-7xl mx-auto">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-opacity-10 rounded-full" style={{backgroundColor: 'rgba(255, 106, 91, 0.1)'}}>
              <span className="text-xs font-bold tracking-wide text-coral uppercase">Science of Learning First</span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-[32px] sm:text-4xl md:text-5xl font-bold text-charcoal mb-4 leading-[1.15] md:leading-tight">
              Describe what you're teaching.<br className="hidden sm:inline" />{" "}
              We'll hand you the lesson.
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-text-muted mb-8 max-w-2xl">
              Search by standard or describe what you're teaching. Get a lesson blueprint, resources, and materials.
            </p>

            {/* Search Bar */}
            <div className="mb-6 max-w-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white rounded-2xl p-3 border border-border" style={{boxShadow: '0 12px 34px rgba(17,17,17,.09)'}}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-coral text-xl flex-shrink-0">✳</span>
                  <input
                    type="text"
                    placeholder='RL.2.1 — or "text evidence"'
                    className="flex-1 min-w-0 outline-none text-base sm:text-sm placeholder:text-text-muted py-2 sm:py-0"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchInput)}
                  />
                </div>
                <button
                  onClick={() => handleSearch(searchInput)}
                  className="bg-coral hover:bg-coral-press text-white px-6 min-h-[44px] rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
                >
                  Match my standard
                </button>
              </div>
            </div>

            {/* Example Chips */}
            <div className="flex items-center gap-2 md:gap-3 mb-12 flex-wrap">
              <span className="text-sm text-text-muted">Try:</span>
              {examples.slice(0, 7).map((example) => (
                <Link
                  key={example.code}
                  href={standardHref(example.code)}
                  className="inline-flex items-center min-h-[44px] px-4 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-full text-sm font-medium border border-border transition-colors"
                  title={`${example.subject} — open ${example.code}`}
                >
                  {example.code}
                </Link>
              ))}
            </div>

            {/* Stat Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline rounded-2xl overflow-hidden">
              <Link href="/resources" className="bg-white p-4 md:p-6 text-center hover:bg-gray-050 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-coral mb-1">{RESOURCE_TOTAL.toLocaleString()}</div>
                <div className="text-xs uppercase font-bold tracking-wider text-text-faint">Resources</div>
              </Link>
              <Link href="/match" className="bg-white p-4 md:p-6 text-center hover:bg-gray-050 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-lavender mb-1">{STANDARD_TOTAL}</div>
                <div className="text-xs uppercase font-bold tracking-wider text-text-faint">Standards</div>
              </Link>
              <Link href="/match/random" className="bg-white p-4 md:p-6 text-center hover:bg-gray-050 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-teal mb-1">K–12</div>
                <div className="text-xs uppercase font-bold tracking-wider text-text-faint">Grade Span</div>
              </Link>
              <Link href="/learning-science" className="bg-white p-4 md:p-6 text-center hover:bg-gray-050 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-pink mb-1">{PRINCIPLES.length}</div>
                <div className="text-xs uppercase font-bold tracking-wider text-text-faint">Learning Science Principles</div>
              </Link>
            </div>
          </div>
        </section>

        {/* Start Here Section */}
        <section className="py-14 md:py-24 px-5 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-charcoal mb-8">Start here</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="border-2 border-coral rounded-2xl bg-white p-6 hover:border-charcoal transition-colors">
                <div className="text-xs font-bold tracking-wider text-coral uppercase mb-2">Find Standards</div>
                <h3 className="text-xl font-bold text-charcoal mb-3">Standard matcher</h3>
                <p className="text-sm text-text-body mb-4">
                  Search by code or describe what you're teaching, and we'll find the exact standard.
                </p>
                <Link href="/match" className="inline-flex items-center gap-2 text-coral font-semibold hover:text-coral-press transition-colors">
                  Get started →
                </Link>
              </div>

              {/* Card 2 */}
              <div className="border-l-4 border-lavender rounded-2xl bg-white p-6 border border-hairline hover:border-charcoal transition-colors">
                <div className="text-xs font-bold tracking-wider text-lavender uppercase mb-2">Discover Resources</div>
                <h3 className="text-xl font-bold text-charcoal mb-3">Resource library</h3>
                <p className="text-sm text-text-body mb-4">
                  All {RESOURCE_TOTAL.toLocaleString()} curated resources, free with an account. Filter by grade, skill, and format.
                </p>
                <Link href="/resources" className="inline-flex items-center gap-2 text-coral font-semibold hover:text-coral-press transition-colors">
                  Browse resources →
                </Link>
              </div>

              {/* Card 3 */}
              <div className="border-l-4 border-teal rounded-2xl bg-white p-6 border border-hairline hover:border-charcoal transition-colors">
                <div className="text-xs font-bold tracking-wider text-teal uppercase mb-2">Learn More</div>
                <h3 className="text-xl font-bold text-charcoal mb-3">Teacher's lounge</h3>
                <p className="text-sm text-text-body mb-4">
                  Read articles, watch videos, and learn from teaching strategies grounded in learning science.
                </p>
                <Link href="/lounge" className="inline-flex items-center gap-2 text-coral font-semibold hover:text-coral-press transition-colors">
                  Read articles →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sign-up band */}
        <section className="py-14 md:py-24 px-5 md:px-8 bg-gray-050">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rounded-3xl overflow-hidden">
              {/* Left: the ask */}
              <div className="bg-charcoal text-white p-8 rounded-3xl">
                <div className="text-xs font-bold tracking-wider text-pink uppercase mb-3">
                  Free with an account
                </div>
                <h3 className="text-3xl font-bold mb-3">
                  Everything here is free
                </h3>
                <p className="text-sm text-gray-200 mb-6 leading-relaxed">
                  All {RESOURCE_TOTAL.toLocaleString()} resources and all {STANDARD_TOTAL} standards,
                  open the moment you have an account. Nothing is held back for a paid tier.
                </p>
                <Link
                  href="/auth/signup"
                  className="inline-block bg-coral hover:bg-coral-press text-white px-6 py-3 rounded-xl font-semibold mb-2 transition-colors"
                >
                  Create a free account
                </Link>
                <div className="text-xs text-gray-300">No card, no trial period, no expiry</div>
              </div>

              {/* Right: what the account opens */}
              <div className="bg-white p-8 rounded-3xl flex flex-col justify-center">
                <h4 className="text-lg font-bold text-charcoal mb-6">What an account opens</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-teal text-lg">&#10003;</span>
                    <div>
                      <div className="font-semibold text-charcoal">Every standard, unpacked</div>
                      <div className="text-xs text-text-muted">
                        {STANDARD_TOTAL} standards with verbs, vocabulary, the learning ladder and the
                        misconception to watch for
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-teal text-lg">&#10003;</span>
                    <div>
                      <div className="font-semibold text-charcoal">A lesson blueprint for each one</div>
                      <div className="text-xs text-text-muted">
                        Seven steps with timings, each tagged to the learning science behind it
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-teal text-lg">&#10003;</span>
                    <div>
                      <div className="font-semibold text-charcoal">The whole resource library</div>
                      <div className="text-xs text-text-muted">
                        All {RESOURCE_TOTAL.toLocaleString()} resources, matched to the standard you are teaching
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-teal text-lg">&#10003;</span>
                    <div>
                      <div className="font-semibold text-charcoal">Courses through Google Classroom</div>
                      <div className="text-xs text-text-muted">Delivered where you already teach</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
