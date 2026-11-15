/**
 * The spelling rules live in scripts/lib so the dictation page and the
 * check that guards it use the same function and cannot drift. That file
 * is plain JavaScript, so its shape is declared here.
 */
declare module "@/../scripts/lib/spelling-span.mjs" {
  /** [start, end) of the lesson inside the spelling, or null. */
  export function spanOf(word: string, raw: string): [number, number] | null;
  /** Did the child write the letters this lesson teaches? */
  export function wrotePattern(typed: string, part: string): boolean;
  /** What the child is told: right, the lesson, or somewhere else. */
  export function judgeSpelling(
    word: string,
    part: string,
    typed: string,
  ): "right" | "lesson" | "elsewhere";
}
