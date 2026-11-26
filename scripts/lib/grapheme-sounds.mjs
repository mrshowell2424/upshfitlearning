/**
 * Which sounds a spelling is allowed to make.
 *
 * WHY THIS EXISTS. A sound-spelling mapping row makes two claims, and the
 * builder already proved both: that there are as many boxes as sounds, and
 * that the boxes read across spell the word. Neither says anything about
 * which sound goes with which box, and that is the claim the child actually
 * answers. Two wrongs that cancel pass both tests.
 *
 *   flexed   f l e x e d    F L EH K S T
 *
 * Six boxes, six sounds, and the letters spell the word. It is still wrong:
 * x is one letter saying /k/ and /s/, the e of -ed is silent, and the d says
 * /t/. Everything after the x is paired with the wrong sound. The same fault
 * put square as s|qu|a_e|r, payroll as p|ay|r|oll, and rhythm as r|h|y|th|m,
 * each of them passing a count while teaching a child something untrue.
 *
 * WHAT THIS TABLE IS. For every spelling the sheets use, the sounds English
 * lets it make. A row survives only when each box is a real spelling of the
 * sound standing next to it. The table is deliberately tight: a spelling that
 * makes a sound only in one borrowed word does not belong to a child learning
 * the pattern, and leaving it out costs one row rather than teaching a rule
 * that is not one.
 *
 * WHAT IS IN HERE ON PURPOSE, because it looks wrong and is not:
 *
 *   ar -> ER    solar, collar, similar. The final -ar really is /er/.
 *   or -> ER    author, neighbor, auditor. So is the final -or.
 *   ou -> AH    famous, nervous, jealous. The -ous is /es/.
 *   o_e -> AH   love, come, done. Scribal o, which og5-06 teaches by name.
 *   i_e -> IY   machine, routine. The French i, which og5-05 teaches.
 *   n  -> NG    think, bank. An n before k says /ng/.
 *   c  -> S     city. g -> JH: gem. s -> Z: is.
 *
 * AND WHAT IS LEFT OUT ON PURPOSE:
 *
 *   x, qu       One letter, two sounds. They cannot sit in one box at all,
 *               which is why og1-06 gets no sheet rather than a wrong one.
 *   i_e -> IH   active, native, massive. The -ive ending is not a split
 *               vowel; the e is there because English words do not end in v.
 *               A child told i_e says /i/ has learned a rule that is false.
 */

/** Spelling to the sounds it may make. Vowel-r is folded, as the builder folds it. */
const TABLE = {
  // consonants
  b: "B", bb: "B", c: "K S", cc: "K", ch: "CH K SH", ck: "K",
  d: "D", dd: "D", dge: "JH", f: "F", ff: "F", g: "G JH", gg: "G",
  gh: "F", h: "HH", j: "JH", k: "K", l: "L", ll: "L", m: "M", mb: "M",
  mm: "M", n: "N NG", ng: "NG", nn: "N", p: "P", ph: "F", pp: "P",
  r: "R", rr: "R", s: "S Z SH", sh: "SH", ss: "S", t: "T", tt: "T",
  tch: "CH", th: "TH DH", v: "V", w: "W", wh: "W HH",
  y: "Y AY IY IH", z: "Z", zz: "Z",

  // single vowels
  a: "AE EY AA AO AH", e: "EH IY AH IH", i: "IH AY IY AH",
  o: "AA OW AH AO UW", u: "AH UW UH",

  // vowel teams
  ai: "EY", ay: "EY", au: "AO AA", aw: "AO", ea: "IY EH EY", ee: "IY",
  ei: "IY EY", eigh: "EY", ew: "UW", ey: "EY IY", ie: "AY IY",
  igh: "AY", oa: "OW", oe: "OW", oi: "OY", oo: "UW UH",
  ou: "AW UW AH AO", ough: "AO OW UW AW", augh: "AO", ow: "OW AW",
  oy: "OY", ue: "UW",

  // split spellings
  a_e: "EY", e_e: "IY", i_e: "AY IY", o_e: "OW AH", u_e: "UW",
  ei_e: "IY", au_e: "AO",

  // vowel-r
  ar: "AAR ER", or: "AOR ER", er: "ER", ir: "ER", ur: "ER",
  are: "EHR", ear: "EHR ER IHR", eer: "IHR", ore: "AOR",
};

const SOUNDS_OF = new Map(
  Object.entries(TABLE).map(([g, s]) => [g, new Set(s.split(" "))]),
);

/** Is this spelling allowed to make this sound? */
export function spells(grapheme, sound) {
  const set = SOUNDS_OF.get(grapheme);
  return !!set && set.has(sound);
}

/**
 * Does every box hold a real spelling of the sound beside it?
 *
 * Returns null when it does, or the first pair that fails, so the caller can
 * say which box is wrong rather than only that the row is.
 */
export function badPair(boxes, sounds) {
  if (boxes.length !== sounds.length) return null;
  for (let i = 0; i < boxes.length; i++) {
    if (!spells(boxes[i], sounds[i])) return { box: boxes[i], sound: sounds[i], at: i };
  }
  return null;
}
