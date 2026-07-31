'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from './providers/AuthProvider'
import Header from './components/Header'
import Footer from './components/Footer'

export default function Home() {
  const [searchInput, setSearchInput] = useState('')
  const router = useRouter()
  const { isPremium, isLoading } = useAuth()

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // If premium, go to resources; otherwise go to match page
      if (isPremium) {
        router.push(`/resources?search=${encodeURIComponent(query)}`)
      } else {
        router.push(`/match?q=${encodeURIComponent(query)}`)
      }
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
        <section className="relative py-24 px-8 bg-gradient-to-br from-gray-050 to-white">
          <div className="relative max-w-7xl mx-auto">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-opacity-10 rounded-full" style={{backgroundColor: 'rgba(255, 106, 91, 0.1)'}}>
              <span className="text-xs font-bold tracking-wide text-coral uppercase">Science of Learning First</span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-5xl font-bold text-charcoal mb-4 max-w-4xl leading-tight">
              Describe what you're teaching. We'll hand you the lesson.
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-text-muted mb-8 max-w-xl">
              Search by standard code or describe what you're teaching. Get a lesson blueprint, resources, and materials.
            </p>

            {/* Search Bar */}
            <div className="mb-6 max-w-2xl">
              <div className="flex items-center gap-2 bg-white rounded-2xl p-3 border border-border" style={{boxShadow: '0 12px 34px rgba(17,17,17,.09)'}}>
                <span className="text-coral text-xl">✳</span>
                <input
                  type="text"
                  placeholder='RL.2.1 — or "text evidence with 2nd graders"'
                  className="flex-1 outline-none text-sm placeholder:text-text-muted"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchInput)}
                />
                <button
                  onClick={() => handleSearch(searchInput)}
                  className="bg-coral hover:bg-coral-press text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Match my standard
                </button>
              </div>
            </div>

            {/* Example Chips */}
            <div className="flex items-center gap-3 mb-12 flex-wrap">
              <span className="text-sm text-text-muted">Try:</span>
              {examples.map((example) => (
                <button
                  key={example.code}
                  onClick={() => {
                    setSearchInput(example.code)
                    handleSearch(example.code)
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-full text-sm font-medium border border-border transition-colors"
                  title={example.subject}
                >
                  {example.code}
                </button>
              ))}
            </div>

            {/* Stat Strip */}
            <div className="grid grid-cols-4 gap-px bg-hairline rounded-2xl overflow-hidden">
              <div className="bg-white p-6 text-center">
                <div className="text-4xl font-bold text-coral mb-1">2,688</div>
                <div className="text-xs uppercase font-bold tracking-wider text-text-faint">Resources</div>
              </div>
              <div className="bg-white p-6 text-center">
                <div className="text-4xl font-bold text-lavender mb-1">150+</div>
                <div className="text-xs uppercase font-bold tracking-wider text-text-faint">Standards</div>
              </div>
              <div className="bg-white p-6 text-center">
                <div className="text-4xl font-bold text-teal mb-1">K–12</div>
                <div className="text-xs uppercase font-bold tracking-wider text-text-faint">Grade Span</div>
              </div>
              <div className="bg-white p-6 text-center">
                <div className="text-4xl font-bold text-pink mb-1">12+</div>
                <div className="text-xs uppercase font-bold tracking-wider text-text-faint">Learning Science Principles</div>
              </div>
            </div>
          </div>
        </section>

        {/* Start Here Section */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-charcoal mb-8">Start here</h2>

            <div className="grid grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="border-l-4 border-coral rounded-2xl bg-white p-6 border border-hairline hover:border-charcoal transition-colors">
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
                  Browse 2,688 curated resources. Save them to your planner. Filter by grade, skill, and format.
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

        {/* Upgrade Band */}
        <section className="py-24 px-8 bg-gray-050">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 gap-8 rounded-3xl overflow-hidden">
              {/* Left: Upgrade CTA */}
              <div className="bg-charcoal text-white p-8 rounded-3xl">
                <div className="text-xs font-bold tracking-wider text-pink uppercase mb-3">Unlock more</div>
                <h3 className="text-3xl font-bold mb-3">
                  Free tier includes 200 resources
                </h3>
                <p className="text-sm text-gray-200 mb-6 leading-relaxed">
                  Upgrade to All Access to receive lesson materials in 4 formats: slides, documents, worksheets, and assessments.
                </p>
                <Link
                  href="/plans"
                  className="inline-block bg-coral hover:bg-coral-press text-white px-6 py-3 rounded-xl font-semibold mb-2 transition-colors"
                >
                  Upgrade now
                </Link>
                <div className="text-xs text-gray-300">From $10/month or $100/year</div>
              </div>

              {/* Right: Benefits */}
              <div className="bg-white p-8 rounded-3xl flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-teal text-lg">✓</span>
                    <div>
                      <div className="font-semibold text-charcoal">Science of Learning Resources</div>
                      <div className="text-xs text-text-muted">Create slides, docs, worksheets, and assessments</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-teal text-lg">✓</span>
                    <div>
                      <div className="font-semibold text-charcoal">Full Resource Library</div>
                      <div className="text-xs text-text-muted">Access all 2,688+ curated resources</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-teal text-lg">✓</span>
                    <div>
                      <div className="font-semibold text-charcoal">Save to Your Planner</div>
                      <div className="text-xs text-text-muted">Organize resources by standard or topic</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-teal text-lg">✓</span>
                    <div>
                      <div className="font-semibold text-charcoal">Team Collaboration</div>
                      <div className="text-xs text-text-muted">Share lessons and resources with colleagues</div>
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
