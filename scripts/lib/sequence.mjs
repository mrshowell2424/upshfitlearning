/**
 * The teaching sequence, derived in one place.
 *
 * "The lesson taught just before this one" is the whole basis of a spiral
 * review, and answering it needs the sequence in order -- not the Basic
 * Reading patterns in their order and the OG concepts in theirs, but the
 * single interleaved list a teacher actually works down.
 *
 * That list is not written down anywhere as data. It exists as a `const
 * SK = [` literal inside lesson-builder.html, with the Basic patterns
 * carrying scope numbers that slot them in among the OG concepts:
 * cvc-a is 1-01a, dig is 1-05, ai-ay is 2-05a. Sorting on those numbers
 * is what interleaves the two.
 *
 * scripts/check-word-ladders.mjs was reaching into that HTML and eval'ing
 * the literal out of it to get the order. That works and it is not
 * something a page can do, so the derivation lives here, one build script
 * writes it out as scripts/reading-sequence.json, and the page reads the
 * JSON. scripts/check-review.mjs re-derives it and fails if the committed
 * file has drifted from the source, which is what stops the two silently
 * parting company.
 */

import { readFileSync } from "node:fs";
import { EXTRA_LESSONS, EXTRA_SCOPE } from "./extra-lessons.mjs";

/**
 * Basic Reading patterns and the scope numbers that place them.
 *
 * Exported because two checkers used to keep their own copies of this, and a
 * copy is a thing that goes stale: moving Vowel teams 3 up a level here left
 * check-passages still sorting it by its old number, so it reported the Long
 * u passage as using ue and ew before they were taught, when they now are.
 */
export const SCOPE = {
  "cvc-a": "1-01a",
  "cvc-mix": "1-01b",
  dig: "1-05",
  floss: "1-07",
  vce: "1-08",
  blends: "1-09",
  vccv: "1-12a",
  vccvce: "1-12b",
  "ng-nk": "2-01",
  y: "2-02",
  "ck-tch": "2-03",
  "ar-or": "2-04",
  "ai-ay": "2-05a",
  "ee-ea": "2-05b",
  "oa-ow": "2-05c",
  // VOWEL TEAMS 3 MOVED UP A LEVEL, from 4-06 to 3-04e.
  //
  // It teaches ue, ew, ei, eigh and ui, which are vowel teams, and it sat
  // among the Latin roots two levels after every other vowel team lesson.
  // That also stranded Long u: its words are built from ue and ew, so it
  // could not come before this one, and it was parked at 4-06a away from
  // Long a, e, i and o. Both now sit in Level 3 with the rest of the teams,
  // Vowel teams 3 first so Long u still follows what it depends on, and
  // "All vowel teams together" last of all.
  "og4-06": "3-04e",
  // The Hub's own lessons, grouped by sound. Their numbers and their rows both
  // live in scripts/lib/extra-lessons.mjs, which explains why they are not
  // written into the export itself.
  ...EXTRA_SCOPE,
};

/**
 * Lessons taught at a different level from the one their OG pack says.
 *
 * The pack's own level is right for nearly all of them. Vowel teams 3 is the
 * exception: it is a vowel team lesson that the pack files at level 4, which
 * put it after every other vowel team lesson and after the Latin roots.
 */
const RELEVEL = { "og4-06": 3 };

/** OG ids already covered by a Basic Reading pattern above. */
const COVER = {
  "1-01": 1, "1-05": 1, "1-07": 1, "1-08": 1, "1-09": 1, "1-12": 1,
  "2-01": 1, "2-02": 1, "2-03": 1, "2-04": 1, "2-05": 1,
};

/**
 * The interleaved sequence, in teaching order.
 *
 * Returns [{ key, name, level }], level being the OG level number, or 1
 * for the Basic Reading patterns that sit among Level 1 and 2.
 */
export function deriveSequence(root = ".") {
  const R = `${root}/content-reading-materials/og-packs/`;
  global.window = global;
  new Function(readFileSync(R + "og-concepts.js", "utf8"))();
  new Function(readFileSync(R + "og-pack-data.js", "utf8"))();

  const s = readFileSync(`${root}/content-reading-materials/science-of-reading/lesson-builder.html`, "utf8");
  const i = s.indexOf("const SK = [");
  if (i === -1) throw new Error("lesson-builder.html no longer contains `const SK = [`");
  const literal = s.slice(i + "const SK = ".length, s.indexOf("\n    ];", i) + "\n    ]".length);
  const SKF = eval(literal);

  const rows = SKF.concat(EXTRA_LESSONS).map((r) => ({ key: r[0], name: r[1], band: r[2] }));
  global.OG_CONCEPTS.filter((c) => !COVER[c.id] && global.OG_PACKS[c.id]).forEach((c) =>
    rows.push({ key: "og" + c.id, name: c.name, band: "Level " + c.level }),
  );

  rows.sort((a, b) =>
    (SCOPE[a.key] || a.key.slice(2)).localeCompare(SCOPE[b.key] || b.key.slice(2)),
  );

  return rows.map((r) => ({
    key: r.key,
    name: r.name,
    level: RELEVEL[r.key] || Number(String(r.band).replace("Level ", "")) || 1,
  }));
}
