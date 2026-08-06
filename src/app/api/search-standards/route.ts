import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { standards } from '@/lib/db/schema'

interface ScoredStandard {
  code: string
  name: string
  skills: string[]
  score: number
}

/** Only the fields the search reads. */
interface StandardRow {
  code: string
  name: string
  plain_reading: string | null
  learning_target: string | null
  skills: string[] | null
  match_keys: string[] | null
}

const normalize = (value: string) => value.toLowerCase().trim()

/** Words too common to be worth matching on their own. */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'the', 'to', 'of', 'in', 'on', 'for', 'with', 'my', 'we',
  'i', 'is', 'are', 'be', 'how', 'what', 'teach', 'teaching', 'students',
  'student', 'grade', 'graders', 'class',
])

/**
 * Score a standard against the query. Curated match_keys count for most — they
 * exist precisely to catch the phrases teachers actually type — then skills,
 * then the prose fields.
 */
function scoreStandard(
  standard: StandardRow,
  query: string,
  terms: string[]
): number {
  const matchKeys = (standard.match_keys ?? []).map(normalize)
  const skills = (standard.skills ?? []).map(normalize)
  const prose = [standard.name, standard.plain_reading, standard.learning_target]
    .filter(Boolean)
    .map(value => normalize(value as string))

  let score = 0

  // Whole-query hits are the strongest signal
  if (matchKeys.some(key => key === query)) score += 100
  else if (matchKeys.some(key => key.includes(query) || query.includes(key))) score += 60

  if (skills.some(skill => skill === query)) score += 50
  else if (skills.some(skill => skill.includes(query) || query.includes(skill))) score += 30

  if (prose.some(text => text.includes(query))) score += 25

  // Then individual words, so "find the main idea" still reaches "main idea"
  for (const term of terms) {
    if (matchKeys.some(key => key.includes(term))) score += 8
    if (skills.some(skill => skill.includes(term))) score += 6
    if (prose.some(text => text.includes(term))) score += 2
  }

  return score
}

export async function GET(request: NextRequest) {
  try {
    const raw = request.nextUrl.searchParams.get('q') || ''
    const query = normalize(raw)

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    const terms = query
      .split(/[^a-z0-9]+/)
      .filter(term => term.length > 2 && !STOP_WORDS.has(term))

    const all = (await db.select().from(standards)) as StandardRow[]

    const results: ScoredStandard[] = all
      .map((standard: StandardRow): ScoredStandard => ({
        code: standard.code,
        name: standard.name,
        skills: standard.skills ?? [],
        score: scoreStandard(standard, query, terms),
      }))
      .filter((result: ScoredStandard) => result.score > 0)
      .sort((a: ScoredStandard, b: ScoredStandard) => b.score - a.score || a.code.localeCompare(b.code))
      .slice(0, 12)

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search standards error:', error)
    return NextResponse.json(
      { error: 'Failed to search standards', results: [] },
      { status: 500 }
    )
  }
}
