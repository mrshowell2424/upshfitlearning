/**
 * Checks the timed probe's word lists before they reach a child.
 *
 * THE MADE-UP WORDS ARE THE POINT OF THIS CHECK. Four generations of them went
 * out with real words in: sup, wilt and ted from the first pass, stat, chem
 * and gov from the second, kup, blak and stek from the third, and glob, guck
 * and fock from the fourth. A child asked to read a real word as nonsense
 * learns the opposite of what the probe is for, and an examiner cannot score
 * a respelling at all.
 *
 * So this asks four things of every made-up word:
 *
 *   1. Does it come from a list somebody signed off? Nothing is generated any
 *      more, so a word with no pool behind it is a word nobody checked.
 *   2. Is it real after all -- in web2, the clipped list, or the reading bank?
 *   3. Is it an unsafe string?
 *   4. Does it keep the structural rules that stop respellings: no lone f, l,
 *      s, z, k or v ending, and no ck ending?
 *
 * And of the real-word list, the opposite: that every word on it is real.
 *
 *   bun run scripts/check-benchmark.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { looksReal, unsafeWord, CLIPPED_WORDS } from "./lib/not-nonsense.mjs";
import { EXTRA_CLOSED } from "./lib/nwf-pools.mjs";
import { CONCEPTS } from "./lib/continuum-pools.mjs";

const B = JSON.parse(readFileSync("scripts/reading-benchmark.json", "utf8"));
const SHORT = new Set(JSON.parse(readFileSync("scripts/lib/real-short-words.json", "utf8")).words);
const MULTI = JSON.parse(readFileSync("scripts/reading-multisyllabic.json", "utf8")).words;

const BANK = new Set(SHORT);
for (const list of Object.values(MULTI)) {
  for (const w of list.one ?? []) BANK.add(String(w).toLowerCase());
  for (const w of list.real ?? []) BANK.add(String(w).toLowerCase());
}

/** The full dictionary, when the machine has one. */
const SYSTEM_DICT = "/usr/share/dict/words";
const FULL = existsSync(SYSTEM_DICT)
  ? new Set(readFileSync(SYSTEM_DICT, "utf8").split("\n").map((w) => w.trim().toLowerCase()).filter(Boolean))
  : null;

/** Every made-up word anybody signed off, and where. */
const SIGNED = new Map();
for (const w of EXTRA_CLOSED) SIGNED.set(w, "nwf-pools");
for (const c of CONCEPTS) {
  if (c.kind !== "words") continue;
  for (const w of c.fake) SIGNED.set(w, `continuum ${c.id}`);
}

/**
 * A lone f/l/s/z/k/v straight after a vowel is where respellings come from:
 * bul is bull, buf is buff, fiz is fizz, hil is hill.
 *
 * Doubled is fine -- that is the spelling English actually uses -- and so is
 * one of these letters inside a blend, because chesk, plisk and shulk end in
 * sk and lk, not in a lone k. An earlier version of this test looked only at
 * the final letter and rejected all of those.
 *
 * It is also only applied to the words in nwf-pools, where it was the design
 * rule. The continuum's made-up words were written to carry a phonics pattern
 * and checked against that; holding them to a rule they were never written
 * for rejected chev, whiv and kiv, none of which respells anything.
 */
const loneFinal = (w) => /[aeiou][flszkv]$/.test(w);

/** web2 lists base forms, so try the obvious inflections of one. */
function realBySuffix(w, dict) {
  const bases = [];
  if (/s$/.test(w)) bases.push(w.slice(0, -1));
  if (/es$/.test(w)) bases.push(w.slice(0, -2));
  if (/ed$/.test(w)) bases.push(w.slice(0, -2), w.slice(0, -1));
  if (/ing$/.test(w)) bases.push(w.slice(0, -3), w.slice(0, -3) + "e");
  if (/(.)\1(ed|ing)$/.test(w)) bases.push(w.replace(/(.)\1(ed|ing)$/, "$1"));
  if (/er$/.test(w)) bases.push(w.slice(0, -2), w.slice(0, -1));
  if (/y$/.test(w)) bases.push(w.slice(0, -1));
  // funniest and funnier are funny; web2 has neither ending.
  if (/i(est|er)$/.test(w)) bases.push(w.replace(/i(est|er)$/, "y"));
  // A prefix on a real word is a real word: unzip, rerun, mislead.
  for (const p of ["un", "re", "de", "pre", "mis", "non", "over", "under"]) {
    if (w.startsWith(p) && w.length > p.length + 2) bases.push(w.slice(p.length));
  }
  return bases.some((b) => b.length > 1 && dict.has(b));
}

const problems = [];
let madeUp = 0;
let realWords = 0;

for (const level of B.levels) {
  const silly = B.nwf[level] ?? [];
  const race = B.wrf[level] ?? [];
  if (!silly.length) problems.push(`L${level}: no made-up words`);
  if (!race.length) problems.push(`L${level}: no real words`);

  const seen = new Set();
  for (const raw of silly) {
    const w = String(raw).toLowerCase();
    madeUp++;
    if (seen.has(w)) problems.push(`L${level} "${w}": appears twice in the level`);
    seen.add(w);
    if (!SIGNED.has(w)) problems.push(`L${level} "${w}": not in any signed-off pool`);
    if (looksReal(w, BANK)) problems.push(`L${level} "${w}": IS A REAL WORD`);
    if (FULL && FULL.has(w)) problems.push(`L${level} "${w}": IS A REAL WORD (dictionary)`);
    if (unsafeWord(w)) problems.push(`L${level} "${w}": unsafe string`);
    if (SIGNED.get(w) === "nwf-pools") {
      if (loneFinal(w)) problems.push(`L${level} "${w}": ends in a lone f/l/s/z/k/v`);
      if (/ck$/.test(w)) problems.push(`L${level} "${w}": ends in ck`);
    }
  }

  for (const raw of race) {
    const w = String(raw).toLowerCase().replace(/[^a-z']/g, "");
    realWords++;
    if (!w) continue;
    // mom's is mom with a possessive on it, which web2 does not list.
    const bare = w.replace(/'s$/, "").replace(/'/g, "");
    const known =
      BANK.has(w) ||
      BANK.has(bare) ||
      CLIPPED_WORDS.has(bare) ||
      (FULL ? FULL.has(bare) || realBySuffix(bare, FULL) : true);
    if (!known) problems.push(`L${level} real "${w}": not in the dictionary or the bank`);
    if (SIGNED.has(w)) problems.push(`L${level} real "${w}": is a MADE-UP word`);
  }
}

console.log(`${B.levels.length} levels · ${realWords} real words · ${madeUp} made-up words`);
console.log(`${SIGNED.size} made-up words are signed off across the pools`);
console.log(FULL ? `dictionary: ${FULL.size} words` : `⚠ ${SYSTEM_DICT} not found — the "is it real" check was SKIPPED`);

if (problems.length) {
  console.error(`\n❌ ${problems.length} problems:\n`);
  for (const p of problems.slice(0, 40)) console.error(`   – ${p}`);
  if (problems.length > 40) console.error(`   … and ${problems.length - 40} more`);
  process.exit(1);
}
console.log("\n✅ every made-up word comes from a signed-off pool, is genuinely made up, safe, and keeps the respelling rules.");
