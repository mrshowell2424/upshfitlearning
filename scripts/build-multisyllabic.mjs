/**
 * The multisyllabic word bank, one list per skill and per part.
 *
 * The lesson builder shipped ten multisyllabic words per skill and every
 * activity drew from those ten: the ten words a day, real-or-made-up, the
 * maze, both spelling tests, the word games. Ten words cannot fill six
 * activities without repeating, which is why a child met sandbox twice on
 * the same page. Nothing could be fixed downstream -- the only fix was
 * more words.
 *
 * They are mined rather than invented. Every word here already appears in
 * something this site hands a child: the articles, the mysteries, the
 * passages, the decodables, the spelling banks. That is the whole point --
 * a word that survived being written into a reading passage for this age
 * group is a word a teacher can put on a list without reading it twice.
 * A generated word would need exactly that check doing again by hand.
 *
 * Each word is then held to four rules, and scripts/check-multisyllabic.mjs
 * re-derives all of it and fails if the committed file has drifted:
 *   1. two syllables or more, counted the way a teacher counts them
 *   2. carries its skill's pattern, matched the way the page matches it
 *   3. is a real English word, per /usr/share/dict/words
 *   4. does not carry a longer sibling pattern -- an i_e lesson must not
 *      hand out a_e words
 *
 *   bun run scripts/build-multisyllabic.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";

const read = (f) => JSON.parse(readFileSync(`scripts/${f}`, "utf8"));
const SPLITS = read("reading-skill-splits.json");
const SEQ = read("reading-sequence.json").sequence;
const SPELL = read("reading-spelling.json").patterns;
/**
 * The words taught as exceptions, kept off every pattern list.
 *
 * one, are and have all have a vowel, a consonant and a silent e, and all
 * three are on the silent-e page precisely because the rule does not hold
 * for them. Ranking by how common a word is pulls them straight to the top
 * of a single-syllable list, where they teach the opposite of the lesson.
 */
const HEART = new Set(read("reading-heart-words.json").words.map((w) => w.word.toLowerCase()));
const PARTW = read("reading-part-words.json");

/**
 * How many words each list aims for.
 *
 * The lesson spends forty-five when every activity has its own: ten on the
 * reading page, ten more on the tracker, five for real-or-made-up and ten
 * for each of the two spelling tests. The word-game packet spends about
 * seventy across its chests, and draws against its own tally rather than
 * the lesson's -- a game is practice of the lesson, so repeating the
 * lesson's words there is right, and only the chests repeating each other
 * is wrong.
 *
 * Eighty is where that stops and the words are still worth printing. At a
 * hundred and twenty the silent-e list had reached diagnoses, conflate and
 * undermine, which are on the pattern and no use to the class reading it.
 * The rarer patterns cannot reach eighty and say so rather than padding.
 */
const TARGET = 80;

/** How many made-up words each list aims for. */
const FAKES = 8;

/* ---------------------------------------------------------------- corpus */

/**
 * Every word this site has already put in front of a child.
 *
 * Read out of the content files rather than a dictionary, so the bank
 * inherits their vetting. Counting how often each one appears doubles as a
 * usefulness ranking: a word the passages use twenty times is a word this
 * age group meets, and a word used once is probably a one-off.
 */
