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

/**
 * The spiral review's three slots, in scripts/lib so the page and
 * scripts/check-review.mjs choose them the same way.
 */
declare module "@/../scripts/lib/review-slots.mjs" {
  /**
   * A level is whatever the subject calls one: a number for reading, a
   * grade name for maths. The function only ever uses it to look up a
   * pool, so both belong here rather than the one the reading page
   * happened to need first.
   */
  export type ReviewLevel = number | string;
  export interface ReviewSlot {
    why: string;
    key: string | null;
    name: string | null;
    level: ReviewLevel | null;
  }
  export function reviewSlots(
    key: string,
    data: {
      seq: { key: string; name: string; level: ReviewLevel }[];
      prereq: Record<string, string>;
      spiral: Record<string, string[]>;
    },
    picks?: { s1?: string; s2?: string; s3?: string },
  ): ReviewSlot[];
}
