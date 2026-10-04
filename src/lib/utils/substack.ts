import Papa from 'papaparse'

const GOOGLE_SHEETS_ID = '1dVlowQJxditueoFpI42NOnZrlJ1sArKPRqfPQwFAqrc'
/** The "Substack" tab, which is the authoritative list of published articles. */
const SUBSTACK_GID = '950021192'
const RSS_URL = 'https://mrshowell24.substack.com/feed'

/** Substack serves og: tags only to a browser-shaped User-Agent. */
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

const COL = { title: 1, url: 2, social: 3 } as const

export type ArticleTag =
  | 'Learning Science'
  | 'Classroom moves'
  | 'Teacher brain'
  | 'Coaching'
  | 'AI in class'

export interface SubstackArticle {
  id: string
  slug: string
  title: string
  /** The article's own Substack URL — what "Read it" must point at. */
  url: string
  description: string
  tag: ArticleTag
  image?: string
  /** ISO timestamp; absent for the handful of pages that don't expose one. */
  publishedAt?: string
}

/**
 * The Social column is the promo post, so it ends with a "Read it here:" style
 * hand-off into the link. With the URL stripped, that trailing fragment dangles,
 * so drop it along with emoji and hashtags — the link lives on the button now.
 */
export function cleanSocialText(raw?: string): string {
  if (!raw) return ''

  return raw
    .replace(/https?:\/\/\S+/g, '')
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu,
      ''
    )
    .replace(/#[A-Za-z]\w*/g, '')
    // the dangling hand-off: "… Read it here:", "… Take a peek:"
    .replace(/\s*[^.!?]{0,60}:\s*$/, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([.,!?])/g, '$1')
    .trim()
}

/** Keyword rules, most specific first — the first match wins. */
const TAG_RULES: Array<{ tag: ArticleTag; pattern: RegExp }> = [
  {
    tag: 'AI in class',
    pattern:
      /\b(ai|a\.i\.|schoolai|chatgpt|gpt|claude|gemini|magicschool|prompt|prompts|iste|copilot)\b/i,
  },
  {
    tag: 'Learning Science',
    pattern:
      /\b(retrieval|spacing|spaced|interleav\w*|memory|cognitive|cognition|dual coding|schema|working memory|science of learning|learning science|research|evidence[- ]based|transfer|forgetting)\b/i,
  },
  {
    tag: 'Coaching',
    pattern:
      /\b(coach\w*|pd|professional development|staff|faculty|principal|leader\w*|mentor\w*|team meeting|observation)\b/i,
  },
  {
    tag: 'Teacher brain',
    pattern:
      /\b(brain|burn\s?out|burned|fried|exhaust\w*|tired|overwhelm\w*|stress\w*|reset|boundaries|rest|energy|workload|sunday|weekend|self[- ]care|balance|sanity|breathe)\b/i,
  },
]

/** Classify an article from its title and promo copy. */
export function deriveTag(title: string, description: string): ArticleTag {
  const haystack = `${title} ${description}`
  for (const { tag, pattern } of TAG_RULES) {
    if (pattern.test(haystack)) return tag
  }
  // Most of the catalogue is concrete classroom practice
  return 'Classroom moves'
}

