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

const R = "content-reading-materials/og-packs/";
global.window = global;
new Function(readFileSync(R + "og-concepts.js", "utf8"))();
new Function(readFileSync(R + "og-pack-data.js", "utf8"))();
const s = readFileSync("content-reading-materials/science-of-reading/lesson-builder.html", "utf8");
const i = s.indexOf("const SK = [");
const SKF = eval(s.slice(i + "const SK = ".length, s.indexOf("\n    ];", i) + "\n    ]".length));
const SK = SKF.map((r) => [r[0], r[1], r[2], r[6] || []]);
const COVER = { "1-01":1,"1-05":1,"1-07":1,"1-08":1,"1-09":1,"1-12":1,"2-01":1,"2-02":1,"2-03":1,"2-04":1,"2-05":1 };
global.OG_CONCEPTS.filter((c) => !COVER[c.id] && global.OG_PACKS[c.id]).forEach((c) =>
  SK.push(["og" + c.id, c.name, "Level " + c.level, []]));
const SCOPE = { 'cvc-a':'1-01a','cvc-mix':'1-01b',dig:'1-05',floss:'1-07',vce:'1-08',blends:'1-09',vccv:'1-12a',vccvce:'1-12b','ng-nk':'2-01',y:'2-02','ck-tch':'2-03','ar-or':'2-04','ai-ay':'2-05a','ee-ea':'2-05b','oa-ow':'2-05c' };
SK.sort((a, b) => (SCOPE[a[0]] || a[0].slice(2)).localeCompare(SCOPE[b[0]] || b[0].slice(2)));
const pos = Object.fromEntries(SK.map((r, n) => [r[0], n]));
const SPLITS = JSON.parse(readFileSync("scripts/reading-skill-splits.json", "utf8"));
const LAD = JSON.parse(readFileSync("scripts/reading-word-ladders.json", "utf8")).ladders;

const DICT = readFileSync("/usr/share/dict/words", "utf8").split("\n").map((w) => w.trim());
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
  if (WORDS.has(x) || HEART.has(x)) return true;
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

/** Would this clue, read literally, turn `a` into `b`? */
function describes(a, b, c) {
  const pickIdx = (a, L, q) => {
    const idxs = [...a].map((ch, n) => (ch === L ? n : -1)).filter((n) => n >= 0);
    if (!q || idxs.length <= 1) return idxs;
    return q === "first " ? [idxs[0]] : q === "last " ? [idxs[idxs.length - 1]] : idxs.slice(1, -1);
  };
  let m;
  if ((m = c.match(/^Change the (first |last |middle )?(\w) to (\w)\.$/)))
    return pickIdx(a, m[2], m[1]).some((i) => a.slice(0, i) + m[3] + a.slice(i + 1) === b);
  if (c === "Add a silent e.") return b === a + "e";
  if (c === "Take off the silent e.") return a.endsWith("e") && b === a.slice(0, -1);
  if ((m = c.match(/^Add an? (\w) at the (start|end)\.$/)))
    return b === (m[2] === "start" ? m[1] + a : a + m[1]);
  if ((m = c.match(/^Put an? (\w) between the (\w) and the (\w)\.$/))) {
    for (let i = 1; i < a.length; i++)
      if (a[i - 1] === m[2] && a[i] === m[3] && a.slice(0, i) + m[1] + a.slice(i) === b) return true;
    return false;
  }
  if ((m = c.match(/^Take off the (first |last |middle )?(\w)\.$/)))
    return pickIdx(a, m[2], m[1]).some((i) => a.slice(0, i) + a.slice(i + 1) === b);
  if ((m = c.match(/^Keep .*?\. Change (\S+) to (\S+)\.$/))) return a !== b && b === a.replace(m[1], m[2]);
  if ((m = c.match(/^Change (\S+)- to (\S+)-\.$/))) return a.startsWith(m[1]) && b === m[2] + a.slice(m[1].length);
  if ((m = c.match(/^Change -(\S+) to -(\S+)\.$/))) return a.endsWith(m[1]) && b === a.slice(0, -m[1].length) + m[2];
  if ((m = c.match(/^Add the prefix (\S+)-\.$/))) return b === m[1] + a;
  if ((m = c.match(/^Take off the prefix (\S+)-\.$/))) return a.startsWith(m[1]) && b === a.slice(m[1].length);
  if ((m = c.match(/^Add -(\S+)\.$/))) return b === a + m[1];
  if ((m = c.match(/^Take off -(\S+)\.$/))) return a.endsWith(m[1]) && b === a.slice(0, -m[1].length);
  if ((m = c.match(/^Add (\S+) to the end\.$/))) return b === a + m[1];
  if ((m = c.match(/^Take (\S+) off the end\.$/))) return a.endsWith(m[1]) && b === a.slice(0, -m[1].length);
  if ((m = c.match(/^Put (\S+) in front of (\S+)\.$/))) return b === m[1] + a;
  if ((m = c.match(/^Take (\S+) off the front\.$/))) return a.startsWith(m[1]) && b === a.slice(m[1].length);
  return false;
}

// Every word any ladder uses, which is the set a clue could be answered
// from. Checking against the whole dictionary would fail honest clues over
// words no child will ever write; checking against this asks the real
// question — could a child working this page write something else down?
const UNIVERSE = new Set();
Object.values(LAD).forEach((v) => v.words.forEach((w) => UNIVERSE.add(String(w).toLowerCase())));

const problems = [];
let rungs = 0;
const expected = [];
for (const r of SK) {
  expected.push(r[0]);
  for (const sub of SPLITS[r[0]] || []) expected.push(r[0] + "|" + sub);
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

console.log(`${Object.keys(LAD).length} ladders, ${rungs} rungs, across ${expected.length} lessons and parts.`);
console.log(`problems: ${problems.length}`);
problems.slice(0, 40).forEach((x) => console.log("  " + x));
if (problems.length) {
  console.error("\n✗ fix these before the batch ships.");
  process.exit(1);
}
console.log("✅ every rung is a real word a child can decode, and every clue has one answer");
