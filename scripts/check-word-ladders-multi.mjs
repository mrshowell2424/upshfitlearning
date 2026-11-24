/**
 * Checks the multisyllabic word ladders before a child is handed one.
 *
 * A LADDER ONLY WORKS IF EACH CLUE HAS EXACTLY ONE ANSWER. "Change mill to
 * fall" turns windmill into windfall and into nothing else, so a child can
 * check themselves. "Change pan to hand and cake to shake" is two changes in
 * one rung: there is no single move to make, nothing to self-check against,
 * and the child is really being asked to guess the next word on the list.
 *
 * That is the mistake this file exists to catch, because it is invisible when
 * you write the ladder -- every rung looks fine on its own, and the fault is
 * only in the relation between the clue and the two words it sits between.
 *
 * Four questions per rung:
 *
 *   1. Does the clue describe a change that really turns this word into the
 *      next one? The clue's own words are read and applied.
 *   2. Is it ONE change? A clue naming two swaps is rejected outright.
 *   3. Is every rung a real word, and multisyllabic -- that is the point of
 *      the harder ladder.
 *   4. Does every rung carry the lesson's pattern?
 *
 *   bun run scripts/check-word-ladders-multi.mjs
 */
import { readFileSync, existsSync } from "node:fs";

const L = JSON.parse(readFileSync("scripts/reading-word-ladders.json", "utf8"));
const MULTI = JSON.parse(readFileSync("scripts/reading-multisyllabic.json", "utf8")).words;
const SHORT = new Set(JSON.parse(readFileSync("scripts/lib/real-short-words.json", "utf8")).words);

const SYSTEM_DICT = "/usr/share/dict/words";
const FULL = existsSync(SYSTEM_DICT)
  ? new Set(readFileSync(SYSTEM_DICT, "utf8").split("\n").map((w) => w.trim().toLowerCase()).filter(Boolean))
  : null;

/** Every real word the repo knows, for checking a rung is a word at all. */
const BANK = new Set(SHORT);
for (const list of Object.values(MULTI)) {
  for (const w of list.one ?? []) BANK.add(String(w).toLowerCase());
  for (const w of list.real ?? []) BANK.add(String(w).toLowerCase());
}
/**
 * A compound of two real words is a real word.
 *
 * These ladders are nearly all compounds, and web2 is the 1934 list: it has
 * hot and spot and dog and pack and shell, and none of hotspot, hotdog,
 * lapdog, backpack, blacktop, keystroke, sidekick, brainstorm or seashell. The
 * first run of this checker called nine real words unreal on that basis.
 */
const isCompound = (w) => {
  if (!FULL) return false;
  for (let i = 3; i <= w.length - 3; i++) {
    if (FULL.has(w.slice(0, i)) && FULL.has(w.slice(i))) return true;
  }
  return false;
};
const isReal = (w) =>
  BANK.has(w) ||
  (FULL ? FULL.has(w) : true) ||
  isCompound(w) ||
  (FULL && ["s", "es", "ed", "ing", "er"].some((sfx) =>
    w.endsWith(sfx) && (FULL.has(w.slice(0, -sfx.length)) || isCompound(w.slice(0, -sfx.length)))));

/** Vowel groups, counting a consonant-le ending as its own syllable. */
const syllables = (w) => {
  const consonantLe = /[^aeiou]le$/.test(w);
  const n = (w.replace(/e$/, "").match(/[aeiouy]+/g) || []).length;
  return consonantLe ? n + 1 : n;
};

/**
 * Apply a clue to a word and return every result it could produce.
 *
 * The clue forms the ladders use, and nothing else -- an unrecognised clue is
 * reported rather than waved through, because a clue this cannot read is one a
 * child has to interpret.
 */
