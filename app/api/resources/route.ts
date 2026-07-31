import { NextRequest, NextResponse } from 'next/server'

// Sample resources data structure
// In production, this would fetch from Google Sheets API
const SAMPLE_RESOURCES = [
  {
    id: '1',
    title: 'Text Evidence Anchor Chart',
    purpose: 'Understand how to find and cite text evidence',
    format: 'Anchor Chart',
    grade_band: 'K-2',
    skill: 'Reading Comprehension',
    is_free: true,
    published_at: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'RL.2.1 Lesson Plan Bundle',
    purpose: 'Teach students to ask and answer questions about key details',
    format: 'Lesson Plan',
    grade_band: '1-3',
    skill: 'Literature',
    is_free: true,
    published_at: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'Inferencing Strategy Guide',
    purpose: 'Help students make inferences from text',
    format: 'Guide',
    grade_band: '3-5',
    skill: 'Reading Comprehension',
    is_free: true,
    published_at: new Date('2024-01-05')
  },
  {
    id: '4',
    title: 'Math Word Problems Grade 3',
    purpose: 'Practice solving multi-step word problems',
    format: 'Worksheet',
    grade_band: '2-4',
    skill: 'Math',
    is_free: true,
    published_at: new Date('2024-01-08')
  },
  {
    id: '5',
    title: 'Science Observation Journal',
    purpose: 'Record and analyze scientific observations',
    format: 'Template',
    grade_band: '3-6',
    skill: 'Science',
    is_free: true,
    published_at: new Date('2024-01-12')
  },
  {
    id: '6',
    title: 'Social Studies Timeline Activity',
    purpose: 'Create timelines of historical events',
    format: 'Activity',
    grade_band: '4-8',
    skill: 'Social Studies',
    is_free: false,
    published_at: new Date('2024-01-20')
  },
  {
    id: '7',
    title: 'Phonics Intervention Program',
    purpose: 'Support struggling readers with phonetic instruction',
    format: 'Program',
    grade_band: 'K-2',
    skill: 'Phonics',
    is_free: false,
    published_at: new Date('2024-01-18')
  },
  {
    id: '8',
    title: 'Multiplication Fact Fluency Games',
    purpose: 'Build speed and accuracy with multiplication facts',
    format: 'Game',
    grade_band: '2-4',
    skill: 'Math',
    is_free: true,
    published_at: new Date('2024-01-14')
  },
  {
    id: '9',
    title: 'Fraction Concepts Visual Guide',
    purpose: 'Understand fractions through visual models',
    format: 'Video',
    grade_band: '3-5',
    skill: 'Math',
    is_free: true,
    published_at: new Date('2024-01-11')
  },
  {
    id: '10',
    title: 'Earth Systems Unit Plan',
    purpose: 'Comprehensive unit on earth systems and weather',
    format: 'Unit Plan',
    grade_band: '5-8',
    skill: 'Science',
    is_free: false,
    published_at: new Date('2024-01-19')
  }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const pageSize = 30

    // Filter resources based on search
    let filtered = SAMPLE_RESOURCES
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = SAMPLE_RESOURCES.filter(
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
