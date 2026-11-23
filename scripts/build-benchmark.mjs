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
import { unsafeWord, looksReal } from "./lib/not-nonsense.mjs";

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

const ONSETS_SIMPLE = ["b", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "y", "z"];
const ONSETS_BLEND = ["bl", "br", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr", "sl", "sm", "sn", "sp", "st", "sw", "tr", "sh", "ch", "th"];
const VOWELS = ["a", "e", "i", "o", "u"];
const CODAS_SIMPLE = ["b", "d", "f", "g", "k", "l", "m", "n", "p", "s", "t", "v", "z"];
const CODAS_BLEND = ["ck", "ff", "ll", "ss", "mp", "nd", "nt", "st", "sk", "lt", "ng", "sh", "ch", "th"];


function makeNonsense(level, count, seed) {
  // Level 1 and 2 stay CVC with simple letters. From level 3 the onsets and
  // codas may be blends and digraphs, which is the progression the reading
  // sequence itself follows.
  const onsets = level <= 2 ? ONSETS_SIMPLE : [...ONSETS_SIMPLE, ...ONSETS_BLEND];
  const codas = level <= 2 ? CODAS_SIMPLE : [...CODAS_SIMPLE, ...CODAS_BLEND];
  const all = [];
  for (const o of onsets) {
    for (const v of VOWELS) {
      for (const c of codas) {
        const w = o + v + c;
        if (looksReal(w, REAL) || unsafeWord(w)) continue;
        // Two of the same letter either side reads oddly: "ded", "sus".
        if (o === c) continue;
        all.push(w);
      }
    }
  }
  return shuffled(all, seed).slice(0, count);
}

const nwf = {};
for (const level of LEVELS) nwf[level] = makeNonsense(level, 60, 2000 + level);

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
