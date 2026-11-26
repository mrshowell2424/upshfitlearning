/**
 * Sound-spelling mapping for every lesson: one box per sound, and what goes
 * in each.
 *
 * WHY THIS EXISTS. 95% Group's weekly timing guide gives "Identify Pattern:
 * Sound-Spelling Mapping with Chips" five minutes on Day 1, and a whole
 * OPTION day for a group that needs it. It is the routine their chip kits and
 * mapping papers are built around, and the packet had nothing for it.
 *
 * WHAT IT ASKS THAT NOTHING ELSE DOES. Every other sheet works in letters or
 * in whole words. This one works in sounds: the teacher says "ship", the
 * child hears three sounds, and writes sh in the first box, i in the second
 * and p in the third. The box count is given, so the question is not how many
 * sounds there are but which letters make each one -- and that is the moment
 * a child learns that sh is one sound written with two letters.
 *
 * HOW THE BOXES ARE WORKED OUT. lib/syllable-split.mjs already reads a word
 * as units rather than letters, longest match first, which is the same thing
 * as reading it in graphemes. Silent e is the one case it hands back
 * differently -- cake comes out c, a, ke -- so that is reshaped into the
 * split spelling a teacher would write: c, a_e, k.
 *
 * AND THEN EVERY ROW IS PROVED. The number of boxes has to equal the number
 * of sounds in the pronouncing dictionary, or the row is thrown away. That is
 * what stops a sheet asking for four boxes on a three-sound word, which no
 * child can do and no teacher can mark. It costs some words and it is the
 * only way to know the sheet is right.
 *
 *   bun run scripts/build-sound-mapping.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { units } from "./lib/syllable-split.mjs";
import { unsafeRealWord } from "./lib/not-nonsense.mjs";

const SEQ = JSON.parse(readFileSync("scripts/reading-sequence.json", "utf8")).sequence;
const SPELL = JSON.parse(readFileSync("scripts/reading-spelling.json", "utf8")).patterns;
const SOUNDS = JSON.parse(readFileSync("scripts/lib/pa-sounds.json", "utf8")).words;

/** Rows per sheet. Eight is a five-minute routine at about thirty seconds each. */
const ROWS = 8;

/*
 * THE SOUNDS, COUNTED THE WAY A MAPPING BOX COUNTS THEM.
 *
 * The pronouncing dictionary splits a vowel-r into two: car is K AA R. On a
 * sound-spelling mat ar is one box, because it is one spelling saying one
 * thing, which is how 95% Group's own cards treat it. So an R that follows a
 * vowel is folded into it before the count. ER is already one in the
 * dictionary, which is why bird never needed this.
 */
const CMU_VOWEL = /^(AA|AE|AH|AO|AW|AY|EH|ER|EY|IH|IY|OW|OY|UH|UW)$/;
function say(w) {
  const raw = SOUNDS[w] ? SOUNDS[w].split(" ") : null;
  if (!raw) return null;
  const out = [];
  for (const p of raw) {
    const prev = out[out.length - 1];
    if (p === "R" && prev && CMU_VOWEL.test(prev)) out[out.length - 1] = prev + "R";
    else out.push(p);
  }
  return out;
}

/*
 * THE GRAPHEMES, with three things the unit reader does differently.
 *
 * It keeps a doubled consonant as two units, because for chopping a word in
 * half that is what matters -- pass splits pas|s nowhere, but rab|bit does.
 * For mapping, ss is one spelling of one sound and belongs in one box.
 *
 * It also glues a vowel to a following ng or nk, for the same chopping
 * reason: ring comes back as r + ing. On a mat the i and the ng are two
 * sounds in two boxes.
 */
function graphemes(word) {
  const raw = units(word).map((u) => ({ s: u.s, vce: !!u.vce }));
  const out = [];
  for (const u of raw) {
    const m = /^([aeiou])(ng|nk)$/.exec(u.s);
    if (m) { out.push({ s: m[1] }, { s: m[2] }); continue; }
    const prev = out[out.length - 1];
    if (prev && prev.s === u.s && /^[bcdfglmnprstvz]$/.test(u.s)) { prev.s += u.s; continue; }
    out.push(u);
  }
  return out;
}

/**
 * A word as the graphemes a child writes in the boxes.
 *
 * Returns null where the word cannot be mapped honestly: no pronunciation on
 * file, or a box count that does not match the number of sounds.
 */
