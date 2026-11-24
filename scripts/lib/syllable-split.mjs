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
  "ch", "sh", "th", "wh", "ck", "ph", "gh", "ng", "qu",
];

/**
 * The silent-letter pairs, which are only one sound in one position.
 *
 * kn, wr, mb and gn each hide a letter, but only where the letter is actually
 * silent. Treating them as units everywhere was wrong in thirteen common
 * words: number divided as numb/er, jumbo as jumb/o, member as memb/er,
 * magnet as magn/et and signal as sign/al. The b in number and the g in
 * magnet are both pronounced, and the division falls between the two letters.
 *
 * So each pair names where it is silent. This is the same position test
 * R_CONTROLLED already makes for "arid", which is a-rid rather than ar-id
 * because a vowel follows the r.
 */
/**
 * Endings where a silent e sits behind a two-letter consonant sound.
 *
 * The silent-e scan below allows exactly ONE consonant between the vowel and
 * the e, because allowing two would swallow the consonant-le ending and turn
 * ta-ble into one syllable. That left -nge with no handling at all: change
 * and fringe came out as two syllables, cha-nge and fring-e, when both are
 * one, and the e was counted as a vowel of its own.
 *
 * Word-final only. In "danger" the same three letters are not an ending --
 * d-a-n-g-er -- and gluing them there would lose the second syllable.
 */
const FINAL_VCE_UNITS = ["nge"];

