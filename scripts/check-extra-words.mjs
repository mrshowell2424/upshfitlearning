/**
 * Checks the authored word batches before they are allowed near a child.
 *
 * A wrong word in a decoding lesson is worse than a short list, and the eye
 * is bad at this: twenty-two of the sixty made-up words already shipping are
 * real English words, five of them common enough that a child would know —
 * dry, stay, flow, plow, mink — all printed "M" for made-up on the key.
 *
 * So every word is checked by machine:
 *   real words  must be in the dictionary and match the skill's pattern
 *   made-up     must NOT be in the dictionary, and must still match it
 *   sentences   must carry the pattern and not repeat one already in use
 *
 *   bun run scripts/check-extra-words.mjs
 *
 * Exits non-zero on any failure, so it can gate the seed.
 */
import { readFileSync } from "node:fs";

const EXTRA = JSON.parse(readFileSync("scripts/reading-extra-words.json", "utf8"));
const WORDS = new Set(
  readFileSync("/usr/share/dict/words", "utf8").split("\n").map((w) => w.trim().toLowerCase())
);

const C = "[bcdfghjklmnpqrstvwxyz]";
const V = "[aeiou]";

/**
 * What counts as on-pattern for each skill.
 *
 * Deliberately loose about word shape and strict about the grapheme: the
 * point of the check is that an ai lesson never shows an oa word, not that
 * every word is the same length.
 */
const PATTERN = {
  // Every vowel in the word, so a two-syllable non-word for a short a
  // lesson has short a in both halves and nothing else.
  "cvc-a": (w) => /[aeiou]/.test(w) && !/[eiou]/.test(w),
  "cvc-mix": (w) => /[ioue]/.test(w) && !/a/.test(w),
  dig: (w) => /sh|ch|th|wh/.test(w),
  floss: (w) => /(ff|ll|ss|zz)/.test(w),
  blends: (w) =>
    /^(bl|cl|fl|sl|st|dr|gr|sw|pl|tr|cr|br|fr|pr|sn|sp|sc|sk|sm|str)/.test(w) ||
    /(nd|st|mp|sk|nt|lt|lk|ft)$/.test(w),
  vce: (w) => new RegExp(`${V}${C}e`).test(w),
  vccv: (w) => new RegExp(`${V}${C}${C}${V}`).test(w),
  vccvce: (w) => new RegExp(`${V}${C}+${V}${C}e`).test(w) || new RegExp(`${V}${C}${C}`).test(w),
  "ng-nk": (w) => /(ng|nk)/.test(w),
  "ck-tch": (w) => /(ck|tch)/.test(w),
  y: (w) => /y$/.test(w),
  "ai-ay": (w) => /(ai|ay)/.test(w),
  "ee-ea": (w) => /(ee|ea)/.test(w),
  "oa-ow": (w) => /(oa|ow)/.test(w),
  "ar-or": (w) => /(ar|or)/.test(w),

  // Batch 2: the Level 1 and 2 concepts that come from the OG packs.
  // An open syllable ends in a vowel, so either the word does, or it
  // splits V/CV with the first syllable open: ro-bot, ti-ger, mu-sic.
  "og1-02": (w) => /[aeiou]$/.test(w) || new RegExp(`^${C}*${V}${C}${V}`).test(w),
  // The consonants lesson teaches one letter, one sound, so a digraph in
  // the list is the thing to catch.
  "og1-03": (w) => !/(sh|ch|th|wh|ck|ng|nk|qu|ph)/.test(w) && /[aeiou]/.test(w),
  "og1-04": (w) => /[ck]/.test(w),
  "og1-06": (w) => /(x|qu)/.test(w),
  // Plural -s, not the FLOSS double s.
  "og1-10": (w) => /s$/.test(w) && !/ss$/.test(w),
  "og1-11": (w) => /'s$/.test(w),
  "og1-13": (w) => /^(un|non)/.test(w),
  "og2-06": (w) => /(ild|old|ost|ind|oll|olt)/.test(w),
  "og2-07": (w) => /(kn|wr|gh|gn|mb$)/.test(w),
  "og2-08": (w) => /(oo|ou|ow)/.test(w),
  "og2-09": (w) => /(rr|are|ere|ire|ore|ure)/.test(w),
  // Three consonants between two vowels is the whole point of the split.
  "og2-10": (w) => new RegExp(`${V}${C}{3}${V}`).test(w),
  "og2-11": (w) => /(ful|less|ness|ment|ly)$/.test(w),
  "og2-12": (w) => /(ed|ing|est|y|en|es)$/.test(w),
  "og2-13": (w) => /^(mis|sub|post)/.test(w),
  // Doubled consonant before a vowel suffix: hop + p + ing.
  "og2-14": (w) => /([bcdfghjklmnpqrstvwxz])\1(ed|ing|er|est|y)$/.test(w),

  // Batch 3: Levels 3 to 5.
  "og3-01": (w) => /[cg][eiy]/.test(w),
  "og3-02": (w) => /(dge|ge$)/.test(w),
  // An open first syllable, with a final y allowed: la-zy as well as ba-by.
  "og3-03": (w) => new RegExp(`^${C}*${V}${C}[aeiouy]`).test(w),
  "og3-04": (w) => /(oi|oy|au|aw|ie|igh)/.test(w),
  "og3-05": (w) => /(ing|ed|er|est|y)$/.test(w),
  "og3-06": (w) => /(ies|ied|ier|iest)/.test(w),
  // One consonant between two vowels — the split that makes robin, not robe.
  "og3-07": (w) => new RegExp(`${V}${C}${V}`).test(w),
  "og3-08": (w) => /[bcdfgkpstz]le$/.test(w),
  "og3-09": (w) => /^a|a$/.test(w),
  "og3-10": (w) => /'/.test(w),
  "og3-11": (w) => /(tion|sion)$/.test(w),
  "og3-12": (w) => /(ist|able|ible|ive)$/.test(w),
  "og3-13": (w) => /^(re|pro|pre|de)/.test(w),
  "og4-01": (w) => /(form|port|tract|rupt|scrib|script)/.test(w),
  "og4-02": (w) => /(spec|struct|flect|flex|mit|miss|ject)/.test(w),
  "og4-03": (w) => /(duc|grad|gress|cur|vid|vis|aud|vert|vers)/.test(w),
  "og4-04": (w) => /^(trans|inter)/.test(w) || /(ure|ous|ic|ar|or|ity)$/.test(w),
  // Two vowels that belong to different syllables: ne-on, du-et.
  "og4-05": (w) => new RegExp(`${V}${V}`).test(w),
  "og4-06": (w) => /(ue|ei|eu|ew|eigh|ui)/.test(w),
  "og4-07": (w) => /^(in|im|il|ir|con|com|dis|ex|sub)/.test(w),
  "og4-08": (w) => /(tian|tial|tious|cian|cial|cious)$/.test(w),
  "og4-09": (w) => /([bcdfghjklmnpqrstvwxz])\1(ed|ing|er)$/.test(w) || /(ed|ing|er)$/.test(w),
  "og5-01": (w) => /(ph|ch|f|k)/.test(w),
  "og5-02": (w) => /[yi]/.test(w),
  "og5-03": (w) => /(rh|mn|pn|ps|r|m|n|s)/.test(w),
  "og5-04": (w) => /(phon|tele|photo|bio|graph|ology|meter|geo|hydro|mono|poly|fon|graf|lig)/.test(w),
  "og5-05": (w) => /(ch|ou|que|sh|oo|k)/.test(w),
  "og5-06": (w) => /[ou]/.test(w),
  "og5-07": (w) => /(wor|wer)/.test(w),
  "og5-08": (w) => /(al|age|ance|ence|el|ence|ige|le)$/.test(w),
  "og5-09": (w) => /(aught|ought)/.test(w),
};