function slugFromUrl(url: string, fallback: string): string {
  const match = /\/p\/([^/?#]+)/.exec(url)
  if (match) return match[1]
  return fallback
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** One post as the feed describes it. */
interface RssItem {
  slug: string
  url: string
  title: string
  image?: string
  publishedAt?: string
  description: string
}

/** Strip tags and entities out of a feed field. */
function plainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&[a-z]+;/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * The ~20 most recent posts, from one RSS request.
 *
 * This used to return cover images alone, and the sheet decided on its own
 * which articles existed. That meant a post was invisible here until somebody
 * added a row by hand, and two months of writing sat unpublished on the site
 * while the feed had carried it all along. The feed is now read for the posts
 * themselves as well as their artwork.
 */
async function fetchRssItems(): Promise<RssItem[]> {
  const items: RssItem[] = []

  try {
    const response = await fetch(RSS_URL, {
      headers: { 'User-Agent': BROWSER_UA },
      next: { revalidate: 3600 },
    })
    if (!response.ok) return items

    const xml = await response.text()
    const itemPattern = /<item>([\s\S]*?)<\/item>/g
    const field = (block: string, tag: string) => {
      const m = new RegExp(
        `<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`
      ).exec(block)
      return m ? m[1].trim() : ''
    }

    let match: RegExpExecArray | null
    while ((match = itemPattern.exec(xml)) !== null) {
      const block = match[1]
      const url = field(block, 'link')
      const title = plainText(field(block, 'title'))
      if (!url || !title) continue

      const pubDate = field(block, 'pubDate')
      const parsed = pubDate ? Date.parse(pubDate) : NaN

      items.push({
        slug: slugFromUrl(url, title),
        url,
        title,
        image: /<enclosure[^>]*url="([^"]+)"/.exec(block)?.[1],
        publishedAt: Number.isNaN(parsed) ? undefined : new Date(parsed).toISOString(),
        description: plainText(field(block, 'description')),
      })
    }
  } catch (error) {
    console.error('Substack RSS fetch failed:', error)
  }

  return items
}

/**
 * Pick the sketchnote out of a post's body images.
 *
 * Substack encodes the original dimensions into the filename
 * (`…_1024x559.jpeg`), which is enough to tell the artwork apart from the page
 * furniture without downloading anything:
 *
 *   1500x498  the publication banner — on every post, far too wide (aspect 3.0)
 *   400x400   the avatar — on every post, square
 *   750x752   a contributor headshot — square
 *   1024x559  the sketchnote we want (aspect 1.8)
 *
 * So: keep landscape-but-not-a-banner images and take the biggest.
 */
function pickBodyImage(html: string): string | undefined {
  const pattern =
    /substack-post-media\.s3\.amazonaws\.com%2Fpublic%2Fimages%2F([a-zA-Z0-9._%-]+?_(\d+)x(\d+)\.(?:png|jpe?g|webp))/g

  let best: { url: string; area: number } | undefined

  for (const match of html.matchAll(pattern)) {
    const [, filename, rawWidth, rawHeight] = match
    const width = Number(rawWidth)
    const height = Number(rawHeight)
    if (!width || !height) continue

    const aspect = width / height
    if (width < 800) continue // avatars and inline icons
    if (aspect < 1.2 || aspect > 2.4) continue // squares and the wide banner

    const area = width * height
    if (!best || area > best.area) {
      best = {
        url: `https://substack-post-media.s3.amazonaws.com/public/images/${decodeURIComponent(filename)}`,
        area,
      }
    }
  }

  return best ? cdnResized(best.url) : undefined
}

/**
 * Serve covers through Substack's image CDN rather than straight from S3. The
 * originals are full-resolution sketchnotes — one is 2 MB — which is far too
 * heavy for a grid of 65 cards.
 */
function cdnResized(originalUrl: string, width = 728): string {
  return `https://substackcdn.com/image/fetch/w_${width},c_limit,f_auto,q_auto:good/${encodeURIComponent(originalUrl)}`
}

interface ArticleAssets {
  /** False when the article URL is dead, so the caller can drop it. */
  ok: boolean
  image?: string
  /** ISO timestamp from the page, used to put the newest post first. */
  publishedAt?: string
}

/**
 * Fetch one article and work out its cover. The body sketchnote is preferred
 * over og:image: some posts (Behavior Bingo, for one) advertise the YouTube
 * thumbnail instead of the artwork, which looks wrong beside the others.
 */
async function fetchArticleAssets(url: string): Promise<ArticleAssets> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': BROWSER_UA },
      next: { revalidate: 86400 },
    })

    // 404 means the URL in the sheet is wrong — don't surface a dead card
    if (!response.ok) return { ok: false }

    const html = await response.text()

    // Substack emits <meta data-rh="true" property="og:image" content="…">, and
    // the attribute order isn't consistent, so don't assume adjacency.
    const ogImage =
      /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/.exec(html)?.[1] ??
      /<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/.exec(html)?.[1]

    // Substack embeds the publish date in its JSON-LD
    const publishedAt =
      /"datePublished"\s*:\s*"([^"]+)"/.exec(html)?.[1] ??
      /<meta[^>]+property=["']article:published_time["'][^>]*content=["']([^"']+)["']/.exec(html)?.[1]

    return { ok: true, image: pickBodyImage(html) ?? ogImage, publishedAt }
  } catch {
    // A network blip shouldn't delete an article, so treat it as reachable
    return { ok: true }
  }
}