function corpus() {
  const freq = new Map();
  const grade = new Map();
  const sentences = [];
  /**
   * The grade each word was met at, as low as it goes.
   *
   * Ranking on how often a word appears is not enough on its own. The
   * articles run to grade 12 and the mysteries to grade 12, so the commonest
   * multisyllabic words in the content include appellate, preamble and
   * aggregate -- real, on pattern, and no use whatever to a class reading
   * two-syllable words. Walking the files with the nearest enclosing grade
   * in hand gives each word the youngest reader this site has shown it to,
   * and that is what decides whether it belongs on a list.
   */
  const walk = (node, g) => {
    if (node == null) return;
    if (typeof node === "string") {
      // Whole sentences, for the partner read. Written by a person for this
      // age group, which is the part a generated sentence cannot be.
      if (node.length > 20 && node.length < 2000 && /[.!?]/.test(node)) {
        for (const q of node.split(/(?<=[.!?])\s+/)) {
          const w = q.trim();
          const n = w.split(/\s+/).length;
          if (n >= 6 && n <= 18 && /^[A-Z]/.test(w) && /[.!?]$/.test(w) &&
              !/[<>{}\[\]|_=]/.test(w) && (w.match(/"/g) || []).length % 2 === 0) {
            sentences.push([w, g]);
          }
        }
      }
      for (const m of node.match(/[A-Za-z][A-Za-z\u2019']{2,}/g) || []) {
        const w = m.toLowerCase().replace(/\u2019/g, "'");
        if (!/^[a-z]+('[a-z]+)?$/.test(w)) continue;
        freq.set(w, (freq.get(w) || 0) + 1);
        if (g != null && (!grade.has(w) || grade.get(w) > g)) grade.set(w, g);
      }
      return;
    }
    if (Array.isArray(node)) { for (const x of node) walk(x, g); return; }
    if (typeof node === "object") {
      let here = g;
      for (const k of ["grade", "level", "gradeBand"]) {
        const v = node[k];
        if (typeof v === "number" && v >= 0 && v <= 12) { here = v; break; }
      }
      for (const [k, v] of Object.entries(node)) {
        if (k === "grade" || k === "level") continue;
        walk(v, here);
      }
    }
  };
  // Content only. Two kinds of file are skipped: this script's own output,
  // because feeding the bank its own made-up words means the second run
  // throws them out as words the site uses and the file never settles; and
  // the generated counts files, which are numbers with a note at the top
  // and are not anything a child reads. Adding reading-hub-counts.json
  // changed the word bank, which is how the second rule was found.
  const SKIP = new Set([
    "reading-multisyllabic.json",
    "reading-hub-counts.json",
    "reading-resources-counts.json",
    // Instructions to a teacher, not text a child reads. Its prose was
    // seeding a bank meant to hold words children have met, and editing a
    // writing task was quietly rewriting the word lists.
    "reading-writing-types.json",
    "math-prerequisites.json",
    "math-practice.json",
    // Maths cases are a teacher's situations and arguments -- crate charges,
    // base rates, lines of best fit. Reasonable prose, and none of it words a
    // child has met in a phonics lesson, so it has no business seeding the
    // bank those lessons draw from.
    "math-cases.json",
    // The slim indexes are the articles and the mysteries with their text
    // removed. The full files are already harvested a few lines above, so
    // reading these as well would count the same titles twice.
    "reading-articles-index.json",
    "reading-mysteries-index.json",
    // Both of these are MADE-UP words by design -- the timed probe's silly
    // words and the continuum review's nonsense words. Harvesting them would
    // teach the real-word bank that vop and dake are words children have met,
    // and the next sheet built from the bank would hand one to a child as a
    // real word. The pools they come from are hand-authored and checked; this
    // bank is not where they belong.
    "reading-benchmark.json",
    "continuum-review.json",
  ]);
  const files = readdirSync("scripts").filter((f) => f.endsWith(".json") && !SKIP.has(f));
  const dirs = ["scripts/articles", "scripts/mysteries"].filter((d) => existsSync(d));
  for (const d of dirs) for (const f of readdirSync(d)) if (f.endsWith(".json")) files.push(`../${d.split("/")[1]}/${f}`);
  for (const f of files) {
    try { walk(JSON.parse(readFileSync(`scripts/${f}`, "utf8")), null); } catch { /* not JSON we can walk */ }
  }
  return { freq, grade, sentences };
}

/**
 * Every three-letter run English actually writes.
 *
 * A made-up word has to be decodable or it is not testing decoding. Swapping
 * one letter produced clazsroom and clitped -- zs and tp are runs no English
 * word contains, so a child rejects them on sight without reading them,
 * which is the failure this is here to prevent. Taking the runs off the
 * dictionary rather than writing a list of banned pairs means the rule is
 * whatever English does, not whatever anybody remembered.
 */
export function trigrams(words) {
  const t = new Set();
  for (const w of words) for (let i = 0; i + 3 <= w.length; i++) t.add(w.slice(i, i + 3));
  return t;
}

/** Real English words, lowercase only, so proper nouns stay out. */
function dictionary() {
  const d = new Set();
  for (const w of readFileSync("/usr/share/dict/words", "utf8").split("\n")) {
    if (/^[a-z]+$/.test(w)) d.add(w);
  }
  return d;
}

/* ------------------------------------------------------------- syllables */

/**
 * Syllables, counted the way a teacher counts them at the board.
 *
 * Vowel groups, less a silent final e, plus one back for a consonant-le
 * ending, which is the one place the silent e rule and the syllable rule
 * disagree: table is two, not one.
 */
export function syllables(w) {
  const s = w.toLowerCase();
  let groups = (s.match(/[aeiouy]+/g) || []).length;
  if (/[^aeiou]e$/.test(s) && !/[^aeiou]le$/.test(s)) groups -= 1;
  if (/[^aeioul]le$/.test(s)) groups += 1;
  // didn't has one vowel and two syllables: the n carries the second, which
  // don't does not do, so the n has to follow a consonant.
  if (/[^aeiou]n't$/.test(s)) groups += 1;
  return Math.max(1, groups);
}

/* --------------------------------------------------------------- pattern */

/** Alternatives on /, with _ standing for one letter. */
export const alts = (q) =>
  String(q).split("/").map((a) => a.replace(/[^a-zA-Z_']/g, "")).filter(Boolean);

/**
 * Where in a word a pattern has to sit.
 *
 * The page matches a pattern as a bare substring, which is fine when it is
 * choosing between ten hand-written words and useless when it is choosing
 * between seven thousand: cl matched article and cycle, a_e matched water
 * and label, and a teacher would have been handed those as blend and
 * silent-e words.
 *
 * The position is not written down anywhere, so it is learned from the
 * words a teacher already wrote. reading-part-words.json holds ten real
 * words for most parts; if they nearly all start with the pattern it is an
 * initial one, if they nearly all end with it it is a final one. That is
 * the same judgement a person would make from the same list, and it
 * updates itself when the bank does.
 */
const SUFFIXED = "(s|es|ed|d|ing|ly|er|est)?";
export function placeOf(key, q) {
  if (q.includes("_")) return "vce";
  if (/^-/.test(q)) return "final";
  if (/-$/.test(q)) return "initial";
  const bank = (PARTW[key] || {}).real || [];
  if (bank.length >= 5) {
    const a = alts(q).map((x) => x.toLowerCase());
    const starts = bank.filter((w) => a.some((x) => w.toLowerCase().startsWith(x))).length;
    const ends = bank.filter((w) =>
      a.some((x) => new RegExp(x + SUFFIXED + "$", "i").test(w))).length;
    if (starts / bank.length >= 0.8) return "initial";
    if (ends / bank.length >= 0.8) return "final";
  }
  return "anywhere";
}

/**
 * Does this word carry this pattern, in the place the pattern belongs?
 *
 * The silent-e case is its own rule because the letters alone cannot say
 * it: label has a, b and e in that order and teaches nothing about a_e.
 * The e has to be the silent one, which means it ends the word or is
 * carrying only an ending behind it -- pancake, mistakes, invited.
 */
export function hits(q, w, place = "anywhere", key = "") {
  const word = String(w).toLowerCase();
  return alts(q).some((a0) => {
    const a = a0.toLowerCase();
    if (place === "vce") {
      // Silent e, and the long vowel it makes. Two things the letters alone
      // do not tell you, both of which put wrong words on a VCe list:
      // leaves and disease match a-consonant-e and say nothing about it,
      // because the a belongs to a vowel team; passage and surface match
      // and say nothing either, because the a is a schwa. So the test is
      // that the word ends in a VCe word a child has already read as one.
      const known = (PARTW[key] || {}).real || [];
      const tails = known.filter((x) => new RegExp(
        a.replace(/_/g, "[bcdfghjklmnpqrstvwxz]") + "$", "i").test(x));
      // A one-syllable word is the VCe word, so it has nothing to end in.
      // The compound rule is for the longer ones built on top of it.
      if (!tails.length || syllables(word) === 1) {
        return new RegExp("(?<![aeiou])" + a.replace(/_/g, "[bcdfghjklmnpqrstvwxz]") +
          SUFFIXED + "$", "i").test(word);
      }
      // No vowel in front of the VCe vowel, or the tail match is an
      // accident of spelling: because, cause, house and mouse all end in
      // use and none of them is a u_e word.
      return tails.some((t) => word.length > t.length &&
        new RegExp("(?<![aeiou])" + t + SUFFIXED + "$", "i").test(word));
    }
    const body = a.replace(/_/g, "[a-z]");
    if (place === "initial") return new RegExp("^" + body, "i").test(word);
    if (place === "final") return new RegExp(body + SUFFIXED + "$", "i").test(word);
    return new RegExp(body, "i").test(word);
  });
}

/**
 * Which patterns a skill teaches, and under which key.
 *
 * A part is its own key, so the ow page never shows oa words. The skill's
 * own key takes every part it has, because "all together" is exactly that.
 */
export function keysAndPatterns() {
  const out = new Map();
  const partsOf = (id) =>
    SPLITS[id] || (SPELL.find((p) => p.key === id) || {}).parts?.map((x) => x.part) || [];
  for (const row of SEQ) {
    const parts = partsOf(row.key);
    if (parts.length) {
      out.set(row.key, parts);
      for (const q of parts) out.set(`${row.key}|${q}`, [q]);
    } else {
      // No split recorded. The part-words bank still names parts for some,
      // and anything left over falls back to its own name having no pattern
      // to test -- those keys are reported rather than filled with guesses.
      const fromBank = Object.keys(PARTW)
        .filter((k) => k.startsWith(`${row.key}|`))
        .map((k) => k.slice(row.key.length + 1));
      if (fromBank.length) {
        out.set(row.key, fromBank);
        for (const q of fromBank) out.set(`${row.key}|${q}`, [q]);
      } else out.set(row.key, []);
    }
  }
  return out;
}

/* ----------------------------------------------------------------- build */

const { freq: FREQ, grade: GRADE, sentences: SENTS } = corpus();
const DICT = dictionary();
/**
 * The runs are taken from the words this site uses, not from the whole
 * dictionary. /usr/share/dict/words is wide enough that almost any run
 * appears in something: itp passed on the strength of a word no child will
 * ever meet, so clitped passed with it. The content's own vocabulary is the
 * right standard, because it is the English these children read.
 */
export const TRI = trigrams([...FREQ.keys()].filter((w) => DICT.has(w)));
const KEYS = keysAndPatterns();

/** Words that are real, multisyllabic, and plain enough to put on a list. */
const POOL = [...FREQ.entries()]
  .filter(([w]) => w.length >= 4 && w.length <= 12)
  // A contraction is in no dictionary as one word, so it is vouched for by
  // this site's own use of it instead: didn't appears everywhere here and
  // "didnt" appears in nothing.
  .filter(([w, n]) => (w.includes("'") ? n >= 5 : DICT.has(w)))
  .filter(([w]) => syllables(w) >= 2)
  // Youngest reader first. A list fills from the words this site has shown
  // a class of nine-year-olds before it reaches for one it has only ever
  // shown a class of fifteen-year-olds, and a pattern with few
  // two-syllable words in English -- zz, olt -- still fills rather than
  // coming out half empty.
  .sort((a, b) =>
    Math.min(9, GRADE.get(a[0]) ?? 99) - Math.min(9, GRADE.get(b[0]) ?? 99) ||
    b[1] - a[1] || a[0].length - b[0].length || a[0].localeCompare(b[0]));

/**
 * Made-up multisyllabic words, for real-or-made-up.
 *
 * The switch used to grow the real words and leave the made-up ones short,
 * so a child could score full marks on that page by circling M for anything
 * under six letters without reading a word of it. These are built by
 * swapping one consonant in a real word, never inside the pattern the
 * lesson teaches, and are kept only if the result is in no dictionary and
 * in nothing this site has written.
 */
const SWAP = { b: "d", c: "p", d: "g", f: "m", g: "b", k: "t", l: "r",
  m: "n", n: "m", p: "t", r: "l", s: "z", t: "p", v: "b", z: "s" };
const readable = (w) => {
  for (let i = 0; i + 3 <= w.length; i++) if (!TRI.has(w.slice(i, i + 3))) return false;
  return true;
};
function fakes(words, carries) {
  const out = [];
  for (const w of words) {
    if (out.length >= FAKES) break;
    if (w.includes("'")) continue;
    // Interior consonants only. Swapping the last letter is what produced
    // conclusioh and agaih -- spellings English never writes, which a child
    // can reject without decoding them, which is the whole failure this is
    // meant to fix.
    for (let i = 1; i < w.length - 1; i++) {
      const c = w[i];
      if (!SWAP[c] || "aeiouy".includes(w[i - 1]) === false && "aeiouy".includes(w[i + 1]) === false) continue;
      const cand = w.slice(0, i) + SWAP[c] + w.slice(i + 1);
      if (!carries(cand)) continue;
      if (DICT.has(cand) || FREQ.has(cand)) continue;
      if (out.includes(cand) || syllables(cand) !== syllables(w)) continue;
      if (!readable(cand)) continue;
      out.push(cand);
      break;
    }
  }
  return out;
}

// Everything below runs only when this is the script being run. The checker
// imports the rules above to test the committed file against them, and a
// checker that rewrote the file it was checking would always pass.
if (import.meta.main) {
    /**
   * The same mining, one syllable at a time.
   *
   * A lesson with the switch off spends just as many words as one with it
   * on, and a young skill ships ten. So the 2nd and 3rd grade spelling
   * tests both set cake, bike, home, cute — the same ten the child had just
   * read, twice. These are the words that widen that.
   */
  const ONES = [...FREQ.entries()]
    .filter(([w]) => w.length >= 3 && w.length <= 7 && !w.includes("'"))
    .filter(([w]) => DICT.has(w))
    .filter(([w]) => syllables(w) === 1)
    .sort((a, b) =>
      Math.min(9, GRADE.get(a[0]) ?? 99) - Math.min(9, GRADE.get(b[0]) ?? 99) ||
      b[1] - a[1] || a[0].length - b[0].length || a[0].localeCompare(b[0]));

  const bank = {};
  const thin = [];
  const empty = [];
  for (const [key, patterns] of KEYS) {
    if (!patterns.length) { empty.push(key); continue; }
    const skill = key.split("|")[0];
    // A longer sibling swallows the shorter one: on the ai page, ay words are
    // fine but a word carrying both belongs to neither list cleanly.
    const sibs = (SPLITS[skill] || []).filter(
      (x) => !patterns.includes(x) &&
        patterns.some((a) => alts(x).some((b) => alts(a).some((c) => b.length > c.length && b.includes(c)))),
    );
    const place = Object.fromEntries(patterns.map((q) => [q, placeOf(`${skill}|${q}`, q)]));
    const carries = (w) => patterns.some((q) => hits(q, w, place[q], `${skill}|${q}`));
  // An apostrophe word belongs only to a lesson about apostrophes. Allowing
  // it everywhere put clinton's on a cl-blend list, and a possessive proper
  // noun is not a blend word.
  const apos = patterns.some((q) => q.includes("'"));
    const offPattern = (w) =>
      sibs.some((L) => hits(L, w, placeOf(`${skill}|${L}`, L), `${skill}|${L}`));
    const pick = (from) => {
      const got = [];
      for (const [w] of from) {
        if (got.length >= TARGET) break;
        if (!carries(w) || offPattern(w)) continue;
        if (!apos && w.includes("'")) continue;
        if (HEART.has(w)) continue;
        got.push(w);
      }
      return got;
    };
    const words = pick(POOL);
    /**
     * Sentences for the partner read, when the switch is on.
     *
     * The hand-written ones are short and single-syllable, because they
     * were written for the single-syllable lesson: "Jill will toss the
     * ball." Turning the switch on left a class reading two-syllable words
     * all lesson and then reading that out to a partner. These carry at
     * least two of the pattern's longer words and are long enough to be
     * worth reading aloud, and every one of them is a sentence a person
     * wrote for this age group.
     */
    const ms = new Set(words.map((w) => w.toLowerCase()));
    // A sentence opening on a bare pronoun is about something the previous
    // sentence named, so on its own it reads as a fragment of somebody
    // else's paragraph. Those are kept, but only to fill up.
    const LEANS = /^(It|He|She|They|That|This|These|Those|Then|But|And|So|Her|His|Their)\b/;
    const standalone = [];
    const rest = [];
    const seenSent = new Set();
    for (const [q, g] of SENTS) {
      // Written for a class of twelve-year-olds at the oldest. The
      // grade 9 to 12 mysteries are full of sentences that are perfectly
      // on pattern and about appellate courts.
      if (g != null && g > 6) continue;
      const hit = new Set((q.toLowerCase().match(/[a-z']{3,}/g) || []).filter((w) => ms.has(w)));
      if (hit.size < 2) continue;
      const k = q.toLowerCase();
      if (seenSent.has(k)) continue;
      seenSent.add(k);
      (LEANS.test(q) ? rest : standalone).push(q);
      if (standalone.length >= 6) break;
    }
    const sent = standalone.concat(rest).slice(0, 6);
    bank[key] = { real: words, one: pick(ONES), fake: fakes(words, carries), sent };
    if (words.length < TARGET) thin.push(`${key} (${words.length})`);
  }

  writeFileSync(
    "scripts/reading-multisyllabic.json",
    JSON.stringify({
      _note:
        "Multisyllabic words for every skill and every part of a split skill, so the ten words a day, real-or-made-up, the maze, both spelling tests and the word games can each have their own and a child never meets the same word twice in one lesson. Mined from the words this site already puts in front of children, then held to four rules. Generated by scripts/build-multisyllabic.mjs; do not hand-edit. scripts/check-multisyllabic.mjs re-derives it and fails on drift.",
      target: TARGET,
      words: bank,
    }, null, 1) + "\n",
  );

  console.log(`${Object.keys(bank).length} lists, ${Object.values(bank).reduce((n, b) => n + b.real.length, 0)} multisyllabic, ${Object.values(bank).reduce((n, b) => n + b.one.length, 0)} single-syllable and ${Object.values(bank).reduce((n, b) => n + b.fake.length, 0)} made-up words, ${Object.values(bank).reduce((n, b) => n + b.sent.length, 0)} sentences`);
console.log(`${Object.values(bank).filter((b) => b.sent.length < 3).length} lists have fewer than three sentences`);
  console.log(`pool: ${POOL.length} multisyllabic words, out of ${FREQ.size} in the content`);
  if (thin.length) console.log(`under ${TARGET}: ${thin.length}\n  ${thin.join("\n  ")}`);
  if (empty.length) console.log(`no pattern recorded, left out: ${empty.join(", ")}`);

}