const SILENT_PAIRS = [
  // The k and the w are silent at the start of a word: knob, knee, wrist.
  ["kn", "initial"],
  ["wr", "initial"],
  // The g is silent at either end: gnat, sign, align.
  ["gn", "both"],
  // The b is silent only at the end: lamb, climb, thumb, comb -- never in
  // the middle, where it is heard: num-ber, jum-bo, am-ber.
  ["mb", "final"],
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
      // A following y counts as a vowel here. VOWELS holds only a, e, i, o, u,
      // so "windy" glued its "ind" the way "find" does and divided as wind/y,
      // leaving a lone y as a syllable. It is win/dy, the same shape as
      // can/dy. "find" and "kind/ly" still glue, because nothing or an l
      // follows them rather than a vowel.
      const vowelNext = after !== "" && (VOWELS.includes(after[0]) || after[0] === "y");
      if (after === "" || !vowelNext || nk) {
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

    // A two-letter consonant sound with a silent e behind it, at the end.
    // Checked BEFORE the consonant units, because "ng" is one of those and
    // would otherwise take the n and the g and leave the e to be counted as a
    // syllable of its own: change came out cha-nge.
    const fv = FINAL_VCE_UNITS.find((u) => rest === u);
    if (fv) {
      out.push({ t: "c", s: fv, vce: true });
      i += fv.length;
      continue;
    }

    const cu = CONSONANT_UNITS.find((c) => rest.startsWith(c));
    if (cu) {
      out.push({ t: "c", s: cu });
      i += cu.length;
      continue;
    }

    // A silent-letter pair, but only where its letter is silent.
    const sp = SILENT_PAIRS.find(([p]) => rest.startsWith(p));
    if (sp) {
      const [pair, where] = sp;
      const atStart = i === 0;
      const atEnd = rest.length === pair.length;
      const silent =
        where === "initial" ? atStart : where === "final" ? atEnd : atStart || atEnd;
      if (silent) {
        out.push({ t: "c", s: pair, silent: true });
        i += pair.length;
        continue;
      }
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
  // Silent e, read off the unit scan rather than the spelling.
  //
  // This used to require two vowel units, and a silent-e syllable has one:
  // units() carries the final e along with the consonant in front of it as a
  // single consonant unit flagged vce, precisely so it does not invent a
  // syllable. So the test counted one vowel, fell through, and called shine,
  // cake and tile closed -- naming the wrong syllable type for the very
  // pattern P5 and P11 exist to teach. The flag is the honest signal.
  if (last && last.t === "c" && last.vce) return "silent e";
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
 * Words that end in -er over a stem that is a word by accident.
 *
 * A corner is not one who corns and a mother is not one who moths, so these
 * divide by their pattern rather than at a morpheme that is not there. Every
 * one was read off the bank's own list of two-syllable -er words whose stem it
 * also holds; the rest of that list -- teacher, farmer, painter, cleaner, and
 * the comparatives like colder and taller -- really are derivations.
 */
const NOT_A_SUFFIX = new Set([
  "brother", "career", "corner", "counter", "drawer", "former", "hunger",
  "mother", "offer", "outer", "porter", "quarter", "solder", "whisker",
  "lesser", "musher",
]);

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
/**
 * Divide a word into syllables.
 *
 * @param word the word
 * @param isWord tells whether a string is a real word, for compounds and stems
 * @param firstVowelLength returns "open", "closed" or null for a word -- the
 *   only thing that can settle a VCV division, which the spelling cannot
 * @param splitsNg whether this word's letters "ng" spell two sounds -- /ŋ/+/g/
 *   as in finger, or /n/+/dʒ/ as in danger -- rather than the single /ŋ/ of
 *   singer. Also invisible in the spelling.
 */
export function splitWord(
  word,
  isWord = () => false,
  firstVowelLength = () => null,
  splitsNg = () => false,
  depth = 0,
) {
  const w = String(word).toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return null;
  let us = units(w);
  // "ng" is one sound in singer and two in finger and danger, and only the
  // pronunciation knows which. Where it is two, the unit is broken apart so
  // the division can fall between them: fin-ger, dan-ger, gin-ger, fun-gus.
  // Carried into the pieces as well as applied here.
  //
  // A piece is re-divided by calling this again on its letters, and the
  // dictionary has no entry for a piece: "senger" is not a word. So
  // splitsNg("senger") is false and the ng glues back together, which is how
  // passenger came out pas-seng-er even though passenger itself is flagged.
  // Within one word the pronunciation does not change, so the flag travels
  // with its parts.
  const ngHere = splitsNg(w);
  const ngDown = (x) => ngHere || splitsNg(x);
  if (ngHere) {
    us = us.flatMap((u) =>
      u.t === "c" && u.s === "ng" ? [{ t: "c", s: "n" }, { t: "c", s: "g" }] : [u],
    );
  }
  const vowelCount = us.filter((u) => u.t === "v").length;
  if (vowelCount < 2) return null;

  const finish = (parts, rule) => {
    if (parts.some((p) => !p)) return null;
    if (parts.join("") !== w) return null;
    // Every piece needs a vowel to be a syllable at all.
    if (parts.some((p) => !units(p).some((u) => u.t === "v"))) return null;
    // A part may still hold more than one syllable -- banana divides first
    // into ba + nana, and the nana has to divide again or the answer key
    // shows a two-syllable chunk as one syllable. Bounded, so a rule that
    // keeps handing back the same word cannot loop.
    const deep =
      depth >= 4
        ? parts
        : parts.flatMap((p) => {
            if (units(p).filter((u) => u.t === "v").length < 2) return [p];
            const inner = splitWord(p, isWord, firstVowelLength, ngDown, depth + 1);
            return inner && inner.parts.length > 1 ? inner.parts : [p];
          });
    return { parts: deep, rule, types: deep.map(syllableType), certain: true };
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
    const inner = splitWord(stem, isWord, firstVowelLength, ngDown, depth + 1);
    const tail = inner ? inner.parts : [stem];
    const got = finish([p, ...tail], "prefix");
    if (got) return got;
  }
  for (const s of SUFFIXES) {
    if (!w.endsWith(s)) continue;
    const stem = w.slice(0, -s.length);
    if (units(stem).filter((u) => u.t === "v").length < 1) continue;
    if (!isWord(stem) && stem.length < 3) continue;
    const inner = splitWord(stem, isWord, firstVowelLength, ngDown, depth + 1);
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
    const inner = splitWord(stem, isWord, firstVowelLength, ngDown, depth + 1);
    const head = inner ? inner.parts : [stem];
    // -er, -ed and -ing come off a two-syllable word too, when the stem is a
    // word -- but only a word the READING BANK knows.
    //
    // This was tried once against a dictionary and was worse: web2 counts pap,
    // sup, tig, numb, sist and wint as words, so paper became pap/er, super
    // sup/er and tiger tig/er. The bank is curated and holds none of those,
    // while it does hold teach, farm, paint and clean -- so teacher divides at
    // its morpheme, which is how the continuum itself files it, and paper does
    // not.
    //
    // NOT_A_SUFFIX is the rest of the gap. A dozen words in the bank end in
    // -er over a stem that is a word by accident rather than by derivation: a
    // corner is not one who corns, a mother is not one who moths. Those keep
    // their pattern division.
    const morpheme = ["er", "ed", "ing"].includes(s) && !NOT_A_SUFFIX.has(w);
    if (!morpheme && head.length + 1 < 3) continue;
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

  // VCCV -- between the two middle consonants, unless the two make a blend
  // the second syllable needs whole.
  //
  // be/tween and pro/gram both have two consonants in the middle and neither
  // divides between them: "tw" and "gr" are single onsets, and splitting them
  // gave bet/ween and prog/ram. So when the pair is a legal way to start a
  // syllable AND the pronunciation says the first syllable is open, the pair
  // travels together. Without the open test this would also break num/ber and
  // mag/net, whose first syllables are closed and which do divide in the
  // middle even though "br" and "gn" could start a syllable.
  if (between === 2) {
    const pair = us.slice(firstV + 1, firstV + 3).map((u) => u.s).join("");
    if (firstVowelLength(w) === "open" && legalOnset(pair + "a")) {
      const got = finish([upto(firstV + 1), from(firstV + 1)], "V/CCV");
      if (got) return got;
    }
    const got = finish([upto(firstV + 2), from(firstV + 2)], "VC/CV");
    if (got) return got;
  }

  // VCV -- before the consonant if the first vowel is long, after it if short.
  if (between === 1) {
    const open = finish([upto(firstV + 1), from(firstV + 1)], "V/CV");
    const closed = finish([upto(firstV + 2), from(firstV + 2)], "VC/V");
    // NOTHING IN THE SPELLING SETTLES THIS. ti/ger and rob/in are both a
    // single vowel, a single consonant and a single vowel; the difference is
    // the sound of the first vowel. So ask the pronunciation first.
    //
    // This used to guess from the spelling alone -- a lone vowel letter was
    // read as short -- and the guess sent every such word the same way:
    // tiger became tig/er, robot rob/ot, music mus/ic, paper pap/er. The
    // guess remains, for a word the dictionary does not have, but it is now
    // the fallback rather than the answer, and `certain` says which it was.
    // An r-controlled first vowel is already closed by its own r, so the
    // consonant after it starts the next syllable: far/mer, cor/ner, bar/ber.
    // The pronunciation lookup cannot see this -- it reports "closed" for
    // farmer, which is true of the syllable and wrong about where to divide
    // -- so the r is checked before the dictionary is asked.
    if (us[firstV].r) return { ...open, certain: true };

    const sound = firstVowelLength(w);
    if (sound === "open") return { ...open, certain: true };
    if (sound === "closed") return { ...closed, certain: true };
    const v = us[firstV];
    const longish = v.team || v.r || v.glued || v.s === "y";
    return { ...(longish ? open : closed), certain: false };
  }

  // VCCCV and VCCCCV -- usually after the first consonant, keeping digraphs
  // and blends together, which the unit scan already does.
  if (between >= 3) {
    const got = finish([upto(firstV + 2), from(firstV + 2)], between === 3 ? "VC/CCV" : "VC/CCCV");
    if (got) return got;
  }

  return null;
}
