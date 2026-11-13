/**
 * Are the decodable passages decodable, and are they actually different?
 *
 * Two questions, because the page had two problems. Every lesson showed one
 * passage at one reading level, and 212 lesson choices shared 59 passages
 * between them — the three vowel-team lessons and all their parts read the
 * same story about a goat and a boat.
 *
 * So each concept now has its own story, written at three levels, and this
 * checks both halves of that:
 *
 *   1. Decodability. A second-grade passage may use only what the sequence
 *      has taught by its own lesson, plus heart words. Third and fourth
 *      grade relax that — a fourth grader reviewing short a has been taught
 *      digraphs, and a passage that pretends otherwise is unreadable rather
 *      than careful — but they still may not run past where the programme
 *      has got to by the end of Level 2 and Level 3 respectively.
 *   2. Difference. No two concepts may share a title or an opening line,
 *      and the three levels of one concept must differ from each other.
 *
 * It also checks the shape: every passage has a title, paragraphs, three
 * questions with answers, and a writing task of a type that grade is
 * expected to write.
 *
 *   bun run scripts/check-passages.mjs
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

const PASS = JSON.parse(readFileSync("scripts/reading-passages.json", "utf8"));

/**
 * What each grade may read.
 *
 * Second grade is pinned to its own lesson. Third and fourth are given a
 * floor: wherever the lesson sits, a third grader may use anything taught
 * by the end of Level 2 and a fourth grader anything taught by the end of
 * Level 3. Without that floor a fourth-grade passage on short a could not
 * contain the word "she", which is absurd.
 */
const lastOf = (prefix) => {
  let best = -1;
  SK.forEach((r, n) => { if (String(r[2]) === prefix) best = Math.max(best, n); });
  return best;
};
const FLOOR = { g2: -1, g3: lastOf("Level 2"), g4: lastOf("Level 3") };
const GRADE_NAME = { g2: "2nd", g3: "3rd", g4: "4th" };
// The three kinds of writing these grades are taught, and the formats they
// practise them through.
const WRITE_TYPES = new Set(["Opinion", "Informative", "Narrative"]);

const problems = [];
const seenTitle = new Map();
const seenOpen = new Map();
let nPass = 0, nWords = 0;

for (const [cid, byGrade] of Object.entries(PASS.passages || {})) {
  const p = pos[cid];
  const say = (m) => problems.push(`${cid}: ${m}`);
  if (p === undefined) { say("unknown concept"); continue; }
  const texts = [];
  for (const g of ["g2", "g3", "g4"]) {
    const v = byGrade[g];
    if (!v) { say(`no ${GRADE_NAME[g]} grade passage`); continue; }
    nPass++;
    const where = `${cid} ${GRADE_NAME[g]}`;
    const sayg = (m) => problems.push(`${where}: ${m}`);
    if (!v.title) sayg("no title");
    if (!Array.isArray(v.paras) || v.paras.length < 2) sayg("fewer than two paragraphs");
    if (!Array.isArray(v.qs) || v.qs.length !== 3) sayg("needs exactly three questions");
    (v.qs || []).forEach((qa, i) => {
      if (!Array.isArray(qa) || qa.length !== 2 || !qa[0] || !qa[1])
        sayg(`question ${i + 1} has no question or no answer`);
    });
    if (!v.write || !WRITE_TYPES.has(v.write.type))
      sayg("writing task must be Opinion, Informative or Narrative");
    if (v.write && !v.write.task) sayg("writing task has no instruction");

    const body = (v.paras || []).join(" ");
    const words = body.split(/\s+/).filter(Boolean);
    nWords += words.length;
    const floor = Math.max(p, FLOOR[g]);
    const ahead = new Map();
    for (const w of words) {
      const lw = w.toLowerCase().replace(/[^a-z']/g, "").replace(/^'|'$/g, "");
      if (!lw || HEART.has(lw)) continue;
      // A contraction is read as its parts.
      if (/'/.test(lw) && isWord(lw)) continue;
      for (const [name, owner, test] of G) {
        if (cid === "og4-05" && /ue|ei|ew|ui/.test(name)) continue;
        if (pos[owner] > floor && test(lw)) ahead.set(lw, name);
      }
    }
    if (ahead.size) {
      const list = [...ahead].slice(0, 6).map(([w, n]) => `${w} (${n})`).join(", ");
      sayg(`${ahead.size} word${ahead.size === 1 ? "" : "s"} ahead of what it may use: ${list}`);
    }
    // Every question must be answerable from the passage: the answer has to
    // share real words with it, or a child is being asked to guess.
    (v.qs || []).forEach((qa, i) => {
      if (!Array.isArray(qa) || !qa[1]) return;
      // Three letters, not four: a decodable answer is made of words like
      // map, mud and pen, and a four-letter floor failed every one of them.
      const a = String(qa[1]).toLowerCase().split(/[^a-z']+/).filter((x) => x.length >= 3);
      const lower = body.toLowerCase();
      if (a.length && !a.some((x) => lower.includes(x)))
        sayg(`answer ${i + 1} uses no word from the passage`);
    });
    const t = String(v.title).trim().toLowerCase();
    const o = String((v.paras || [])[0] || "").trim().slice(0, 60).toLowerCase();
    if (seenTitle.has(t) && seenTitle.get(t) !== cid)
      say(`shares the title "${v.title}" with ${seenTitle.get(t)}`);
    seenTitle.set(t, cid);
    if (o && seenOpen.has(o) && seenOpen.get(o) !== cid)
      say(`opens the same way as ${seenOpen.get(o)}`);
    if (o) seenOpen.set(o, cid);
    texts.push(body);
  }
  if (texts.length === 3) {
    if (texts[0] === texts[1] || texts[1] === texts[2] || texts[0] === texts[2])
      say("two of its three levels are the same text");
  }
}

const concepts = Object.keys(PASS.passages || {}).length;
const total = SK.length;
console.log(`${nPass} passages across ${concepts} of ${total} concepts, ${nWords} words.`);
console.log(`problems: ${problems.length}`);
problems.slice(0, 40).forEach((x) => console.log("  " + x));
if (problems.length) { console.error("\n✗ fix these before the batch ships."); process.exit(1); }
console.log("✅ every passage is decodable for its grade, and no two concepts share a story");
