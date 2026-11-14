import { OG_CONCEPTS, OG_LEVELS } from "@/app/reading/og-packs-data";
import SPLITS from "@/../scripts/reading-skill-splits.json";

/**
 * Names for the 62 phonics patterns the writing sets are keyed by.
 *
 * 47 of them are OG concepts and already have authored names in
 * og-packs-data.ts, so those are read from there rather than retyped -- the
 * two would drift otherwise, and a pattern called one thing on the OG packs
 * page and another here is worse than no name at all.
 *
 * The other 15 are the Basic Reading patterns, which carry their sub-patterns
 * in reading-skill-splits.json but no prose name anywhere. Those are written
 * out below. They are standard phonics names, not invented ones.
 */

/** The Basic Reading patterns, in teaching order. */
const BASIC: Record<string, string> = {
  "cvc-a": "Short a · closed syllable",
  "cvc-mix": "Short i, o, u, e",
  dig: "Digraphs",
  floss: "The FLOSS rule",
  blends: "Blends",
  vce: "Silent e",
  vccv: "Two syllables · VCCV",
  vccvce: "Two syllables ending in silent e",
  "ng-nk": "ng and nk",
  "ck-tch": "ck and tch",
  y: "y doing a vowel's job",
  "ai-ay": "ai and ay",
  "ee-ea": "ee and ea",
  "oa-ow": "oa and ow",
  "ar-or": "ar and or",
};

/** The order the Basic patterns are taught in, which is the order above. */
export const BASIC_ORDER = Object.keys(BASIC);

export interface PatternInfo {
  key: string;
  /** What a teacher calls it. */
  name: string;
  /** "Basic Reading", or "Level 3". */
  group: string;
  /** Which grades the group is for, where the OG levels say so. */
  grades: string;
  /** The letters inside it, where they are recorded. */
  sub: string[];
}

const splits = SPLITS as Record<string, string[]>;

export function patternInfo(key: string): PatternInfo {
  const sub = splits[key] ?? [];

  if (key.startsWith("og")) {
    const id = key.slice(2);
    const concept = OG_CONCEPTS.find((c) => c.id === id);
    const level = OG_LEVELS.find((l) => l.level === concept?.level);
    return {
      key,
      name: concept?.name ?? key,
      group: level ? level.title : "OG",
      grades: level?.grades ?? "",
      // The concept's own pattern string is better than the split letters
      // where it exists, because it was authored for a teacher to read.
      sub: concept?.patterns ? concept.patterns.split(/,\s*/) : sub,
    };
  }

  return {
    key,
    name: BASIC[key] ?? key,
    group: "Basic Reading",
    grades: "1st–3rd",
    sub,
  };
}
