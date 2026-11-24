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
 *   maze              generated from the passage, a different spacing each day
 *
 *   bun run scripts/build-daily-practice.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { CONCEPTS } from "./lib/continuum-pools.mjs";
import { LEVEL_SKILLS, EXTRA_CLOSED } from "./lib/nwf-pools.mjs";

const SEQ = JSON.parse(readFileSync("scripts/reading-sequence.json", "utf8")).sequence;
const PASS = JSON.parse(readFileSync("scripts/reading-passages.json", "utf8")).passages;
const MULTI = JSON.parse(readFileSync("scripts/reading-multisyllabic.json", "utf8")).words;
const HEART = JSON.parse(readFileSync("scripts/reading-heart-words.json", "utf8")).words;

const DAYS = 5;
const WRF_PER_DAY = 6;
const NWF_PER_DAY = 4;

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

const out = [];
const short = [];

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
    days.push({
      day: d + 1,
      wrf: take(reals, d, WRF_PER_DAY),
      nwf: take(fakes, d, NWF_PER_DAY),
      // The maze blanks move each day over the same text: a wider spacing on
      // Monday, tighter by Friday.
      every: 10 - d,
      seed: seed + 100 + d,
    });
  }

  out.push({
    key: lesson.key,
    name: lesson.name,
    level,
    passage: { title: text.title, paras: text.paras, words },
    days,
  });
}

writeFileSync(
  "scripts/reading-daily-practice.json",
  JSON.stringify(
    {
      _note:
        "Five days of daily practice for each lesson in the reading sequence, across the five mClass measures: oral reading fluency and accuracy from the lesson's own decodable passage (the same passage all week, because repeated reading is what moves those two), word reading and letter sounds from different words each day, and a maze whose blanks shift daily over the same text. Generated by scripts/build-daily-practice.mjs; do not hand-edit.",
      perDay: { wrf: WRF_PER_DAY, nwf: NWF_PER_DAY },
      lessons: out,
    },
    null,
    1,
  ) + "\n",
);

console.log(`${out.length} lessons × ${DAYS} days`);
console.log(`  ${out.length * DAYS} practice days, ${out.length * DAYS * (WRF_PER_DAY + NWF_PER_DAY)} word slots`);
if (short.length) {
  console.log(`\n⚠ ${short.length} lessons have fewer words than five full days need:`);
  for (const s of short.slice(0, 8)) console.log(`   – ${s}`);
}
