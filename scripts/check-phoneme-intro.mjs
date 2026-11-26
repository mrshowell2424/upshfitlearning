/**
 * Checks the Day 1 sound card before a teacher reads it out.
 *
 * Both halves are spoken, and a teacher reading them has no way to tell a
 * wrong answer from a right one except by trusting the card. So:
 *
 *   1. Is the spelling actually in the word? "Do you hear sh in chip" is a
 *      question with no answer, and the child who says no is right.
 *   2. Is the position the card gives the position the word has? This is the
 *      whole of the identify item. An item that says "at the end" about a
 *      spelling at the start teaches a child to distrust their own ear.
 *   3. Does every spelling the lesson teaches get asked about? A digraph
 *      lesson whose card asks about sh four times has not introduced ch, th
 *      or wh at all.
 *   4. Does each articulation say where the mouth is and whether the voice
 *      is on? Those are the two things a child can check for themselves,
 *      and an entry missing either is not worth reading out.
 *
 *   bun run scripts/check-phoneme-intro.mjs
 */
import { readFileSync } from "node:fs";

const D = JSON.parse(readFileSync("scripts/reading-phoneme-intro.json", "utf8"));
const SEQ = JSON.parse(readFileSync("scripts/reading-sequence.json", "utf8")).sequence;
const keys = new Set(SEQ.map((l) => l.key));

/** The same positional test the builder uses. */
function placeOf(word, grapheme) {
  let at = -1;
  let len = 0;
  if (grapheme.includes("_")) {
    const m = new RegExp(grapheme.replace(/_/g, "[a-z]")).exec(word);
    if (!m) return null;
    at = m.index;
    len = 1;
  } else {
    at = word.indexOf(grapheme);
    len = grapheme.length;
  }
  if (at === -1) return null;
  if (at === 0) return "at the start";
  if (at + len === word.length) return "at the end";
  return "in the middle";
}

const problems = [];
let identify = 0;
let articulate = 0;
for (const L of D.lessons) {
  const say = (m) => problems.push(`${L.key}: ${m}`);
  if (!keys.has(L.key)) say("is not a lesson in the sequence");

  const words = new Set();
  const spellings = new Set();
  for (const it of L.identify) {
    identify += 1;
    spellings.add(it.g);
    if (words.has(it.w)) say(`asks about "${it.w}" twice`);
    words.add(it.w);
    const real = placeOf(it.w, it.g);
    if (!real) { say(`"${it.g}" is not in "${it.w}" at all`); continue; }
    if (real !== it.at) say(`says "${it.g}" is ${it.at} in "${it.w}", and it is ${real}`);
  }

  /*
   * Every spelling the lesson teaches gets asked about, where there are
   * slots to go round.
   *
   * Against the lesson's own list, not a flat rule. The first version of
   * this said any card that asked about one spelling four times was wrong,
   * and reported four lessons that teach exactly one spelling -- aud, y, o,
   * wor -- for asking about the only one they have.
   */
  const have = (L.spellings || []).length;
  const asked = new Set(L.identify.map((i) => i.g)).size;
  if (have > 1 && asked < Math.min(have, L.identify.length)) {
    say(`teaches ${have} spellings and asks about ${asked} of them in ${L.identify.length} items`);
  }

  for (const a of L.articulate) {
    articulate += 1;
    if (!a.how) say(`"${a.g}" does not say where the mouth is`);
    if (!a.voice) say(`"${a.g}" does not say whether the voice is on`);
    if (a.pair && !L.articulate.some((x) => x.g === a.pair)
        && !/^[a-z]+$/.test(a.pair)) say(`"${a.g}" names a pair that is not a spelling`);
  }
  if (!L.identify.length && !L.articulate.length) say("has a card with nothing on it");
}

const covered = new Set(D.lessons.map((l) => l.key));
const absent = SEQ.filter((l) => !covered.has(l.key));
console.log(`${D.lessons.length} sound cards of ${SEQ.length} lessons.`);
console.log(`${identify} identify items, ${articulate} articulate items.`);
if (absent.length) {
  console.log(`\n${absent.length} lessons have no card, because their pattern is not a sound to hear:`);
  console.log(`   ${absent.map((l) => l.name).slice(0, 8).join(", ")}${absent.length > 8 ? ", …" : ""}`);
}
console.log(`problems: ${problems.length}`);
problems.slice(0, 30).forEach((x) => console.log("  " + x));
if (problems.length) {
  console.error("\n✗ fix these before the card ships.");
  process.exit(1);
}
console.log("✅ every spelling is in its word, in the place the card gives");
