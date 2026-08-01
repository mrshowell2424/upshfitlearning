const GOOGLE_SHEETS_ID = '1dVlowQJxditueoFpI42NOnZrlJ1sArKPRqfPQwFAqrc'

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
    const lines = csv
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    if (lines.length < 2) {
      console.warn('Google Sheet is empty or inaccessible')
      return []
    }

    const resources: Resource[] = []

    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i])

      const title = row[2]?.trim()
      if (!title) continue

      const resource: Resource = {
        id: String(i),
        title: title,
        purpose: row[3]?.trim() || '',
        format: 'Video',
        grade_band: 'K-12',
        skill: row[4]?.trim() || 'General',
        is_free:
          !row[7]?.toString().toLowerCase().includes('paid') &&
          row[7]?.toString().toLowerCase() !== 'false',
        published_at: row[1]?.trim() || new Date().toISOString(),
      }

      if (resource.title) {
        resources.push(resource)
      }
    }

    console.log(`✓ Loaded ${resources.length} resources from Google Sheets`)
    return resources
  } catch (error) {
    console.error('Error fetching Google Sheets:', error)
    return []
  }
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let currentField = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField.replace(/^"+|"+$/g, ''))
      currentField = ''
    } else {
      currentField += char
    }
  }

  fields.push(currentField.replace(/^"+|"+$/g, ''))
  return fields
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
