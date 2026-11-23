/**
 * Where a word gets chopped, and why.
 *
 * This is the rule set on the classroom chart, written out: VCCV between the
 * two middle consonants, VCV either side of the consonant depending on
 * whether the first vowel is long, consonant-le before the consonant,
 * compounds between the two words, and affixes after a prefix and before a
 * suffix. The point is not only the chop — it is that a child can say which
 * rule did it, and what kind of syllable each piece is.
 *
 * WHAT MUST NOT BE SPLIT. The second chart is the one that makes this hard:
 * digraphs, vowel teams, r-controlled vowels, silent-e, blends at the start
 * of a syllable, and the glued sounds all have to survive the chop. So the
 * word is first read as a string of UNITS rather than letters -- "ar" is one
 * vowel unit, "th" is one consonant unit, "ank" is one glued unit -- and the
 * rules then run over the units. Dividing letters instead of units is what
 * produces fa/rmer and ga/ther.
 *
 * This is deliberately a rule engine and not a dictionary. A dictionary would
 * be right more often and would teach nothing: a child looking at "basket"
 * has to be able to find the chop themselves, and the answer key has to name
 * the rule they should have used. Where the rules give the wrong answer for a
 * real word, that word does not belong in the exercise, and the checker's job
 * is to find those rather than paper over them.
 */

/** Consonant digraphs and trigraphs, longest first so the scan prefers them. */
const CONSONANT_UNITS = [
  "tch", "dge", "igh",
  "ch", "sh", "th", "wh", "ck", "ph", "gh", "ng", "qu", "kn", "wr", "mb", "gn",
];

/** Vowel teams, longest first. */
const VOWEL_TEAMS = [
  "eigh", "augh", "ough",
  "ai", "ay", "ea", "ee", "ei", "ey", "ie", "oa", "oe", "oi", "oo", "ou",
  "ow", "oy", "ue", "ui", "ew", "au", "aw",
];

/** Vowel + r, which says one sound and travels together. */
const R_CONTROLLED = ["ear", "air", "are", "oar", "ore", "ere", "ar", "er", "ir", "or", "ur"];

/**
 * The glued sounds, straight off the chart.
 *
 * These are vowel-plus-consonants that are taught as one chunk, which is why
 * blanket chops after "ank" rather than between the n and the k.
 */
const GLUED = [
  "ang", "ing", "ong", "ung", "ank", "ink", "onk", "unk",
  "old", "olt", "ost", "ind", "ild", "all", "oll", "alk",
];

const VOWELS = "aeiou";

/** Clusters a syllable may legally begin with, plus any single consonant. */
const ONSETS = [
  "spl", "spr", "str", "scr", "shr", "thr", "sch", "squ",
  "bl", "br", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr",
  "sc", "sk", "sl", "sm", "sn", "sp", "st", "sw", "tr", "tw", "dw",
  "ch", "sh", "th", "wh", "ph", "kn", "wr", "gn", "qu",
];
function legalOnset(s) {
  const t = String(s).toLowerCase();
  if (!t) return false;
  if (VOWELS.includes(t[0])) return true;
  if (ONSETS.some((o) => t.startsWith(o))) return true;
  // A lone consonant is always a legal start; two that are not a known
  // cluster are not.
  return !!t[1] && VOWELS.includes(t[1]);
}

/**
 * Read a word as units rather than letters.
 *
 * Each unit is {t: "v"|"c", s: letters}. Longest match wins, and a glued
 * sound counts as a vowel unit with its consonants attached, because that is
 * how it behaves when the word is chopped.
 */
