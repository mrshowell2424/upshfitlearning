'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

interface Article {
  id: string
  slug: string
  title: string
  /** The article's own Substack URL. */
  url: string
  description: string
  tag: string
  image?: string
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

  const categories = ['All', 'Classroom moves', 'Teacher brain', 'AI in class', 'Learning Science', 'Coaching']
  const displayArticles = articles
  const featuredArticle = displayArticles[0]

  const filteredArticles = selectedCategory === 'all'
    ? displayArticles
    : displayArticles.filter(a => a.tag.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 px-5 md:px-8 bg-white border-b border-hairline">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-[30px] md:text-[48px] font-bold text-charcoal mb-2">
                  The Teacher's Lounge
                </h1>
                <p className="text-lg text-text-muted">
                  Short reads for the ten minutes you actually get. Straight from the newsletter, no lesson prep required.
                </p>
              </div>
              <a
                href="https://mrshowell24.substack.com/subscribe"
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
                  <a href={featuredArticle.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="bg-gray-100 rounded-lg aspect-video mb-6 overflow-hidden border border-border">
                      {featuredArticle.image ? (
                        <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                      )}
                    </div>
                  </a>
                </div>
                <div className="lg:col-span-1 flex flex-col justify-center">
                  <h2 className="text-[28px] font-bold text-charcoal mb-3">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-text-body mb-6">
                    {featuredArticle.description}
                  </p>
                  <a
                    href={featuredArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-[44px] text-coral font-semibold hover:text-coral-press transition-colors"
                  >
                    Read it on Substack →
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filters + article grid */}
        <section className="bg-white border-t border-hairline">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar filters, matching the resource library */}
            <aside className="lg:w-80 lg:flex-shrink-0 px-5 md:px-8 py-8 border-b lg:border-b-0 lg:border-r border-border bg-white">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-charcoal mb-3">
                Category
              </h3>
              <div className="space-y-1">
                <label className="flex items-center gap-2 cursor-pointer min-h-[36px] rounded-md px-1 -mx-1 hover:bg-gray-050">
                  <input
                    type="checkbox"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-charcoal">All posts</span>
                  <span className="text-xs text-text-muted ml-auto">{displayArticles.length}</span>
                </label>

                {categories
                  .filter((c) => c !== 'All')
                  .map((category) => {
                    const key = category.toLowerCase()
                    const count = displayArticles.filter(
                      (a) => a.tag.toLowerCase() === key
                    ).length
                    if (count === 0) return null
                    return (
                      <label
                        key={category}
                        className="flex items-center gap-2 cursor-pointer min-h-[36px] rounded-md px-1 -mx-1 hover:bg-gray-050"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategory === key}
                          onChange={() =>
                            setSelectedCategory(selectedCategory === key ? 'all' : key)
                          }
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-charcoal">{category}</span>
                        <span className="text-xs text-text-muted ml-auto">{count}</span>
                      </label>
                    )
                  })}
              </div>
            </aside>

            {/* Articles */}
            <div className="flex-1 min-w-0 px-5 md:px-8 py-8">
              <p className="text-sm text-text-muted mb-6">
                {filteredArticles.length} post{filteredArticles.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' ? ' in this category' : ' in the lounge'}
              </p>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-text-muted">Loading articles...</p>
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <article
                      key={article.id}
                      className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                    >
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="block bg-gray-100 aspect-video overflow-hidden border-b border-border">
                        {article.image ? (
                          <img src={article.image} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                        )}
                      </a>
                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-xs font-bold uppercase text-text-faint mb-2">
                          {article.tag}
                        </p>
                        <h3 className="text-[16px] font-bold text-charcoal mb-2 leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-sm text-text-body mb-4 flex-1">
                          {article.description}
                        </p>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 min-h-[44px] text-coral font-semibold text-sm hover:text-coral-press transition-colors"
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
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
