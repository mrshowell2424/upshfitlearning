import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'
// Force rebuild

interface Resource {
  id: string
  title: string
  purpose: string
  format: string
  grade_band: string
  skill: string
  is_free: boolean
  published_at: string | Date
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

    let query = supabase.from('resources').select('*', { count: 'exact' })

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      query = query.or(
        `title.ilike.%${search}%,purpose.ilike.%${search}%,skill.ilike.%${search}%`
      )
    }

    // Apply pagination
    const offset = (page - 1) * pageSize
    const { data: items, count, error } = await query
      .order('published_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch resources' },
        { status: 500 }
      )
    }

    const total = count || 0
    const totalPages = Math.ceil(total / pageSize)

    return NextResponse.json({
      items: items || [],
      total,
      page,
      pageSize,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}
