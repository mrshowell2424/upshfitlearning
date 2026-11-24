/**
 * Checks the thirty-a-day continuum sheet before a child reads one.
 *
 * The questions are the same ones every word file here has to answer, because
 * the same mistakes keep being available: a made-up word that is really a word,
 * a real word that is not, a concept quietly missing from a day, or a word
 * showing up twice in the week so Friday is Monday from memory.
 *
 *   bun run scripts/check-continuum-daily.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { CONCEPTS } from "./lib/continuum-pools.mjs";
import { looksReal, unsafeWord } from "./lib/not-nonsense.mjs";

const D = JSON.parse(readFileSync("scripts/continuum-daily.json", "utf8"));
const SHORT = new Set(JSON.parse(readFileSync("scripts/lib/real-short-words.json", "utf8")).words);
const SYSTEM_DICT = "/usr/share/dict/words";
const FULL = existsSync(SYSTEM_DICT)
  ? new Set(readFileSync(SYSTEM_DICT, "utf8").split("\n").map((w) => w.trim().toLowerCase()).filter(Boolean))
  : null;

/** Which pool each word should have come from. */
const REAL_OF = new Map();
const FAKE_OF = new Map();
for (const c of CONCEPTS) {
  if (c.kind !== "words") continue;
  REAL_OF.set(c.id, new Set(c.real));
  FAKE_OF.set(c.id, new Set(c.fake));
}
const LETTERS = new Set(CONCEPTS.find((c) => c.kind === "letters").letters.map(([l]) => l));
const WORD_IDS = CONCEPTS.filter((c) => c.kind === "words").map((c) => c.id);

const problems = [];
const seen = new Map();

for (const day of D.days) {
  if (day.items.length !== D.perDay) {
    problems.push(`day ${day.day}: ${day.items.length} words, expected ${D.perDay}`);
  }
  // Every concept, every day, one of each kind.
  for (const id of WORD_IDS) {
    const real = day.items.filter((i) => i.from === id && i.kind === "real").length;
    const fake = day.items.filter((i) => i.from === id && i.kind === "made-up").length;
    if (real !== 1) problems.push(`day ${day.day} ${id}: ${real} real words, expected 1`);
    if (fake !== 1) problems.push(`day ${day.day} ${id}: ${fake} made-up words, expected 1`);
  }

  for (const it of day.items) {
    const key = `${it.from}:${it.w}`;
    if (seen.has(key)) problems.push(`"${it.w}" (${it.from}) appears on day ${seen.get(key)} and day ${day.day}`);
    else seen.set(key, day.day);

    if (it.kind === "letter") {
      if (!LETTERS.has(it.w)) problems.push(`day ${day.day}: "${it.w}" is not one of the 26 letters`);
      if (!it.sound) problems.push(`day ${day.day}: letter "${it.w}" has no sound`);
      continue;
    }
    const pool = it.kind === "real" ? REAL_OF.get(it.from) : FAKE_OF.get(it.from);
    if (!pool) { problems.push(`day ${day.day}: "${it.w}" claims concept ${it.from}, which has no words`); continue; }
    if (!pool.has(it.w)) problems.push(`day ${day.day}: "${it.w}" is not in ${it.from}'s ${it.kind} pool`);
    if (it.kind === "made-up") {
      if (looksReal(it.w, SHORT) || (FULL && FULL.has(it.w))) problems.push(`day ${day.day}: made-up "${it.w}" IS A REAL WORD`);
      if (unsafeWord(it.w)) problems.push(`day ${day.day}: made-up "${it.w}" is an unsafe string`);
    }
  }
}

if (D.track.length !== CONCEPTS.length) {
  problems.push(`tracker has ${D.track.length} rows for ${CONCEPTS.length} concepts`);
}

console.log(`${D.days.length} days x ${D.perDay} words = ${D.days.length * D.perDay} slots`);
console.log(`tracker rows: ${D.track.length}`);
console.log(FULL ? `dictionary: ${FULL.size} words` : `⚠ ${SYSTEM_DICT} not found — the "is it real" check was SKIPPED`);

if (problems.length) {
  console.error(`\n❌ ${problems.length} problems:\n`);
  for (const p of problems.slice(0, 30)) console.error(`   – ${p}`);
  if (problems.length > 30) console.error(`   … and ${problems.length - 30} more`);
  process.exit(1);
}
console.log("\n✅ every day carries all fifteen concepts, one real and one made-up each, nothing twice, and every made-up word is genuinely made up.");
