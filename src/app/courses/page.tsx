import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { AnnouncedCourses } from './announced'

interface Course {
  id: string
  title: string
  track: string | null
  lesson_count: number | null
  duration: string | null
  blurb: string | null
  cover_image: string | null
  is_free: boolean | null
}

/**
 * Rendered per request rather than prerendered. The course list comes from the
 * database, which is not reachable at build time, so a static page would bake
 * in an empty grid and never recover — the query throws, the catch below
 * swallows it, and the result is cached as though the table were empty.
 */
export const dynamic = 'force-dynamic'

/**
 * The page itself is public: graduate credit is open to anyone, so the courses
 * need to be visible without an account. Only the Google Classroom link is
 * member-only, gated inside AnnouncedCourses.
 */
export default async function CoursesPage() {
  let courseList: Course[] = []

  try {
    courseList = (await db.select().from(courses)) as Course[]
  } catch (error) {
    console.error('Error loading courses:', error)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-16 px-5 md:px-8 bg-gradient-to-br from-teal-50 to-white border-b border-hairline">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-[30px] md:text-4xl font-bold text-charcoal">Courses</h1>
          </div>
        </section>

        <AnnouncedCourses />

        {/* Anything added to the courses table publishes here too */}
        {courseList.length > 0 && (
          <section className="pb-14 md:pb-24 px-5 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseList.map(course => (
                  <article
                    key={course.id}
                    className="border border-hairline rounded-2xl overflow-hidden hover:border-charcoal hover:shadow-lg transition-all flex flex-col"
                  >
                    <div className="bg-gray-100 aspect-video overflow-hidden border-b border-hairline">
                      {course.cover_image ? (
                        <img
                          src={course.cover_image}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-50 to-gray-100" />
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {course.track && (
                          <span className="text-xs font-bold text-teal uppercase tracking-[0.1em]">
                            {course.track}
                          </span>
                        )}
                        {course.duration && (
                          <>
                            <span className="text-xs text-text-muted">•</span>
                            <span className="text-xs text-text-muted">{course.duration}</span>
                          </>
                        )}
                        {course.lesson_count ? (
                          <>
                            <span className="text-xs text-text-muted">•</span>
                            <span className="text-xs text-text-muted">
                              {course.lesson_count} lessons
                            </span>
                          </>
                        ) : null}
                      </div>

                      <h3 className="text-lg font-bold text-charcoal mb-2">{course.title}</h3>

                      {course.blurb && (
                        <p className="text-sm text-text-body flex-1">{course.blurb}</p>
                      )}

                      {!course.is_free && (
                        <span className="mt-4 inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-text-faint">
                          All-Access
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
