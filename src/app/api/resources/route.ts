import { NextRequest, NextResponse } from 'next/server'
import { getResources } from '@/lib/utils/resources'

// Purpose values present in the sheet but deliberately kept out of the filter
// sidebar. Compared case-insensitively.
const HIDDEN_PURPOSES = ['eduprotocols', 'ckla', 'indiana']

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const purpose = searchParams.get('purpose') || 'all'
    const access = searchParams.get('access') || 'all'
    const pageSize = 30

    const resources = await getResources()

    // If no resources from sheet, show helpful message
    if (!resources.length) {
      console.warn('No resources loaded from Google Sheets')
      return NextResponse.json({
        items: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        purposes: [],
        accessCounts: { free: 0, paid: 0 },
        message: 'Resources not yet loaded. Please check Google Sheets integration.'
      })
    }

    // Every distinct Purpose in the sheet, with counts — sent so the filter
    // sidebar reflects the whole library rather than just the current page.
    const purposeCounts = new Map<string, number>()
    for (const r of resources) {
      if (!r.purpose) continue
      if (HIDDEN_PURPOSES.includes(r.purpose.toLowerCase())) continue
      purposeCounts.set(r.purpose, (purposeCounts.get(r.purpose) ?? 0) + 1)
    }
    const purposes = [...purposeCounts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))

    const accessCounts = {
      free: resources.filter(r => r.is_free).length,
      paid: resources.filter(r => !r.is_free).length,
    }

    // Filter across the full library, then paginate the result
    let filtered = resources

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        r =>
          r.title.toLowerCase().includes(searchLower) ||
          r.purpose.toLowerCase().includes(searchLower) ||
          r.skill.toLowerCase().includes(searchLower)
      )
    }

    if (purpose !== 'all') {
      filtered = filtered.filter(r => r.purpose === purpose)
    }

    if (access === 'free') {
      filtered = filtered.filter(r => r.is_free)
    } else if (access === 'paid') {
      filtered = filtered.filter(r => !r.is_free)
    }

    const total = filtered.length
    const offset = (page - 1) * pageSize
    const items = filtered.slice(offset, offset + pageSize)

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      purposes,
      accessCounts,
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}
