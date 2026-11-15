/**
 * Where the lesson lives inside the word.
 *
 * Kept in its own file so the checker can use it without importing the
 * builder. It used to come from build-spelling.mjs, which meant importing
 * it rebuilt the data -- so the check ran against output it had just
 * generated and could never fail on a stale file, which is the one thing
 * a check like this exists to catch.
 *
 * The bank keys spell their pattern three ways, and all three have to be
 * read to find it in a word:
 *
 *   un-        a hyphen marks an affix, and WHERE it is: a leading hyphen
 *              is a suffix and must sit at the end of the word, a
 *              trailing one is a prefix and must sit at the start. The
 *              word itself has no hyphen in it.
 *   mit/miss   a slash offers alternates; either one may be the form used
 *   a_e        an underscore is the consonant slot in a split vowel
 *
 * Returns [start, end) into the word, or null.
 */
export function spanOf(word, raw) {
  const w = word.toLowerCase();
  for (const alt of raw.toLowerCase().split("/")) {
    const bare = alt.replace(/-/g, "");
    if (!bare) continue;
    /*
     * An affix has a place, and taking the first match ignored it. The
     * -ing suffix was marked on the FIRST ing in "singing", which is the
     * stem, and -ar was marked on the "ar" in "particular" -- in both
     * cases the heart sat on letters the child already knew and the
     * suffix being taught went unmarked.
     */
    if (alt.startsWith("-")) {
      if (w.endsWith(bare)) return [w.length - bare.length, w.length];
      continue;
    }
    if (alt.endsWith("-")) {
      if (w.startsWith(bare)) return [0, bare.length];
      continue;
    }
    if (bare.includes("_")) {
      const m = new RegExp(bare.replace(/_/g, ".")).exec(w);
      if (m) return [m.index, m.index + m[0].length];
    } else {
      const i = w.indexOf(bare);
      if (i !== -1) return [i, i + bare.length];
    }
  }
  return null;
}

/**
 * Did the child write the letters this lesson teaches?
 *
 * The whole judgement the dictation tool makes, and deliberately the
 * simplest question that answers it. The first version compared the
 * stretch of the word the attempt disagreed with against the stretch the
 * lesson occupies, and it was wrong at the edges: a letter inserted
 * exactly at the boundary of the lesson counted as inside it, so
 * "submitt" for "submit" came back as a child who does not know the root
 * mit -- when they had written mit perfectly and doubled a final
 * consonant, which is a different lesson entirely.
 *
 * Asking whether the pattern is present in what they wrote has no
 * boundary to get wrong, and it is the claim actually made on screen:
 * the ai is there, or it is not.
 *
 * Lives here, beside spanOf, so the page and the check that guards it
 * cannot drift apart.
 */
export function wrotePattern(typed, part) {
  const w = String(typed).toLowerCase().trim();
  for (const alt of part.toLowerCase().split("/")) {
    const bare = alt.replace(/-/g, "");
    if (!bare) continue;
    /*
     * An affix counts only where it belongs. A child who writes "desk"
     * for "desks" has not written the -s suffix, and asking whether the
     * letter appears anywhere said they had -- because desk ends in k
     * and holds an s. Same for "sing" against singing, and "particul"
     * against particular. Each of those was told the pattern was right
     * and the mistake was somewhere else, when the mistake was the
     * pattern and nothing else.
     */
    if (alt.startsWith("-")) {
      if (w.endsWith(bare)) return true;
      continue;
    }
    if (alt.endsWith("-")) {
      if (w.startsWith(bare)) return true;
      continue;
    }
    if (bare.includes("_")) {
      if (new RegExp(bare.replace(/_/g, ".")).test(w)) return true;
    } else if (w.includes(bare)) {
      return true;
    }
  }
  return false;
}

/** What the child is told: right, the lesson, or somewhere else. */
export function judgeSpelling(word, part, typed) {
  if (word.toLowerCase() === String(typed).toLowerCase().trim()) return "right";
  return wrotePattern(typed, part) ? "elsewhere" : "lesson";
}
