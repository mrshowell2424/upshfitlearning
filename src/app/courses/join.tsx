'use client'

import { useAuth } from '@/providers/AuthProvider'

/**
 * The Google Classroom link carries a join code, so anyone holding it can enroll.
 * The course is an All-Access benefit, so the link is shown to subscribers and
 * everyone else is pointed at the plans page.
 *
 * To make it public instead, drop the isPremium check and always render the link.
 */
const CLASSROOM_JOIN_URL =
  'https://classroom.google.com/c/ODcxODcwMDI4MDI4?cjc=nprypzsl'

const BUTTON =
  'inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 min-h-[44px] font-semibold transition-colors text-center'

export function ClassroomJoinLink() {
  const { isPremium, isLoading } = useAuth()

  if (isLoading) {
    return <div className="h-11 rounded-lg bg-gray-100 animate-pulse" aria-hidden="true" />
  }

  if (!isPremium) {
    return (
      <div>
        <a href="/pricing" className={`${BUTTON} bg-charcoal text-white hover:bg-charcoal/90`}>
          Get All-Access to join
        </a>
        <p className="mt-2 text-xs text-text-muted">
          The Classroom link is shared with All-Access members.
        </p>
      </div>
    )
  }

  return (
    <div>
      <a
        href={CLASSROOM_JOIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${BUTTON} bg-coral text-white hover:bg-coral-press`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3L2 8l10 5 10-5-10-5zM2 13.5V17c0 .6 4.5 3 10 3s10-2.4 10-3v-3.5l-10 5-10-5z" />
        </svg>
        Join in Google Classroom
      </a>
      <p className="mt-2 text-xs text-text-muted">
        Opens Google Classroom. You'll join with your Google account.
      </p>
    </div>
  )
}
