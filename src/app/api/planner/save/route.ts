import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'
import { db } from '@/lib/db'
import { resources, saved_resources } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

/**
 * Save a resource to the signed-in teacher's planner.
 *
 * The resource is identified by its YouTube id rather than a row id, because the
 * public resource list is keyed by Google Sheet row position while
 * saved_resources.resource_id is a uuid from the resources table.
 */
export async function POST(request: NextRequest) {
  try {
    // The browser client holds the session, so it sends the access token along
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    if (!token) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    // supabase is a stub when the Supabase env vars are absent
    if (!supabase?.auth?.getUser) {
      console.error('Supabase is not configured; cannot verify the session')
      return NextResponse.json({ error: 'Auth is not configured' }, { status: 503 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    const { youtube_id: youtubeId } = await request.json()
    if (!youtubeId) {
      return NextResponse.json({ error: 'youtube_id is required' }, { status: 400 })
    }

    const [resource] = await db
      .select({ id: resources.id })
      .from(resources)
      .where(eq(resources.youtube_id, youtubeId))
      .limit(1)

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Saving twice is a no-op rather than an error
    const [existing] = await db
      .select({ id: saved_resources.id })
      .from(saved_resources)
      .where(
        and(
          eq(saved_resources.user_id, user.id),
          eq(saved_resources.resource_id, resource.id)
        )
      )
      .limit(1)

    if (existing) {
      return NextResponse.json({ saved: true, alreadySaved: true })
    }

    await db.insert(saved_resources).values({
      user_id: user.id,
      resource_id: resource.id,
    })

    return NextResponse.json({ saved: true, alreadySaved: false })
  } catch (error) {
    console.error('Error saving resource to planner:', error)
    return NextResponse.json({ error: 'Failed to save resource' }, { status: 500 })
  }
}
