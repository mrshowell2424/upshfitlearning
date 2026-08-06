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

/** Cover images for the ~20 most recent posts, from one RSS request. */
async function fetchRssImages(): Promise<Map<string, string>> {
  const images = new Map<string, string>()

  try {
    const response = await fetch(RSS_URL, {
      headers: { 'User-Agent': BROWSER_UA },
      next: { revalidate: 3600 },
    })
    if (!response.ok) return images

    const xml = await response.text()
    const itemPattern = /<item>([\s\S]*?)<\/item>/g
    let item: RegExpExecArray | null

    while ((item = itemPattern.exec(xml)) !== null) {
      const link = /<link>(.*?)<\/link>/.exec(item[1])?.[1]?.trim()
      const image = /<enclosure[^>]*url="([^"]+)"/.exec(item[1])?.[1]
      if (link && image) images.set(slugFromUrl(link, ''), image)
    }
  } catch (error) {
    console.error('Substack RSS fetch failed:', error)
  }

  return images
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

    return { ok: true, image: pickBodyImage(html) ?? ogImage }
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

  // Visit each article for its artwork, and to find out whether it still exists
  const assets = await mapWithLimit(articles, 6, article =>
    fetchArticleAssets(article.url)
  )

  // RSS covers the recent posts and needs no extra request, so it backs up any
  // page whose body image we couldn't identify
  const rssImages = await fetchRssImages()

  const live: SubstackArticle[] = []

  articles.forEach((article, index) => {
    const { ok, image } = assets[index]
    if (!ok) {
      console.warn(`Substack article URL is dead, skipping: ${article.url}`)
      return
    }

    article.image = image ?? rssImages.get(article.slug)
    live.push(article)
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
