/**
 * What to review today.
 *
 * The data for this has been sitting in reading-prerequisites.json with a
 * note describing exactly how it was meant to be used, and nothing read
 * it. The note says:
 *
 *   "The auto review pass fills three slots: the prerequisite named here,
 *    the lesson taught just before, and one from the spiral pool for that
 *    level. A teacher's own picks in the three dropdowns override all of
 *    it."
 *
 * That is what this does. Three slots, because three is what fits in the
 * front of a lesson, and each one answers a different question:
 *
 *   1. What is today built on? If a child cannot do the prerequisite,
 *      today will not land however well it is taught.
 *   2. What was taught last? The newest thing is the most fragile thing,
 *      and one day is exactly when it needs meeting again.
 *   3. What is going cold? Everything else decays quietly, and the spiral
 *      pool is where a level's load-bearing patterns are named.
 *
 * Spaced review is the best-evidenced thing in the whole literature and
 * the thing teachers most reliably skip, because deciding WHAT to review
 * is the work. This decides it. The teacher overrides any slot.
 *
 * The pick is deterministic -- same lesson, same three every time. A
 * review that shuffled would be worse than useless: a teacher who plans
 * Monday on Sunday needs Monday to still say the same thing on Monday.
 */

/**
 * Build the three slots for `key`.
 *
 * `seq` is the ordered sequence ([{key, name, level}]), `prereq` the map,
 * `spiral` the pools by level. `picks` optionally overrides any slot by
 * key; an override that is not a real lesson is ignored rather than
 * trusted.
 *
 * Returns three slots, each { why, key, name, level } with key null when
 * there is genuinely nothing to put there.
 *
 * A level is whatever the subject calls one — a number for reading, a
 * grade name for maths. This only ever uses it to look up a pool, so it
 * is declared as either rather than inferred from whichever subject
 * happened to call it first.
 *
 * @param {string} key
 * @param {{ seq: { key: string, name: string, level: string|number }[],
 *           prereq: Record<string, string>,
 *           spiral: Record<string, string[]> }} data
 * @param {{ s1?: string, s2?: string, s3?: string }} [picks]
 */
export function reviewSlots(key, { seq, prereq, spiral }, picks = {}) {
  const at = seq.findIndex((r) => r.key === key);
  if (at === -1) throw new Error(`not a lesson in the sequence: ${key}`);
  const here = seq[at];
  const byKey = new Map(seq.map((r) => [r.key, r]));

  const taken = new Set([key]);
  const row = (k) => (k && byKey.has(k) ? byKey.get(k) : null);

  const slot = (why, chosen, override) => {
    const pick = row(override) ?? row(chosen);
    if (pick) taken.add(pick.key);
    return pick
      ? { why, key: pick.key, name: pick.name, level: pick.level }
      : { why, key: null, name: null, level: null };
  };

  // 1. What today is built on.
  const one = slot("Today is built on this", prereq[key] ?? null, picks.s1);

  // 2. The lesson taught just before. Skipping anything already taken
  //    keeps a prerequisite that happens to be the previous lesson from
  //    filling two slots with the same thing.
  let before = null;
  for (let i = at - 1; i >= 0; i--) {
    if (!taken.has(seq[i].key)) {
      before = seq[i].key;
      break;
    }
  }
  const two = slot("Taught most recently", before, picks.s2);

  // 3. Going cold. The pool is filtered to what has actually been taught
  //    by now: a level-1 pool names vce, and for the first few lessons of
  //    level 1 that has not happened yet, so "going cold" would be
  //    pointing at something nobody has seen. Then walked from an offset
  //    fixed by this lesson's own position, so consecutive lessons do not
  //    all reach for the same pattern while any given lesson always
  //    reaches for the same one.
  const taughtBy = (k) => {
    const i = seq.findIndex((r) => r.key === k);
    return i !== -1 && i < at;
  };
  const pool = (spiral[String(here.level)] ?? []).filter((k) => !taken.has(k) && taughtBy(k));
  const three = slot("Going cold", pool.length ? pool[at % pool.length] : null, picks.s3);

  return [one, two, three];
}
