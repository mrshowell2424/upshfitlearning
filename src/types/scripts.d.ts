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

/**
 * The word ladder clue logic, in scripts/lib for the same reason: the
 * ladder page and scripts/check-word-ladders.mjs both decide whether a
 * clue turns one word into another, and two copies would drift silently.
 */
declare module "@/../scripts/lib/ladder-clue.mjs" {
  /** Would this clue, read literally, turn `a` into `b`? */
  export function describes(a: string, b: string, clue: string): boolean;
  /** Trim, lowercase, and drop anything that is not a letter. */
  export function tidy(typed: unknown): string;
  /** One letter swapped, added or taken away? */
  export function oneEditAway(a: string, b: string): boolean;
  /** What a child is told about one rung. */
  export function judgeRung(
    prev: string,
    want: string,
    clue: string,
    typed: string,
  ): "right" | "same" | "near" | "far" | "empty";
}
