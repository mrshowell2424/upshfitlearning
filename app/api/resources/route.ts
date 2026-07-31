import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_SHEETS_ID = '1dVlowQJxditueoFpI42NOnZrlJ1sArKPRqfPQwFAqrc'

interface SheetResource {
  id: string
  title: string
  purpose: string
  format: string
  grade_band: string
  skill: string
  is_free: boolean
  published_at: string | Date
}

async function fetchGoogleSheetResources(): Promise<SheetResource[]> {
  try {
    // Export sheet as CSV from public Google Sheet
    // The sheet must be shared with "Anyone with the link" or "Public" access
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

    // Parse CSV
    const lines = csv
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    if (lines.length < 2) {
      console.warn('Google Sheet is empty or inaccessible. Make sure the sheet is publicly shared.')
      return []
    }

    const resources: SheetResource[] = []

    for (let i = 1; i < lines.length; i++) {
      // Simple CSV parsing - handle quoted fields
      const row = parseCSVLine(lines[i])

      if (!row[0] || !row[0].trim()) continue

      const resource: SheetResource = {
        id: String(i),
        title: row[0]?.trim() || '',
        purpose: row[1]?.trim() || '',
        format: row[2]?.trim() || 'Link',
        grade_band: row[3]?.trim() || 'K-12',
        skill: row[4]?.trim() || 'General',
        is_free:
          row[5]?.toString().toLowerCase() === 'true' ||
          row[5]?.toString().toLowerCase() === 'yes',
        published_at: row[6]?.trim() || new Date().toISOString(),
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

// Cache resources in memory to avoid repeated API calls
let cachedResources: SheetResource[] | null = null
let cacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function getResources(): Promise<SheetResource[]> {
  const now = Date.now()

  // Return cached resources if still valid
  if (cachedResources && (now - cacheTime) < CACHE_DURATION) {
    return cachedResources
  }

  // Fetch fresh data
  const resources = await fetchGoogleSheetResources()
  cachedResources = resources
  cacheTime = now

  return resources
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const pageSize = 30

    // Get resources from Google Sheets (or cache)
    let resources = await getResources()

    // If no resources from sheet, show helpful message
    if (!resources.length) {
      console.warn('No resources loaded from Google Sheets. Check sheet sharing and format.')
      return NextResponse.json({
        items: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        message: 'Resources not yet loaded. Please check Google Sheets integration.'
      })
    }

    // Filter resources based on search
    let filtered = resources
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = resources.filter(
        r =>
          r.title.toLowerCase().includes(searchLower) ||
          r.purpose.toLowerCase().includes(searchLower) ||
          r.skill.toLowerCase().includes(searchLower)
      )
    }

    // Paginate
    const offset = (page - 1) * pageSize
    const items = filtered.slice(offset, offset + pageSize)
    const total = filtered.length

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}
