import { NextResponse } from 'next/server'
import { getSubstackArticles } from '@/lib/utils/substack'

/**
 * The Teacher's Lounge article list, sourced from the sheet's Substack tab —
 * the authoritative catalogue of published posts.
 *
 * This replaces an RSS parse that only saw the 20 most recent posts, stamped
 * every one of them with category 'Learning Science' and image '📚', and never
 * exposed each article's own URL (so every card linked to the same page).
 */
export async function GET() {
  try {
    const articles = await getSubstackArticles()

    return NextResponse.json({
      articles,
      total: articles.length,
    })
  } catch (error) {
    console.error('Error fetching lounge articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles', articles: [], total: 0 },
      { status: 500 }
    )
  }
}
