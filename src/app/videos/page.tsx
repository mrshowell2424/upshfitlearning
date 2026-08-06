'use client'

import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

export default function VideosPage() {
  // Learning videos library
  const videos = [
    {
      id: 1,
      title: 'Introduction to Learning Science',
      description: 'Understand the fundamentals of how students learn.',
      duration: '12 min',
      category: 'Learning Science',
    },
    {
      id: 2,
      title: 'Spaced Repetition in Practice',
      description: 'How to use spacing to improve long-term retention.',
      duration: '8 min',
      category: 'Teaching Strategy',
    },
    {
      id: 3,
      title: 'Active Retrieval Practice',
      description: 'Techniques for helping students retrieve and reinforce knowledge.',
      duration: '10 min',
      category: 'Teaching Strategy',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 px-5 md:px-8 bg-gradient-to-br from-teal-50 to-white border-b border-hairline">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-charcoal mb-4">Learning Videos</h1>
            <p className="text-lg text-text-muted">
              Watch videos about learning science and teaching strategies.
            </p>
          </div>
        </section>

        {/* Videos Grid */}
        <section className="py-14 md:py-24 px-5 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="border border-hairline rounded-2xl overflow-hidden hover:border-charcoal hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="bg-gray-200 h-40 flex items-center justify-center text-5xl">
                    ▶️
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-teal uppercase">
                        {video.category}
                      </span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs text-text-muted">{video.duration}</span>
                    </div>
                    <h3 className="text-lg font-bold text-charcoal mb-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-text-body">
                      {video.description}
                    </p>
                  </div>
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
