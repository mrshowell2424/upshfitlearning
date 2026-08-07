/**
 * Course data, kept out of the client component so the server can read it too.
 *
 * COURSE_COUNT is quoted on the pricing page and the matcher, and importing it
 * from a 'use client' module made the server throw rather than render — the
 * count is data, not UI, so it belongs somewhere both sides can reach.
 */
/** Exactly five, so the filter row stays scannable. */
export const CATEGORIES = [
  'Classroom Management',
  'Instruction & Lesson Design',
  'Technology & Blended Learning',
  'Book Studies',
  'Quick PD',
] as const

export type CourseCategory = (typeof CATEGORIES)[number]

export interface AnnouncedCourse {
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

export const COURSES: AnnouncedCourse[] = [
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
