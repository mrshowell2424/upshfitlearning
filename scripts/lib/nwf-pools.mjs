/**
 * The made-up words for the timed probe. Chosen, not generated.
 *
 * WHY NOT GENERATED. There was a generator and it was abandoned after four
 * audits, each finding a class the one before had missed:
 *
 *   1. filtered against the reading bank -> sup, wilt, ted, sez. All real.
 *   2. plus the Unix web2 dictionary -> stat, chem, gov, feb, med, def, rem.
 *      web2 is the 1934 list: no abbreviations, nothing modern.
 *   3. plus a respelling list -> kup, blak, kut, stek, wuz, frend. Not real
 *      words, but a child who decodes them correctly says cup, black, cut,
 *      steak, was and friend, and the probe cannot tell a correct read from a
 *      substitution. That is the one thing it exists to measure.
 *   4. narrowing the letters to stop respellings at the source still left yup,
 *      lib, neg, rez, mol, yod, glob, guck, boff -- real words web2 has never
 *      heard of -- and fock, which nobody hands a child.
 *
 * No dictionary available here is dense enough for three-letter strings, and a
 * blocklist only ever catches what somebody has already read and noticed. A
 * hand-written list fared no better on its own: the checker found 30 problems
 * in the first one written for this file.
 *
 * SO THE SAFETY IS STRUCTURAL, and only then checked.
 *
 *   - The onset is v, z, y or j. Those four almost never begin an English
 *     word, so a string built on one is almost never a real word by accident.
 *   - No word ends in a lone f, l, s, z, k or v. That is where respellings
 *     come from: bul is bull, buf is buff, fiz is fizz, hil is hill.
 *   - No ck ending at all. It respells k, and several of its survivors read
 *     as profanity-adjacent.
 *
 * Every word below then passed web2, the clipped-and-respelling list, the
 * unsafe-string list and a read-through.
 */

/** Closed-syllable made-up words for the early levels. */
export const EXTRA_CLOSED = [
  "vab", "vad", "vaff", "vass", "vazz", "veb", "vem", "vep", "veff", "vess",
  "vezz", "viff", "viss", "vizz", "vob", "vop", "vot", "voll", "voff", "voss",
  "vozz", "vub", "vud", "vun", "vup", "vut", "vull", "vuff", "vuss", "vuzz",
  "zab", "zall", "zaff", "zass", "zazz", "zeg", "zem", "zell", "zeff", "zess",
  "zezz", "zib", "zid", "zill", "ziff", "ziss", "zob", "zog", "zom", "zop",
  "zot", "zoff", "zoss", "zozz", "zud", "zug", "zum", "zun", "zup", "zut",
  "zull", "zuff", "zuss", "zuzz",
  "yag", "yass", "yazz", "yeb", "yeg", "yem", "yeff", "yezz", "yib", "yig",
  "yim", "yiff", "yiss", "yizz", "yop", "yoll", "yoff", "yoss", "yozz", "yub",
  "yud", "yug", "yut", "yull", "yuff", "yuss", "yuzz",
  "jall", "jaff", "jeb", "jeg", "jep", "jezz", "jiss", "jom", "jop", "joff",
  "jozz", "jub", "jup", "jull", "juff", "juss", "juzz",
];

/**
 * Which continuum skills feed which level.
 *
 * The 210 made-up words in the continuum pools are already signed off by
 * scripts/check-continuum-review.mjs, so the later levels reuse them rather
 * than inventing a second set that would have to be audited all over again.
 * The levels follow the reading sequence: closed syllables first, then
 * blends and digraphs, then teams and vowel-r.
 */
export const LEVEL_SKILLS = {
  1: ["P2"],
  2: ["P2", "P4"],
  3: ["P3", "P4"],
  4: ["P5", "P6"],
  5: ["P7", "P8", "P9"],
};

/** How many closed-syllable words each level takes from EXTRA_CLOSED. */
export const LEVEL_EXTRAS = { 1: 45, 2: 30, 3: 12, 4: 0, 5: 0 };
