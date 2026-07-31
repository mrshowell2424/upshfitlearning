import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

const GOOGLE_SHEETS_ID = '1dVlowQJxditueoFpI42NOnZrlJ1sArKPRqfPQwFAqrc'

interface SheetResource {
  id: string
  title: string
  purpose: string
  format: string
  grade_band: string
  skill: string
  is_free: boolean
  published_at: string
}

async function fetchGoogleSheetResources(): Promise<SheetResource[]> {
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
      throw new Error(`CSV export failed: ${response.status}`)
    }

    const csv = await response.text()
    const lines = csv
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    if (lines.length < 2) {
      throw new Error('Google Sheet is empty')
    }

    const resources: SheetResource[] = []

    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i])

      if (!row[0]?.trim()) continue

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

    return resources
  } catch (error) {
    console.error('Error fetching Google Sheets:', error)
    throw error
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

export async function POST(request: NextRequest) {
  try {
    // Verify authorization header (optional: add a shared secret)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.SYNC_SECRET_KEY

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Log sync start
    const { data: syncRecord } = await supabase
      .from('resource_syncs')
      .insert({ status: 'pending' })
      .select()
      .single()

    console.log('Starting resource sync...')

    // Fetch resources from Google Sheets
    const resources = await fetchGoogleSheetResources()
    console.log(`Fetched ${resources.length} resources from Google Sheets`)

    // Upsert into Supabase
    const { error: upsertError } = await supabase
      .from('resources')
      .upsert(resources, { onConflict: 'id' })

    if (upsertError) {
      throw new Error(`Upsert failed: ${upsertError.message}`)
    }

    // Mark sync as complete
    await supabase
      .from('resource_syncs')
      .update({
        status: 'success',
        completed_at: new Date().toISOString(),
        resource_count: resources.length,
      })
      .eq('id', syncRecord?.id)

    console.log(`✓ Synced ${resources.length} resources to Supabase`)

    return NextResponse.json({
      success: true,
      message: `Synced ${resources.length} resources`,
      resourceCount: resources.length,
    })
  } catch (error) {
    console.error('Sync error:', error)

    // Log error in sync table
    await supabase
      .from('resource_syncs')
      .insert({
        status: 'error',
        completed_at: new Date().toISOString(),
        error: String(error),
      })

    return NextResponse.json(
      {
        error: String(error),
        message: 'Failed to sync resources',
      },
      { status: 500 }
    )
  }
}
