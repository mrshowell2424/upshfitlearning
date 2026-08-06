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
  {
    title:
      'Control the Chaos: What It Takes to Create Order in the Classroom and Teach Executive Functioning Skills',
    status: 'Book study with the authors',
    classroomUrl: 'https://classroom.google.com/c/NDk2OTUzNDk5NTkz?cjc=hkzerua',
    gradCredit: false,
  },
  {
    title: 'EDU Minute Clinic',
    classroomUrl: 'https://classroom.google.com/c/NDk3MjAxMzU4OTYy?cjc=4riwocf',
    gradCredit: false,
  },
  {
    title: 'Control the Chaos With Executive Functioning',
    classroomUrl: 'https://classroom.google.com/c/NDY1MDI2NDk4MDE4?cjc=vn23vdd',
    gradCredit: false,
  },
  {
    title: 'EduProtocols: Pick Your Own Adventure',
    classroomUrl: 'https://classroom.google.com/c/NTM2Nzc0OTQ5MzM0?cjc=pz3nlto',
    gradCredit: false,
  },
  {
    title: 'Flipping Your Classroom With Technology and Depth of Knowledge',
    classroomUrl: 'https://classroom.google.com/c/NDk2OTU0NjYzMDAx?cjc=jq2o2co',
    gradCredit: false,
  },
  {
    title: 'Positive Perks',
    classroomUrl: 'https://classroom.google.com/c/NTM2MDg0NjU0MTUw?cjc=icyvhvd',
    gradCredit: false,
  },
  {
    title: 'Lesson Fixer Upper',
    classroomUrl: 'https://classroom.google.com/c/NDk2OTUzODQzMDQ4?cjc=kd4rexh',
    gradCredit: false,
  },
  {
    title: 'Unit Zero: Setting Up Your Personalized Learning Classroom',
    classroomUrl: 'https://classroom.google.com/c/NDk2MDQ1MTc4OTk0?cjc=gvumhic',
    gradCredit: false,
  },
  {
    title: 'Behavior Reboot & Reset',
    classroomUrl: 'https://classroom.google.com/c/NDk1Nzg3MjkyOTUy?cjc=ono2kkw',
    gradCredit: false,
  },
  {
    title: 'Control the Chaos With Top Blended Learning Tips',
    classroomUrl: 'https://classroom.google.com/c/NDY1MDI2NDk3Mjgz?cjc=7r764vx',
    gradCredit: false,
  },
  {
    title: 'Control the Chaos With SOPs',
    classroomUrl: 'https://classroom.google.com/c/NDgyODk4MDc0ODk3?cjc=y4i7ck3',
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES.map(course => (
          <div
            key={course.title}
            className="flex flex-col border-2 border-teal rounded-2xl p-6 bg-white"
          >
            {/* Fixed slot, so titles line up whether or not there's a badge */}
            <div className="min-h-[28px] mb-3">
              {course.status && (
                <span className="inline-flex w-fit items-center rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-teal">
                  {course.status}
                </span>
              )}
            </div>

            <h2 className="text-[20px] font-bold text-charcoal mb-4 leading-tight">
              {course.title}
            </h2>

            {/* Stacked inside a column card, so the panels stay readable */}
            <div className="mt-auto grid grid-cols-1 gap-4">
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
                  <p className="text-sm text-text-body">
                    Graduate credit isn't offered for this course yet. If you
                    think it would make a great graduate credit course, email{' '}
                    <a
                      href="mailto:hello@upshiftlearning.org"
                      className="text-link-blue font-semibold hover:underline"
                    >
                      hello@upshiftlearning.org
                    </a>
                    .
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
