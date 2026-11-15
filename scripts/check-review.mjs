/**
 * Does the spiral review hold up?
 *
 * The review page hands a teacher three lessons to go over before today's,
 * chosen rather than suggested. That is only worth doing if the choices
 * survive a few things that are easy to get wrong and impossible to see:
 *
 *   1. The committed sequence matches the one derived from the lesson
 *      builder. The order is the whole basis of "taught most recently",
 *      and the file is generated, so it can go stale.
 *   2. Every prerequisite is a real lesson, and comes BEFORE the lesson
 *      it is a prerequisite for. A prerequisite taught later is not a
 *      prerequisite.
 *   3. Every spiral pool entry is a real lesson, and none of them are
 *      ahead of the level they are pooled under.
 *   4. No lesson gets the same pattern in two slots. A review that says
 *      "go over ai-ay, then ai-ay" is a review with two slots.
 *   5. Every lesson that has anything behind it gets three filled slots.
 *   6. Every key the page can land on has something concrete to show --
 *      a ladder at minimum.
 *
 *   bun scripts/check-review.mjs
 */

import { readFileSync } from "node:fs";
import { LESSON_SPANS, lessonSpan } from "./lib/lesson-span.mjs";
import { deriveSequence } from "./lib/sequence.mjs";
import { reviewSlots } from "./lib/review-slots.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));

const COMMITTED = read("scripts/reading-sequence.json").sequence;
const PRE = read("scripts/reading-prerequisites.json");
const LAD = read("scripts/reading-word-ladders.json").ladders;
const SPLITS = read("scripts/reading-skill-splits.json");

const prereq = PRE.prereq;
const spiral = PRE.spiral;

const problems = [];
const say = (m) => problems.push(m);

// 1. the committed order is the derived order
const fresh = deriveSequence();
if (fresh.length !== COMMITTED.length) {
  say(`reading-sequence.json has ${COMMITTED.length} lessons, the source derives ${fresh.length} — run: bun scripts/build-sequence.mjs`);
} else {
  for (let i = 0; i < fresh.length; i++) {
    const a = fresh[i], b = COMMITTED[i];
    if (a.key !== b.key || a.name !== b.name || a.level !== b.level)
      say(`reading-sequence.json row ${i} is ${b.key}/${b.name}/L${b.level}, the source derives ${a.key}/${a.name}/L${a.level} — run: bun scripts/build-sequence.mjs`);
  }
}

const seq = COMMITTED;
const pos = Object.fromEntries(seq.map((r, n) => [r.key, n]));
const levelOf = Object.fromEntries(seq.map((r) => [r.key, r.level]));

// 2. prerequisites are real, and earlier
for (const [lesson, need] of Object.entries(prereq)) {
  if (!(lesson in pos)) say(`prereq: "${lesson}" is not a lesson in the sequence`);
  if (!(need in pos)) say(`prereq: "${lesson}" needs "${need}", which is not a lesson in the sequence`);
  if (lesson in pos && need in pos && pos[need] >= pos[lesson])
    say(`prereq: "${lesson}" names "${need}" as its prerequisite, but ${need} is taught at or after it`);
}

// 3. spiral pools are real, and not ahead of their level
for (const [lvl, pool] of Object.entries(spiral)) {
  for (const k of pool) {
    if (!(k in pos)) {
      say(`spiral level ${lvl}: "${k}" is not a lesson in the sequence`);
      continue;
    }
    if (levelOf[k] > Number(lvl))
      say(`spiral level ${lvl}: "${k}" is a Level ${levelOf[k]} lesson, which has not been taught yet at level ${lvl}`);
  }
}

// 4, 5. the slots themselves, for every lesson
let filled = 0;
let partial = 0;
for (const r of seq) {
  const slots = reviewSlots(r.key, { seq, prereq, spiral });
  const keys = slots.map((s) => s.key).filter(Boolean);

  if (new Set(keys).size !== keys.length)
    say(`${r.key}: the same lesson fills two slots (${keys.join(", ")})`);
  if (keys.includes(r.key)) say(`${r.key}: reviews itself`);

  for (const s of slots) {
    if (s.key && pos[s.key] >= pos[r.key])
      say(`${r.key}: slot "${s.why}" is ${s.key}, which is taught at or after it`);
  }

  if (keys.length === 3) filled++;
  else if (pos[r.key] >= 3) {
    partial++;
    say(`${r.key} is lesson ${pos[r.key] + 1} and fills only ${keys.length} of 3 slots`);
  }

  // 6. something concrete behind every slot
  for (const s of slots) {
    if (s.key && !LAD[s.key]) say(`${r.key}: slot ${s.key} has no word ladder to show`);
  }
}

