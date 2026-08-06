import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { standards } from '@/lib/db/schema'
import { standardHref } from '@/lib/utils/standards'

/**
 * Opens a standard at random — the "K–12 Grade Range" tile on the matcher points
 * here, so a teacher who doesn't have a standard in mind still has a way in.
 *
 * Picked on the server against the live table, so newly authored standards join
 * the pool with no code change. Never cached, or everyone would get the same one.
 */
export const dynamic = 'force-dynamic'

export default async function RandomStandardPage() {
  try {
    const rows = await db.select({ code: standards.code }).from(standards)

    if (rows.length) {
      const pick = rows[Math.floor(Math.random() * rows.length)]
      redirect(standardHref(pick.code))
    }
  } catch (error) {
    // redirect() throws to signal the redirect, so let that through untouched
    if ((error as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) throw error
    console.error('Could not pick a random standard:', error)
  }

  // Nothing to pick from — send them to the matcher rather than a dead end
  redirect('/match')
}
