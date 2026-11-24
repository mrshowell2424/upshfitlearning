/**
 * Is the first vowel long or short? Vendored, from the CMU pronouncing dictionary.
 *
 * WHY THIS EXISTS. A VCV word -- one consonant between two vowels -- divides
 * one of two ways, and nothing in the spelling says which. ti/ger and rob/in
 * look identical on the page: single vowel, single consonant, single vowel.
 * The difference is the sound. A long first vowel leaves the consonant to the
 * second syllable (ti/ger, ro/bot, mu/sic, pa/per); a short one keeps it
 * (rob/in, cab/in, lem/on, wag/on).
 *
 * The syllable engine had no way to know, so it guessed from the spelling --
 * a lone vowel letter was read as short -- and that guess sent every one of
 * them the same way. tiger became tig/er, robot rob/ot, music mus/ic, paper
 * pap/er. An answer key built on that teaches a child to chop a word wrongly,
 * which is worse than not having the exercise.
 *
 * So the vowel's length comes from a pronunciation dictionary instead. The
 * CMU dictionary gives phonemes with stress, and the five tense vowels --
 * AY IY EY OW UW -- are exactly the ones a child is taught as "saying its
 * name". Everything else is short for this purpose.
 *
 * ONLY THE WORDS THIS REPO USES are kept, so the vendored file is small and
 * the build does not depend on a 3.6 MB download. Re-run with the dictionary
 * path when new words are added:
 *
 *   bun run scripts/build-vowel-length.mjs <path-to-cmudict.dict>
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { CONCEPTS } from "./lib/continuum-pools.mjs";

const dictPath = process.argv[2];
if (!dictPath) {
  console.error("usage: bun run scripts/build-vowel-length.mjs <path-to-cmudict.dict>");
  console.error("  get it from https://github.com/cmusphinx/cmudict (public domain)");
  process.exit(1);
}

/** The tense vowels: the ones a child is taught as the vowel saying its name. */
const LONG = new Set(["AY", "IY", "EY", "OW", "UW"]);

/**
 * STRESS DECIDES IT FIRST, vowel quality second.
 *
 * Vowel quality alone got a whole class wrong: begin came out beg/in, below
 * bel/ow, decide dec/ide, return ret/urn. The dictionary gives those a
 * reduced vowel -- B IH0 G IH1 N -- because the first syllable is unstressed,
 * and a reduced vowel read as "short" sends the consonant the wrong way.
 *
 * But an unstressed syllable is reduced precisely BECAUSE it is open: the
 * vowel has nothing after it to close it. So an unstressed first vowel means
 * an open first syllable, whatever the reduced vowel sounds like. Only when
 * the first syllable carries stress does its vowel quality decide, which is
 * the difference between ti/ger and rob/in.
 *
 * This also sorts relish from return. Both start "re", and a blanket rule
 * about the prefix would get one of them wrong: relish is R EH1 L IH0 SH,
 * stressed and short, so rel/ish; return is R IH0 T ER1 N, unstressed, so
 * re/turn.
 *
 * Secondary stress counts as unstressed here. decide is D IH2 S AY1 D -- the
 * first syllable carries secondary stress, not primary -- and treating only
 * stress 0 as unstressed sent it to dec/ide. Only primary stress means the
 * syllable is prominent enough for its vowel quality to decide.
 */

/**
 * Words the dictionary's chosen variant disagrees with the taught
 * pronunciation on. Each one is here because it was checked by hand.
 */
const OVERRIDES = {
  // Z IH1 R OW0 is a real variant, but the word is taught -- and far more
  // often said -- as ZEE-ro, an open first syllable.
  zero: "open",
};

/** Every multisyllabic word anywhere in the repo's word banks. */
const wanted = new Set();
const addWord = (w) => {
  const k = String(w).toLowerCase().replace(/[^a-z]/g, "");
  // Two vowel groups or more: a one-syllable word never needs this.
  if (k.length > 2 && (k.match(/[aeiouy]+/g) || []).length >= 2) wanted.add(k);
};