/*
 * 7. The words shown for a lesson have to be that lesson's words.
 *
 * This is the one that was wrong and looked right. The review page used
 * to fall back to a lesson's word ladder when it had no dictation bank,
 * and a ladder is a chain of one-sound changes, not a list of examples:
 * the -dge ladder is one, on, in, it, at, sat, saw, with no -dge in it
 * anywhere. The page cheerfully told a teacher to review -dge with those.
 *
 * So every lesson that has sub-patterns recorded must show words that
 * between them carry each of its sub-patterns, AND every word it shows
 * must be an example of one of them.
 *
 * The second half was added after the first half passed something it
 * should not have. Short a (CVC) draws its words from an OG pack that
 * covers all five short vowels, and it was listing cat, pig, hen, mop,
 * bug, map, sit, red, hot, fun -- eight words with no a in them, under a
 * heading that says short a. "Some word carries the pattern" is true of
 * that list and tells you nothing. It costs nothing to ask for all of
 * them: every one of the forty-one lessons that had splits before today
 * already passed the stricter rule.
 *
 * Where a lesson has a span rule in lib/lesson-span.mjs, that rule is the
 * test, because a substring is not the pattern: desks ends in the -s
 * suffix and also contains an s that is part of desk, and the c in magic
 * is not a soft c.
 *
 * Lessons whose pattern is not a letter string at all -- syllable
 * division, the silent e rule, schwa a -- have no split to check against
 * and are only required to show something.
 */
const bare = (raw) => raw.toLowerCase().split("/").map((x) => x.replace(/-/g, "")).filter(Boolean);
const carries = (word, raw) =>
  bare(raw).some((b) =>
    b.includes("_") ? new RegExp(b.replace(/_/g, ".")).test(word.toLowerCase()) : word.toLowerCase().includes(b),
  );

let withWords = 0;
let checkedAgainstSplits = 0;
for (const r of seq) {
  if (!r.words || r.words.length === 0) {
    say(`${r.key} (${r.name}) has no words to review with`);
    continue;
  }
  withWords++;
  const subs = SPLITS[r.key];
  if (!subs || !subs.length) continue;
  checkedAgainstSplits++;
  const rule = LESSON_SPANS[r.key];
  const holds = (w, sub) => (rule ? lessonSpan(r.key, w)?.sub === sub : carries(w, sub));
  for (const sub of subs) {
    if (!r.words.some((w) => holds(w, sub)))
      say(`${r.key} (${r.name}): not one of its review words carries "${sub}" — ${r.words.join(", ")}`);
  }
  const twice = r.words.filter((w, i) => r.words.indexOf(w) !== i);
  if (twice.length)
    say(`${r.key} (${r.name}): ${[...new Set(twice)].join(", ")} appears twice in its review words`);
  const strays = r.words.filter((w) => !subs.some((sub) => holds(w, sub)));
  if (strays.length)
    say(
      `${r.key} (${r.name}): ${strays.join(", ")} ${strays.length === 1 ? "is" : "are"} shown as review ` +
        `for this lesson and ${strays.length === 1 ? "is" : "are"} not ${
          strays.length === 1 ? "an example" : "examples"
        } of ${subs.map((s) => `"${s}"`).join(" or ")}`,
    );
}

// The overrides have to actually override, and have to refuse nonsense.
const probe = seq[30].key;
const forced = reviewSlots(probe, { seq, prereq, spiral }, { s1: "cvc-a", s3: "vce" });
if (forced[0].key !== "cvc-a") say(`override: s1 did not take (got ${forced[0].key})`);
if (forced[2].key !== "vce") say(`override: s3 did not take (got ${forced[2].key})`);
const junk = reviewSlots(probe, { seq, prereq, spiral }, { s1: "not-a-lesson" });
const auto = reviewSlots(probe, { seq, prereq, spiral });
if (junk[0].key !== auto[0].key) say("override: a key that is not a lesson was trusted instead of ignored");

// And the pick has to be stable.
for (const r of seq.slice(0, 10)) {
  const a = reviewSlots(r.key, { seq, prereq, spiral }).map((s) => s.key).join();
  const b = reviewSlots(r.key, { seq, prereq, spiral }).map((s) => s.key).join();
  if (a !== b) say(`${r.key}: the three slots are not the same twice running`);
}

console.log(`${seq.length} lessons in sequence · ${Object.keys(prereq).length} prerequisites · ${Object.keys(spiral).length} spiral pools`);
console.log(`${filled} lessons fill all three slots, ${partial} fall short of three with room behind them`);
console.log(`${withWords} lessons have review words; ${checkedAgainstSplits} of them checked against their recorded sub-patterns`);
console.log(`problems: ${problems.length}`);
problems.slice(0, 40).forEach((x) => console.log("  " + x));
if (problems.length) {
  console.error("\n✗ fix these before the review page ships.");
  process.exit(1);
}
console.log("✅ every lesson reviews three earlier lessons, all of them real and none of them twice");