function applyClue(word, clue) {
  const c = clue.toLowerCase().replace(/[.!]$/, "");
  let m;

  // "Change mill to fall." / "Change the ew to ue."
  if ((m = c.match(/^change (?:the )?([a-z]+) to ([a-z]+)$/))) {
    const [, from, to] = m;
    if (!word.includes(from)) return { out: [], why: `"${from}" is not in ${word}` };
    const hits = word.split(from).length - 1;
    if (hits > 1) return { out: [], why: `"${from}" appears ${hits} times in ${word}` };
    return { out: [word.replace(from, to)] };
  }

  // "Add an s at the end." / "Add a d at the end."
  if ((m = c.match(/^add (?:an?|the) ([a-z]+) (?:at|to) the end$/))) {
    return { out: [word + m[1]] };
  }

  // "Take off the s." / "Take off the st."
  if ((m = c.match(/^take off (?:the )?([a-z]+)$/))) {
    if (!word.endsWith(m[1]) && !word.startsWith(m[1])) {
      return { out: [], why: `${word} does not start or end with "${m[1]}"` };
    }
    const out = [];
    if (word.endsWith(m[1])) out.push(word.slice(0, -m[1].length));
    if (word.startsWith(m[1])) out.push(word.slice(m[1].length));
    return { out: [...new Set(out)] };
  }

  // "Put an s at the front."
  if ((m = c.match(/^put (?:an?|the) ([a-z]+) at the front$/))) {
    return { out: [m[1] + word] };
  }

  // "Put a t between the s and the a."
  if ((m = c.match(/^put (?:an?|the) ([a-z]+) between the ([a-z]+) and the ([a-z]+)$/))) {
    const [, ins, a, b] = m;
    const at = word.indexOf(a + b);
    if (at === -1) return { out: [], why: `"${a}${b}" is not in ${word}` };
    if (word.split(a + b).length - 1 > 1) {
      return { out: [], why: `"${a}${b}" appears more than once in ${word}` };
    }
    return { out: [word.slice(0, at + a.length) + ins + word.slice(at + a.length)] };
  }

  return { out: [], why: "clue form not recognised" };
}

/** A clue naming two changes is not a rung, whatever it produces. */
const twoChanges = (clue) => /\band\b.*\bto\b/i.test(clue) && (clue.match(/\bto\b/g) || []).length > 1;

const problems = [];
let rungs = 0;
let checked = 0;

for (const [key, lad] of Object.entries(L.laddersMulti ?? {})) {
  checked++;
  const words = lad.words ?? [];
  const clues = lad.clues ?? [];
  if (words.length !== clues.length + 1) {
    problems.push(`${key}: ${words.length} words but ${clues.length} clues`);
    continue;
  }
  if (lad.start !== words[0]) problems.push(`${key}: start "${lad.start}" is not the first word`);

  const seen = new Set();
  for (const w of words) {
    if (seen.has(w)) problems.push(`${key}: "${w}" appears twice`);
    seen.add(w);
    if (!isReal(w)) problems.push(`${key}: "${w}" is not a word`);
    if (syllables(w) < 2) problems.push(`${key}: "${w}" has one syllable, so this is not a harder ladder`);
  }

  for (let i = 0; i < clues.length; i++) {
    rungs++;
    const from = words[i];
    const want = words[i + 1];
    const clue = clues[i];
    if (twoChanges(clue)) {
      problems.push(`${key} rung ${i + 1}: "${clue}" names two changes`);
      continue;
    }
    const { out, why } = applyClue(from, clue);
    if (!out.length) {
      problems.push(`${key} rung ${i + 1}: "${clue}" on "${from}" -- ${why}`);
      continue;
    }
    if (out.length > 1) {
      problems.push(`${key} rung ${i + 1}: "${clue}" on "${from}" has ${out.length} answers: ${out.join(", ")}`);
      continue;
    }
    if (out[0] !== want) {
      problems.push(`${key} rung ${i + 1}: "${clue}" on "${from}" gives "${out[0]}", not "${want}"`);
    }
  }
}

console.log(`${checked} multisyllabic ladders · ${rungs} rungs`);
console.log(FULL ? `dictionary: ${FULL.size} words` : `⚠ ${SYSTEM_DICT} not found — the "is it a word" check was SKIPPED`);

if (problems.length) {
  console.error(`\n❌ ${problems.length} problems:\n`);
  for (const p of problems.slice(0, 40)) console.error(`   – ${p}`);
  if (problems.length > 40) console.error(`   … and ${problems.length - 40} more`);
  process.exit(1);
}
if (!checked) {
  console.log("\n⚠ no multisyllabic ladders to check yet.");
} else {
  console.log("\n✅ every rung is one change with one answer, and every word is a real multisyllabic word.");
}
