/**
 * Where a lesson lives inside a word, for the lessons whose pattern is a
 * letter string but whose word banks never recorded one.
 *
 * reading-skill-splits.json records, per lesson, the spellings that lesson
 * teaches -- ai and ay for the ai-ay lesson. Forty-one lessons had them.
 * Twenty-one did not, and those twenty-one were exactly the lessons with
 * no dictation bank and, less obviously, the only lessons whose review
 * word lists nothing checked. Short a (CVC) was listing pig, hen, mop and
 * bug.
 *
 * The missing piece was never the words. It was the span: which letters in
 * "badge" are the lesson. Without it a spelling tool cannot tell a pattern
 * error from a slip, and a review list cannot be held to its own pattern.
 *
 * WHY THIS IS NOT indexOf. The builder's own spanOf() takes the first
 * occurrence of the substring, which is right for a digraph and wrong for
 * most of what is here:
 *
 *   desks   the -s suffix is the LAST s, not the one in desk
 *   magic   the soft letter is the g, not the c, which says /k/
 *   panda   the schwa is the second a (which is why schwa a is not here)
 *   mystery the Greek y is the first, the second is the final-y lesson
 *
 * So each lesson carries its own rule, and a word the rule cannot place is
 * dropped rather than guessed at. A span in the wrong place is worse than
 * no span: it teaches the wrong letters.
 *
 * WHAT IS DELIBERATELY ABSENT. Eight of the twenty-one get no split,
 * because no substring is the lesson:
 *
 *   og2-10, og3-03, og3-07, og4-05   syllable division. The lesson is a
 *                                    boundary between letters, not letters.
 *   og3-05   the silent e rule is about a letter that is NOT there.
 *   og3-09   schwa a. Which a is schwa cannot be read off the spelling:
 *            panda and banana disagree, and both are in the bank.
 *   og4-09   advanced doubling. Half its words -- visiting, opened,
 *            happened -- teach the rule by NOT doubling, and a span
 *            cannot mark a letter that was not written.
 *   og1-03   consonants, as a lesson, is every consonant.
 *
 * Those eight keep no split and are checked only for having words at all,
 * which is what the splits file already meant by an absent entry.
 */

const V = "aeiou";
const isV = (c) => V.includes(c);
const vowels = (w) => [...w].filter(isV).length;
const count = (w, c) => w.split(c).length - 1;

/** [start, end) or null. */
const at = (i, n = 1) => (i === -1 ? null : [i, i + n]);

/**
 * Per lesson: the spellings it teaches, and how to find one in a word.
 * find() returns [start, end) or null -- null means this word is not an
 * example of that spelling, and the caller drops it.
 */
export const LESSON_SPANS = {
  // Short a: the a, and only where it is the word's one vowel. A CVC word
  // with a different vowel is not an example of this lesson.
  "cvc-a": { subs: ["a"], find: (w) => (vowels(w) === 1 && w.includes("a") ? at(w.indexOf("a")) : null) },

  // Open syllable, one syllable: the vowel is last and alone -- he, go, hi.
  // A word with a second vowel is a two-syllable word and a later lesson.
  "og1-02": {
    subs: ["e", "o", "i"],
    find: (w, sub) => (vowels(w) === 1 && w.endsWith(sub) ? at(w.length - 1) : null),
  },

  // The -s suffix is the final s. desks ends in one and contains another.
  "og1-10": {
    subs: ["-s"],
    find: (w) => (w.endsWith("s") && w.length > 2 ? at(w.length - 1) : null),
  },

  // Possessive 's, at the end. Sam's.
  "og1-11": { subs: ["'s"], find: (w) => (w.endsWith("'s") ? at(w.length - 2, 2) : null) },

  // Y as a vowel: the final y. fly, candy.
  y: { subs: ["y"], find: (w) => (w.endsWith("y") ? at(w.length - 1) : null) },

  // VrrV and Vre: a doubled r anywhere, or a final re after a vowel +
  // single r -- care, here, store. Not "re" anywhere: ready is not this.
  "og2-09": {
    subs: ["rr", "re"],
    find: (w, sub) =>
      sub === "rr"
        ? at(w.indexOf("rr"), 2)
        : w.endsWith("re") && w.length > 3 && isV(w[w.length - 3])
          ? at(w.length - 2, 2)
          : null,
  },

  // The doubling rule: the doubled consonant before the suffix.
  //
  // One sub-pattern with twelve alternates, not twelve sub-patterns. The
  // splits file is a checklist -- the ai-ay lesson must show both ai and
  // ay -- and this lesson is not a checklist: no teacher owes a child a
  // zz example. What it teaches is that the consonant doubles, and any
  // doubling is an instance of it.
  "og2-14": {
    subs: ["pp/tt/nn/gg/mm/bb/dd/ll/rr/ss/ff/zz"],
    find: (w, sub) => {
      for (const alt of sub.split("/")) if (w.includes(alt)) return at(w.indexOf(alt), 2);
      return null;
    },
  },

  // Soft c and soft g: a c or g followed by e, i or y. In magic the c is
  // hard and the g is the lesson, so each letter is tested, not located.
  "og3-01": {
    subs: ["c", "g"],
    find: (w, sub) => {
      for (let i = w.indexOf(sub); i !== -1; i = w.indexOf(sub, i + 1))
        if ("eiy".includes(w[i + 1] || "\u0000")) return at(i);
      return null;
    },
  },

  // -dge and its soft-g cousin. Longest first, so badge is dge and not ge.
  "og3-02": { subs: ["dge", "ge"], find: (w, sub) => at(w.indexOf(sub), sub.length) },

  // The final y rule: y became i before the suffix -- cried, babies. The i
  // has to be the one the suffix follows, so it is found as "ie" at the
  // end or before a suffix letter. crying keeps its y, which is the
  // exception the lesson is for, and is marked on the y.
  "og3-06": {
    subs: ["i", "y"],
    find: (w, sub) => {
      if (sub === "y") return w.endsWith("ying") ? at(w.length - 4) : null;
      const m = /ie(d|s|r|st)?$/.exec(w);
      return m ? at(m.index) : null;
    },
  },

  // Greek y: the y that is not the word's ending. mystery has both -- the
  // first is Greek, the last is the final-y lesson.
  "og5-02": {
    subs: ["y"],
    find: (w) => {
      const i = w.indexOf("y");
      return i !== -1 && i !== w.length - 1 ? at(i) : null;
    },
  },

  // Scribal o: the o saying /u/. Only marked where the word holds one o,
  // which every word in this bank does; a second o would need an ear.
  "og5-06": { subs: ["o"], find: (w) => (count(w, "o") === 1 ? at(w.indexOf("o")) : null) },

  // R-controlled wor: homework and password carry it too.
  "og5-07": { subs: ["wor"], find: (w) => at(w.indexOf("wor"), 3) },
};

/**
 * The lesson's span in one word: the first of its spellings that the word
 * is an example of, longest spelling first so dge beats ge.
 * Returns { sub, span } or null.
 */
export function lessonSpan(key, word) {
  const rule = LESSON_SPANS[key];
  if (!rule) return null;
  const w = String(word).toLowerCase();
  for (const sub of [...rule.subs].sort((a, b) => b.length - a.length)) {
    const span = rule.find(w, sub);
    if (span) return { sub, span };
  }
  return null;
}
