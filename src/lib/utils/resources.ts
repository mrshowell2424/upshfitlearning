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
  summary: 6,
  access: 7,
} as const

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

      const youtubeId = extractYoutubeId(row[COL.youtubeUrl]?.trim())
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
