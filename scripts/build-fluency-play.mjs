/**
 * The fluency practice set: lines worth performing, pulled from the articles.
 *
 * /fluency measures. It times a minute, works out words correct per minute
 * and accuracy, and asks the teacher to score how it sounded against the
 * NAEP scale, one to four. What it never did was give anybody a way to
 * practise the thing it scores. A child told they read "word by word" has
 * been told a fact about themselves and handed no way to change it.
 *
 * Expression is practised by rereading, and rereading is dull unless there
 * is a reason to do it again. A voice is a reason. A child will read one
 * sentence six times as a robot, a whisper and a sports announcer and think
 * they are messing about, and every pass is another repetition of the same
 * words -- which is what repeated reading is, and it is the best-evidenced
 * fluency intervention there is.
 *
 * So this picks the lines worth performing. Every one is verbatim from an
 * article, like everything else on this site, and carries the article it
 * came from so a teacher can put it back in context.
 *
 *   bun scripts/build-fluency-play.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const AR = JSON.parse(readFileSync("scripts/reading-articles.json", "utf8")).articles;

/** How many of each to keep per grade. Enough to never repeat in a term. */
const LINES_PER_GRADE = 60;
const STEMS_PER_GRADE = 40;

const splitSentences = (t) =>
  t.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
const wordCount = (s) => s.split(/\s+/).filter(Boolean).length;

/**
 * A sentence read on its own, out of its paragraph, has to stand up on its
 * own. One opening with a bare pronoun does not -- "It stood in Cleveland,
 * Ohio" is a fine sentence in place and a puzzle out of it -- so those sort
 * last rather than being thrown away, and only surface if a grade is thin.
 */
const WEAK_OPENER = /^(It|They|He|She|This|That|These|Those|Then|There)\b/;

/** Numbers, brackets and dashes read badly aloud at speed. */
const AWKWARD = /\d|\(|\)|—|"|"|"/;

/**
 * A sentence already shaped as a question cannot be read three ways. "How
 * many left." is a statement only on paper, and asking a child to perform it
 * as one teaches nothing.
 */
const ALREADY_ASKING = /^(How|What|Why|When|Where|Who|Which|Whose|Is|Are|Was|Were|Do|Does|Did|Can|Could|Will|Would|Should)\b/;

const lines = {};
const stems = {};

for (const a of AR) {
  // The lower Lexile, because a line being performed is not the place to
  // also be decoding. The point is the voice, not the vocabulary.
  for (const p of a.lower?.paras ?? []) {
    for (const s of splitSentences(p.text)) {
      if (AWKWARD.test(s) || !/[.]$/.test(s)) continue;
      const n = wordCount(s);
      const row = { text: s, words: n, article: a.title, id: a.id };

      if (n >= 6 && n <= 14) (lines[a.grade] ??= []).push(row);
      if (n >= 3 && n <= 6 && !ALREADY_ASKING.test(s)) (stems[a.grade] ??= []).push(row);
    }
  }
}

/**
 * Strongest openers first, then nearest to `ideal` words, then spread across
 * articles so one piece cannot own a grade.
 *
 * Sorting on raw length instead of distance from an ideal is what the first
 * run did, and it returned nothing but six-word sentences -- which leaves a
 * child performing "A baby dog is a puppy" with no phrase in it to phrase.
 */
function pick(rows, limit, ideal) {
  const sorted = [...rows].sort((a, b) => {
    const wa = WEAK_OPENER.test(a.text) ? 1 : 0;
    const wb = WEAK_OPENER.test(b.text) ? 1 : 0;
    return wa - wb || Math.abs(a.words - ideal) - Math.abs(b.words - ideal);
  });

  const perArticle = new Map();
  const out = [];
  for (const row of sorted) {
    const used = perArticle.get(row.id) ?? 0;
    if (used >= 2) continue;
    perArticle.set(row.id, used + 1);
    out.push(row);
    if (out.length >= limit) break;
  }
  return out;
}

const grades = [...new Set(AR.map((a) => a.grade))].sort((a, b) => a - b);
const outLines = {};
const outStems = {};
for (const g of grades) {
  // Long enough to have a phrase in it to perform; short enough to reread
  // six times without it becoming a chore.
  outLines[g] = pick(lines[g] ?? [], LINES_PER_GRADE, 11);
  outStems[g] = pick(stems[g] ?? [], STEMS_PER_GRADE, 5);
}

