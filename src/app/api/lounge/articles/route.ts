import { NextResponse } from 'next/server'

const SUBSTACK_URL = 'https://mrshowell24.substack.com/feed'

interface Article {
  id: string
  slug: string
  title: string
  description: string
  content: string
  category: string
  readTime: string
  image: string
  pubDate: string
}

async function parseRSSFeed(): Promise<Article[]> {
  try {
    const response = await fetch(SUBSTACK_URL, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error('Failed to fetch RSS feed')
    }

    const xml = await response.text()

    // Parse XML
    const articles: Article[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemContent = match[1]

      const titleMatch = /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/.exec(itemContent)
      const descriptionMatch = /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/.exec(itemContent)
      const linkMatch = /<link>(.*?)<\/link>/.exec(itemContent)
      const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/.exec(itemContent)

      if (titleMatch) {
        const title = titleMatch[1].trim()
        const description = descriptionMatch ? descriptionMatch[1].trim().substring(0, 150) : ''
        const link = linkMatch ? linkMatch[1].trim() : ''
        const pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString()

        // Generate slug from title
        const slug = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50)

        const article: Article = {
          id: slug,
          slug,
          title,
          description,
          content: description,
          category: 'Learning Science',
          readTime: '5-10 min read',
          image: '📚',
          pubDate
        }

        articles.push(article)
      }
    }

    return articles.slice(0, 10) // Return latest 10 articles
  } catch (error) {
    console.error('Error parsing RSS feed:', error)
    return []
  }
}

export async function GET() {
  try {
    const articles = await parseRSSFeed()
    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles', articles: [] },
      { status: 500 }
    )
  }
}
