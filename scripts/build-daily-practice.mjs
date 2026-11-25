/**
 * Five days of quick daily practice for every lesson, across the five mClass
 * measures a child is actually scored on.
 *
 * WHAT THE DATA CHAT ASKS FOR. It reports six numbers -- reading fluency,
 * reading accuracy, letter sounds, whole made-up words, word reading and the
 * maze -- and then leaves a child with a goal and nothing to do about it. This
 * is the something to do: five minutes a day, five days, on all five, built
 * from the concept the lesson is teaching rather than from a generic list.
 *
 * A DAY IS A PAGE. Five pages, one for each day, and everything on a page
 * is that day's: the passage, six real words and four made-up ones, three
 * maze sentences, and the word race. A child sits down with one sheet.
 *
 * WHY THE PASSAGE IS THE SAME ALL WEEK and the words are not. Repeated reading
 * of one passage is the thing that moves fluency and accuracy -- the child
 * reads it Monday, and again Friday, and the numbers in the margin show the
 * change. Word reading and letter sounds work the other way: reading the same
 * ten words five times measures memory, so those are different every day. The
 * maze shifts its blanks each day over the same text, which keeps the reading
 * honest without changing what is being read.
 *
 * WHERE EACH PART COMES FROM
 *   ORF and accuracy  the lesson's own decodable passage
 *   word reading      the lesson's real words, plus heart words up to its level
 *   letter sounds     the lesson's made-up words, topped up from the continuum
 *                     pools for its level -- eight per lesson is not five days
 *   maze              three sentences of that passage, a different three
 *                     and a different blank in them each day
 *   word race         the lesson's own words again, one list for the whole
 *                     week, so Monday's count and Friday's can be compared
 *
 *   bun run scripts/build-daily-practice.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { CONCEPTS } from "./lib/continuum-pools.mjs";
import { mazeTokens } from "./lib/maze.mjs";
import { LEVEL_SKILLS, EXTRA_CLOSED } from "./lib/nwf-pools.mjs";

const SEQ = JSON.parse(readFileSync("scripts/reading-sequence.json", "utf8")).sequence;
const PASS = JSON.parse(readFileSync("scripts/reading-passages.json", "utf8")).passages;
const MULTI = JSON.parse(readFileSync("scripts/reading-multisyllabic.json", "utf8")).words;
const HEART = JSON.parse(readFileSync("scripts/reading-heart-words.json", "utf8")).words;

const DAYS = 5;
const WRF_PER_DAY = 6;
const NWF_PER_DAY = 4;
const MAZE_SENTENCES = 3;
// A minute of reading down a list. Twenty-four is more than a child at these
// levels gets through in sixty seconds, which is the point: the sheet must
// not run out before the clock does, or the score stops being a speed.
const RACE_WORDS = 24;

/** Same seed, same week. A sheet printed on Sunday has to match the key on Friday. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(list, seed) {
  const out = [...list];
  const rand = rng(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** The continuum's made-up words for a reading level, already signed off. */
function continuumFakes(level) {
  const ids = LEVEL_SKILLS[Math.min(5, Math.max(1, level))] || [];
  return ids.flatMap((id) => {
    const c = CONCEPTS.find((x) => x.id === id);
    return c && c.kind === "words" ? c.fake : [];
  });
}