/**
 * The voices. Curated, because the whole point is that each one asks for a
 * different thing from the reader -- and `teaches` says which, so this is a
 * fluency routine with a costume on rather than a party game.
 */
const VOICES = [
  { key: "robot", name: "A robot", how: "Flat. Every. Word. The. Same.",
    teaches: "What phrasing does, by taking it away. Read it again as yourself straight after and the difference is the lesson." },
  { key: "whisper", name: "A whisper", how: "Quiet enough that somebody across the room leans in.",
    teaches: "Phrasing without volume. A whisper that still groups its words proves the phrasing is real and not just loudness." },
  { key: "announcer", name: "A sports announcer", how: "Loud and fast, like the last ten seconds of a game.",
    teaches: "Pace, and the nerve to push it. Speed collapses into mumbling unless the phrases hold." },
  { key: "secret", name: "Telling a secret", how: "Like you are telling one person something nobody else should hear.",
    teaches: "Leaning on the words that matter. A secret has to land, so the stress goes somewhere on purpose." },
  { key: "sleepy", name: "Just woke up", how: "Slow and heavy, one eye still shut.",
    teaches: "Holding a phrase together when it is slow. Slow is where word-by-word reading hides." },
  { key: "excited", name: "Very excited", how: "Like you just found out something brilliant.",
    teaches: "Pitch moving across a sentence instead of sitting flat." },
  { key: "news", name: "A newsreader", how: "Clear and even. This is the six o'clock news.",
    teaches: "The neutral expert read. This one is the target, which is why it comes after the silly ones." },
  { key: "grumpy", name: "Grumpy", how: "Like somebody made you read it.",
    teaches: "That tone is a choice. The words did not change; the feeling did." },
  { key: "giant", name: "A giant", how: "Low and enormous. The floor shakes.",
    teaches: "Breath and volume across a whole phrase rather than one word at a time." },
  { key: "mouse", name: "A tiny mouse", how: "High and quick and small.",
    teaches: "Speed and clarity together. Fast and tiny still has to be understood." },
  { key: "scared", name: "A bit scared", how: "Like something is behind the door.",
    teaches: "Pausing for meaning. Fear puts the breaks in different places, and the child chooses where." },
  { key: "bored", name: "Completely bored", how: "Like this is the dullest sentence ever written.",
    teaches: "The opposite of expression, named out loud. Children recognise this voice, which is why it is worth making fun of." },
];

/** The three ways to end a sentence, and what each asks the voice to do. */
const PUNCTUATION = [
  { mark: ".", name: "Telling", how: "Your voice goes down at the end. You are stating it." },
  { mark: "?", name: "Asking", how: "Your voice goes up at the end. You want an answer." },
  { mark: "!", name: "Meaning it", how: "Louder and sharper. You are surprised, or you are certain." },
];

const data = {
  _note:
    "Built by scripts/build-fluency-play.mjs from the 350 articles. Every line " +
    "is verbatim from one. Do not hand-edit -- change the script and rebuild.",
  source: "scripts/reading-articles.json",
  voices: VOICES,
  punctuation: PUNCTUATION,
  lines: outLines,
  stems: outStems,
};

writeFileSync("scripts/reading-fluency-play.json", JSON.stringify(data, null, 1) + "\n");

const gradeName = (g) => (g === 0 ? "K" : g === 1 ? "1st" : g === 2 ? "2nd" : g === 3 ? "3rd" : `${g}th`);
console.log("wrote scripts/reading-fluency-play.json");
console.log(`  voices:      ${VOICES.length}`);
console.log(`  lines:       ${Object.values(outLines).reduce((s, v) => s + v.length, 0)}`);
console.log(`  stems:       ${Object.values(outStems).reduce((s, v) => s + v.length, 0)}`);
console.log("  per grade:  ", grades.map((g) => `${gradeName(g)} ${outLines[g].length}/${outStems[g].length}`).join("  "));

const thin = grades.filter((g) => outLines[g].length < 20 || outStems[g].length < 12);
if (thin.length) {
  console.log(`\n  thin grades (lines/stems): ${thin.map(gradeName).join(", ")}`);
  console.log("  these grades' articles are short, which is correct for them -- not a fault to pad over.");
}
