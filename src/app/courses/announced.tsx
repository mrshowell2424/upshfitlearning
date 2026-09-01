'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { CATEGORIES, COURSES, type CourseCategory } from './courses-data'

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
      <a href="/auth/signup" className={`${BUTTON} border border-border-strong text-charcoal hover:bg-gray-050`}>
        Create a free account to join
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
          to enroll.
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

  return (
    <section className="bg-white">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar filters, matching the resource library so the two pages
            behave the same way. */}
        <aside className="lg:w-72 lg:flex-shrink-0 px-5 md:px-8 py-8 border-b lg:border-b-0 lg:border-r border-border bg-white">
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
          <HowItWorks />

          <p className="text-sm text-text-muted mb-6">
            {visible.length} course{visible.length !== 1 ? 's' : ''}
            {active !== 'All' ? ` in ${active}` : ''}
          </p>

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
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
                      style={{ backgroundColor: 'var(--color-amber)' }}
                    >
                      {course.status}
                    </span>
                  )}
                </div>

                {/* Titles grow to their natural height; the button is pinned by
                    mt-auto so cards align without padding short titles out. */}
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
      </div>
    </section>
  )
}