/** Resolve promises a few at a time so we don't open 47 sockets at once. */
async function mapWithLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let cursor = 0

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await fn(items[index])
    }
  })

  await Promise.all(workers)
  return results
}

async function fetchSubstackArticles(): Promise<SubstackArticle[]> {
  const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/export?format=csv&gid=${SUBSTACK_GID}`

  const response = await fetch(csvUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; UpshiftLearningBot/1.0)' },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    console.error('Substack sheet fetch failed:', response.status)
    return []
  }

  const rows = Papa.parse<string[]>(await response.text(), {
    skipEmptyLines: true,
  }).data.slice(1)

  const articles: SubstackArticle[] = []

  rows.forEach((row, index) => {
    const title = row[COL.title]?.trim()
    const url = row[COL.url]?.trim()
    if (!title || !url?.startsWith('http')) return

    const description = cleanSocialText(row[COL.social])

    articles.push({
      id: String(index + 1),
      slug: slugFromUrl(url, title),
      title,
      url,
      description,
      tag: deriveTag(title, description),
    })
  })

  const rss = await fetchRssItems()

  // Visit each article for its artwork, and to find out whether it still exists
  const assets = await mapWithLimit(articles, 6, article =>
    fetchArticleAssets(article.url)
  )

  /*
   * RSS backs up both the artwork and — the reason this matters — the date.
   *
   * Scraping a post page for its date works locally and frequently does not in
   * production, which left 33 of 79 articles undated on the live site. Undated
   * articles sink to the bottom of the sort, so the newest writing was landing
   * underneath posts from March. The feed carries a pubDate for the twenty most
   * recent posts, which is exactly the window where getting the order right
   * matters.
   *
   * Keyed by title as well as slug because the sheet sometimes records a post
   * as substack.com/home/post/p-<id>, which yields a different slug from the
   * /p/<slug> the feed gives for the same article.
   */
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '')
  const rssImages = new Map<string, string>()
  const rssDates = new Map<string, string>()
  for (const item of rss) {
    for (const key of [item.slug, norm(item.title)]) {
      if (item.image && !rssImages.has(key)) rssImages.set(key, item.image)
      if (item.publishedAt && !rssDates.has(key)) rssDates.set(key, item.publishedAt)
    }
  }
  const fromRss = (m: Map<string, string>, a: SubstackArticle) =>
    m.get(a.slug) ?? m.get(norm(a.title))

  const live: SubstackArticle[] = []

  articles.forEach((article, index) => {
    const { ok, image, publishedAt } = assets[index]
    if (!ok) {
      console.warn(`Substack article URL is dead, skipping: ${article.url}`)
      return
    }

    article.image = image ?? fromRss(rssImages, article)
    article.publishedAt = publishedAt ?? fromRss(rssDates, article)
    live.push(article)
  })

  // Newest first, so the lounge reorders itself as posts go out. Anything
  // without a date sinks to the bottom rather than jumping to the top.
  live.sort((a, b) => {
    const left = a.publishedAt ? Date.parse(a.publishedAt) : 0
    const right = b.publishedAt ? Date.parse(b.publishedAt) : 0
    return right - left
  })

  return live
}

let cached: SubstackArticle[] | null = null
let cachedAt = 0
const CACHE_DURATION = 60 * 60 * 1000

export async function getSubstackArticles(): Promise<SubstackArticle[]> {
  if (cached && Date.now() - cachedAt < CACHE_DURATION) return cached

  try {
    const articles = await fetchSubstackArticles()
    if (articles.length) {
      cached = articles
      cachedAt = Date.now()
    }
    return articles
  } catch (error) {
    console.error('Error loading Substack articles:', error)
    return cached ?? []
  }
}
