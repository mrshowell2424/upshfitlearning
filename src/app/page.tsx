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
import { IMPACT, ORG, SERVICES } from '@/lib/constants/org'
import HUB from '@/../scripts/reading-hub-counts.json'

/**
 * What a teacher can open today, with the counts read off the content.
 *
 * This section exists because the site had grown a long way past what the
 * home page admitted to. A visitor landing here saw a standard matcher and
 * three cards, and had no way of knowing there were 468 mysteries, 650
 * articles and a lesson builder behind them.
 *
 * The numbers come from scripts/reading-hub-counts.json, which is counted
 * from the content by a builder and checked, because a page that advertises
 * a number is a page that will eventually advertise a wrong one.
 */
const HUB_SETS = [
  {
    href: '/science-of-reading',
    eyebrow: 'Science of Reading',
    title: 'The lesson builder',
    body: `Pick a skill and get the whole lesson: thirteen steps, a workbook, spelling tests, word games and a decodable \u2014 across ${HUB.sequence} lessons in one teaching sequence.`,
    edge: 'border-l-coral',
    ink: 'text-coral-ink',
  },
  {
    href: '/science-of-reading/resources',
    eyebrow: 'Reading mysteries',
    title: `${HUB.mysteries} cases, two versions each`,
    body: `A week\u2019s mystery for every grade from K to 12. Solve it, where the text rules the others out \u2014 or debate it, where three suspects are arguable and the evidence is what counts.`,
    edge: 'border-l-lavender',
    ink: 'text-lavender-ink',
  },
  {
    href: '/science-of-reading/resources',
    eyebrow: 'Informational articles',
    title: `${HUB.articles} articles on science and social studies`,
    body: `Every one written at two Lexile levels with five questions and answers \u2014 ${HUB.articleVersions.toLocaleString()} versions in all \u2014 so the group reading below grade reads the same text as everybody else.`,
    edge: 'border-l-teal',
    ink: 'text-teal-ink',
  },
  {
    href: '/passages',
    eyebrow: 'Decodable passages',
    title: `${HUB.passages} passages at ${HUB.passageLevels} reading levels`,
    body: `A passage for every one of the ${HUB.concepts} phonics concepts, written at ${HUB.passageLevels} levels so the group reading below grade still reads the pattern.`,
    edge: 'border-l-pink',
    ink: 'text-pink-ink',
  },
  {
    href: '/word-ladders',
    eyebrow: 'Word work',
    title: `${HUB.ladders} word ladders, ${HUB.spelling} spelling banks`,
    body: `Ladders, dictation banks, ${HUB.heartWords} heart words and ${HUB.morphemes} morpheme families \u2014 the daily work, already written.`,
    edge: 'border-l-coral',
    ink: 'text-coral-ink',
  },
  {
    href: '/science-of-reading/threads',
    eyebrow: 'Knowledge threads',
    title: `${HUB.threads} threads that build knowledge`,
    body: `Articles sequenced so each one stands on what the last one taught, because comprehension is knowledge as much as it is strategy.`,
    edge: 'border-l-lavender',
    ink: 'text-lavender-ink',
  },
]

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
      <main id="main" tabIndex={-1} className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-24 px-5 md:px-8 bg-gradient-to-br from-gray-050 to-white">
          <div className="relative max-w-7xl mx-auto">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-opacity-10 rounded-full" style={{backgroundColor: 'rgba(255, 106, 91, 0.1)'}}>
              <span className="text-xs font-bold tracking-wide text-coral-ink uppercase">Upshift Learning · Your shift starts here</span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-[32px] sm:text-4xl md:text-5xl font-bold text-charcoal mb-4 leading-[1.15] md:leading-tight">
              Describe what you&apos;re teaching.<br className="hidden sm:inline" />{" "}
              We&apos;ll hand you the lesson.
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-text-muted mb-8 max-w-2xl">
              Search by standard or describe what you&apos;re teaching. Get a lesson blueprint, resources, and materials.
            </p>

            {/* Search Bar */}
            <div className="mb-6 max-w-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white rounded-2xl p-3 border border-border" style={{boxShadow: '0 12px 34px rgba(17,17,17,.09)'}}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-coral-ink text-xl flex-shrink-0">✳</span>
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
                  className="bg-coral-ink hover:bg-coral-ink-press text-white px-6 min-h-[44px] rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
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
                <div className="text-3xl md:text-4xl font-bold text-coral-ink mb-1">{RESOURCE_TOTAL.toLocaleString()}</div>
                <div className="text-xs uppercase font-bold tracking-wider text-text-faint">Resources</div>
              </Link>
              <Link href="/match" className="bg-white p-4 md:p-6 text-center hover:bg-gray-050 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-lavender-ink mb-1">{STANDARD_TOTAL}</div>
                <div className="text-xs uppercase font-bold tracking-wider text-text-faint">Standards</div>
              </Link>
              <Link href="/match/random" className="bg-white p-4 md:p-6 text-center hover:bg-gray-050 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-teal-ink mb-1">K–12</div>
                <div className="text-xs uppercase font-bold tracking-wider text-text-faint">Grade Span</div>
              </Link>
              <Link href="/learning-science" className="bg-white p-4 md:p-6 text-center hover:bg-gray-050 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-pink-ink mb-1">{PRINCIPLES.length}</div>
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
                <div className="text-xs font-bold tracking-wider text-coral-ink uppercase mb-2">Find Standards</div>
                <h3 className="text-xl font-bold text-charcoal mb-3">Standard matcher</h3>
                <p className="text-sm text-text-body mb-4">
                  Search by code or describe what you&apos;re teaching, and we&apos;ll find the exact standard.
                </p>
                <Link href="/match" className="inline-flex items-center gap-2 text-coral-ink font-semibold hover:text-coral-ink-press transition-colors">
                  Get started →
                </Link>
              </div>

              {/* Card 2 */}
              <div className="border-l-4 border-lavender rounded-2xl bg-white p-6 border border-hairline hover:border-charcoal transition-colors">
                <div className="text-xs font-bold tracking-wider text-lavender-ink uppercase mb-2">Discover Resources</div>
                <h3 className="text-xl font-bold text-charcoal mb-3">Resource library</h3>
                <p className="text-sm text-text-body mb-4">
                  All {RESOURCE_TOTAL.toLocaleString()} curated resources, free with an account. Filter by grade, skill, and format.
                </p>
                <Link href="/resources" className="inline-flex items-center gap-2 text-coral-ink font-semibold hover:text-coral-ink-press transition-colors">
                  Browse resources →
                </Link>
              </div>

              {/* Card 3 */}
              <div className="border-l-4 border-teal rounded-2xl bg-white p-6 border border-hairline hover:border-charcoal transition-colors">
                <div className="text-xs font-bold tracking-wider text-teal-ink uppercase mb-2">Learn More</div>
                <h3 className="text-xl font-bold text-charcoal mb-3">Teacher&apos;s lounge</h3>
                <p className="text-sm text-text-body mb-4">
                  Read articles, watch videos, and learn from teaching strategies grounded in learning science.
                </p>
                <Link href="/lounge" className="inline-flex items-center gap-2 text-coral-ink font-semibold hover:text-coral-ink-press transition-colors">
                  Read articles →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Everything in the hub, with the counts read off the content. */}
        <section className="py-14 md:py-24 px-5 md:px-8 bg-gray-050 border-y border-hairline">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-bold tracking-wider text-teal-ink uppercase mb-3">What&rsquo;s inside</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-3">
              Built here, not bought in.
            </h2>
            <p className="text-base md:text-lg text-text-muted mb-10 max-w-2xl">
              Every passage, case and word list on this site was written for it. Nothing is
              off-the-shelf, and all of it is yours to print.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {HUB_SETS.map((s) => (
                <Link
                  key={s.title}
                  href={s.href}
                  className={`block bg-white rounded-2xl p-6 border border-hairline border-l-4 ${s.edge} hover:border-charcoal transition-colors`}
                >
                  <div className={`text-xs font-bold tracking-wider uppercase mb-2 ${s.ink}`}>
                    {s.eyebrow}
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2 leading-snug">{s.title}</h3>
                  <p className="text-sm text-text-body leading-relaxed">{s.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Who makes it. Carried over from upshiftlearning.org, which used to
            be a second site saying this while this one held the work. */}
        <section className="py-14 md:py-24 px-5 md:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-bold tracking-wider text-coral-ink uppercase mb-3">
              Who makes this
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-3 max-w-3xl leading-tight">
              Better learning starts with stronger educators.
            </h2>
            <p className="text-base md:text-lg text-text-body mb-10 max-w-2xl leading-relaxed">
              {ORG.name} works alongside teachers, school leaders, and workforce teams to transform
              how people learn, grow, and lead. The hub above is free. The work below is how we
              build with schools and teams directly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-hairline rounded-2xl overflow-hidden mb-10">
              {IMPACT.map((i) => (
                <div key={i.figure} className="bg-white p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-coral-ink mb-2">{i.figure}</div>
                  <div className="text-sm text-text-muted leading-snug">{i.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {SERVICES.map((s) => (
                <Link
                  key={s.name}
                  href="/services"
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 bg-white border border-hairline rounded-full text-sm font-semibold text-charcoal hover:border-charcoal transition-colors"
                >
                  <span aria-hidden="true">{s.icon}</span>
                  {s.name}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-xl bg-coral-ink hover:bg-coral-ink-press text-white font-semibold transition-colors"
              >
                Explore What We Offer
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-xl bg-white border-2 border-charcoal text-charcoal font-semibold hover:bg-gray-050 transition-colors"
              >
                Ready to Shift?
              </Link>
            </div>

            <p className="mt-8 text-sm text-text-muted max-w-2xl">
              {ORG.name} is a registered 501(c)(3) nonprofit organization incorporated in the State
              of Ohio. EIN {ORG.ein} · Ohio Charter Number {ORG.charter}.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
