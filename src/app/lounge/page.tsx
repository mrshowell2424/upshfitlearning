'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

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
  const [selectedCategory, setSelectedCategory] = useState('all')

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
      title: 'The First 20 Minutes',
      description: 'Most of us teach the way we feel, not the way we plan. The first 20 minutes of your day shape all of it.',
      category: 'Teacher Brain',
      readTime: '8 min read',
      image: '📚'
    },
    {
      id: '2',
      slug: 'active-retrieval',
      title: 'Why Your Brain Feels Fried by Wednesday',
      description: 'Wednesday—wiped? You\'re not lazy. Your brain is fried. Pre-load boring choices, take real breaks, close your loops.',
      category: 'Teacher Brain',
      readTime: '10 min read',
      image: '🎯'
    },
    {
      id: '3',
      slug: 'metacognition',
      title: 'The 3-Second Pause That Changes Everything',
      description: 'Wait time is the smallest classroom move with the biggest payoff. Three seconds is all it takes.',
      category: 'Classroom moves',
      readTime: '7 min read',
      image: '🧠'
    },
    {
      id: '4',
      slug: 'interleaving',
      title: 'Designing for Real Kids, Not Just "The Class"',
      description: 'Lesson plans for the class miss the actual kids in front of you. Here\'s how to design for real students.',
      category: 'Classroom moves',
      readTime: '9 min read',
      image: '🔀'
    },
    {
      id: '5',
      slug: 'elaboration',
      title: 'Stop Waiting for Motivation',
      description: 'Motivation is not a prerequisite—it\'s an outcome. Here\'s how to get there.',
      category: 'Coaching',
      readTime: '6 min read',
      image: '💡'
    },
    {
      id: '6',
      slug: 'growth-mindset',
      title: '5 Quick Retrieval Practice Moves You Can Use Tomorrow',
      description: 'Three seconds for students read their line and say why it answers the question while thinking out loud.',
      category: 'Classroom moves',
      readTime: '11 min read',
      image: '🌱'
    }
  ]

  const categories = ['All', 'Classroom moves', 'Teacher brain', 'Coaching', 'AI in class']
  const displayArticles = articles.length > 0 ? articles : defaultArticles
  const featuredArticle = displayArticles[0]

  const filteredArticles = selectedCategory === 'all'
    ? displayArticles
    : displayArticles.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 px-5 md:px-8 bg-white border-b border-hairline">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-[48px] font-bold text-charcoal mb-2">
                  The Teacher's Lounge
                </h1>
                <p className="text-lg text-text-muted">
                  Short reads for the ten minutes you actually get. Straight from the newsletter, no<br />lesson prep required.
                </p>
              </div>
              <a
                href="https://substack.com/upshiftlearning"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[44px] px-4 bg-charcoal text-white rounded-lg font-semibold hover:bg-charcoal/90 transition-colors whitespace-nowrap"
              >
                Subscribe free →
              </a>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {!loading && featuredArticle && (
          <section className="px-5 md:px-8 py-12 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-gray-300 rounded-lg aspect-video mb-6 flex items-center justify-center text-6xl">
                    {featuredArticle.image}
                  </div>
                </div>
                <div className="lg:col-span-1 flex flex-col justify-center">
                  <h2 className="text-[28px] font-bold text-charcoal mb-3">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-text-body mb-6">
                    {featuredArticle.description}
                  </p>
                  <a
                    href="https://substack.com/upshiftlearning"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-coral font-semibold hover:text-coral-press transition-colors"
                  >
                    Read it on Substack →
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Posts Count and Filters */}
        <section className="px-5 md:px-8 py-8 bg-white border-t border-hairline">
          <div className="max-w-7xl mx-auto">
            <p className="text-text-muted mb-6">
              {filteredArticles.length} posts in the lounge
            </p>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category.toLowerCase() === 'all' ? 'all' : category.toLowerCase())}
                  className={`inline-flex items-center min-h-[44px] px-4 rounded-full font-semibold text-sm transition-colors ${
                    (selectedCategory === 'all' && category === 'All') ||
                    (selectedCategory === category.toLowerCase() && category !== 'All')
                      ? 'bg-charcoal text-white'
                      : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12 px-5 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-text-muted">Loading articles...</p>
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.slice(1).map((article) => (
                  <article
                    key={article.id}
                    className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="bg-gray-200 aspect-video flex items-center justify-center text-4xl border-b border-border">
                      {article.image}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-xs font-bold uppercase text-text-faint mb-2">
                        {article.category}
                      </p>
                      <h3 className="text-[16px] font-bold text-charcoal mb-2 leading-tight">
                        {article.title}
                      </h3>
                      <p className="text-sm text-text-body mb-4 flex-1">
                        {article.description}
                      </p>
                      <a
                        href="https://substack.com/upshiftlearning"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-coral font-semibold text-sm hover:text-coral-press transition-colors"
                      >
                        Read it →
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-muted">No articles in this category.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
