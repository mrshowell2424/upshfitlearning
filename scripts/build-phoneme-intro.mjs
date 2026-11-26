/**
 * Meeting the new sound: where it is in a word, and how the mouth makes it.
 *
 * WHY THIS EXISTS. 95% Group's weekly timing guide opens Day 1 with two short
 * items before anything is read or written: Identify Phoneme, two minutes,
 * and Articulate Phoneme, three. They were the last two components of the
 * routine with nothing in the packet.
 *
 * WHAT THEY ARE FOR. Identify asks whether the sound is in the word at all
 * and whereabouts -- a child who cannot hear /sh/ at the end of "fish" will
 * not spell it there. Articulate asks what the mouth is doing, which is the
 * part that separates the pairs children confuse: /f/ and /v/ are the same
 * mouth with the voice off and on, and a child who can feel that stops
 * guessing between them.
 *
 * BOTH ARE SPOKEN, so what prints is a teacher's card. Nothing is shown to
 * the child: they listen and answer.
 *
 * WHERE THE ANSWERS COME FROM. Position is read off the spelling -- the
 * grapheme reader says where the unit falls, so "at the start", "in the
 * middle" and "at the end" are counted, not judged. Articulation comes from
 * the table below, which covers the consonants. A vowel lesson gets the
 * identify half and no articulation: what the mouth does for a vowel is a
 * matter of how open it is, and saying "your lips are a bit rounded" is not
 * a thing a child can check, so it is better left unsaid than said loosely.
 *
 *   bun run scripts/build-phoneme-intro.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { units } from "./lib/syllable-split.mjs";

const SEQ = JSON.parse(readFileSync("scripts/reading-sequence.json", "utf8")).sequence;
const SPELL = JSON.parse(readFileSync("scripts/reading-spelling.json", "utf8")).patterns;
const SPLITS = JSON.parse(readFileSync("scripts/reading-skill-splits.json", "utf8"));

/** Items per drill. Two minutes and three minutes, so four of each. */
const PER = 4;

/*
 * HOW EACH CONSONANT IS MADE: where the mouth is, and whether the voice is on.
 *
 * `how` is what a child can see or feel for themselves, which is the whole
 * point of asking. `voice` is noisy or quiet, tested with two fingers on the
 * throat. `hold` says whether the sound can be stretched, because that is how
 * a child tells a stop from a continuant without being told the words.
 *
 * Pairs that share a mouth and differ only in the voice are marked, because
 * those are the ones children mix up: f and v, s and z, p and b, t and d,
 * k and g, ch and j, th both ways.
 */
const MOUTH = {
  p: ["your lips press together and pop open", "quiet", false, "b"],
  b: ["your lips press together and pop open", "noisy", false, "p"],
  t: ["your tongue taps behind your top teeth", "quiet", false, "d"],
  d: ["your tongue taps behind your top teeth", "noisy", false, "t"],
  k: ["the back of your tongue lifts to the roof", "quiet", false, "g"],
  g: ["the back of your tongue lifts to the roof", "noisy", false, "k"],
  f: ["your top teeth rest on your bottom lip", "quiet", true, "v"],
  v: ["your top teeth rest on your bottom lip", "noisy", true, "f"],
  s: ["your tongue is behind your top teeth and the air hisses", "quiet", true, "z"],
  z: ["your tongue is behind your top teeth and the air buzzes", "noisy", true, "s"],
  sh: ["your lips push out and the air rushes", "quiet", true, null],
  ch: ["your lips push out and the air stops, then rushes", "quiet", false, "j"],
  j: ["your lips push out and the air stops, then rushes", "noisy", false, "ch"],
  th: ["your tongue comes between your teeth", "either, so try both", true, null],
  m: ["your lips close and the sound goes down your nose", "noisy", true, null],
  n: ["your tongue is behind your top teeth and the sound goes down your nose", "noisy", true, null],
  ng: ["the back of your tongue lifts and the sound goes down your nose", "noisy", true, null],
  l: ["your tongue touches behind your top teeth and the air goes round the sides", "noisy", true, null],
  r: ["your tongue pulls back and does not touch anything", "noisy", true, null],
  w: ["your lips round up small", "noisy", true, null],
  h: ["your mouth is open and it is only breath", "quiet", true, null],
  y: ["your tongue lifts to the front of the roof", "noisy", true, null],
  wh: ["your lips round up small", "noisy", true, null],
  ck: ["the back of your tongue lifts to the roof", "quiet", false, null],
  tch: ["your lips push out and the air stops, then rushes", "quiet", false, null],
  qu: ["the back of your tongue lifts, then your lips round up", "quiet", false, null],
};

const clean = (w) => String(w).toLowerCase().replace(/[^a-z]/g, "");

/*
 * The Hub's own lessons are not in the dictation bank and have no sub-focus
 * list, so their spellings are named here. They are the spellings in the
 * lesson's own title, which is where a teacher would look for them.
 */
const OWN = {
  "er-ir-ur": ["er", "ir", "ur"],
  "long-a": ["ai", "ay", "ea", "ey", "eigh"],
  "long-e": ["ea", "ee", "ey", "ie", "ei"],
  "long-i": ["igh", "ie", "y"],
  "long-o": ["oa", "oe", "ow"],
  "long-u": ["ue", "ew", "eu"],
  "teams-all": ["ai", "ee", "oa", "igh", "ow"],
};

