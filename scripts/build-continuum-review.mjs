/**
 * Five review days for each of the fifteen continuum skills.
 *
 * THE SHAPE OF A DAY. The rule for the skill, in the words a child needs it
 * in, then eight words that carry it -- five real and three made-up -- and
 * four words from skills already taught, mixed in among them rather than
 * listed after. A child who only ever sees the pattern being taught learns to
 * read the sheet rather than the word, which is why the review words are
 * interleaved and why the day does not say which is which.
 *
 * WHY BOTH KINDS. A real word can be recognised rather than decoded, so a
 * list of only real words flatters a child who has memorised them. A made-up
 * word can only be decoded. Neither alone tells a teacher what they need, so
 * every day has both and the key says which were which.
 *
 * NO WORD TWICE IN A SKILL. Across one skill's five days every word differs,
 * target and review alike, so day five is not day one re-read from memory.
 *
 * DETERMINISTIC. The same seed gives the same five days every time, because a
 * teacher who printed Monday's sheet needs Friday's to still be the one the
 * key describes.
 *
 *   bun run scripts/build-continuum-review.mjs
 */
import { writeFileSync } from "node:fs";
import { CONCEPTS } from "./lib/continuum-pools.mjs";

const DAYS = 5;
const REAL_PER_DAY = 5;
const FAKE_PER_DAY = 3;
const REVIEW_PER_DAY = 4;

/** Mulberry32: same seed, same stream, small enough to read. */
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

/**
 * Everything taught before this skill, as review material.
 *
 * Letters stop being review material after the basic band. Mixing a bare "n"
 * into a consonant-le sheet spends one of twelve slots on something the child
 * is years past, so letters are reviewed while letters are still recent --
 * P2 to P4 -- and from the silent-e skill onwards the review is words.
 */
function earlierPool(upto) {
  const pool = [];
  const lettersStillUseful = upto <= 3;
  for (const c of CONCEPTS.slice(0, upto)) {
    if (c.kind === "letters") {
      if (!lettersStillUseful) continue;
      for (const [letter, sound] of c.letters) {
        pool.push({ w: letter, kind: "letter", from: c.id, sound });
      }
      continue;
    }
    for (const w of c.real) pool.push({ w, kind: "real", from: c.id });
    for (const w of c.fake) pool.push({ w, kind: "made-up", from: c.id });
  }
  return pool;
}

const skills = CONCEPTS.map((c, idx) => {
  const seed = 7000 + idx * 97;

  if (c.kind === "letters") {
    // Twenty-six letters over five days: six, five, five, five, five.
    const order = shuffled(c.letters, seed);
    const days = [];
    let at = 0;
    for (let d = 0; d < DAYS; d++) {
      const take = d === 0 ? 6 : 5;
      days.push({
        day: d + 1,
        rule: c.rule,
        items: order.slice(at, at + take).map(([letter, sound]) => ({
          w: letter, kind: "letter", from: c.id, sound,
        })),
      });
      at += take;
    }
    return { id: c.id, band: c.band, name: c.name, rule: c.rule, kind: "letters", days };
  }

  const real = shuffled(c.real, seed + 1);
  const fake = shuffled(c.fake, seed + 2);
  // Review words come from skills already taught, and never repeat inside
  // this skill's week.
  const review = shuffled(earlierPool(idx), seed + 3).slice(0, REVIEW_PER_DAY * DAYS);

  const days = [];
  for (let d = 0; d < DAYS; d++) {
    const target = [
      ...real.slice(d * REAL_PER_DAY, (d + 1) * REAL_PER_DAY)
        .map((w) => ({ w, kind: "real", from: c.id })),
      ...fake.slice(d * FAKE_PER_DAY, (d + 1) * FAKE_PER_DAY)
        .map((w) => ({ w, kind: "made-up", from: c.id })),
    ];
    const mixedIn = review.slice(d * REVIEW_PER_DAY, (d + 1) * REVIEW_PER_DAY);
    // Interleaved, not appended: the review words sit among the new ones so
    // the child cannot tell from position which pattern a word belongs to.
    days.push({
      day: d + 1,
      rule: c.rule,
      items: shuffled([...target, ...mixedIn], seed + 10 + d),
    });
  }
  return { id: c.id, band: c.band, name: c.name, rule: c.rule, kind: "words", days };
});

writeFileSync(
  "scripts/continuum-review.json",
  JSON.stringify(
    {
      _note:
        "Five review days for each of the fifteen 95% Group Phonics Intervention Continuum skills (P1-P15). Each day carries the skill's rule, five real and three made-up words that use it, and four interleaved words from skills already taught. Words are hand-authored in scripts/lib/continuum-pools.mjs and verified by scripts/check-continuum-review.mjs; this file is generated, so do not hand-edit.",
      perDay: { real: REAL_PER_DAY, madeUp: FAKE_PER_DAY, review: REVIEW_PER_DAY },
      skills,
    },
    null,
    1,
  ) + "\n",
);

// What was built, and proof the week never repeats a word.
let repeats = 0;
for (const s of skills) {
  const seen = new Set();
  for (const d of s.days) {
    for (const it of d.items) {
      const k = `${it.from}:${it.w}`;
      if (seen.has(k)) repeats++;
      seen.add(k);
    }
  }
}
const total = skills.reduce((n, s) => n + s.days.reduce((m, d) => m + d.items.length, 0), 0);
console.log(`${skills.length} skills · ${skills.length * DAYS} review days · ${total} word slots`);
console.log(`a word repeating inside a skill's week: ${repeats}`);
for (const s of skills) {
  const counts = s.days.map((d) => d.items.length).join("/");
  console.log(`  ${s.id.padEnd(4)} ${s.name.padEnd(34)} ${counts}`);
}
