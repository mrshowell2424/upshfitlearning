import { redirect } from 'next/navigation'

/**
 * The Videos tab became Courses. Kept as a redirect so any link already out in
 * the world — newsletter, socials, bookmarks — still lands somewhere useful.
 */
export default function VideosPage() {
  redirect('/courses')
}
