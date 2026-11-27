/**
 * Does every word ladder hold up?
 *
 * A ladder is only worth printing if four things are true of it, and none
 * of them are true by accident:
 *
 *   1. every rung is a real word, and one a child should meet;
 *   2. every rung is decodable with what the sequence has taught by the
 *      lesson the ladder belongs to — a ladder in the short-a lesson may
 *      not reach for a silent e;
 *   3. the clue turns the rung above it into the rung below it; and
 *   4. no other legal word satisfies the same clue. "Change the t to n" is
 *      no use on "that", where it could mean either t, so a clue that two
 *      words answer is not a clue.
 *
 * The fourth is the one that cannot be eyeballed, and it is the reason this
 * runs rather than a person reading the list.
 *
 *   bun run scripts/check-word-ladders.mjs
 */
import { readFileSync } from "node:fs";
import { describes, judgeRung } from "./lib/ladder-clue.mjs";
import { deriveSequence } from "./lib/sequence.mjs";
import { CONCEPTS } from "./lib/continuum-pools.mjs";

// The order, the scope numbers that interleave the Basic patterns among
// the OG concepts, and the reach into the lesson builder for the list
// itself all live in lib/sequence.mjs now, because the review page needs
// exactly the same order and a second copy would drift.
const SK = deriveSequence().map((r) => [r.key, r.name, "Level " + r.level]);
const pos = Object.fromEntries(SK.map((r, n) => [r[0], n]));
const PART_WORDS = JSON.parse(readFileSync("scripts/reading-part-words.json", "utf8"));
const LAD = JSON.parse(readFileSync("scripts/reading-word-ladders.json", "utf8")).ladders;

const DICT = readFileSync("/usr/share/dict/words", "utf8").split("\n").map((w) => w.trim());
// web2 is a dictionary of base forms, and it leaves out irregular
// inflections a child meets early: no feet, no blew, though foot and blow
// are both there. The continuum pools are the hand-vetted real-word lists
// the thirty-a-day sheets are drawn from, already under check-continuum-*,
// so a word that stands on one of those sheets counts as a word here too.
// This is the whole reason "feet" was reported as not a word.
const POOL = new Set(CONCEPTS.flatMap((c) => c.real || []).map((w) => String(w).toLowerCase()));
const WORDS = new Set(DICT.filter((w) => w && w === w.toLowerCase()));
const compound = (w, g) => {
  let i = w.indexOf(g);
  while (i > 0) {
    const a = w.slice(0, i + 1), b = w.slice(i + 1);
    if (a.length > 1 && b.length > 1 && WORDS.has(a) && WORDS.has(b)) return true;
    i = w.indexOf(g, i + 1);
  }
  return false;
};
const V = "aeiou";
// The same table the sequence check uses, plus the two gates a ladder needs
// that a word bank does not: silent e, and the short vowels a short-a
// lesson has not taught.
const G = [
  ["x", "og1-06", (w) => /x/.test(w)],
  ["ck", "og1-04", (w) => /ck/.test(w)],
  ["sh", "dig", (w) => /sh/.test(w) && !compound(w, "sh")],
  ["ch", "dig", (w) => /ch/.test(w)],
  ["th", "dig", (w) => /th/.test(w) && !compound(w, "th")],
  ["wh", "dig", (w) => /^wh/.test(w)],
  ["ff/ll/ss/zz", "floss", (w) => /(ff|ll|ss|zz)/.test(w)],
  ["a blend", "blends", (w) => /^(bl|cl|fl|gl|pl|sl|br|cr|dr|fr|gr|pr|tr|sc|sk|sm|sn|sp|st|sw|tw|str|spl|spr|scr|shr|thr)/.test(w) || /(nd|nt|mp|lt|lk|ft|sk|st|sp)$/.test(w)],
  ["ng/nk", "ng-nk", (w) => /(ng|nk)$/.test(w)],
  ["tch", "ck-tch", (w) => /tch/.test(w)],
  ["ar/or", "ar-or", (w) => new RegExp("(ar|or)(?![" + V + "])").test(w)],
  ["ai/ay", "ai-ay", (w) => /ai|ay/.test(w)],
  ["ee/ea", "ee-ea", (w) => /(ee|ea)/.test(w) && !/qu(ee|ea)/.test(w)],
  ["oa/ow", "oa-ow", (w) => /(oa|ow)/.test(w)],
  ["kn/wr/gh/igh", "og2-07", (w) => /^(kn|wr)/.test(w) || /gh/.test(w)],
  ["oo/ou", "og2-08", (w) => /(oo|ou)/.test(w) && !/qu(oo|ou)/.test(w)],
  ["dge", "og3-02", (w) => /dge/.test(w)],
  ["oi/oy/au/aw", "og3-04", (w) => /(oi|oy)/.test(w) || new RegExp("(au|aw)(?![" + V + "])").test(w)],
  ["consonant-le", "og3-08", (w) => new RegExp("[^" + V + "]le$").test(w)],
  ["tion/sion", "og3-11", (w) => /(tion|sion)$/.test(w)],
  ["ue/ei/ew/eigh/ui", "og4-06", (w) => /(ue|ei|ew|eigh|ui)/.test(w) && !/[qg](ue|ui)/.test(w) && !/eing/.test(w)],
  ["ph", "og5-01", (w) => /ph/.test(w) && !compound(w, "ph")],
  ["rh/mn/pn/ps", "og5-03", (w) => /^(rh|pn|ps|mn)/.test(w) || /mn$/.test(w)],
  ["que", "og5-05", (w) => /que$/.test(w)],
  ["augh/ough", "og5-09", (w) => /(augh|ough)/.test(w)],
  ["short i/o/u/e", "cvc-mix", (w) => /[ioue]/.test(w)],
  ["silent e", "vce", (w) => new RegExp("^[^" + V + "]*[" + V + "][^" + V + "]e$").test(w)],
];
const HEART = new Set("the a is was of to what they said you your are were there their who does been come some one two here where would could should have give live love done my by i he she we me be go no so do into put push pull full very every from or for want water again any many friend and but not had has his her him them then this that with as at it in on up all got get can will did see".split(" "));
JSON.parse(readFileSync("scripts/reading-sight-words.json", "utf8")).lists.flat()
  .forEach((w) => HEART.add(String(w).toLowerCase()));
