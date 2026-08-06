'use client'

import { useAuth } from '@/providers/AuthProvider'

interface AnnouncedCourse {
  title: string
  /** Shown as a badge; omit for a course that's already open. */
  status?: string
  /** All-Access delivery. Held client-side so it stays out of the server payload. */
  classroomUrl: string
  /** Whether graduate credit is offered through Malone University. */
  gradCredit: boolean
}

const COURSES: AnnouncedCourse[] = [
  {
    title: 'Effective Instructions: Helping Students Understand and Follow Through',
    status: 'Coming spring semester',
    classroomUrl: 'https://classroom.google.com/c/ODcxODcwMDI4MDI4?cjc=nprypzsl',
    gradCredit: true,
  },
  {
    title: 'Imagineering Education Book Study: Design Magical Learning Experiences',
    classroomUrl: 'https://classroom.google.com/c/ODQ4NjA0MTAxMTA5?cjc=ypanrx3v',
    gradCredit: false,
  },
]

const BUTTON =
  'inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 min-h-[44px] font-semibold transition-colors text-center'

/**
 * The Google Classroom link is All-Access only, so it's rendered for members and
 * replaced with a plans prompt for everyone else.
 */
function ClassroomAccess({ url }: { url: string }) {
  const { isPremium, isLoading } = useAuth()

  if (isLoading) {
    return <div className="h-11 rounded-lg bg-gray-100 animate-pulse" aria-hidden="true" />
  }

  if (!isPremium) {
    return (
      <a href="/pricing" className={`${BUTTON} bg-charcoal text-white hover:bg-charcoal/90`}>
        Get All-Access to join
      </a>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${BUTTON} bg-coral text-white hover:bg-coral-press`}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3L2 8l10 5 10-5-10-5zM2 13.5V17c0 .6 4.5 3 10 3s10-2.4 10-3v-3.5l-10 5-10-5z" />
      </svg>
      Join in Google Classroom
    </a>
  )
}

export function AnnouncedCourses() {
  return (
    <section className="py-12 md:py-16 px-5 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto space-y-6">
        {COURSES.map(course => (
          <div
            key={course.title}
            className="border-2 border-teal rounded-2xl p-6 md:p-8 bg-white"
          >
            {course.status && (
              <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-teal mb-4">
                {course.status}
              </span>
            )}

            <h2 className="text-[22px] md:text-[28px] font-bold text-charcoal mb-3 leading-tight">
              {course.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 items-start">
              {/* All-Access — members only */}
              <div className="rounded-xl border border-hairline p-5">
                <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-charcoal mb-2">
                  With All-Access
                </h3>
                <p className="text-sm text-text-body mb-4">
                  The full course is included at no extra cost, delivered through
                  Google Classroom.
                </p>
                <ClassroomAccess url={course.classroomUrl} />
              </div>

              {/* Graduate credit — open to anyone, no membership needed */}
              <div className="rounded-xl border border-hairline p-5">
                <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-charcoal mb-2">
                  For graduate credit
                </h3>

                {course.gradCredit ? (
                  <>
                    <p className="text-sm text-text-body mb-4">
                      Open to everyone — no membership needed. Graduate credit is
                      available through Malone University.
                    </p>
                    <a
                      href="mailto:hello@upshiftlearning.org"
                      className={`${BUTTON} border border-border-strong text-charcoal hover:bg-gray-050`}
                    >
                      Email to enroll
                    </a>
                  </>
                ) : (
                  <p className="text-sm text-text-muted">
                    Graduate credit isn't offered for this book study.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
