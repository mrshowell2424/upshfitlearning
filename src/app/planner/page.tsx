'use client'

import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

export default function PlannerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-8 py-24 bg-gray-050">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-charcoal mb-4">My Planner</h1>
          <p className="text-lg text-text-muted mb-12">
            Save and organize your favorite resources and lessons.
          </p>

          <div className="bg-white rounded-3xl p-12 border border-hairline text-center">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-charcoal mb-3">Your planner is empty</h2>
            <p className="text-text-muted mb-8">
              Start saving resources from the Resource Library to organize them here.
            </p>
            <a
              href="/resources"
              className="inline-block bg-coral hover:bg-coral-press text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Browse Resources
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
