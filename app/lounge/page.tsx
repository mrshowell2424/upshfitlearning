'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

interface Article {
  id: string
  slug: string
  title: string
  description: string
  category: string
  readTime: string
  image: string
}

export default function TeachersLounge() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/lounge/articles')
        const data = await response.json()
        setArticles(data.articles || [])
      } catch (error) {
        console.error('Failed to fetch articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const defaultArticles: Article[] = [
    {
      id: '1',
      slug: 'spaced-repetition',
      title: 'The Science of Spaced Repetition',
      description: 'Learn how spacing out your study sessions can dramatically improve long-term retention and understanding.',
      category: 'Learning Science',
      readTime: '8 min read',
      image: '📚'
    },
    {
      id: '2',
      slug: 'active-retrieval',
      title: 'Active Retrieval Practice in the Classroom',
      description: 'Discover evidence-based strategies for helping students retrieve and reinforce their knowledge.',
      category: 'Teaching Strategy',
      readTime: '10 min read',
      image: '🎯'
    },
    {
      id: '3',
      slug: 'metacognition',
      title: 'Building Metacognitive Skills',
      description: 'Help students understand their own learning processes and become more effective learners.',
      category: 'Student Development',
      readTime: '7 min read',
      image: '🧠'
    },
    {
      id: '4',
      slug: 'interleaving',
      title: 'Interleaving: Mix It Up for Better Learning',
      description: 'Explore how mixing up different topics and problem types enhances student understanding.',
      category: 'Learning Science',
      readTime: '9 min read',
      image: '🔀'
    },
    {
      id: '5',
      slug: 'elaboration',
      title: 'The Role of Elaboration in Learning',
      description: 'Learn how asking "why" and "how" questions deepens student comprehension.',
      category: 'Teaching Strategy',
      readTime: '6 min read',
      image: '💡'
    },
    {
      id: '6',
      slug: 'growth-mindset',
      title: 'Creating a Growth Mindset Culture',
      description: 'Build a classroom environment where students embrace challenges and learn from mistakes.',
      category: 'Student Development',
      readTime: '11 min read',
      image: '🌱'
    }
  ]

  const displayArticles = articles.length > 0 ? articles : defaultArticles

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-8 bg-gradient-to-br from-teal-50 to-white border-b border-hairline">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-opacity-10 rounded-full" style={{backgroundColor: 'rgba(0, 128, 128, 0.1)'}}>
              <span className="text-xs font-bold tracking-wide text-teal uppercase">Learning Science First</span>
            </div>
            <h1 className="text-5xl font-bold text-charcoal mb-4 max-w-2xl leading-tight">
              Teacher's Lounge
            </h1>
            <p className="text-lg text-text-muted max-w-2xl">
              Read articles, watch videos, and learn from teaching strategies grounded in learning science. Stay informed about the latest research and best practices.
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-text-muted">Loading articles...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayArticles.map((article) => (
                  <article
                    key={article.id}
                    className="border border-hairline rounded-2xl overflow-hidden hover:border-charcoal hover:shadow-lg transition-all duration-200 flex flex-col"
                  >
                    <div className="bg-gray-50 p-8 flex items-center justify-center text-4xl border-b border-hairline">
                      {article.image}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold tracking-wider text-teal uppercase">
                          {article.category}
                        </span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">{article.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-charcoal mb-2 leading-tight">
                        {article.title}
                      </h3>
                      <p className="text-sm text-text-body mb-4 flex-1">
                        {article.description}
                      </p>
                      <Link href={`/lounge/${article.slug}`} className="inline-flex items-center gap-2 text-teal font-semibold hover:text-teal-600 transition-colors">
                        Read article →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-8 bg-gray-50 border-t border-hairline">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              Want more learning science resources?
            </h2>
            <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
              Explore our full library of resources and materials curated with learning science principles in mind.
            </p>
            <Link
              href="/resources"
              className="inline-block bg-teal hover:bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Browse Resource Library
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
