import { describe, it, expect } from "vitest";
import { judgeSpelling, wrotePattern, spanOf } from "../../scripts/lib/spelling-span.mjs";

/**
 * The one piece of real logic in the dictation tool.
 *
 * Everything else on that page is data a build script generates and a
 * check script verifies. This is the part that decides what a teacher is
 * told about a child's spelling: whether the letters that went wrong are
 * the ones the lesson teaches, or whether the lesson landed and something
 * earlier did not. Those are two different lessons tomorrow.
 *
 * It is tested rather than eyeballed because a screenshot of one error
 * proves nothing. Two things only came out under test:
 *
 *   "triin" and "trian" for "train" both look like slips elsewhere and
 *   are not: in one, ii stands where ai goes; in the other both letters
 *   are there in the wrong order, and the order is the lesson.
 *
 *   The first rule compared the disagreeing stretch of the word against
 *   the stretch the lesson occupies, and called "submitt" a child who
 *   does not know the root mit. They wrote mit correctly and doubled a
 *   final consonant. That is what replaced it with the rule below.
 */

function verdict(word: string, part: string, typed: string) {
  return judgeSpelling(word, part, typed);
}

describe("wrotePattern", () => {
  it("sees a digraph", () => {
    expect(wrotePattern("rain", "ai")).toBe(true);
    expect(wrotePattern("rane", "ai")).toBe(false);
  });

  it("sees a split vowel across its consonant", () => {
    expect(wrotePattern("cake", "a_e")).toBe(true);
    expect(wrotePattern("caik", "a_e")).toBe(false);
  });

  it("sees an affix written without its hyphen", () => {
    expect(wrotePattern("unlock", "un-")).toBe(true);
    expect(wrotePattern("onlock", "un-")).toBe(false);
  });

  it("accepts either form of a root given as alternates", () => {
    expect(wrotePattern("submit", "mit/miss")).toBe(true);
    expect(wrotePattern("mission", "mit/miss")).toBe(true);
    expect(wrotePattern("subnit", "mit/miss")).toBe(false);
  });

  it("ignores case and stray space, because a child's typing has both", () => {
    expect(wrotePattern("  RAIN ", "ai")).toBe(true);
  });
});

describe("what the teacher is told", () => {
  it("says right when it is right", () => {
    expect(verdict("rain", "ai", "rain")).toBe("right");
    expect(verdict("cake", "a_e", "Cake")).toBe("right");
    expect(verdict("rain", "ai", "  rain  ")).toBe("right");
  });

  it("blames the pattern when the pattern is not in what they wrote", () => {
    expect(verdict("rain", "ai", "rane")).toBe("lesson");
    expect(verdict("rain", "ai", "rayn")).toBe("lesson");
    expect(verdict("train", "ai", "triin")).toBe("lesson");
    // Both letters present, wrong order -- and the order is the lesson.
    expect(verdict("train", "ai", "trian")).toBe("lesson");
    expect(verdict("paint", "ai", "paynt")).toBe("lesson");
    expect(verdict("cake", "a_e", "caik")).toBe("lesson");
    expect(verdict("unlock", "un-", "onlock")).toBe("lesson");
  });

  it("looks elsewhere when the pattern is there and the word still is not", () => {
    expect(verdict("train", "ai", "traip")).toBe("elsewhere");
    expect(verdict("train", "ai", "chrain")).toBe("elsewhere");
    expect(verdict("paint", "ai", "paind")).toBe("elsewhere");
    expect(verdict("cake", "a_e", "scake")).toBe("elsewhere");
    expect(verdict("unlock", "un-", "unlok")).toBe("elsewhere");
  });

  it("calls a doubled final consonant a doubling error, not a root one", () => {
    // The rule this replaced called this a child who does not know mit.
    expect(verdict("submit", "mit/miss", "submitt")).toBe("elsewhere");
    expect(verdict("rain", "ai", "rainn")).toBe("elsewhere");
  });
});

describe("the spans the data carries", () => {
  it("puts the split vowel across its consonant", () => {
    expect(spanOf("cake", "a_e")).toEqual([1, 4]);
  });
  it("puts an affix at the front", () => {
    expect(spanOf("unlock", "un-")).toEqual([0, 2]);
  });
  it("finds whichever alternate the word uses", () => {
    expect(spanOf("submit", "mit/miss")).toEqual([3, 6]);
    expect(spanOf("mission", "mit/miss")).toEqual([0, 4]);
  });
});
