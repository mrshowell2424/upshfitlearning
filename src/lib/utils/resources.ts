import Papa from 'papaparse'

const GOOGLE_SHEETS_ID = '1dVlowQJxditueoFpI42NOnZrlJ1sArKPRqfPQwFAqrc'

// Column positions in the published sheet. The header labels are misleading:
// column 4 is labeled "Description" but holds the YouTube URL, and column 5
// labeled "URL" holds the resource link (Slides, Docs, etc).
const COL = {
  date: 1,
  title: 2,
  purpose: 3,
  youtubeUrl: 4,
  resourceUrl: 5,
  summary: 6,
  access: 7,
  createdBy: 13,
} as const

/**
 * Upshift's own YouTube handle, including the misspellings that appear in the
 * sheet's "Created By" column (@mrshowel24, @rshowell24, @mrhsowell24).
 */
const OWN_CHANNEL_PATTERN = /mr\s*h?showell|mrshowell|mrhsowell|mrshowel|rshowell/i

/**
 * A line that is nothing but a "watch this" call to action — "Watch:",
 * "Watch the demo!", "Watch it here:". These pointed at the share link that
 * gets stripped below, so on the site they'd dangle with nothing after them.
 * Anchored and length-capped so genuine prose survives ("Watch kids race to
 * guess", "watch the chaos calm down").
 */
const WATCH_CTA_LINE = /^watch\b[^.?]{0,70}[:!]?$/i

/**
 * Summaries in the sheet are the original social captions, so they carry emoji,
 * hashtags, a "Watch:" prompt and a trailing share link (buff.ly or the YouTube
 * URL). Strip all of it so the description reads as site copy, and tidy the
 * whitespace left behind.
 */
export function cleanSummary(raw?: string): string | undefined {
  if (!raw) return undefined

  const withoutNoise = raw
    // share/tracking links and the YouTube URL
    .replace(/https?:\/\/\S+/g, '')
    // emoji, pictographs, dingbats and their variation selectors
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu,
      ''
    )
    // hashtags — letter-led so "#1" and similar survive
    .replace(/#[A-Za-z]\w*/g, '')

  const cleaned = withoutNoise
    .split('\n')
    .map(line => line.replace(/[ \t]{2,}/g, ' ').trim())
    // drop the orphaned watch prompts, keeping real sentences
    .filter(line => !WATCH_CTA_LINE.test(line))
    .join('\n')
    // no more than one blank line between paragraphs
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return cleaned || undefined
}

export interface Resource {
  id: string
  title: string
  purpose: string
  format: string
  grade_band: string
  skill: string
  is_free: boolean
  published_at: string | Date
  thumbnail_url?: string
  youtube_id?: string
  youtube_url?: string
  resource_url?: string
  summary?: string
  created_by?: string
}

/**
 * True when the resource is one of Upshift's own videos: it has a YouTube video
 * and its "Created By" credit is either Upshift's handle or blank. Rows credited
 * solely to someone else (a guest, or the Gold Community) are excluded.
 */
export function isOwnVideo(resource: Resource): boolean {
  if (!resource.youtube_id) return false

  const credit = resource.created_by?.trim()
  if (!credit) return true // unattributed rows in her own sheet are hers

  return OWN_CHANNEL_PATTERN.test(credit)
}

async function fetchGoogleSheetResources(): Promise<Resource[]> {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/export?format=csv`

    const response = await fetch(csvUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; UpshiftLearningBot/1.0)',
      },
    })

    if (!response.ok) {
      console.error('Google Sheets CSV export error:', response.status, response.statusText)
      return []
    }

    const csv = await response.text()

    // Purpose, Summary and Description cells contain commas, quotes and hard
    // line breaks, so the CSV must be parsed properly — splitting on '\n'
    // shreds every multi-line row and misaligns the columns after it.
    const { data: rows, errors } = Papa.parse<string[]>(csv, { skipEmptyLines: true })

    if (errors.length) {
      console.warn(`Google Sheet CSV parsed with ${errors.length} warning(s); first:`, errors[0]?.message)
    }

    if (rows.length < 2) {
      console.warn('Google Sheet is empty or inaccessible')
      return []
    }

    const resources: Resource[] = []

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]

      const title = row[COL.title]?.trim()
      if (!title) continue

      const youtubeUrl = row[COL.youtubeUrl]?.trim()
      const youtubeId = extractYoutubeId(youtubeUrl)
      const access = row[COL.access]?.trim().toLowerCase() ?? ''

      resources.push({
        id: String(i),
        title,
        purpose: row[COL.purpose]?.trim() || '',
        format: 'Video',
        grade_band: 'K-12',
        skill: 'Teaching Strategies',
        is_free: !access.includes('paid') && access !== 'false',
        published_at: row[COL.date]?.trim() || new Date().toISOString(),
        thumbnail_url: youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg` : undefined,
        youtube_id: youtubeId,
        youtube_url: youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : undefined,
        resource_url: row[COL.resourceUrl]?.trim() || undefined,
        summary: cleanSummary(row[COL.summary]),
        created_by: row[COL.createdBy]?.trim() || undefined,
      })
    }

    console.log(`✓ Loaded ${resources.length} resources from Google Sheets`)
    return resources
  } catch (error) {
    console.error('Error fetching Google Sheets:', error)
    return []
  }
}

function extractYoutubeId(url?: string): string | undefined {
  if (!url) return undefined
  try {
    // Handle youtube.com/watch?v=ID
    if (url.includes('youtube.com/watch')) {
      const match = url.match(/[?&]v=([^&]+)/)
      return match ? match[1] : undefined
    }
    // Handle youtu.be/ID
    if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([^?&]+)/)
      return match ? match[1] : undefined
    }
  } catch (e) {
    console.error('Error extracting YouTube ID:', e)
  }
  return undefined
}

let cachedResources: Resource[] | null = null
let cacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000

export async function getResourceById(id: string): Promise<Resource | null> {
  const all = await getResources()
  return all.find(r => r.id === id) ?? null
}

/**
 * Other resources worth pairing with this one: Upshift's own videos, preferring
 * the same purpose, never the resource itself.
 */
export async function getRelatedOwnVideos(resource: Resource, limit = 3): Promise<Resource[]> {
  const all = await getResources()
  const candidates = all.filter(r => r.id !== resource.id && isOwnVideo(r))

  const samePurpose = resource.purpose
    ? candidates.filter(r => r.purpose === resource.purpose)
    : []

  // Top up with any other own video so the rail is never half-empty
  const rest = candidates.filter(r => !samePurpose.includes(r))
  return [...samePurpose, ...rest].slice(0, limit)
}

export async function getResources(): Promise<Resource[]> {
  const now = Date.now()

  if (cachedResources && (now - cacheTime) < CACHE_DURATION) {
    return cachedResources
  }

  const resources = await fetchGoogleSheetResources()
  cachedResources = resources
  cacheTime = now

  return resources
}