/**
 * Where a spelling falls in a word: at the start, in the middle, at the end.
 *
 * Found by position in the spelling rather than by asking the grapheme
 * reader for a matching unit. The reader is built for chopping words, so it
 * keeps pass as p-a-s-s and clap as c-l-a-p, and a lesson whose pattern is
 * ss or cl found no word at all when this looked for one unit. A doubled
 * letter, a blend and a split spelling are all perfectly findable as
 * positions.
 *
 * A split spelling is placed by its vowel. The pattern in "cake" literally
 * runs to the end of the word, but the sound a child is listening for is in
 * the middle, and the middle is the true answer to where do you hear it.
 */
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

const out = [];
const noIdentify = [];
for (const lesson of SEQ) {
  const sp = SPELL.find((p) => p.key === lesson.key);
  const parts = sp ? sp.parts : null;
  const graphemes = (OWN[lesson.key] || SPLITS[lesson.key] || (parts ? parts.map((p) => p.part) : []))
    .map((g) => String(g).toLowerCase())
    // Letters, and the underscore a split spelling is written with.
    .filter((g) => /^[a-z]+(_[a-z]+)?$/.test(g));
  if (!graphemes.length) { noIdentify.push(lesson.key); continue; }

  const pool = [
    ...(parts ? parts.flatMap((p) => p.words.map((w) => w.word)) : []),
    ...(lesson.words || []),
  ].map(clean).filter((w) => w.length >= 2);
  if (!pool.length) { noIdentify.push(lesson.key); continue; }

  // Identify: the sound is in this word, and here is where. Spread across
  // the places the lesson's own words actually offer, so a child is not
  // asked "where" four times and told "at the start" four times.
  /*
   * Spread across the spellings AND the places they turn up in.
   *
   * One spelling at a time, and within each one the place that has been
   * asked about least so far. Two earlier versions each got one half of this
   * right and the other wrong: walking the spellings inside the place asked
   * "where do you hear it" four times and answered "at the start" every time,
   * and walking the places inside the spelling asked about sh four times in
   * a lesson that teaches sh, ch, th and wh. A child should meet each
   * spelling the lesson names, in more than one position.
   */
  const options = new Map();
  for (const g of graphemes) {
    const rows = [];
    const seenW = new Set();
    for (const w of pool) {
      const place = placeOf(w, g);
      if (!place || seenW.has(w)) continue;
      seenW.add(w);
      rows.push({ g, w, at: place });
    }
    if (rows.length) options.set(g, rows);
  }
  const identify = [];
  const usedWord = new Set();
  const placeCount = { "at the start": 0, "in the middle": 0, "at the end": 0 };
  const order = [...options.keys()];
  for (let round = 0; identify.length < PER && round < 8; round += 1) {
    for (const g of order) {
      if (identify.length >= PER) break;
      const rows = options.get(g).filter((r) => !usedWord.has(r.w));
      if (!rows.length) continue;
      rows.sort((a2, b2) => placeCount[a2.at] - placeCount[b2.at]);
      const pick = rows[0];
      usedWord.add(pick.w);
      placeCount[pick.at] += 1;
      identify.push(pick);
    }
  }

  // Articulate: only the graphemes this table can speak for.
  const articulate = [];
  for (const g of graphemes) {
    if (articulate.length >= PER) break;
    const m = MOUTH[g];
    if (!m) continue;
    articulate.push({ g, how: m[0], voice: m[1], hold: m[2], pair: m[3] });
  }

  if (!identify.length && !articulate.length) { noIdentify.push(lesson.key); continue; }
  // The spellings the lesson teaches, carried so the checker can tell a card
  // that asks about one of four from a lesson that only has one.
  out.push({
    key: lesson.key, name: lesson.name, level: lesson.level,
    spellings: [...options.keys()], identify, articulate,
  });
}

writeFileSync(
  "scripts/reading-phoneme-intro.json",
  JSON.stringify(
    {
      _note:
        "The two short Day 1 items 95% Group's weekly timing guide opens with: Identify Phoneme, two minutes, and Articulate Phoneme, three. Identify asks whether the lesson's sound is in a word and whereabouts, because a child who cannot hear /sh/ at the end of fish will not spell it there; the position is read off the grapheme reader rather than judged. Articulate asks what the mouth is doing, which is what separates the pairs children confuse -- f and v are the same mouth with the voice off and on. Consonants only: what the mouth does for a vowel is a matter of degree and not something a child can check, so vowel lessons get the identify half alone. Both are spoken, so what prints is a teacher's card. Generated by scripts/build-phoneme-intro.mjs; do not hand-edit.",
      perDrill: PER,
      lessons: out,
    },
    null,
    1,
  ) + "\n",
);

const withBoth = out.filter((l) => l.identify.length && l.articulate.length).length;
console.log(`${out.length} cards of ${SEQ.length} lessons.`);
console.log(`  ${withBoth} have both halves, ${out.length - withBoth} have identify only (vowel and morphology patterns).`);
console.log(`  ${out.reduce((s, l) => s + l.identify.length, 0)} identify items, ${out.reduce((s, l) => s + l.articulate.length, 0)} articulate items.`);
if (noIdentify.length) {
  console.log(`\n${noIdentify.length} lessons have no card, because their pattern is not a grapheme to hear:`);
  console.log(`   ${noIdentify.join(", ")}`);
}