const MULTI = JSON.parse(readFileSync("scripts/reading-multisyllabic.json", "utf8")).words;
for (const list of Object.values(MULTI)) {
  for (const w of list.one ?? []) addWord(w);
  for (const w of list.real ?? []) addWord(w);
}
for (const c of CONCEPTS) {
  if (c.kind === "letters") continue;
  for (const w of c.real) addWord(w);
}
for (const f of ["scripts/reading-sequence.json", "scripts/reading-spelling.json",
  "scripts/reading-heart-words.json", "scripts/reading-word-ladders.json"]) {
  if (!existsSync(f)) continue;
  for (const m of readFileSync(f, "utf8").toLowerCase().matchAll(/\b[a-z]{3,16}\b/g)) addWord(m[0]);
}
for (const d of ["scripts/articles-text"]) {
  if (!existsSync(d)) continue;
  for (const f of readdirSync(d)) {
    if (!f.endsWith(".json")) continue;
    for (const m of readFileSync(`${d}/${f}`, "utf8").toLowerCase().matchAll(/\b[a-z]{3,16}\b/g)) addWord(m[0]);
  }
}

// The dictionary is read as data: one line per pronunciation, the word first
// and its phonemes after. Variants are numbered word(2), word(3); the first
// listed is the common one, so later variants are ignored.
const out = {};
/**
 * Words where the letters "ng" spell TWO sounds rather than one.
 *
 * singer is S IH1 NG ER0: one sound, /ŋ/, and the letters stay together, so
 * sing-er. Two other things happen and both need the letters pulled apart:
 *
 *   finger  F IH1 NG G ER0   /ŋ/ + /g/   -> fin-ger
 *   danger  D EY1 N JH ER0   /n/ + /dʒ/  -> dan-ger
 *
 * Nothing in the spelling distinguishes any of the three. Looking only for
 * NG followed by G found finger, fungus, anger and hunger but missed the
 * whole soft-g class, leaving da-nger, ging-er and a-ngel.
 */
const ngSplit = [];
let seen = 0;
for (const line of readFileSync(dictPath, "utf8").split("\n")) {
  const sp = line.indexOf(" ");
  if (sp === -1) continue;
  const raw = line.slice(0, sp);
  if (raw.includes("(")) continue;
  const word = raw.toLowerCase();
  if (!wanted.has(word) || out[word] !== undefined) continue;
  seen++;
  const phones = line.slice(sp + 1).trim().split(/\s+/);
  const firstVowel = phones.find((p) => /[0-2]$/.test(p));
  if (!firstVowel) continue;
  const stress = firstVowel.slice(-1);
  const vowel = firstVowel.replace(/[0-2]$/, "");
  out[word] =
    OVERRIDES[word] ??
    (stress !== "1" ? "open" : LONG.has(vowel) ? "open" : "closed");
  // Three ways the letters "ng" come to spell two sounds:
  //   finger  NG G   /ŋ/ + /g/
  //   danger  N JH   /n/ + /dʒ/
  //   engage  N G    /n/ + /g/
  // Only the first two were checked at first, which left e-ngage.
  const ng = phones.indexOf("NG");
  const n = phones.indexOf("N");
  const twoSounds =
    (ng !== -1 && phones[ng + 1] === "G") ||
    (n !== -1 && (phones[n + 1] === "JH" || phones[n + 1] === "G"));
  if (twoSounds) ngSplit.push(word);
}

writeFileSync(
  "scripts/lib/vowel-length.json",
  JSON.stringify({
    _note:
      "Whether a word's FIRST syllable is open or closed, worked out from the CMU pronouncing dictionary (public domain). Used only to decide which way a VCV word divides -- one consonant between two vowels, where the spelling cannot tell ti/ger from rob/in. Unstressed means open; stressed means the vowel's quality decides. Generated by scripts/build-vowel-length.mjs; do not hand-edit.",
    source: "https://github.com/cmusphinx/cmudict",
    ngSplit,
    words: out,
  }) + "\n",
);

const opens = Object.values(out).filter((v) => v === "open").length;
console.log(`wanted ${wanted.size} multisyllabic words, found ${seen} in the dictionary`);
console.log(`  ${Object.keys(out).length} resolved: ${opens} open, ${Object.keys(out).length - opens} closed`);
console.log(`  ${wanted.size - seen} not in the dictionary (the engine still guesses for those)`);
console.log(`  ${ngSplit.length} words where "ng" spells two sounds, not one`);
