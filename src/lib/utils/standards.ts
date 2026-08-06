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

export type StandardSubject = 'ELA' | 'Math' | 'Science' | 'Social Studies' | 'Other'

/**
 * Work out the subject from the shape of the code, so cards can be colour-coded
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
