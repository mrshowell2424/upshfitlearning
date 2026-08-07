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
  /**
   * One line on what the course actually covers. Optional, and currently unset
   * for every course — a title alone does not tell a teacher whether "Unit Zero"
   * or "Positive Perks" is worth their evening. Adding one sentence each is the
   * single biggest improvement available to this page, and it has to come from
   * whoever wrote the courses rather than be invented here.
   */
  blurb?: string
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

/** The real number of courses, so stats elsewhere can't drift out of date. */
export const COURSE_COUNT = COURSES.length

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
      <a href="/pricing" className={`${BUTTON} border border-border-strong text-charcoal hover:bg-gray-050`}>
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

/**
 * Said once, above the grid.
 *
 * This used to sit inside every card — two panels of heading, paragraph and
 * button, repeated for all thirteen courses. The terms are identical for every
 * course, so repeating them buried the one thing that differs: which course it
 * actually is.
 */
function HowItWorks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="rounded-2xl border border-hairline bg-gray-050 p-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal mb-1.5">
          With All-Access
        </h3>
        <p className="text-sm text-text-body">
          Every course is included at no extra cost, delivered through Google
          Classroom. Join any of them whenever you like.
        </p>
      </div>

      <div className="rounded-2xl border border-hairline bg-gray-050 p-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal mb-1.5">
          For graduate credit
        </h3>
        <p className="text-sm text-text-body">
          Courses marked{' '}
          <span className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-teal align-middle">
            Grad credit
          </span>{' '}
          carry credit through Malone University — open to anyone, no membership
          needed. Email{' '}
          <a
            href="mailto:hello@upshiftlearning.org"
            className="text-link-blue font-semibold hover:underline"
          >
            hello@upshiftlearning.org
          </a>{' '}
          to enrol.
        </p>
      </div>
    </div>
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

  /**
   * Pills rather than a sidebar of checkboxes. Only one category applies at a
   * time, so checkboxes promised a choice the page could not honour — and the
   * sidebar spent 320px on six items that fit comfortably in a row, squeezing
   * the cards into what was left.
   */
  const pill = (label: string, count: number, isActive: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`inline-flex items-center gap-2 min-h-[38px] px-4 rounded-full text-sm font-semibold border transition-colors ${
        isActive
          ? 'bg-charcoal text-white border-charcoal'
          : 'bg-white text-charcoal border-border-strong hover:bg-gray-050'
      }`}
    >
      {label}
      <span className={isActive ? 'text-white/60' : 'text-text-faint'}>{count}</span>
    </button>
  )

  return (
    <section className="bg-white px-5 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <HowItWorks />

        <div className="flex flex-wrap gap-2 mb-6">
          {pill('All courses', COURSES.length, active === 'All', () => setActive('All'))}
          {available.map(category =>
            pill(category, countFor(category), active === category, () =>
              setActive(active === category ? 'All' : category)
            )
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visible.map(course => (
            <article
              key={course.title}
              className="flex flex-col rounded-2xl border border-hairline bg-white p-6 transition-colors hover:border-charcoal"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-text-faint">
                  {course.category}
                </span>
                {course.gradCredit && (
                  <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-teal">
                    Grad credit
                  </span>
                )}
                {course.status && (
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white" style={{ backgroundColor: 'var(--color-amber)' }}>
                    {course.status}
                  </span>
                )}
              </div>

              {/* Titles grow to their natural height; the button is pinned by mt-auto
                  so cards still line up without padding short titles out to a fixed box. */}
              <h2 className="text-[18px] font-bold text-charcoal leading-snug mb-2">
                {course.title}
              </h2>

              {course.blurb && (
                <p className="text-sm text-text-body leading-relaxed mb-4">{course.blurb}</p>
              )}

              <div className="mt-auto pt-4">
                <ClassroomAccess url={course.classroomUrl} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
