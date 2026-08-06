'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'

/** Exactly five, so the filter row stays scannable. */
const CATEGORIES = [
  'Classroom Management',
  'Instruction & Lesson Design',
  'Technology & Blended Learning',
  'Book Studies',
  'Quick PD',
] as const

type CourseCategory = (typeof CATEGORIES)[number]

interface AnnouncedCourse {
  title: string
  category: CourseCategory
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
    category: 'Instruction & Lesson Design',
    classroomUrl: 'https://classroom.google.com/c/ODcxODcwMDI4MDI4?cjc=nprypzsl',
    gradCredit: true,
  },
  {
    title: 'Imagineering Education Book Study: Design Magical Learning Experiences',
    category: 'Book Studies',
    classroomUrl: 'https://classroom.google.com/c/ODQ4NjA0MTAxMTA5?cjc=ypanrx3v',
    gradCredit: false,
  },
  {
    title:
      'Control the Chaos: What It Takes to Create Order in the Classroom and Teach Executive Functioning Skills',
    status: 'Book study with the authors',
    category: 'Book Studies',
    classroomUrl: 'https://classroom.google.com/c/NDk2OTUzNDk5NTkz?cjc=hkzerua',
    gradCredit: false,
  },
  {
    title: 'EDU Minute Clinic',
    category: 'Quick PD',
    classroomUrl: 'https://classroom.google.com/c/NDk3MjAxMzU4OTYy?cjc=4riwocf',
    gradCredit: false,
  },
  {
    title: 'Control the Chaos With Executive Functioning',
    category: 'Classroom Management',
    classroomUrl: 'https://classroom.google.com/c/NDY1MDI2NDk4MDE4?cjc=vn23vdd',
    gradCredit: false,
  },
  {
    title: 'EduProtocols: Pick Your Own Adventure',
    category: 'Instruction & Lesson Design',
    classroomUrl: 'https://classroom.google.com/c/NTM2Nzc0OTQ5MzM0?cjc=pz3nlto',
    gradCredit: false,
  },
  {
    title: 'Flipping Your Classroom With Technology and Depth of Knowledge',
    category: 'Technology & Blended Learning',
    classroomUrl: 'https://classroom.google.com/c/NDk2OTU0NjYzMDAx?cjc=jq2o2co',
    gradCredit: false,
  },
  {
    title: 'Positive Perks',
    category: 'Classroom Management',
    classroomUrl: 'https://classroom.google.com/c/NTM2MDg0NjU0MTUw?cjc=icyvhvd',
    gradCredit: false,
  },
  {
    title: 'Lesson Fixer Upper',
    category: 'Instruction & Lesson Design',
    classroomUrl: 'https://classroom.google.com/c/NDk2OTUzODQzMDQ4?cjc=kd4rexh',
    gradCredit: false,
  },
  {
    title: 'Unit Zero: Setting Up Your Personalized Learning Classroom',
    category: 'Technology & Blended Learning',
    classroomUrl: 'https://classroom.google.com/c/NDk2MDQ1MTc4OTk0?cjc=gvumhic',
    gradCredit: false,
  },
  {
    title: 'Behavior Reboot & Reset',
    category: 'Classroom Management',
    classroomUrl: 'https://classroom.google.com/c/NDk1Nzg3MjkyOTUy?cjc=ono2kkw',
    gradCredit: false,
  },
  {
    title: 'Control the Chaos With Top Blended Learning Tips',
    category: 'Technology & Blended Learning',
    classroomUrl: 'https://classroom.google.com/c/NDY1MDI2NDk3Mjgz?cjc=7r764vx',
    gradCredit: false,
  },
  {
    title: 'Control the Chaos With SOPs',
    category: 'Classroom Management',
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
  const [active, setActive] = useState<CourseCategory | 'All'>('All')

  // Only offer a category that actually has courses in it
  const available = CATEGORIES.filter(category =>
    COURSES.some(course => course.category === category)
  )
  const countFor = (category: CourseCategory) =>
    COURSES.filter(course => course.category === category).length

  const visible =
    active === 'All' ? COURSES : COURSES.filter(course => course.category === active)

  return (
    <section className="bg-white">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar filters, matching the resource library */}
        <aside className="lg:w-80 lg:flex-shrink-0 px-5 md:px-8 py-8 border-b lg:border-b-0 lg:border-r border-border bg-white">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-charcoal mb-3">
            Category
          </h3>
          <div className="space-y-1">
            <label className="flex items-center gap-2 cursor-pointer min-h-[36px] rounded-md px-1 -mx-1 hover:bg-gray-050">
              <input
                type="checkbox"
                checked={active === 'All'}
                onChange={() => setActive('All')}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-charcoal">All courses</span>
              <span className="text-xs text-text-muted ml-auto">{COURSES.length}</span>
            </label>

            {available.map(category => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer min-h-[36px] rounded-md px-1 -mx-1 hover:bg-gray-050"
              >
                <input
                  type="checkbox"
                  checked={active === category}
                  onChange={() => setActive(active === category ? 'All' : category)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-charcoal">{category}</span>
                <span className="text-xs text-text-muted ml-auto">{countFor(category)}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Course grid */}
        <div className="flex-1 min-w-0 px-5 md:px-8 py-8">
          <p className="text-sm text-text-muted mb-6">
            {visible.length} course{visible.length !== 1 ? 's' : ''}
            {active !== 'All' ? ` in ${active}` : ''}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {visible.map(course => (
              <div
                key={course.title}
                className="flex flex-col border-2 border-teal rounded-2xl p-6 bg-white"
              >
                {/* Fixed slot, so titles line up whether or not there's a status badge */}
                <div className="min-h-[56px] mb-2 flex flex-wrap items-start content-start gap-2">
                  <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-text-faint">
                    {course.category}
                  </span>
                  {course.status && (
                    <span className="inline-flex w-fit items-center rounded-full bg-teal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-teal">
                      {course.status}
                    </span>
                  )}
                </div>

                <h2 className="text-[19px] font-bold text-charcoal mb-4 leading-snug min-h-[160px]">
                  {course.title}
                </h2>

                {/* Stacked inside a column card, so the panels stay readable */}
                <div className="grid grid-cols-1 gap-4">
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
                  <div className="rounded-xl border border-hairline p-5 min-h-[208px]">
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
        </div>
      </div>
    </section>
  )
}