(global.OG_LEVELS || []).forEach((l) => (l.heart || []).forEach((w) => HEART.add(String(w).toLowerCase())));

// A heart word is only a heart word once it has been taught. The set above
// is cumulative, so on its own it would let a Level 5 sight word stand on a
// Level 1 rung. ALWAYS is what a child has from the start; everything else
// carries the level that introduces it, and a rung may not run ahead of it.
//
// This caught "says" standing on an ai/ay rung, reached by adding an s to
// "say". A child at that lesson reads the result /sayz/, which is the one
// thing "says" is a heart word in order to avoid.
const ALWAYS = new Set("the a is was of to what they said you your are were there their who does been come some one two here where would could should have give live love done my by i he she we me be go no so do into put push pull full very every from or for want water again any many friend and but not had has his her him them then this that with as at it in on up all got get can will did see".split(" "));
JSON.parse(readFileSync("scripts/reading-sight-words.json", "utf8")).lists.flat()
  .forEach((w) => ALWAYS.add(String(w).toLowerCase()));
const heartLevel = new Map();
(global.OG_LEVELS || []).forEach((l) => (l.heart || []).forEach((w) => {
  const k = String(w).toLowerCase();
  const n = Number(l.level);
  if (!heartLevel.has(k) || heartLevel.get(k) > n) heartLevel.set(k, n);
}));
const levelOf = Object.fromEntries(SK.map((r) => [r[0], Number(String(r[2]).replace("Level ", "")) || 9]));
/** A heart word this lesson has not met yet, or null. */
const heartTooSoon = (w, sid) => {
  const lw = String(w).toLowerCase();
  if (ALWAYS.has(lw) || !heartLevel.has(lw)) return null;
  const intro = heartLevel.get(lw);
  return intro > (levelOf[sid] || 9) ? intro : null;
};

