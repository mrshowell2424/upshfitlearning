/**
 * Standard codes are dotted and contain no spaces, which is what separates them
 * from a plain-language search. This deliberately covers every shape used across
 * subjects — RL.2.1, L.5.4, 2.NBT.B.5, 3.MD.A.1, 5.LS1.A, K.PS2.A, 3.5.C — rather
 * than only the two-letter ELA form.
 */
const STANDARD_CODE_PATTERN = /^[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+$/

export function isStandardCode(value: string): boolean {
  return STANDARD_CODE_PATTERN.test(value.trim())
}

/** Link to the standard detail page (blueprint, unpack, resources, generate). */
export function standardHref(code: string): string {
  return `/match/${encodeURIComponent(code.trim().toUpperCase())}`
}

/**
 * Steps carry a learning-science slug; teachers read the principle by name.
 * Anything not listed falls back to title case, so a new slug still renders.
 */
const SCIENCE_LABELS: Record<string, string> = {
  retrieval: 'Retrieval Practice',
  'retrieval-practice': 'Retrieval Practice',
  'dual-coding': 'Dual Coding',
  elaboration: 'Elaboration',
  interleaving: 'Interleaving',
  collaborative: 'Collaborative Learning',
  'collaborative-learning': 'Collaborative Learning',
  spaced: 'Spaced Practice',
  'spaced-practice': 'Spaced Practice',
  metacognition: 'Metacognition',
  'worked-example': 'Worked Example',
  'cognitive-load': 'Cognitive Load Support',
  otr: 'Opportunities to Respond',
  modeling: 'Explicit Modeling',
  feedback: 'Immediate Feedback',
}

export function scienceLabel(tag: string): string {
  if (!tag) return ''
  const key = tag.trim().toLowerCase()
  if (SCIENCE_LABELS[key]) return SCIENCE_LABELS[key]

  return key
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** "4th grade ELA" — the line that tells a teacher whose lesson this is. */
/**
 * The grade a code belongs to: "K", "1".."8", a band like "9-10", or "HS".
 *
 * Order matters. Scanning for the first grade-shaped segment looks tempting but
 * misfiles high school: RL.9-10.1 would match the trailing "1" and land in
 * first grade, and N-RN.2 would land in second. So the leading segment is
 * checked first, then the high school conceptual categories, and only then the
 * segment after the strand.
 *
 *   K.CC.A.1     → K       leading segment is the grade
 *   2.NBT.A.1    → 2
 *   RL.2.1       → 2       grade follows the strand
 *   RL.9-10.1    → 9-10    a band, not two grades
 *   N-RN.2       → HS      high school categories carry no grade at all
 */
const HS_CATEGORY = /^[NAFGS]-[A-Z]{2,4}$/
const GRADE_SEGMENT = /^(K|1[0-2]|[1-9])$/i
const GRADE_BAND = /^\d{1,2}-\d{1,2}$/

export function standardGrade(code: string): string | null {
  const parts = code.trim().toUpperCase().split('.')

  if (GRADE_SEGMENT.test(parts[0])) return parts[0]
  if (HS_CATEGORY.test(parts[0])) return 'HS'
  if (parts[1] && GRADE_BAND.test(parts[1])) return parts[1]
  if (parts[1] && GRADE_SEGMENT.test(parts[1])) return parts[1]

  return null
}

/** How a grade reads to a teacher. */
export function gradeLabel(grade: string): string {
  const g = grade.toUpperCase()
  if (g === 'K') return 'Kindergarten'
  if (g === 'HS') return 'High school'
  if (GRADE_BAND.test(g)) return `Grades ${g.replace('-', '\u2013')}`
  return `Grade ${g}`
}

export function gradeSubjectLabel(code: string, grade: string | null): string {
  const subject = standardSubject(code)
  const subjectName = subject === 'Other' ? '' : subject

  if (!grade) return subjectName

  const upper = grade.toUpperCase()
  const ordinal =
    upper === 'K'
      ? 'Kindergarten'
      : upper === 'HS'
        ? 'High school'
        : GRADE_BAND.test(upper)
          ? `Grades ${upper.replace('-', '\u2013')}`
          : `${grade}${['th', 'st', 'nd', 'rd'][Number(grade) % 10 > 3 || Math.floor(Number(grade) % 100 / 10) === 1 ? 0 : Number(grade) % 10]} grade`

  return [ordinal, subjectName].filter(Boolean).join(' ')
}

export type StandardSubject = 'ELA' | 'Math' | 'Science' | 'Social Studies' | 'Other'

/**
 * Work out the subject from the shape of the code, so cards can be color-coded
 * without the standards table needing a subject column.
 *
 *   RL.2.1, L.5.4      → ELA            (ELA strands are letter-led)
 *   5.LS1.A, K.PS2.A   → Science        (NGSS domains carry a trailing digit)
 *   2.NBT.B.5, 3.MD.A.1→ Math           (letters-only domain segment)
 *   3.5.C, 4.4.B       → Social Studies (all-numeric segments)
 *
 * Science is checked before Math because both start with a grade digit.
 */
export function standardSubject(code: string): StandardSubject {
  const normalized = code.trim().toUpperCase()
  const parts = normalized.split('.')

  if (/^(RL|RI|RF|L|W|SL)$/.test(parts[0])) return 'ELA'
  // High school maths: N-RN, A-SSE, F-IF, G-SRT, S-ID and friends
  if (/^[NAFGS]-[A-Z]{2,4}$/.test(parts[0])) return 'Math'
  if (parts[1] && /^(LS|PS|ESS|ETS)\d/.test(parts[1])) return 'Science'
  if (parts[1] && /^[A-Z]+$/.test(parts[1])) return 'Math'
  if (/^\d+\.\d+/.test(normalized)) return 'Social Studies'

  return 'Other'
}

export interface SubjectTheme {
  label: string
  /** Solid accent — rules, code text, badge text */
  accent: string
  /** Card wash, kept light enough for body copy to stay legible */
  tint: string
  /** Slightly stronger than the tint, for chips sitting on the wash */
  chip: string
}

export const SUBJECT_THEME: Record<StandardSubject, SubjectTheme> = {
  ELA: {
    label: 'ELA',
    accent: 'var(--color-lavender)',
    tint: 'rgba(184, 125, 255, 0.08)',
    chip: 'rgba(184, 125, 255, 0.18)',
  },
  Math: {
    label: 'Math',
    accent: 'var(--color-blue)',
    tint: 'rgba(76, 154, 255, 0.08)',
    chip: 'rgba(76, 154, 255, 0.18)',
  },
  Science: {
    label: 'Science',
    accent: 'var(--color-teal)',
    tint: 'rgba(0, 180, 166, 0.08)',
    chip: 'rgba(0, 180, 166, 0.18)',
  },
  'Social Studies': {
    label: 'Social Studies',
    accent: 'var(--color-amber)',
    tint: 'rgba(255, 177, 63, 0.10)',
    chip: 'rgba(255, 177, 63, 0.22)',
  },
  Other: {
    label: 'Standard',
    accent: 'var(--color-coral)',
    tint: 'rgba(255, 106, 91, 0.08)',
    chip: 'rgba(255, 106, 91, 0.18)',
  },
}

/** Convenience: the palette for a given code. */
export function standardTheme(code: string): SubjectTheme {
  return SUBJECT_THEME[standardSubject(code)]
}
