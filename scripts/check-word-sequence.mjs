/**
 * Does a lesson's words run ahead of the sequence it sits in?
 *
 * A structured literacy sequence only works if a child can decode what is
 * in front of them with what they have been taught. The word banks had
 * never been checked against their own position in that sequence, and mine
 * were the worst offenders: I put wax in the short-a lesson six lessons
 * before x, rock in the short-vowel lesson three before ck, and flu in the
 * open-syllable lesson seven before blends.
 *
 * Each grapheme is listed with the lesson that teaches it and a test that
 * it is really doing that job in the word, because the substring is not the
 * grapheme. ps is Greek only at the start — caps is a plural. aw before a
 * vowel is not the digraph — away is a-way. mn is silent at the edges of a
 * word, not in the middle of gymnast. The V/V lesson is exempt from the
 * vowel-team tests because adjacent vowels are the thing it teaches.
 *
 * Without those tests the check reported 89 hits and was useless. With them
 * it reported 43, of which 32 were real and are now fixed.
 *
 *   bun run scripts/check-word-sequence.mjs
 */
import { readFileSync } from "node:fs";
const B = "";  // run from the repo root, like the other checks
const R = B + "content-reading-materials/og-packs/";
global.window = global;
new Function(readFileSync(R + "og-concepts.js", "utf8"))();
new Function(readFileSync(R + "og-pack-data.js", "utf8"))();
const s = readFileSync(B + "content-reading-materials/science-of-reading/lesson-builder.html", "utf8");
const i = s.indexOf("const SK = [");
const SK = eval(s.slice(i + "const SK = ".length, s.indexOf("\n    ];", i) + "\n    ]".length)).map((r) => [r[0], r[1], r[2]]);
const COVER = { "1-01":1,"1-05":1,"1-07":1,"1-08":1,"1-09":1,"1-12":1,"2-01":1,"2-02":1,"2-03":1,"2-04":1,"2-05":1 };
global.OG_CONCEPTS.filter((c) => !COVER[c.id] && global.OG_PACKS[c.id]).forEach((c) => SK.push(["og" + c.id, c.name, "Level " + c.level]));
const SCOPE = { 'cvc-a':'1-01a','cvc-mix':'1-01b',dig:'1-05',floss:'1-07',vce:'1-08',blends:'1-09',vccv:'1-12a',vccvce:'1-12b','ng-nk':'2-01',y:'2-02','ck-tch':'2-03','ar-or':'2-04','ai-ay':'2-05a','ee-ea':'2-05b','oa-ow':'2-05c' };
SK.sort((a, b) => (SCOPE[a[0]] || a[0].slice(2)).localeCompare(SCOPE[b[0]] || b[0].slice(2)));
const pos = Object.fromEntries(SK.map((r, n) => [r[0], n]));

// A grapheme, where it is taught, and a test that it is really doing that
// job in the word — "ps" is Greek only at the start, "caps" is a plural.
const V = "aeiou";
const G = [
  ["x", "og1-06", (w) => /x/.test(w)],
  ["ck", "og1-04", (w) => /ck/.test(w)],
  ["sh", "dig", (w) => /sh/.test(w)],
  ["ch", "dig", (w) => /ch/.test(w)],
  ["th", "dig", (w) => /th/.test(w)],
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
  ["ue/ei/ew/eigh/ui", "og4-06", (w) => /(ue|ei|ew|eigh|ui)/.test(w) && !/q(ue|ui)/.test(w)],
  ["ph", "og5-01", (w) => /ph/.test(w)],
  ["rh/mn/pn/ps", "og5-03", (w) => /^(rh|pn|ps|mn)/.test(w) || /mn$/.test(w)],
  ["que", "og5-05", (w) => /que$/.test(w)],
  ["augh/ough", "og5-09", (w) => /(augh|ough)/.test(w)],
];
const HEART = new Set("the a is was of to what they said you your are were there their who does been come some one two here where would could should have give live love done my by i he she we me be go no so do into put push pull full very every from or for want water again any many friend".split(" "));
const X = JSON.parse(readFileSync(B + "scripts/reading-extra-words.json", "utf8"));
const out = [];
for (const [sid, v] of Object.entries(X)) {
  if (sid.startsWith("_") || !(sid in pos)) continue;
  const p = pos[sid];
  const scan = (w, where) => {
    const lw = String(w).toLowerCase().replace(/[^a-z']/g, "");
    if (!lw || HEART.has(lw)) return;
    for (const [name, owner, test] of G) {
      const gp = pos[owner];
      if (gp > p && test(lw) && !(sid === "og4-05" && /ue|ei|ew|ui/.test(name))) out.push({ p, sid, where, w: lw, name, gp, gs: SK[gp][1] });
    }
  };
  (v.real || []).forEach((w) => scan(w, "real"));
  Object.values(v.realfix || {}).forEach((w) => scan(w, "realfix"));
  (v.sent || []).forEach((q) => String(q).split(/\s+/).forEach((w) => scan(w, "sentence")));
}
out.sort((a, b) => a.p - b.p);
console.log("words using a grapheme taught later: " + out.length + "\n");
out.forEach((o) => console.log("  #" + String(o.p).padStart(2) + " " + o.sid.padEnd(8) + o.where.padEnd(9) + '"' + o.w + '"'.padEnd(12) + " uses " + o.name + " — taught at #" + o.gp + " " + o.gs));

if (out.length) {
  console.error("\n✗ fix these before the batch ships.");
  process.exit(1);
}
console.log("✅ every word is decodable with what has been taught by its lesson");
