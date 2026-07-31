import { NextRequest, NextResponse } from 'next/server'
import Papa from 'papaparse'

const GOOGLE_SHEETS_ID = '1dVlowQJxditueoFpI42NOnZrlJ1sArKPRqfPQwFAqrc'
const SHEET_GID = '0' // First sheet (gid=0)

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
    // Export sheet as CSV via public URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/export?format=csv&gid=${SHEET_GID}`

    const response = await fetch(csvUrl)

    if (!response.ok) {
      console.error('Google Sheets export error:', response.statusText)
      return []
    }

    const csv = await response.text()

    // Parse CSV
    const lines = csv.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      console.warn('Google Sheet is empty or inaccessible')
      return []
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const resources: SheetResource[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())

      if (!values[0]) continue // Skip empty rows

      const resource: SheetResource = {
        id: String(i),
        title: values[0] || '',
        purpose: values[1] || '',
        format: values[2] || 'Link',
        grade_band: values[3] || 'K-12',
        skill: values[4] || 'General',
        is_free: values[5]?.toLowerCase() === 'true' || values[5]?.toLowerCase() === 'yes',
        published_at: values[6] || new Date().toISOString(),
      }

      if (resource.title) {
        resources.push(resource)
      }
    }

    return resources
  } catch (error) {
    console.error('Error fetching Google Sheets:', error)
    return []
  }
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
