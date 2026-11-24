/**
 * Five days of continuum practice, thirty words a day, every concept each day.
 *
 * WHY EVERY CONCEPT EVERY DAY. The continuum review already gives one skill a
 * week of its own, which is the right shape for teaching a skill. It is the
 * wrong shape for keeping fifteen of them: a child who learned short vowels in
 * September meets them again only when the sheet comes round. This is the other
 * half -- a daily pass across ALL fifteen, so nothing waits months for its turn.
 *
 * THE THIRTY. Two letters from P1, then one real word and one made-up word from
 * each of P2 to P15: 2 + 14 + 14 = 30. One of each kind per concept is the
 * point, because a real word can be recognised rather than decoded and a
 * made-up word cannot, so a child who is guessing shows it on the second
 * column and not the first.
 *
 * NOTHING REPEATS ACROSS THE WEEK. Each concept gives five different real words
 * and five different made-up ones, so Friday is not Monday read from memory.
 *
 *   bun run scripts/build-continuum-daily.mjs
 */
import { writeFileSync } from "node:fs";
import { CONCEPTS } from "./lib/continuum-pools.mjs";

const DAYS = 5;
const LETTERS_PER_DAY = 2;

/** Same seed, same week: a printed sheet has to match its key on Friday. */
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

const letters = CONCEPTS.find((c) => c.kind === "letters");
const wordConcepts = CONCEPTS.filter((c) => c.kind === "words");

const pools = new Map();
wordConcepts.forEach((c, i) => {
  pools.set(c.id, {
    real: shuffled(c.real, 4100 + i * 13),
    fake: shuffled(c.fake, 4200 + i * 17),
  });
});
const letterPool = shuffled(letters.letters, 4000);

const days = [];
for (let d = 0; d < DAYS; d++) {
  const items = [];

  for (let n = 0; n < LETTERS_PER_DAY; n++) {
    const [letter, sound] = letterPool[(d * LETTERS_PER_DAY + n) % letterPool.length];
    items.push({ w: letter, kind: "letter", from: letters.id, sound });
  }
  for (const c of wordConcepts) {
    const p = pools.get(c.id);
    items.push({ w: p.real[d % p.real.length], kind: "real", from: c.id });
    items.push({ w: p.fake[d % p.fake.length], kind: "made-up", from: c.id });
  }

  // IN TRACKER ORDER, two rows per concept: rows 1-2 are P1, 3-4 are P2, and
  // so on to 29-30 for P15. The tracker has fifteen rows and the grid has
  // thirty, so each tracker row is exactly one pair.
  //
  // The first version shuffled all thirty, on the reasoning that a child who
  // can see the pattern of the page reads the page rather than the word. That
  // was the wrong trade: the student sheet never says which skill a word
  // belongs to, so with the rows shuffled there was no way to fill the tracker
  // in at all. Scoring by skill is the whole point of having a tracker.
  //
  // Real word first, then the made-up one. An earlier version shuffled which
  // came first so a child could not rely on position, and that is the wrong
  // call on a sheet a child reads down a column: a fixed order means they know
  // the second of each pair is the silly word and can expect it, rather than
  // being tripped by it. It also makes the sheet readable at a glance for a
  // teacher scoring the pair.
  const pairs = [];
  pairs.push(items.filter((i) => i.kind === "letter"));
  for (const c of wordConcepts) {
    pairs.push([
      items.find((i) => i.from === c.id && i.kind === "real"),
      items.find((i) => i.from === c.id && i.kind === "made-up"),
    ]);
  }
  days.push({ day: d + 1, items: pairs.flat() });
}

/**
 * Which concept each of the thirty rows belongs to, in order.
 *
 * The same for every day, which is what lets one tracker row cover a pair of
 * grid rows across the whole week.
 */
const rowConcepts = days[0].items.map((i) => i.from);

/**
 * The tracker's rows: every concept, in continuum order, with its rule.
 *
 * The rule travels with the row because the sheet a child checks their score
 * on is the sheet they are looking at when they ask why a word went wrong.
 * Sending them back to the lesson for the rule is how a reminder gets skipped.
 */
const track = CONCEPTS.map((c) => ({ id: c.id, name: c.name, band: c.band, rule: c.rule }));

writeFileSync(
  "scripts/continuum-daily.json",
  JSON.stringify(
    {
      _note:
        "Five days of continuum practice, thirty words a day: two letters from P1 and one real plus one made-up word from each of P2 to P15. Every concept appears every day and nothing repeats across the week. The rows run in tracker order, two per concept, so one tracker row covers one pair: the real word first, then the made-up one. `rowConcepts` names the concept for each of the thirty rows and `track` is the tracker's rows. Generated by scripts/build-continuum-daily.mjs; do not hand-edit.",
      perDay: 2 + wordConcepts.length * 2,
      rowConcepts,
      days,
      track,
    },
    null,
    1,
  ) + "\n",
);

const all = days.flatMap((d) => d.items.map((i) => `${i.from}:${i.w}`));
const dupes = all.length - new Set(all).size;
console.log(`${DAYS} days x ${days[0].items.length} words = ${all.length} slots`);
console.log(`  repeats across the week: ${dupes}`);
for (const d of days) {
  const k = d.items.reduce((m, i) => ((m[i.kind] = (m[i.kind] || 0) + 1), m), {});
  console.log(`  day ${d.day}: ${Object.entries(k).map(([a, b]) => `${b} ${a}`).join(", ")}`);
}