export function units(word) {
  const w = String(word).toLowerCase();
  // A final silent e belongs to the syllable in front of it. Counted as its
  // own vowel unit it invents a syllable and produces re-ptil-e, so it is
  // carried along with the consonant before it instead.
  const silentE = /[aeiou][^aeiou]e$/.test(w) && !/[aeiou]{2}e$/.test(w);
  if (silentE) {
    const head = units(w.slice(0, -2));
    return [...head, { t: "c", s: w.slice(-2), vce: true }];
  }
  const out = [];
  let i = 0;
  while (i < w.length) {
    const rest = w.slice(i);

    // A glued sound only counts where it ends the syllable's sound, which in
    // practice means it is not followed by another vowel: "ing" in "singer"
    // is glued, "ing" in "finger" would be too, but the "ang" in "angle" is
    // not -- the e pulls the l over and leaves an-gle.
    const glue = GLUED.find((g) => rest.startsWith(g));
    if (glue) {
      const after = rest.slice(glue.length);
      const nk = ["ank", "ink", "onk", "unk"].includes(glue);
      if (after === "" || !VOWELS.includes(after[0]) || nk) {
        out.push({ t: "v", s: glue, glued: true });
        i += glue.length;
        continue;
      }
    }

    const rc = R_CONTROLLED.find((r) => rest.startsWith(r));
    if (rc) {
      // "ar" is only r-controlled when the r is not starting the next
      // syllable: "arid" is a-rid, not ar-id, because a vowel follows the r.
      const after = rest.slice(rc.length);
      const simple = rc.length === 2;
      if (!simple || after === "" || !VOWELS.includes(after[0])) {
        out.push({ t: "v", s: rc, r: true });
        i += rc.length;
        continue;
      }
    }

    const vt = VOWEL_TEAMS.find((v) => rest.startsWith(v));
    if (vt) {
      out.push({ t: "v", s: vt, team: true });
      i += vt.length;
      continue;
    }

    const cu = CONSONANT_UNITS.find((c) => rest.startsWith(c));
    if (cu) {
      out.push({ t: "c", s: cu });
      i += cu.length;
      continue;
    }

    const ch = w[i];
    out.push({ t: VOWELS.includes(ch) || ch === "y" ? "v" : "c", s: ch });
    i += 1;
  }
  return out;
}

/** The unit string as V and C, for matching the chart's patterns. */
const shape = (us) => us.map((u) => u.t.toUpperCase()).join("");

/** Join a run of units back into letters. */
const text = (us) => us.map((u) => u.s).join("");

/**
 * What kind of syllable a piece is.
 *
 * Named in the order the chart teaches them, and the first that fits wins:
 * a piece can only be called one thing on an answer key.
 */
export function syllableType(part) {
  const p = String(part).toLowerCase();
  const us = units(p);
  const vs = us.filter((u) => u.t === "v");
  const last = us[us.length - 1];

  if (/[^aeiou]le$/.test(p) && p.length >= 3) return "consonant-le";
  if (vs.some((v) => v.r)) return "r-controlled";
  if (vs.some((v) => v.glued)) return "glued";
  if (vs.some((v) => v.team)) return "vowel team";
  // Silent e: ends in e, the e is not the only vowel, and a consonant sits
  // between it and the vowel before it.
  if (p.endsWith("e") && vs.length >= 2 && /[aeiou][^aeiou]e$/.test(p)) return "silent e";
  if (last && last.t === "v") return "open";
  return "closed";
}

/**
 * Prefixes and suffixes the chart's affix rule applies to.
 *
 * Kept short on purpose. A long list starts finding prefixes inside words
 * that do not have them -- "under" inside "thunder", "in" inside "insect" --
 * and a wrong rule name on an answer key is worse than a plain VCCV chop that
 * lands in the same place anyway.
 */
const PREFIXES = ["un", "re", "dis", "mis", "pre", "non", "over", "under", "sub", "trans", "inter", "super", "fore", "semi", "anti", "mid"];
const SUFFIXES = ["ness", "less", "ment", "able", "ible", "tion", "sion", "ful", "ous", "ive"];

/**
 * The short suffixes, held back.
 *
 * -er, -ed, -ly and -ing are only split off once the pattern rules have had
 * their turn, and only where doing so leaves three syllables or more. The
 * chart is the reason: farmer is far-mer by the V/CV rule and gather is
 * gath-er by VC/V, neither of them an affix split, while unkindly really is
 * un-kind-ly. Splitting every -er first produced beav-er and farm-er.
 */
const SHORT_SUFFIXES = ["ing", "est", "ly", "er", "ed"];

/**
 * Divide a word, and say which rule did it.
 *
 * Returns { parts, rule, types } or null where the rules do not produce a
 * clean division -- a single syllable, or a shape none of the rules cover.
 * Null is a real answer: it means the word should not be in the exercise.
 *
 * @param {string} word
 * @param {(w: string) => boolean} [isWord] knows whether a string is a word
 *   on its own, used only for spotting compounds.
 */
