/**
 * Checks every sound-spelling mapping row before a child fills one in.
 *
 * The sheet makes two claims about each word, and a child cannot do it if
 * either is wrong:
 *
 *   1. There are as many boxes as the word has sounds. Four boxes on a
 *      three-sound word is a question with no answer, and the child will
 *      look for a sound that is not there.
 *   2. The letters in the boxes, read across, spell the word. A box holding
 *      letters that are not in the word, or a word missing letters that are
 *      in no box, makes the answer key wrong.
 *
 * Both are re-proved here from the pronouncing dictionary rather than taken
 * from the builder, because the builder is where a mistake would be made.
 *
 *   bun run scripts/check-sound-mapping.mjs
 */
import { readFileSync } from "node:fs";
import { unsafeRealWord } from "./lib/not-nonsense.mjs";

const D = JSON.parse(readFileSync("scripts/reading-sound-mapping.json", "utf8"));
const SEQ = JSON.parse(readFileSync("scripts/reading-sequence.json", "utf8")).sequence;
const SOUNDS = JSON.parse(readFileSync("scripts/lib/pa-sounds.json", "utf8")).words;

/** A vowel-r is one box, so it is one sound here too. See the builder. */
const CMU_VOWEL = /^(AA|AE|AH|AO|AW|AY|EH|ER|EY|IH|IY|OW|OY|UH|UW)$/;
function sounds(w) {
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

const problems = [];
const keys = new Set(SEQ.map((l) => l.key));
let rows = 0;
let boxes = 0;

for (const L of D.lessons) {
  const say = (m) => problems.push(`${L.key}: ${m}`);
  if (!keys.has(L.key)) say("is not a lesson in the sequence");
  const seen = new Set();
  for (const r of L.rows) {
    rows += 1;
    boxes += r.boxes.length;
    if (seen.has(r.w)) say(`"${r.w}" appears twice on the same sheet`);
    seen.add(r.w);
    if (unsafeRealWord(r.w)) say(`"${r.w}" cannot be printed for a child`);

    const s = sounds(r.w);
    if (!s) { say(`"${r.w}" has no pronunciation on file`); continue; }
    if (r.boxes.length !== s.length) {
      say(`"${r.w}" has ${r.boxes.length} boxes and ${s.length} sounds`);
    }
    if (r.boxes.some((b) => !b)) say(`"${r.w}" has an empty box`);
    // A box for a silent e says it makes a sound. The consonant-le words
    // slipped through on a count: table is five sounds and five letters, and
    // one box each pairs the schwa with the l and gives the /l/ to the e.
    if (r.boxes[r.boxes.length - 1] === "e" && /[aeiou]/.test(r.w.slice(0, -1))) {
      say(`"${r.w}" gives a box to a silent e`);
    }

    // The boxes, read across, have to spell the word. A split spelling puts
    // its e back on the end, which is where the word has it.
    const split = r.boxes.some((b) => b.includes("_e"));
    const spelled = r.boxes.join("").replace("_e", "") + (split ? "e" : "");
    if (spelled !== r.w) say(`"${r.w}" is spelled "${spelled}" by its boxes`);
    if (r.boxes.filter((b) => b.includes("_e")).length > 1) {
      say(`"${r.w}" has two split spellings, which cannot both take the final e`);
    }
  }
}

const covered = new Set(D.lessons.map((l) => l.key));
const absent = SEQ.filter((l) => !covered.has(l.key));
console.log(`${D.lessons.length} mapping sheets of ${SEQ.length} lessons, ${rows} rows, ${boxes} boxes.`);
if (absent.length) {
  console.log(`\n${absent.length} lessons have no sheet, because none of their words map one box to one sound:`);
  console.log(`   ${absent.map((l) => l.name).join(", ")}`);
  console.log("   (x and qu are one letter saying two sounds, and nk is two; a mat cannot show that in one box)");
}
console.log(`problems: ${problems.length}`);
problems.slice(0, 30).forEach((x) => console.log("  " + x));
if (problems.length) {
  console.error("\n✗ fix these before the sheet ships.");
  process.exit(1);
}
console.log("✅ every row has one box per sound, and the boxes spell the word");
