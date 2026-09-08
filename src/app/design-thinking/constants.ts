/**
 * The shapes and the small constants — the part the browser is allowed to have.
 *
 * The weeks themselves are deliberately not here. They live in weeks-data.ts,
 * which is imported only by /api/design-thinking/year, so a signed-out visitor
 * receives no week titles, no driving questions and no material links at all.
 * Splitting the file is what makes that true: importing the grade list from the
 * same module as the year data would pull all 468 weeks into the client bundle
 * whatever the page chose to render.
 */

export interface DesignWeek {
  /** 1-36, and the number the material pages take as ?week= */
  n: number
  tag: string
  title: string
  /** The driving question, always phrased "How might we ..." */
  hmw: string
  /** Who the week's work is tested on. */
  audience: string
}

export interface Quarter {
  name: string
  meta: string
  blurb: string
}

export interface GradeYear {
  quarters: Quarter[]
  weeks: DesignWeek[]
}

/** K first, then 1-12, which is the order the picker shows. */
export const DESIGN_GRADES = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const

export type DesignGrade = (typeof DESIGN_GRADES)[number]

/** The five days, in the order a week runs. Colours are the canvas's own. */
export const PHASES = [
  { letter: "M", day: "Monday", phase: "Empathize", color: "#F26D5B" },
  { letter: "T", day: "Tuesday", phase: "Define", color: "#F2A93B" },
  { letter: "W", day: "Wednesday", phase: "Ideate", color: "#2FA39B" },
  { letter: "T", day: "Thursday", phase: "Prototype", color: "#5B5BD6" },
  { letter: "F", day: "Friday", phase: "Test", color: "#8B3E8F" },
] as const

/** 36 a year across 13 grades — the number the page puts on the masthead. */
export const DESIGN_WEEK_TOTAL = DESIGN_GRADES.length * 36

/** Five a week, every week. */
export const DESIGN_ACTIVITY_TOTAL = DESIGN_WEEK_TOTAL * PHASES.length
