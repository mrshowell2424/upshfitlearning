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

/** Basic Reading patterns and the scope numbers that place them. */
const SCOPE = {
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
};

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

  const rows = SKF.map((r) => ({ key: r[0], name: r[1], band: r[2] }));
  global.OG_CONCEPTS.filter((c) => !COVER[c.id] && global.OG_PACKS[c.id]).forEach((c) =>
    rows.push({ key: "og" + c.id, name: c.name, band: "Level " + c.level }),
  );

  rows.sort((a, b) =>
    (SCOPE[a.key] || a.key.slice(2)).localeCompare(SCOPE[b.key] || b.key.slice(2)),
  );

  return rows.map((r) => ({
    key: r.key,
    name: r.name,
    level: Number(String(r.band).replace("Level ", "")) || 1,
  }));
}