const CONTRACT = /^([a-z]+)('d|'ll|'re|'s|'ve|'m|n't)$/;
const isWord = (w) => {
  const x = String(w).toLowerCase().replace(/'s$/, "");
  if (WORDS.has(x) || HEART.has(x) || POOL.has(x)) return true;
  const k = String(w).toLowerCase().match(CONTRACT);
  if (k) {
    const stem = k[2] === "n't" && k[1] === "wo" ? "will"
      : k[2] === "n't" && k[1] === "ca" ? "can"
      : k[2] === "n't" && k[1] === "sha" ? "shall" : k[1];
    if (WORDS.has(stem) || HEART.has(stem)) return true;
  }
  const stems = [];
  if (/ies$/.test(x)) stems.push(x.replace(/ies$/, "y"));
  if (/e?s$/.test(x)) stems.push(x.replace(/es$/, ""), x.replace(/s$/, ""));
  if (/(ed|ing|er|est|en|y|ly)$/.test(x)) {
    const t = x.replace(/(ed|ing|er|est|en|y|ly)$/, "");
    stems.push(t, t + "e");
    if (/([bcdfghjklmnpqrstvwxz])\1$/.test(t)) stems.push(t.slice(0, -1));
  }
  return stems.some((t) => t.length > 1 && WORDS.has(t));
};
const legalAt = (w, p, sid) => {
  const lw = String(w).toLowerCase();
  if (HEART.has(lw)) return true;
  for (const [name, owner, test] of G) {
    if (sid === "og4-05" && /ue|ei|ew|ui/.test(name)) continue;
    if (pos[owner] > p && test(lw)) return false;
  }
  return true;
};
const NOTFORKIDS = /^(fat|fats|fatter|fattest|kill|killed|dead|death|gun|guns|shot|blood|drunk|beer|wine|hell|damn|ass|butt|stupid|dumb|ugly|hate|war|sex|drug|drugs|naked)$/i;

/*
 * WORDS isWord SAYS YES TO AND A TEACHER WOULD NOT.
 *
 * isWord asks two things, and both of them can be true of something no child
 * should be handed as the right answer:
 *
 *   web2 is a very large dictionary. It carries thaught, an archaic word for
 *   a rower's bench, and tought, and limn, and volar. Two ladders on the
 *   aught/ought lesson printed thaught and tought as correct rungs, which on
 *   that lesson of all lessons reads as a misspelling of taught.
 *
 *   The stem rule says a regular inflection is a word when its stem is. That
 *   is right for words and feet, and wrong for gastest, which rode in on
 *   gast; for voy on voe; for mis on mi; for bess on bes; for posttest on
 *   post. The stem being a word does not make the inflection one.
 *
 * So the ladders are allowed only words someone has decided are words. This
 * list is the exceptions found by reading the printed sheets, and it is meant
 * to be added to the same way: when a rung looks wrong on paper, it goes here
 * and the ladder gets rebuilt.
 */
const NOTAWORD = new Set([
  // not words at all, admitted by the stem rule
  "gastest", "voy", "mis", "posttest", "thaught", "tought", "boughts",
  // archaic or specialist, admitted by web2
  "aught", "nought", "naught", "limn", "volar", "thew", "thole", "colewort",
  "prelection", "derat", "rescription", "scription",
  // names, which a lowercase dictionary cannot tell from words
  "bess", "jess", "jane", "pete", "rex", "kim",
  // dialect, slang and archaic, all of which web2 lists without comment:
  // mong and dink are slurs in some dialects, jow is Scots for tolling a
  // bell, blay is a small fish, knop an ornamental knob, and zar is not a
  // word at all -- the Russian ruler is czar or tsar.
  "mong", "dink", "jow", "blay", "knop", "zar",
]);


// Every word any ladder uses, which is the set a clue could be answered
// from. Checking against the whole dictionary would fail honest clues over
// words no child will ever write; checking against this asks the real
// question — could a child working this page write something else down?
const UNIVERSE = new Set();
Object.values(LAD).forEach((v) => v.words.forEach((w) => UNIVERSE.add(String(w).toLowerCase())));

const problems = [];
let rungs = 0;
/*
 * One ladder per lesson, and one per part of a lesson that has a word
 * bank. The parts come from reading-part-words.json, which is what a
 * ladder is actually built against -- its rungs have to be words a child
 * can decode at that point, and the bank is the list of them.
 *
 * This used to read the parts out of reading-skill-splits.json instead.
 * The two lists were identical, so it passed, and the day splits were
 * recorded for thirteen lessons that have no word bank it demanded
 * nineteen ladders -- including one for the possessive 's and one for
 * soft c, neither of which is a chain of one-sound changes. Splits say
 * what a lesson teaches. Banks say what there are words for.
 */
const expected = [];
for (const r of SK) {
  expected.push(r[0]);
  for (const k of Object.keys(PART_WORDS)) if (!k.startsWith("_") && k.split("|")[0] === r[0] && k.includes("|")) expected.push(k);
}
for (const key of expected) if (!LAD[key]) problems.push(`${key}: no ladder`);
for (const [key, v] of Object.entries(LAD)) {
  const sid = key.split("|")[0];
  const p = pos[sid];
  const say = (m) => problems.push(`${key}: ${m}`);
  if (p === undefined) { say("unknown skill"); continue; }
  if (!Array.isArray(v.words) || !Array.isArray(v.clues)) { say("malformed"); continue; }
  if (v.words.length !== v.clues.length + 1) say("clue count does not match word count");
  if (v.words[0] !== v.start) say("start does not match the first word");
  if (new Set(v.words).size !== v.words.length) say("a word appears twice");
  if (v.words.length < 5) say("shorter than five words");
  const legal = [...UNIVERSE].filter((w) => legalAt(w, p, sid));
  for (const w of v.words) {
    rungs++;
    if (!isWord(w)) say(`"${w}" is not a word`);
    if (NOTFORKIDS.test(w)) say(`"${w}" is not for children`);
    if (NOTAWORD.has(String(w).toLowerCase())) {
      say(`"${w}" is not a word a child should be given as the answer`);
    }
    if (!legalAt(w, p, sid)) say(`"${w}" uses something taught later`);
    const soon = heartTooSoon(w, sid);
    if (soon !== null) say(`"${w}" is a Level ${soon} heart word, taught after this lesson`);
  }
  for (let i = 0; i < v.clues.length; i++) {
    const a = v.words[i], b = v.words[i + 1], c = v.clues[i];
    if (!describes(a, b, c)) say(`clue ${i + 1} ("${c}") does not turn ${a} into ${b}`);
    const other = legal.filter((x) => x !== a && x !== b && describes(a, x, c));
    if (other.length) say(`clue ${i + 1} ("${c}") also gives ${other.join(", ")}`);
  }
}

/*
 * What the page tells a child.
 *
 * These verdicts come from the same judgeRung the ladder page calls, so
 * the rule itself is under test rather than a description of it. The
 * split that earns its keep is "near" against "far": a child who changed
 * one sound and picked the wrong one has the method and missed the
 * target; a child who wrote a different word altogether has not
 * manipulated anything. Those are different lessons tomorrow.
 */
const VERDICTS = [
  // prev,   want,   clue,                                typed,    expected
  ["set",    "sat",  "Change the e to a.",                "sat",    "right"],
  ["set",    "sat",  "Change the e to a.",                "  SAT ", "right"],
  ["set",    "sat",  "Change the e to a.",                "",       "empty"],
  ["set",    "sat",  "Change the e to a.",                "set",    "same"],
  // One sound changed, wrong one. The method is there.
  ["set",    "sat",  "Change the e to a.",                "sit",    "near"],
  ["set",    "sat",  "Change the e to a.",                "bet",    "near"],
  ["set",    "sat",  "Change the e to a.",                "sea",    "near"],
  // A different word altogether. The method is not there.
  ["set",    "sat",  "Change the e to a.",                "dog",    "far"],
  ["set",    "sat",  "Change the e to a.",                "mat",    "far"],
  // Insertions and deletions count as one edit.
  ["sad",    "said", "Put an i between the a and the d.", "said",   "right"],
  ["sad",    "said", "Put an i between the a and the d.", "sand",   "near"],
  ["snail",  "nail", "Take off the s.",                   "nail",   "right"],
  ["snail",  "nail", "Take off the s.",                   "snai",   "near"],
  // "tail" is two edits from "snail" -- drop the s AND change n to t --
  // so it is far, not near. Worth keeping as the case that says what one
  // edit actually means.
  ["snail",  "nail", "Take off the s.",                   "tail",   "far"],
  ["snail",  "nail", "Take off the s.",                   "sail",   "near"],
  ["snail",  "nail", "Take off the s.",                   "rain",   "far"],
  ["pin",    "pine", "Add a silent e.",                   "pine",   "right"],
  ["pin",    "pine", "Add a silent e.",                   "pint",   "near"],
  ["pine",   "pin",  "Take off the silent e.",            "pin",    "right"],
];

for (const [prev, want, clue, typed, want_v] of VERDICTS) {
  const got = judgeRung(prev, want, clue, typed);
  if (got !== want_v)
    problems.push(`judgeRung("${prev}","${want}","${clue}","${typed}") = ${got}, expected ${want_v}`);
}

/*
 * Every clue admits exactly one string.
 *
 * This is not a nicety: a verdict of the form "you followed the
 * instruction but that is not a word" was written here and then taken out
 * again, because across all 1,089 clues there is no string other than the
 * answer that satisfies any of them. Anything that follows the
 * instruction already is the answer. Asserting it keeps that branch from
 * coming back on the strength of an assumption, and would catch a new
 * clue form loose enough to allow two readings.
 */
const ALPHA = "abcdefghijklmnopqrstuvwxyz".split("");
let clueCount = 0;
for (const [key, v] of Object.entries(LAD)) {
  for (let i = 0; i < v.clues.length; i++) {
    const a = v.words[i], want = v.words[i + 1], c = v.clues[i];
    clueCount++;
    const cand = new Set();
    for (let q = 0; q < a.length; q++) {
      for (const ch of ALPHA) cand.add(a.slice(0, q) + ch + a.slice(q + 1));
      cand.add(a.slice(0, q) + a.slice(q + 1));
    }
    for (let q = 0; q <= a.length; q++) for (const ch of ALPHA) cand.add(a.slice(0, q) + ch + a.slice(q));
    // A clue may name a grapheme rather than a single letter -- "Change the
    // ea to oa.", "Put an r between the f and the ee." -- so one-character
    // edits no longer span everything a clue can reach. Whatever a grapheme
    // clue produces is built out of the pieces the clue itself names, so
    // take every word in the clue as material and lay it over every span of
    // up to four letters. Without this the proof below would be making a
    // claim about letters while the clues talk about teams.
    const parts = c.toLowerCase().match(/[a-z]+/g) || [];
    for (let q = 0; q <= a.length; q++)
      for (let g = 0; g <= 4 && q + g <= a.length; g++) {
        cand.add(a.slice(0, q) + a.slice(q + g));
        for (const t of parts) cand.add(a.slice(0, q) + t + a.slice(q + g));
      }
    for (const x of cand) {
      if (x !== want && describes(a, x, c))
        problems.push(`${key}: rung ${i + 1} ("${c}") is satisfied by "${x}" as well as "${want}"`);
    }
  }
}

/*
 * And the near/far split has to be reachable on real ladders, or it is
 * decoration. For every rung, how many of the one-edit neighbours of the
 * rung above are judged "near"?
 */
let nearReachable = 0;
for (const v of Object.values(LAD)) {
  for (let i = 0; i < v.clues.length; i++) {
    const a = v.words[i], want = v.words[i + 1], c = v.clues[i];
    const neigh = new Set();
    for (let q = 0; q < a.length; q++) {
      for (const ch of ALPHA) neigh.add(a.slice(0, q) + ch + a.slice(q + 1));
      neigh.add(a.slice(0, q) + a.slice(q + 1));
    }
    for (const x of neigh) if (judgeRung(a, want, c, x) === "near") nearReachable++;
  }
}
if (nearReachable === 0) problems.push('the "near" verdict never fires on any rung -- it is decoration');

console.log(`verdicts: ${VERDICTS.length} checked; ${clueCount.toLocaleString()} clues each admit exactly one string; "near" reachable on ${nearReachable.toLocaleString()} near-misses.`);
console.log(`${Object.keys(LAD).length} ladders, ${rungs} rungs, across ${expected.length} lessons and parts.`);
console.log(`problems: ${problems.length}`);
problems.slice(0, 40).forEach((x) => console.log("  " + x));
if (problems.length) {
  console.error("\n✗ fix these before the batch ships.");
  process.exit(1);
}
console.log("✅ every rung is a real word a child can decode, and every clue has one answer");
