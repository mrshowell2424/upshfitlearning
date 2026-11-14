'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

import { articles } from "./articles";

export default function ArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const article = articles[slug as keyof typeof articles]

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center px-5 md:px-8 py-14 md:py-24 bg-gray-050">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-charcoal mb-4">Article not found</h1>
            <Link href="/lounge" className="text-teal font-semibold hover:text-teal-600">
              Back to Teacher's Lounge
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <article className="py-16 px-5 md:px-8 max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-teal uppercase">{article.category}</span>
              <span className="text-xs text-text-muted">•</span>
              <span className="text-xs text-text-muted">{article.readTime}</span>
            </div>
            <h1 className="text-5xl font-bold text-charcoal mb-6">{article.title}</h1>
          </div>

          <div className="prose prose-lg max-w-none text-text-body space-y-6">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-hairline">
            <Link href="/lounge" className="inline-flex items-center gap-2 text-teal font-semibold hover:text-teal-600">
              ← Back to Teacher's Lounge
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