/** The passage as sentences, terminal punctuation and closing quote kept. */
function sentences(text) {
  const m = String(text).match(/[^.!?]+[.!?]+[\u201d"']*/g);
  return (m || [String(text)]).map((x) => x.trim()).filter(Boolean);
}

/**
 * The sentences long enough to hold a maze item.
 *
 * "Nat is a cat." has one word that can be blanked and two of the three
 * choices read as English, so an item built on it is a coin toss. Longer
 * sentences carry enough around the gap for sense to decide it. The
 * threshold slides because six passages have no sentence of eight words --
 * better a short sentence than a day with no maze.
 */
function mazeable(all) {
  for (const n of [8, 7, 6]) {
    const keep = all.filter((x) => x.split(/\s+/).length >= n);
    if (keep.length >= MAZE_SENTENCES) return keep;
  }
  return all;
}

/**
 * One blank in one sentence, as a word index rather than a token list.
 *
 * The gap sits about a third of the way in, so there is something before it
 * to set the sense and something after it to confirm the choice. `shift`
 * moves it further along, which is what a passage with six usable sentences
 * needs: the week comes round to that sentence twice and the second pass has
 * to ask a different question.
 *
 * Returned compactly -- the sentence, which word is missing, and the three
 * choices -- rather than as one object per word. Both the practice page and
 * every lesson packet carry this data inline, and a token list per word made
 * the file eight times the size for nothing: a renderer can split a sentence
 * on spaces.
 *
 * Returns null when no word in the sentence can be blanked -- a capital, a
 * two letter word and a full stop leave nothing to ask about -- and the
 * caller moves on to the next sentence.
 */
function oneBlank(sentence, seed, avoid, shift) {
  const words = sentence.split(/\s+/);
  const base = Math.max(1, Math.floor(words.length / 3));
  // The shift wraps rather than grows. A passage of four usable sentences
  // comes round three times in a week, and a shift that kept adding simply
  // ran off the end of a short sentence and fell back to the same word it
  // asked about on Monday -- which is how this read before the wrap: five
  // days of "The map was [for / she / most] a run up to see Nan."
  const span = Math.max(1, words.length - 2);
  for (const lead of [1 + ((base + shift * 2) % span), base, 1]) {
    if (lead >= words.length - 1) continue;
    const tokens = mazeTokens(sentence, { lead, every: 1, max: 1, seed, avoid });
    const at = tokens.findIndex((t) => t.kind === "blank");
    if (at === -1) continue;
    const b = tokens[at];
    return { s: sentence, at, before: b.before, after: b.after, choices: b.choices, answer: b.answer };
  }
  return null;
}

const out = [];
const short = [];
const noMaze = [];

for (const lesson of SEQ) {
  const p = PASS[lesson.key];
  if (!p) continue;
  // The easiest version written, because this is a daily warm-up rather than
  // a reach: the point is reading it faster, not decoding it for the first
  // time. A teacher who wants the harder text has it on the fluency page.
  const text = p.g2 || p.g3 || p.g4;
  if (!text) continue;

  const m = MULTI[lesson.key] || {};
  const level = lesson.level || 1;
  const seed = 9000 + SEQ.indexOf(lesson) * 31;

  // Real words: the lesson's own, then its single-syllable bank, then the
  // heart words taught up to this level -- the irregular ones no amount of
  // sounding out will crack, which is exactly why they need the repetition.
  const heart = HEART.filter((h) => h.level <= level).map((h) => h.word);
  const realPool = [...new Set([...(lesson.words || []), ...(m.one || []), ...heart])]
    .filter((w) => /^[a-z']+$/i.test(w));

  // Made-up words come ONLY from the signed-off pools, never from the
  // multisyllabic bank's own made-up list.
  //
  // That bank's words are deliberately near-real -- sumshine, cutcake,
  // oupside -- because they exist to be told apart from sunshine, cupcake and
  // outside in a different exercise. Letter sounds is the opposite task: a
  // made-up word there has to be plainly made up, or a child who reads it
  // right says a real word and the measure means nothing. So this draws from
  // scripts/lib/nwf-pools.mjs and the continuum pools, both of which are
  // checked for exactly that.
  const fakePool = [...new Set([
    ...continuumFakes(level),
    ...(level <= 2 ? EXTRA_CLOSED : []),
  ])];

  const reals = shuffled(realPool, seed + 1);
  const fakes = shuffled(fakePool, seed + 2);

  // THE WORD RACE IS THE SAME LIST ALL WEEK, and deliberately so. The six
  // word-reading words change daily because reading those five times over
  // measures memory; the race is the opposite task. A child races the same
  // twenty-four words on Monday and on Friday and the two counts can be put
  // next to each other, which is the only way the number means anything.
  // Drawn from this lesson's own words, so it is this skill being raced.
  const race = shuffled(realPool, seed + 3).slice(0, RACE_WORDS);
  if (race.length < RACE_WORDS) short.push(`${lesson.key}: ${race.length} race words`);

  const allWords = text.paras.join(" ").split(/\s+/);
  const sents = mazeable(sentences(text.paras.join(" ")));
  if (reals.length < WRF_PER_DAY * DAYS || fakes.length < NWF_PER_DAY * DAYS) {
    short.push(`${lesson.key}: ${reals.length} real, ${fakes.length} made-up`);
  }

  /**
   * Take a day's words, wrapping round if the pool is short.
   *
   * Four lessons have fewer words than five days of fresh ones need, and
   * slicing past the end of the list gave those lessons an empty Thursday and
   * Friday. A repeated word on day five is a worse sheet than a fresh one; no
   * sheet at all is not a sheet.
   */
  const take = (pool, d, n) =>
    pool.length === 0
      ? []
      : Array.from({ length: n }, (_, i) => pool[(d * n + i) % pool.length]);

  const words = text.paras.join(" ").split(/\s+/).filter(Boolean).length;

  const days = [];
  for (let d = 0; d < DAYS; d++) {
    // Three sentences, walking through the passage across the week, so each
    // day asks about a different part of the text the child has just read.
    // A passage with six usable sentences comes round twice; that is the
    // design -- the same passage all week is the whole point, and a second
    // pass gets a different blank because the seed has moved.
    const maze = [];
    for (let i = 0; sents.length && maze.length < MAZE_SENTENCES && i < sents.length; i++) {
      const n = d * MAZE_SENTENCES + i;
      const sentence = sents[n % sents.length];
      if (maze.some((x) => x.s === sentence)) continue;
      const item = oneBlank(sentence, seed + 200 + n, allWords, Math.floor(n / sents.length));
      if (item) maze.push(item);
    }
    if (maze.length < MAZE_SENTENCES) noMaze.push(`${lesson.key} day ${d + 1}: ${maze.length}`);

    days.push({
      day: d + 1,
      wrf: take(reals, d, WRF_PER_DAY),
      nwf: take(fakes, d, NWF_PER_DAY),
      maze,
    });
  }

  out.push({
    key: lesson.key,
    name: lesson.name,
    level,
    passage: { title: text.title, paras: text.paras, words },
    race,
    days,
  });
}

writeFileSync(
  "scripts/reading-daily-practice.json",
  JSON.stringify(
    {
      _note:
        "Five days of daily practice for each lesson in the reading sequence, across the five mClass measures. Each day is a page: the lesson's own decodable passage (the same one all week, because repeated reading is what moves fluency and accuracy), six real words and four made-up ones that change daily, a three-sentence maze over a different part of that passage, and a twenty-four word race that stays the same all week so Monday and Friday can be compared. Generated by scripts/build-daily-practice.mjs; do not hand-edit.",
      perDay: { wrf: WRF_PER_DAY, nwf: NWF_PER_DAY, maze: MAZE_SENTENCES },
      raceWords: RACE_WORDS,
      lessons: out,
    },
    null,
    1,
  ) + "\n",
);

console.log(`${out.length} lessons × ${DAYS} days`);
console.log(`  ${out.length * DAYS} practice days, ${out.length * DAYS * (WRF_PER_DAY + NWF_PER_DAY)} word slots`);
if (noMaze.length) {
  console.log(`\n⚠ ${noMaze.length} days could not fill ${MAZE_SENTENCES} maze sentences:`);
  for (const s of noMaze.slice(0, 8)) console.log(`   – ${s}`);
}
if (short.length) {
  console.log(`\n⚠ ${short.length} lessons have fewer words than five full days need:`);
  for (const s of short.slice(0, 8)) console.log(`   – ${s}`);
}
