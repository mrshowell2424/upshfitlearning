/**
 * The words an OG pack holds for a lesson.
 *
 * Pulled out of build-sequence.mjs so build-spelling.mjs can read the
 * same words without reading build-sequence's OUTPUT. That distinction
 * matters: reading-sequence.json takes a lesson's words from its
 * dictation bank where one exists, so a dictation builder that read the
 * sequence file would be deriving a lesson's words from its own previous
 * output. One shared reader of the packs, and the loop cannot form.
 *
 *   packWords(key)   the lesson's own short list: speed, then bank,
 *                    then read -- the first field that has anything.
 *   widePool(key)    every real word anywhere in the pack's word fields,
 *                    for topping up a list that is short or one-sided.
 *
 * widePool is filtered through the system dictionary because some of
 * those fields carry the made-up words from the real-or-fake exercises --
 * proll, mandle, jicture, interblate -- and a review sheet telling a
 * teacher to read "mandle" is worse than one that is merely incomplete.
 */

import { readFileSync } from "node:fs";

const R = "content-reading-materials/og-packs/";
if (!global.OG_PACKS) {
  global.window = global;
  new Function(readFileSync(R + "og-concepts.js", "utf8"))();
  new Function(readFileSync(R + "og-pack-data.js", "utf8"))();
}
const PACKS = global.OG_PACKS;

const DICT = new Set(
  readFileSync("/usr/share/dict/words", "utf8")
    .split("\n")
    .map((w) => w.trim())
    .filter((w) => w && w === w.toLowerCase()),
);
export const realWord = (w) =>
  DICT.has(w) || DICT.has(w.replace(/'s$/, "")) || DICT.has(w.replace(/-/g, ""));

/** Basic Reading patterns and the OG pack that covers the same ground. */
export const PACK_FOR_BASIC = {
  "cvc-a": "1-01",
  "cvc-mix": "1-01",
  dig: "1-05",
  floss: "1-07",
  vce: "1-08",
  blends: "1-09",
  vccv: "1-12",
  vccvce: "1-12",
  "ng-nk": "2-01",
  y: "2-02",
  "ck-tch": "2-03",
  "ar-or": "2-04",
  "ai-ay": "2-05",
  "ee-ea": "2-05",
  "oa-ow": "2-05",
};

export const packId = (key) => (key.startsWith("og") ? key.slice(2) : PACK_FOR_BASIC[key]);

/** The lesson's own short word list, or null. */
export function packWords(key, limit = Infinity) {
  const p = PACKS[packId(key)];
  if (!p) return null;
  for (const field of ["speed", "bank", "read"]) {
    const v = p[field];
    if (Array.isArray(v) && v.length) {
      const words = [...new Set(v.map((w) => String(w).trim()).filter((w) => /^[a-zA-Z'-]+$/.test(w)))];
      if (words.length) return words.slice(0, limit);
    }
  }
  return null;
}

const WIDE_FIELDS = ["speed", "bank", "read", "read2", "lists"];
/** Every real word anywhere in the pack's word fields. */
export function widePool(key) {
  const p = PACKS[packId(key)];
  if (!p) return [];
  const out = new Set();
  for (const f of WIDE_FIELDS) {
    const v = p[f];
    if (!v) continue;
    for (const item of Array.isArray(v) ? v : [v]) {
      if (typeof item !== "string") continue;
      for (const w of item.split(/[^A-Za-z'-]+/)) {
        const lw = w.toLowerCase();
        if (lw.length > 1 && realWord(lw)) out.add(lw);
      }
    }
  }
  return [...out];
}
