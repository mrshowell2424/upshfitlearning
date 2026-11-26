/**
 * Which 95% Group continuum skill each lesson teaches.
 *
 * WHY THIS EXISTS. The lesson picker said "Level 3 · Vowel teams 2" and
 * nothing else, so there was no way to see from it that the lesson is a P7
 * and that three P6 lessons sit a level below it. The continuum is the thing
 * the intervention groups are organised by -- a child is "PLL 5.3", and the
 * grade-level plan circles a DIBELS measure and reads off a Big Idea -- so
 * the picker should say which skill a lesson belongs to.
 *
 * WHAT THE CONTINUUM DOES NOT COVER. P1-P15 indexes phonics patterns: sounds,
 * teams, syllable types. It has nothing for morphology, and roughly a third
 * of this sequence is morphology -- Latin roots, chameleon prefixes, the
 * doubling rule, derivational suffixes. Those get null rather than the
 * nearest-looking P, because a teacher reading "P9" off a Latin roots lesson
 * would be reading something that is not true. The picker prints nothing for
 * them, which is the honest answer and also a visible one: it shows at a
 * glance how much of the sequence the continuum does not reach.
 *
 * Where a lesson spans two skills the first is the one it is filed under and
 * the second is noted, because a lesson has to sit somewhere in an ordering.
 */

/** lesson key → [continuum id, also] where `also` is a second skill it touches. */
export const LESSON_SKILL = {
  // Level 1
  "cvc-a": ["P2"],
  "cvc-mix": ["P2"],
  "og1-02": ["P12"],
  "og1-03": ["P1"],
  "og1-04": ["P4"],
  dig: ["P4"],
  "og1-06": ["P1"],
  floss: ["P2"],
  vce: ["P5"],
  blends: ["P3"],
  "og1-10": [null],
  "og1-11": [null],
  vccv: ["P10"],
  vccvce: ["P11"],
  "og1-13": ["P10"],

  // Level 2
  "ng-nk": ["P4"],
  y: ["P7"],
  "ck-tch": ["P4"],
  "ar-or": ["P8"],
  "er-ir-ur": ["P8"],
  "ai-ay": ["P6"],
  "ee-ea": ["P6", "P7"],
  "oa-ow": ["P6", "P7"],
  "og2-06": ["P2"],
  "og2-07": ["P9"],
  "og2-08": ["P7"],
  "og2-09": ["P15"],
  "og2-10": ["P10"],
  "og2-11": [null],
  "og2-12": [null],
  "og2-13": [null],
  "og2-14": [null],

  // Level 3
  "og3-01": ["P9"],
  "og3-02": ["P9"],
  "og3-03": ["P12"],
  "og3-04": ["P7"],
  "long-a": ["P6"],
  "long-e": ["P6", "P7"],
  "long-i": ["P6", "P7"],
  "long-o": ["P6", "P7"],
  "teams-all": ["P6", "P7"],
  "og3-05": [null],
  "og3-06": [null],
  "og3-07": ["P12"],
  "og3-08": ["P14"],
  "og3-09": ["P12"],
  "og3-10": [null],
  "og3-11": ["P14"],
  "og3-12": [null],
  "og3-13": ["P12"],

  // Level 4
  "og4-01": [null],
  "og4-02": [null],
  "og4-03": [null],
  "og4-04": [null],
  "og4-05": ["P12"],
  "og4-06": ["P7"],
  "long-u": ["P6"],
  "og4-07": [null],
  "og4-08": ["P9"],
  "og4-09": [null],

  // Level 5
  "og5-01": ["P9"],
  "og5-02": ["P7"],
  "og5-03": ["P9"],
  "og5-04": [null],
  "og5-05": ["P9"],
  "og5-06": ["P12"],
  "og5-07": ["P8"],
  "og5-08": [null],
  "og5-09": ["P7"],
};

/** The continuum id a lesson is filed under, or null where none fits. */
export function skillOf(key) {
  const row = LESSON_SKILL[String(key).split("|")[0]];
  return row ? row[0] : null;
}

/** The second skill a lesson also touches, or null. */
export function alsoSkillOf(key) {
  const row = LESSON_SKILL[String(key).split("|")[0]];
  return row && row.length > 1 ? row[1] : null;
}
