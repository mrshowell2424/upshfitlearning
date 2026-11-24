/**
 * The word lists behind the two timed probes.
 *
 * WHY THESE EXIST. The mClass data chat explains six measures, and the Hub
 * only had practice for two of them. The fluency page covers ORF and its
 * accuracy, and the comprehension work sits beside the articles — but there
 * was nothing for WRF, the timed list of real words, and nothing that treats
 * made-up words as a timed probe with the two scores mClass actually gives
 * (sounds correct, and whole words read). This builds the words for both.
 *
 * Both lists are organised by the reading sequence's own levels rather than
 * by grade, because that is how every other word list on the site is
 * organised and inventing a second scheme would guarantee the two drift. The
 * page maps a grade onto a level and says which it is using, so a teacher can
 * see the choice rather than having it made silently.
 *
 *   bun run scripts/build-benchmark.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { looksReal } from "./lib/not-nonsense.mjs";
import { EXTRA_CLOSED, LEVEL_SKILLS, LEVEL_EXTRAS } from "./lib/nwf-pools.mjs";
import { CONCEPTS } from "./lib/continuum-pools.mjs";

const HEART = JSON.parse(readFileSync("scripts/reading-heart-words.json", "utf8")).words;
const SEQ = JSON.parse(readFileSync("scripts/reading-sequence.json", "utf8")).sequence;
const MULTI = JSON.parse(readFileSync("scripts/reading-multisyllabic.json", "utf8")).words;

/** Same seed, same list. A probe that reshuffles is not a probe. */
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

const LEVELS = [1, 2, 3, 4, 5];

/**
 * WORD RACE. Real words, the mix mClass uses.
 *
 * Two kinds go in, because a list of only decodable words overstates a child
 * who has learned the patterns and nothing else, and a list of only irregular
 * words overstates one who has memorised a sight list. So each level gets the
 * heart words taught up to and including it -- the irregular ones a child
 * cannot sound out -- and the decodable target words from that level's
 * lessons, then they are mixed.
 */
const wrf = {};
for (const level of LEVELS) {
  const heart = HEART.filter((w) => w.level <= level).map((w) => w.word);
  const decodable = SEQ.filter((l) => l.level === level).flatMap((l) => l.words ?? []);
  const seen = new Set();
  const pool = [...heart, ...decodable].filter((w) => {
    const k = String(w).toLowerCase();
    if (!/^[a-z']+$/.test(k) || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  wrf[level] = shuffled(pool, 1000 + level).slice(0, 90);
}

/**
 * SILLY WORDS. Made-up words, built rather than borrowed.
 *
 * The multisyllabic bank already holds 880 made-up words, and none of them
 * can be used here: they are multisyllabic by design -- palagraph, sunmarize
 * -- and NWF is a closed-syllable probe. The data chat's own examples are
 * bif, sep, nop, vat. So these are generated from onsets, short vowels and
 * codas, and anything that turns out to be a real word is dropped.
 *
 * THE REAL-WORD FILTER. Filtering against the reading bank alone produced
 * sup, wilt, ted and sez -- all real. Filtering against web2 as well still
 * produced stat, chem, gov, feb, med, def, rem and clos, because web2 is the
 * 1934 word list and has no abbreviations and nothing modern. Scanning the
 * Hub's own reading content was worse in both directions: it missed those and
 * blocked genuine nonsense that appeared in the data as something else.
 *
 * So the filter is three sources, in scripts/lib/not-nonsense.mjs and here:
 * web2, a hand-enumerated list of clipped and modern words, and the reading
 * bank's own real words. The unsafe-string list sits on top of all three,
 * because no dictionary catches a string that is offensive precisely by not
 * being a word. The first run of this produced one.
 */
const REAL = new Set(JSON.parse(readFileSync("scripts/lib/real-short-words.json", "utf8")).words);
for (const list of Object.values(MULTI)) {
  for (const w of list.one ?? []) REAL.add(w.toLowerCase());
  for (const w of list.real ?? []) REAL.add(w.toLowerCase());
}

/**
 * SILLY WORDS now come from a chosen list, not a generator.
 *
 * The generator that used to live here is gone. Four audits of its output each
 * found a class of bad word the filter before it had missed -- real words the
 * reading bank did not know, real words a 1934 dictionary does not contain,
 * respellings that sound exactly like real words, and one string nobody hands
 * a child -- and the fourth audit of a narrowed, heavily filtered generator
 * still turned up yup, lib, neg, rez, mol, yod, glob, guck and fock.
 *
 * The words are in scripts/lib/nwf-pools.mjs, where the reasoning and the
 * structural rules that keep them safe are written down. The later levels
 * reuse the continuum review's own made-up words, which are already signed off
 * by scripts/check-continuum-review.mjs, rather than inventing a second set
 * that would need auditing all over again.
 */
function sillyWords(level, seed) {
  const skills = LEVEL_SKILLS[level] || [];
  const fromSkills = skills.flatMap((id) => {
    const c = CONCEPTS.find((x) => x.id === id);
    return c && c.kind === "words" ? c.fake : [];
  });
  const extras = shuffled(EXTRA_CLOSED, seed + 500).slice(0, LEVEL_EXTRAS[level] || 0);
  const seen = new Set();
  const pool = [...extras, ...fromSkills].filter((w) => {
    const k = String(w).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return shuffled(pool, seed);
}

const nwf = {};
for (const level of LEVELS) nwf[level] = sillyWords(level, 2000 + level);

writeFileSync(
  "scripts/reading-benchmark.json",
  JSON.stringify(
    {
      _note:
        "Word lists for the two timed probes on /benchmark: WORD RACE (WRF) real words, and SILLY WORDS (NWF) made-up closed syllables. Organised by the reading sequence's levels, 1 to 5. Generated by scripts/build-benchmark.mjs; do not hand-edit. scripts/check-benchmark.mjs re-derives them and checks no made-up word is a real one.",
      levels: LEVELS,
      wrf,
      nwf,
    },
    null,
    1,
  ) + "\n",
);

console.log("word race (real words) per level:");
for (const l of LEVELS) console.log(`  L${l}: ${wrf[l].length}  ${wrf[l].slice(0, 8).join(" ")}`);
console.log("silly words (made up) per level:");
for (const l of LEVELS) console.log(`  L${l}: ${nwf[l].length}  ${nwf[l].slice(0, 8).join(" ")}`);