export function splitWord(word, isWord = () => false) {
  const w = String(word).toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return null;
  const us = units(w);
  const vowelCount = us.filter((u) => u.t === "v").length;
  if (vowelCount < 2) return null;

  const finish = (parts, rule) => {
    if (parts.some((p) => !p)) return null;
    if (parts.join("") !== w) return null;
    // Every piece needs a vowel to be a syllable at all.
    if (parts.some((p) => !units(p).some((u) => u.t === "v"))) return null;
    return { parts, rule, types: parts.map(syllableType) };
  };

  // 1. Compound words: divide between the two words.
  for (let i = 2; i <= w.length - 2; i++) {
    const a = w.slice(0, i);
    const b = w.slice(i);
    if (isWord(a) && isWord(b) && a.length >= 3 && b.length >= 3) {
      return finish([a, b], "compound");
    }
  }

  // 2. Affixes: after a prefix, before a suffix.
  for (const p of PREFIXES) {
    if (!w.startsWith(p)) continue;
    const stem = w.slice(p.length);
    if (units(stem).filter((u) => u.t === "v").length < 1) continue;
    // The stem has to be a word, or at least start like one.
    if (!isWord(stem) && !(stem.length >= 5 && legalOnset(stem))) continue;
    const inner = splitWord(stem, isWord);
    const tail = inner ? inner.parts : [stem];
    const got = finish([p, ...tail], "prefix");
    if (got) return got;
  }
  for (const s of SUFFIXES) {
    if (!w.endsWith(s)) continue;
    const stem = w.slice(0, -s.length);
    if (units(stem).filter((u) => u.t === "v").length < 1) continue;
    if (!isWord(stem) && stem.length < 3) continue;
    const inner = splitWord(stem, isWord);
    const head = inner ? inner.parts : [stem];
    const got = finish([...head, s], "suffix");
    if (got) return got;
  }

  // 2b. Short suffixes, but only where the word is long enough that the
  //     affix is doing the work rather than the pattern rules.
  for (const s of SHORT_SUFFIXES) {
    if (!w.endsWith(s)) continue;
    const stem = w.slice(0, -s.length);
    if (!isWord(stem)) continue;
    const inner = splitWord(stem, isWord);
    const head = inner ? inner.parts : [stem];
    if (head.length + 1 < 3) continue;
    const got = finish([...head, s], "suffix");
    if (got) return got;
  }

  // 3. Consonant-le: divide before the consonant.
  if (/[^aeiou]le$/.test(w) && w.length >= 5) {
    const cut = w.length - 3;
    const got = finish([w.slice(0, cut), w.slice(cut)], "consonant-le");
    if (got) return got;
  }

  // 4. The vowel-consonant patterns, read off the units.
  const sh = shape(us);
  const firstV = sh.indexOf("V");
  const nextV = sh.indexOf("V", firstV + 1);
  if (firstV === -1 || nextV === -1) return null;
  const between = nextV - firstV - 1;

  const upto = (n) => text(us.slice(0, n));
  const from = (n) => text(us.slice(n));

  // V/V -- nothing between the two vowel units, so the chop goes between
  // them. This is lion, poem and create, and it is also what a glued sound
  // produces: blank-et, once "ank" is read as one chunk.
  if (between === 0) {
    const got = finish([upto(firstV + 1), from(firstV + 1)], "V/V");
    if (got) return got;
  }

  // VCCV -- between the two middle consonants.
  if (between === 2) {
    const got = finish([upto(firstV + 2), from(firstV + 2)], "VC/CV");
    if (got) return got;
  }

  // VCV -- before the consonant if the first vowel is long, after it if short.
  if (between === 1) {
    const open = finish([upto(firstV + 1), from(firstV + 1)], "V/CV");
    const closed = finish([upto(firstV + 2), from(firstV + 2)], "VC/V");
    // A long first vowel keeps the consonant with the second syllable. The
    // honest signal available here is the vowel unit itself: a team, an
    // r-controlled or a final silent e says long, a lone vowel letter does
    // not, so a lone vowel letter is read as short and takes the consonant.
    const v = us[firstV];
    const longish = v.team || v.r || v.glued || v.s === "y";
    return longish ? open : closed;
  }

  // VCCCV and VCCCCV -- usually after the first consonant, keeping digraphs
  // and blends together, which the unit scan already does.
  if (between >= 3) {
    const got = finish([upto(firstV + 2), from(firstV + 2)], between === 3 ? "VC/CCV" : "VC/CCCV");
    if (got) return got;
  }

  return null;
}
