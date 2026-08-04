import { NextRequest, NextResponse } from 'next/server'
import { getResources, type Resource } from '@/lib/utils/resources'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const pageSize = 30

    let resources = await getResources()

    // If no resources from sheet, show helpful message
    if (!resources.length) {
      console.warn('No resources loaded from Google Sheets')
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