/**
 * How far apart two spellings are. Used only for the misspelling skills,
 * where a made-up word has to be a wrong spelling of a word in the lesson
 * and not just any invention: alfabet earns its place next to alphabet,
 * zaxquel does not.
 */
const distance = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
};

/** The possessive is never in the list, so it comes off before any lookup. */
const bare = (w) => String(w).toLowerCase().replace(/'s$/, "");

/**
 * web2 holds base forms, not inflections — jump but not jumped, hen but not
 * hens — so a plural or a past tense has to be looked up by its stem or
 * every suffix lesson reports its whole list as unknown. Undoubling catches
 * hugged, and the silent e catches hoping.
 *
 * Only real words are checked this way. A made-up word is judged on itself:
 * mabbing is not a word whatever mab is.
 */
const isWord = (w) => {
  const x = bare(w);
  if (WORDS.has(x)) return true;
  const stems = [];
  if (/ies$/.test(x)) stems.push(x.replace(/ies$/, "y"));
  if (/e?s$/.test(x)) stems.push(x.replace(/es$/, ""), x.replace(/s$/, ""));
  if (/(ed|ing|er|est|en|y)$/.test(x)) {
    const t = x.replace(/(ed|ing|er|est|en|y)$/, "");
    stems.push(t, t + "e");
    if (/([bcdfghjklmnpqrstvwxz])\1$/.test(t)) stems.push(t.slice(0, -1));
  }
  return stems.some((t) => t.length > 1 && WORDS.has(t));
};

/** A made-up word still has to be sayable: every chunk needs a vowel. */
const sayable = (w) => /[aeiouy]/.test(w) && !/[bcdfghjklmnpqrstvwxz]{4}/.test(w);

const problems = [];
const warnings = [];
const seenReal = new Set();
let realN = 0;
let fakeN = 0;
let sentN = 0;
let fixN = 0;
let realfixN = 0;

for (const [sid, v] of Object.entries(EXTRA)) {
  if (sid.startsWith("_")) continue;
  const fits = PATTERN[sid];
  if (!fits) {
    problems.push(`${sid}: no pattern test`);
    continue;
  }

  for (const w of v.real || []) {
    realN++;
    // web2 is an old list with gaps — it has fox and six and not box — so a
    // miss is something to look at, not something to fail on. The other
    // direction is reliable: if it is in there, it is a word.
    if (!isWord(w)) warnings.push(`${sid}: "${w}" is not in the dictionary — check by hand`);
    if (!fits(w)) problems.push(`${sid}: "${w}" does not match the pattern`);
    const key = sid + "|" + w;
    if (seenReal.has(key)) problems.push(`${sid}: "${w}" is listed twice`);
    seenReal.add(key);
  }

  // The Greek, French, connective and doubling lessons do not use nonsense.
  // Their made-up column is the wrong spelling of a real word, because the
  // question those lessons ask is which spelling is right — so alfabet and
  // werk belong there, and a word invented out of nothing does not.
  const misspelling = v.style === "misspelling";

  for (const w of v.fake || []) {
    fakeN++;
    if (misspelling) {
      const near = (v.real || []).map((r) => distance(w.toLowerCase(), r.toLowerCase()));
      const best = Math.min(...near);
      if (best > 3)
        problems.push(`${sid}: "${w}" is not a misspelling of anything in the lesson (nearest is ${best} edits away)`);
      // web2 carries archaic spellings — ryme, tought — so a hit here is
      // something to look at, not a failure: being an old spelling of the
      // word is exactly what makes it a good distractor.
      if (WORDS.has(bare(w))) warnings.push(`${sid}: misspelling "${w}" is in the dictionary — check it still reads as wrong`);
      continue;
    }
    if (WORDS.has(bare(w))) problems.push(`${sid}: made-up "${w}" is a real word`);
    if (!fits(w)) problems.push(`${sid}: made-up "${w}" does not match the pattern`);
    if (!sayable(w)) problems.push(`${sid}: made-up "${w}" is not sayable`);
  }

  // A shipped real word that is off the skill's pattern — an open-syllable
  // lesson printing "hen" — gets swapped for one that is on it.
  for (const [was, now] of Object.entries(v.realfix || {})) {
    realfixN++;
    if (fits(was)) problems.push(`${sid}: realfix for "${was}" — but it already matches the pattern`);
    if (!isWord(now)) warnings.push(`${sid}: replacement "${now}" is not in the dictionary — check by hand`);
    if (!fits(now)) problems.push(`${sid}: replacement "${now}" does not match the pattern`);
  }

  for (const [was, now] of Object.entries(v.fix || {})) {
    fixN++;
    if (!WORDS.has(bare(was)))
      problems.push(`${sid}: fix for "${was}" — but it was not a real word`);
    if (WORDS.has(bare(now))) problems.push(`${sid}: replacement "${now}" is a real word`);
    if (!fits(now)) problems.push(`${sid}: replacement "${now}" does not match the pattern`);
    if (!sayable(now)) problems.push(`${sid}: replacement "${now}" is not sayable`);
  }

  for (const s of v.sent || []) {
    sentN++;
    if (!/^[A-Z]/.test(s)) problems.push(`${sid}: sentence does not start with a capital — "${s}"`);
    if (!/[.!?]$/.test(s)) problems.push(`${sid}: sentence has no end mark — "${s}"`);
    const carries = s
      .toLowerCase()
      .replace(/[^a-z'\s]/g, "")
      .split(/\s+/)
      .some((w) => w.length > 1 && fits(w));
    if (!carries) problems.push(`${sid}: sentence carries no ${sid} word — "${s}"`);
  }
}

console.log(
  `checked ${realN} real words, ${fakeN} made-up words, ` +
    `${fixN} replacements, ${realfixN} pattern repairs and ${sentN} sentences across ` +
    `${Object.keys(EXTRA).filter((k) => !k.startsWith("_")).length} skills`
);
if (warnings.length) {
  console.log(`\n${warnings.length} to look at by eye:`);
  warnings.forEach((w) => console.log("   " + w));
}
if (problems.length) {
  console.error(`\n✗ ${problems.length} problems:`);
  problems.forEach((p) => console.error("   " + p));
  process.exit(1);
}
console.log("✅ every word checks out");
