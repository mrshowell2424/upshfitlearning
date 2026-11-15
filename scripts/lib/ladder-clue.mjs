/**
 * What a word ladder clue means, in one place.
 *
 * A ladder is a sequence of words where each rung differs from the one
 * above it by a single stated change: "Change the e to a.", "Put an i
 * between the a and the d.", "Take off the silent e." The clue is an
 * instruction, not a riddle, and scripts/check-word-ladders.mjs proves
 * two things about every one of them before it ships: that the clue
 * really does turn its rung into the next, and that no other word a
 * child could reach satisfies it.
 *
 * `describes` decides the first of those. It lives here rather than in
 * the checker because the page a child works on needs the same answer,
 * and two copies would drift the first time a clue form was added --
 * silently, with the checker still passing while the page misjudged a
 * child.
 *
 * Plain string work, no dependencies, runs anywhere.
 */

/** Would this clue, read literally, turn `a` into `b`? */
export function describes(a, b, c) {
  const pickIdx = (a, L, q) => {
    const idxs = [...a].map((ch, n) => (ch === L ? n : -1)).filter((n) => n >= 0);
    if (!q || idxs.length <= 1) return idxs;
    return q === "first " ? [idxs[0]] : q === "last " ? [idxs[idxs.length - 1]] : idxs.slice(1, -1);
  };
  let m;
  if ((m = c.match(/^Change the (first |last |middle )?(\w) to (\w)\.$/)))
    return pickIdx(a, m[2], m[1]).some((i) => a.slice(0, i) + m[3] + a.slice(i + 1) === b);
  if (c === "Add a silent e.") return b === a + "e";
  if (c === "Take off the silent e.") return a.endsWith("e") && b === a.slice(0, -1);
  if ((m = c.match(/^Add an? (\w) at the (start|end)\.$/)))
    return b === (m[2] === "start" ? m[1] + a : a + m[1]);
  if ((m = c.match(/^Put an? (\w) between the (\w) and the (\w)\.$/))) {
    for (let i = 1; i < a.length; i++)
      if (a[i - 1] === m[2] && a[i] === m[3] && a.slice(0, i) + m[1] + a.slice(i) === b) return true;
    return false;
  }
  if ((m = c.match(/^Take off the (first |last |middle )?(\w)\.$/)))
    return pickIdx(a, m[2], m[1]).some((i) => a.slice(0, i) + a.slice(i + 1) === b);
  if ((m = c.match(/^Keep .*?\. Change (\S+) to (\S+)\.$/))) return a !== b && b === a.replace(m[1], m[2]);
  if ((m = c.match(/^Change (\S+)- to (\S+)-\.$/))) return a.startsWith(m[1]) && b === m[2] + a.slice(m[1].length);
  if ((m = c.match(/^Change -(\S+) to -(\S+)\.$/))) return a.endsWith(m[1]) && b === a.slice(0, -m[1].length) + m[2];
  if ((m = c.match(/^Add the prefix (\S+)-\.$/))) return b === m[1] + a;
  if ((m = c.match(/^Take off the prefix (\S+)-\.$/))) return a.startsWith(m[1]) && b === a.slice(m[1].length);
  if ((m = c.match(/^Add -(\S+)\.$/))) return b === a + m[1];
  if ((m = c.match(/^Take off -(\S+)\.$/))) return a.endsWith(m[1]) && b === a.slice(0, -m[1].length);
  if ((m = c.match(/^Add (\S+) to the end\.$/))) return b === a + m[1];
  if ((m = c.match(/^Take (\S+) off the end\.$/))) return a.endsWith(m[1]) && b === a.slice(0, -m[1].length);
  if ((m = c.match(/^Put (\S+) in front of (\S+)\.$/))) return b === m[1] + a;
  if ((m = c.match(/^Take (\S+) off the front\.$/))) return a.startsWith(m[1]) && b === a.slice(m[1].length);
  return false;
}

/** Trim, lowercase, and drop anything that is not a letter. */
export function tidy(typed) {
  return String(typed ?? "").toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * Is `b` reachable from `a` by exactly one letter change -- one swapped,
 * one added, or one taken away?
 */
export function oneEditAway(a, b) {
  if (a === b) return false;
  if (a.length === b.length) {
    let diff = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
    return diff === 1;
  }
  const [s, l] = a.length < b.length ? [a, b] : [b, a];
  if (l.length - s.length !== 1) return false;
  let i = 0;
  while (i < s.length && s[i] === l[i]) i++;
  return s.slice(i) === l.slice(i + 1);
}

/**
 * What a child is told about one rung.
 *
 * `prev` is the rung above, `want` the word that belongs on this one,
 * `clue` the instruction between them, `typed` what was written.
 *
 *   "right"  it is the word.
 *   "same"   nothing was changed.
 *   "near"   exactly one letter was changed, added or taken away, but not
 *            the one the clue names.
 *   "far"    more than one change from the rung above.
 *
 * The split that earns its keep is "near" against "far". A ladder is a
 * phoneme-manipulation exercise, and the thing worth knowing is whether
 * the child manipulated at all. "near" is a child who held the word,
 * changed one sound and chose the wrong one -- the method is there and
 * the target is not. "far" is a child who wrote a new word instead of
 * changing this one, which is the method missing.
 *
 * There was a third verdict here, for a child who followed the
 * instruction exactly and produced a non-word. It is gone because it
 * could never happen: every one of the 1,089 clues in the ladders admits
 * exactly one string, not merely one word, so anything satisfying the
 * instruction already is the answer. check-word-ladders.mjs asserts that
 * so the branch cannot creep back in on a wrong assumption.
 */
export function judgeRung(prev, want, clue, typed) {
  const t = tidy(typed);
  const p = tidy(prev);
  if (!t) return "empty";
  if (t === tidy(want)) return "right";
  if (t === p) return "same";
  return oneEditAway(p, t) ? "near" : "far";
}