export function boxesFor(word) {
  const w = String(word).toLowerCase();
  if (!/^[a-z]+$/.test(w)) return null;
  const sounds = say(w);
  if (!sounds) return null;

  let parts = graphemes(w);
  // c + a + ke becomes c + a_e + k, which is how a teacher writes a split
  // spelling and how the child will see it on every other sheet.
  const last = parts[parts.length - 1];
  if (last && last.vce && last.s.length === 2) {
    const vowel = [...parts].reverse().find((p) => /^[aeiou]+$/.test(p.s));
    if (!vowel) return null;
    vowel.s += "_e";
    last.s = last.s[0];
    last.vce = false;
  }
  if (parts.some((p) => p.vce)) return null;

  const boxes = parts.map((p) => p.s);
  /*
   * A LONE e ON THE END IS ONLY A SOUND IN he, me, we AND she.
   *
   * Anywhere else it is silent, and a box for it tells a child it says
   * something. The consonant-le words are the trap, because they pass a
   * count: "table" is T EY B AH L, five sounds, and t-a-b-l-e is five
   * letters, so one box each looked right. It is not -- the schwa in
   * consonant-le has no letter at all, so that mapping pairs the schwa with
   * the l and hands the /l/ to the e. Ten rows across four lessons said that,
   * including circle as c, ir, c, l, e.
   *
   * The test is whether the e is the only vowel in the word, which is what
   * makes it the vowel of he rather than the silent one of table.
   */
  if (boxes[boxes.length - 1] === "e" && /[aeiou]/.test(w.slice(0, -1))) return null;
  // The proof: one box per sound, counted by the dictionary rather than by
  // the spelling.
  if (boxes.length !== sounds.length) return null;
  // And the boxes still have to spell the word, with the split e put back.
  const spelled = boxes.join("").replace(/_e/, "") + (boxes.some((b) => b.includes("_e")) ? "e" : "");
  if (spelled !== w) return null;
  return boxes;
}

const out = [];
const thin = [];
for (const lesson of SEQ) {
  const sp = SPELL.find((p) => p.key === lesson.key);
  const pool = [
    ...(sp ? sp.parts.flatMap((p) => p.words.map((w) => w.word)) : []),
    ...(lesson.words || []),
  ].map((w) => String(w).toLowerCase());

  const rows = [];
  const seen = new Set();
  for (const w of pool) {
    if (rows.length >= ROWS) break;
    if (seen.has(w) || unsafeRealWord(w)) continue;
    const boxes = boxesFor(w);
    if (!boxes || boxes.length < 2 || boxes.length > 6) continue;
    seen.add(w);
    rows.push({ w, boxes });
  }
  if (rows.length < 4) { thin.push(`${lesson.key}: ${rows.length} of ${ROWS}`); }
  if (!rows.length) continue;
  out.push({ key: lesson.key, name: lesson.name, level: lesson.level, rows });
}

writeFileSync(
  "scripts/reading-sound-mapping.json",
  JSON.stringify(
    {
      _note:
        "Sound-spelling mapping for each lesson: one row per word, one box per sound, and the grapheme that goes in each box. 95% Group's weekly timing guide gives this five minutes on Day 1 plus a whole OPTION day, and it is the routine their chip kits are built around. The teacher says the word and the child writes one grapheme per box, which is where a child learns that sh is one sound written with two letters. Boxes come from the grapheme reader in lib/syllable-split.mjs, with silent e reshaped into the split spelling a teacher writes; every row is then proved against the pronouncing dictionary, so the number of boxes is the number of sounds and not a guess from the spelling. Generated by scripts/build-sound-mapping.mjs; do not hand-edit.",
      rowsPerSheet: ROWS,
      lessons: out,
    },
    null,
    1,
  ) + "\n",
);

const rows = out.reduce((s, l) => s + l.rows.length, 0);
console.log(`${out.length} mapping sheets of ${SEQ.length} lessons, ${rows} rows.`);
console.log(`  ${out.reduce((s, l) => s + l.rows.reduce((t, r) => t + r.boxes.length, 0), 0)} boxes, every one proved against the pronouncing dictionary.`);
if (thin.length) {
  console.log(`\n${thin.length} lessons have fewer than four rows -- their words do not map cleanly:`);
  for (const x of thin.slice(0, 10)) console.log(`   – ${x}`);
}
