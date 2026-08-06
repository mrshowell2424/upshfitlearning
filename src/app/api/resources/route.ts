import { NextRequest, NextResponse } from 'next/server'
import { getResources, RESOURCE_CATEGORIES } from '@/lib/utils/resources'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'all'
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
        categories: [],
        accessCounts: { free: 0, paid: 0 },
        message: 'Resources not yet loaded. Please check Google Sheets integration.'
      })
    }

    // The five categories with counts, sent so the sidebar reflects the whole
    // library rather than just the current page. Every resource lands in exactly
    // one, so these counts sum to the full total.
    const categoryCounts = new Map<string, number>()
    for (const r of resources) {
      categoryCounts.set(r.category, (categoryCounts.get(r.category) ?? 0) + 1)
    }
    const categories = RESOURCE_CATEGORIES.map(value => ({
      value,
      count: categoryCounts.get(value) ?? 0,
    })).filter(entry => entry.count > 0)

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

    if (category !== 'all') {
      filtered = filtered.filter(r => r.category === category)
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
      categories,
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
