/**
 * Five days of quick daily practice for every lesson, across the five mClass
 * measures a child is actually scored on.
 *
 * WHAT THE DATA CHAT ASKS FOR. It reports six numbers -- reading fluency,
 * reading accuracy, letter sounds, whole made-up words, word reading and the
 * maze -- and then leaves a child with a goal and nothing to do about it. This
 * is the something to do: five minutes a day, five days, on all five, built
 * from the concept the lesson is teaching rather than from a generic list.
 *
 * A DAY IS A PAGE. Five pages, one for each day, and everything on a page
 * is that day's: the passage, six real words and four made-up ones, three
 * maze sentences, and the word race. A child sits down with one sheet.
 *
 * WHY THE PASSAGE IS THE SAME ALL WEEK and the words are not. Repeated reading
 * of one passage is the thing that moves fluency and accuracy -- the child
 * reads it Monday, and again Friday, and the numbers in the margin show the
 * change. Word reading and letter sounds work the other way: reading the same
 * ten words five times measures memory, so those are different every day. The
 * maze shifts its blanks each day over the same text, which keeps the reading
 * honest without changing what is being read.
 *
 * WHERE EACH PART COMES FROM
 *   ORF and accuracy  the lesson's own passage, the grade 3 telling, which
 *                     is the one still being read when the minute is up
 *   word reading      the lesson's real words, plus heart words up to its level
 *   letter sounds     the lesson's made-up words, topped up from the continuum
 *                     pools for its level -- eight per lesson is not five days
 *   maze              three sentences a day, a different three and a
 *                     different blank in them: from the printed passage up
 *                     to Level 2, and from g3, the same story told for a
 *                     stronger reader, from Level 3 -- so the answer is not
 *                     sitting on the page above the question
 *   word race         the lesson's own words again, one list for the whole
 *                     week, so Monday's count and Friday's can be compared
 *
 *   bun run scripts/build-daily-practice.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { CONCEPTS } from "./lib/continuum-pools.mjs";
import { mazeTokens } from "./lib/maze.mjs";
import { LEVEL_SKILLS, EXTRA_CLOSED } from "./lib/nwf-pools.mjs";
import { unsafeRealWord } from "./lib/not-nonsense.mjs";

const SEQ = JSON.parse(readFileSync("scripts/reading-sequence.json", "utf8")).sequence;
// Read for the multisyllabic variant of the word rows only. It is NOT a
// source for the word race: this bank is generated against spelling patterns
// out of a dictionary, and a race drawn from it asks a child to read limn.
const MULTI = JSON.parse(readFileSync("scripts/reading-multisyllabic.json", "utf8")).words;
const PASS = JSON.parse(readFileSync("scripts/reading-passages.json", "utf8")).passages;
const HEART = JSON.parse(readFileSync("scripts/reading-heart-words.json", "utf8")).words;

const DAYS = 5;
const WRF_PER_DAY = 6;
const NWF_PER_DAY = 4;
const MAZE_SENTENCES = 3;
// A minute of reading down a list, at roughly a word a second, and then some.
// The sheet must not run out before the clock does or the score stops being a
// speed, and a fluent Grade 3 reader passes sixty words on a word list.
//
// Nineteen rows of six, which is what fills the sheet: at twelve rows the
// page stopped two thirds of the way down and the score boxes sat in the
// middle of it. One lesson -- short a, the first in the sequence, with
// nothing behind it to review -- has about a hundred words to draw on and
// prints what it has.
const RACE_WORDS = 114;

/** Same seed, same week. A sheet printed on Sunday has to match the key on Friday. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(list, seed) {
  const out = [...list];
  const rand = rng(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Every distinct word of a passage that a race could ask for.
 *
 * Only the ones written in lower case. A capitalised word is either a name --
 * Jane, Nat, Mia -- or the first word of a sentence, and a race list is no
 * place for either: "jane" is not a word a child should be asked to read off
 * a list, and lower-casing a name to put it there is worse. Sentence-initial
 * words are lost along with the names, but almost all of them turn up
 * somewhere else in the passage in lower case anyway.
 */
function passageWords(text) {
  return [...new Set(
    text.paras
      .join(" ")
      .split(/\s+/)
      .filter((w) => /^[a-z]/.test(w))
      .map((w) => w.toLowerCase().replace(/[^a-z']/g, "")),
  )].filter((w) => w.length > 1);
}

/** The continuum's real words for a reading level, already signed off. */
function continuumReals(level) {
  const ids = LEVEL_SKILLS[Math.min(5, Math.max(1, level))] || [];
  return ids.flatMap((id) => {
    const c = CONCEPTS.find((x) => x.id === id);
    return c && c.kind === "words" ? c.real : [];
  });
}

/** The continuum's made-up words for a reading level, already signed off. */
function continuumFakes(level) {
  const ids = LEVEL_SKILLS[Math.min(5, Math.max(1, level))] || [];
  return ids.flatMap((id) => {
    const c = CONCEPTS.find((x) => x.id === id);
    return c && c.kind === "words" ? c.fake : [];
  });
}

/** The passage as sentences, terminal punctuation and closing quote kept. */
/**
 * EVERY WORD THIS SEQUENCE EVER PUTS IN FRONT OF A CHILD.
 *
 * Built once, and used only to check the answer to a spoken question: take
 * /s/ off "stop" and the child says "top", so "top" has to be a word the
 * sequence itself uses. The web2 list would also accept lam, lack and rax,
 * which are words in a dictionary and not words in a Year 2 classroom.
 */
const SAFE = (() => {
  const all = new Set();
  const add = (w) => {
    const x = String(w).toLowerCase();
    if (/^[a-z]+$/.test(x) && x.length >= 2 && !unsafeRealWord(x)) all.add(x);
  };
  for (const l of SEQ) (l.words || []).forEach(add);
  for (const k of Object.keys(PASS)) {
    for (const g of ["g2", "g3", "g4"]) {
      const t = PASS[k] && PASS[k][g];
      if (t) passageWords(t).forEach(add);
    }
  }
  for (const c of CONCEPTS) (c.real || []).forEach(add);
  for (const h of HEART) add(h.word);
  return all;
})();

/*
 * EVERY ITEM IS PROVED IN SOUNDS, NOT IN LETTERS.
 *
 * This drill is spoken. A teacher says "take /s/ off 'stop'" and a child
 * answers out loud, so an item is true or false about SOUNDS -- and a
 * generator working from spelling gets it wrong in ways that are not obvious
 * until you read the output. Letters say that "she" without /s/ is "he",
 * that "bone" with /n/ for /b/ is "none", that "find" without /d/ is "fin",
 * that "love" and "move" rhyme, that "ask" without /k/ is "as", and that
 * "season" is "sea" plus "son". Every one of those is wrong out loud, and a
 * teacher reading them off a card has to mark a right answer wrong.
 *
 * So the spelling rules below only pick candidates, which is all they are
 * good for. The proof is the pronouncing dictionary: take the first phoneme
 * off the word and what is left has to BE the phonemes of the answer, every
 * sound, in order. Anything that cannot be proved that way is not printed.
 */
const SOUNDS = JSON.parse(readFileSync("scripts/lib/pa-sounds.json", "utf8")).words;
const say = (w) => (SOUNDS[w] ? SOUNDS[w].split(" ") : null);
const same = (a, b) => a && b && a.length === b.length && a.every((x, i) => x === b[i]);

/**
 * What to call a sound on a card a teacher reads out.
 *
 * Taken from the phoneme rather than from the spelling, so the label and the
 * thing being proved cannot drift apart: the c in "cake" is named /k/, which
 * is what it says.
 */
const LETTER = {
  B: "b", D: "d", F: "f", G: "g", HH: "h", JH: "j", K: "k", L: "l", M: "m",
  N: "n", P: "p", R: "r", S: "s", T: "t", V: "v", Z: "z", W: "w", Y: "y",
  CH: "ch", SH: "sh", TH: "th", DH: "th", NG: "ng", ZH: "zh",
};
/** The consonants a child can hold on its own, at the edge of a word. */
const NAMEABLE = new Set(Object.keys(LETTER));

/**
 * A minute of phonemic awareness, scripted, with the answer written down.
 *
 * Kilpatrick one-minute drills are named for Well Below and Below on the
 * grade-level plan's own decision chart, and nothing in the packet did
 * phonemic awareness at all. It is aural -- no letters, no text, the child
 * only listens and answers -- so what prints is a teacher's card, not a
 * child's page.
 *
 * The lesson's own words come first and the rest of the sequence tops the
 * drills up, because the shape each drill needs is rare: a word whose last
 * sound can come off and leave another word is not something every lesson
 * has. Where even that cannot fill six, the drill prints short.
 */
function paItems(ownWords, levelWords, multiWords, seed) {
  const pool = [...new Set([...ownWords, ...levelWords])].filter((w) => SAFE.has(w));
  const rest = [...SAFE].filter((w) => !pool.includes(w));
  const mix = [...shuffled(pool, seed), ...shuffled(rest, seed + 7)];

  // Five a drill, twenty in all. Twenty-four ran the card 136px past a page,
  // and a minute does not hold twenty-four questions asked and answered out
  // loud: at four seconds each, twenty is already brisk.
  const drop = [];
  const chop = [];
  const swap = [];
  for (const w of mix) {
    const p = say(w);
    if (!p || p.length < 3) continue;

    // Take the first sound off. "stop" without /s/ is "top".
    if (drop.length < 5 && NAMEABLE.has(p[0])) {
      const tail = p.slice(1);
      const answer = mix.find((x) => x !== w && SAFE.has(x) && same(say(x), tail));
      if (answer) drop.push([w, LETTER[p[0]], answer]);
    }

    // Take the last sound off. "cart" without /t/ is "car".
    if (chop.length < 5 && NAMEABLE.has(p[p.length - 1])) {
      const head = p.slice(0, -1);
      const answer = mix.find((x) => x !== w && SAFE.has(x) && same(say(x), head));
      if (answer) chop.push([w, LETTER[p[p.length - 1]], answer]);
    }

    // Change the first sound. "cake" with /l/ for /k/ is "lake".
    if (swap.length < 5 && NAMEABLE.has(p[0])) {
      const tail = p.slice(1);
      const answer = mix.find((x) => {
        if (x === w || !SAFE.has(x)) return false;
        const q = say(x);
        return q && q.length === p.length && q[0] !== p[0] && NAMEABLE.has(q[0]) && same(q.slice(1), tail);
      });
      if (answer) swap.push([w, LETTER[p[0]], LETTER[say(answer)[0]], answer]);
    }
    if (drop.length >= 5 && chop.length >= 5 && swap.length >= 5) break;
  }

  // Take a whole syllable off. "sunshine" without "sun" is "shine".
  //
  // Proved the same way: the sounds of the two halves, run together, have to
  // be the sounds of the whole word. That is what rules out "season" as "sea"
  // plus "son" and "bitten" as "bit" plus "ten" -- both of them split cleanly
  // on paper and neither of them survives being said.
  const syll = [];
  for (const w of shuffled([...new Set(multiWords)], seed + 3)) {
    if (syll.length >= 5) break;
    const p = say(w);
    if (!p) continue;
    for (let i = 2; i <= w.length - 2; i++) {
      const a = w.slice(0, i);
      const b = w.slice(i);
      if (!SAFE.has(a) || !SAFE.has(b)) continue;
      const pa = say(a);
      const pb = say(b);
      if (!pa || !pb) continue;
      if (!same([...pa, ...pb], p)) continue;
      syll.push([w, a, b]);
      break;
    }
  }

  return { drop, chop, swap, syll };
}

/**
 * The passage cut into phrases, so there is a rung between a word list and a
 * whole page of text.
 *
 * PLL's fluency sheet climbs words, then three-word phrases, then longer
 * ones, then sentences. The packet jumped from the word race straight to the
 * passage, and phrasing is the thing that moves oral reading rate once the
 * words themselves are accurate -- which is the first measure the grade-level
 * plan circles.
 *
 * Cut from the lesson's own passage rather than written fresh, so every
 * phrase is made of words the child reads on the page above and the practice
 * transfers to the text it came from.
 */
const CHUNK_AT = new Set([
  "in", "on", "at", "to", "into", "onto", "from", "with", "without", "by", "for",
  "of", "over", "under", "behind", "through", "across", "around", "after",
  "before", "near", "past", "up", "down", "out", "and", "but", "so", "or",
  "because", "while", "until", "when", "if", "that", "which", "than", "as",
]);

function phrasesFrom(all) {
  const short = [];
  const long = [];
  for (const sentence of all) {
    const words = sentence.replace(/[“”"]/g, "").split(/\s+/).filter(Boolean);
    let run = [];
    const flush = () => {
      if (!run.length) return;
      const text = run.join(" ").replace(/^[,;:]+|[,;:]+$/g, "").trim();
      const n = run.length;
      const clean = text.replace(/[.!?]+$/, "").trim();
      // One word is not a phrase, and seven is a sentence with the end cut
      // off. Anything with a number or a stray bracket in it is left alone.
      if (n === 3 && clean.length > 5) short.push(clean);
      else if (n >= 4 && n <= 6) long.push(clean);
      run = [];
    };
    for (const w of words) {
      const bare = w.toLowerCase().replace(/[^a-z']/g, "");
      if ((CHUNK_AT.has(bare) && run.length) || /[,;:]$/.test(run[run.length - 1] || "")) flush();
      run.push(w);
    }
    flush();
  }
  const tidy = (list) => [...new Set(list.map((x) => x.replace(/\s+/g, " ").trim()))]
    .filter((x) => /^[A-Za-z]/.test(x) && !/[0-9()[\]]/.test(x));
  return { short: tidy(short), long: tidy(long) };
}

function sentences(text) {
  const m = String(text).match(/[^.!?]+[.!?]+[\u201d"']*/g);
  return (m || [String(text)]).map((x) => x.trim()).filter(Boolean);
}

/**
 * The sentences long enough to hold a maze item.
 *
 * "Nat is a cat." has one word that can be blanked and two of the three
 * choices read as English, so an item built on it is a coin toss. Longer
 * sentences carry enough around the gap for sense to decide it. The
 * threshold slides because six passages have no sentence of eight words --
 * better a short sentence than a day with no maze.
 */
function mazeable(all) {
  // Long enough to decide on, short enough to be an item. g3 writes
  // thirty-word sentences -- "She built the platform herself over two
  // summers, and she [photographs / yellow / window] the sky from it on every
  // clear night she can manage, which in this country is not many" -- which
  // is a passage with a gap in it, not a quick maze. Both bounds slide,
  // because some passages have nothing else.
  for (const most of [22, Infinity]) {
    for (const least of [8, 7, 6]) {
      const keep = all.filter((x) => {
        const n = x.split(/\s+/).length;
        return n >= least && n <= most;
      });
      if (keep.length >= MAZE_SENTENCES) return keep;
    }
  }
  return all;
}

/**
 * One blank in one sentence, as a word index rather than a token list.
 *
 * The gap sits about a third of the way in, so there is something before it
 * to set the sense and something after it to confirm the choice. `shift`
 * moves it further along, which is what a passage with six usable sentences
 * needs: the week comes round to that sentence twice and the second pass has
 * to ask a different question.
 *
 * Returned compactly -- the sentence, which word is missing, and the three
 * choices -- rather than as one object per word. Both the practice page and
 * every lesson packet carry this data inline, and a token list per word made
 * the file eight times the size for nothing: a renderer can split a sentence
 * on spaces.
 *
 * Returns null when no word in the sentence can be blanked -- a capital, a
 * two letter word and a full stop leave nothing to ask about -- and the
 * caller moves on to the next sentence.
 */
function oneBlank(sentence, seed, avoid, shift) {
  const words = sentence.split(/\s+/);
  const base = Math.max(1, Math.floor(words.length / 3));
  // The shift wraps rather than grows. A passage of four usable sentences
  // comes round three times in a week, and a shift that kept adding simply
  // ran off the end of a short sentence and fell back to the same word it
  // asked about on Monday -- which is how this read before the wrap: five
  // days of "The map was [for / she / most] a run up to see Nan."
  const span = Math.max(1, words.length - 2);
  for (const lead of [1 + ((base + shift * 2) % span), base, 1]) {
    if (lead >= words.length - 1) continue;
    const tokens = mazeTokens(sentence, { lead, every: 1, max: 1, seed, avoid });
    const at = tokens.findIndex((t) => t.kind === "blank");
    if (at === -1) continue;
    const b = tokens[at];
    return { s: sentence, at, before: b.before, after: b.after, choices: b.choices, answer: b.answer };
  }
  return null;
}

const out = [];
const short = [];
const noMaze = [];
/** Every word taught so far, in sequence order, for the race to reach back into. */
const taught = [];
/** Every multisyllabic word so far, real and made-up, for the same reason. */
const taughtFakes = [];
const taughtMulti = [];
const noMulti = [];

for (const lesson of SEQ) {
  const p = PASS[lesson.key];
  const bank = MULTI[lesson.key] || {};
  const taughtHere = [
    ...(lesson.words || []),
    ...(PASS[lesson.key]?.g2 ? passageWords(PASS[lesson.key].g2) : []),
  ];
  const fakesHere = bank.fake || [];
  // Added after this lesson is built, never before: a race may reach back
  // through what has been taught, and this lesson is not behind itself.
  const remember = () => {
    taught.push(...taughtHere);
    taughtFakes.push(...fakesHere);
    taughtMulti.push(...(bank.real || []));
  };
  if (!p) { remember(); continue; }
  /*
   * THE READ-ALOUD IS THE LONGER TELLING, and the maze is cut from the
   * shorter one.
   *
   * A minute of reading needs more than a minute of words on the page. The
   * grade 2 telling runs 61 to 101 words and only two of the sixty-eight
   * reach a hundred, so a child who can read gets to the end and stops being
   * measured; g3 runs 110 to 164 and every one of them clears it.
   *
   * That also frees the maze. It used to be cut from whichever telling was
   * not printed -- g2 up to Level 2, where the sentences sat on the same page
   * as the passage and the answer could be read off it, and g3 above, which
   * was harder than the lesson itself. The printed passage is g3 now and the
   * maze is always g2: never on the page, and never ahead of the reader.
   */
  const text = p.g3 || p.g2 || p.g4;
  // remember() before every continue, not just the first: a lesson this
  // builder skips is still a lesson a child has been taught, and a later
  // race reaches back through all of them.
  if (!text) { remember(); continue; }
  const mazeSource = p.g2 && p.g2 !== text ? p.g2 : text;

  const level = lesson.level || 1;
  const seed = 9000 + SEQ.indexOf(lesson) * 31;

  // Real words: the lesson's own, then its single-syllable bank, then the
  // heart words taught up to this level -- the irregular ones no amount of
  // sounding out will crack, which is exactly why they need the repetition.
  const heart = HEART.filter((h) => h.level <= level).map((h) => h.word);
  // A capitalised word with an apostrophe in it is somebody's name with a
  // possessive on the end -- Sam's, Ben's, Kim's -- which the possessive
  // lesson teaches and a speed list has no use for. "I" and "August" are
  // capitals that are simply words, and they stay.
  const word = (w) =>
    /^[a-z']+$/i.test(w) && !unsafeRealWord(w) && !(/^[A-Z]/.test(w) && w.includes("'"));

  // WHERE A RACE WORD MAY COME FROM. Four sources, each of them already
  // vetted for children: the lesson's own ten words, the heart words taught
  // by this level, the continuum pools for this level -- the same hand-picked
  // real words the thirty-a-day sheets draw on -- and the words of the
  // passage the child reads at the top of every day page.
  //
  // NOT the generated single-syllable bank, which the first version of this
  // used and which put limn, quay and ness on a Silent e race. That bank
  // exists to be matched against a spelling pattern and is built out of a
  // dictionary; it is the right source for "does this word have a vce
  // syllable" and the wrong one for "read this out loud as fast as you can".
  const ownWords = [...new Set([...(lesson.words || []), ...passageWords(text)])].filter(word);
  const levelWords = continuumReals(level).filter(word);
  // What has already been taught, most recent first, so a race backfills with
  // the lesson before this one rather than with the first week of September.
  const reviewWords = [...new Set([...taught].reverse())]
    .filter(word)
    .filter((w) => !ownWords.includes(w));
  const realPool = [...new Set([...ownWords, ...heart])].filter(word);

  // Made-up words come ONLY from the signed-off pools, never from the
  // multisyllabic bank's own made-up list.
  //
  // That bank's words are deliberately near-real -- sumshine, cutcake,
  // oupside -- because they exist to be told apart from sunshine, cupcake and
  // outside in a different exercise. Letter sounds is the opposite task: a
  // made-up word there has to be plainly made up, or a child who reads it
  // right says a real word and the measure means nothing. So this draws from
  // scripts/lib/nwf-pools.mjs and the continuum pools, both of which are
  // checked for exactly that.
  const fakePool = [...new Set([
    ...continuumFakes(level),
    ...(level <= 2 ? EXTRA_CLOSED : []),
  ])];

  const reals = shuffled(realPool, seed + 1);
  const fakes = shuffled(fakePool, seed + 2);

  // THE WORD RACE IS THE SAME LIST ALL WEEK, and deliberately so. The six
  // word-reading words change daily because reading those five times over
  // measures memory; the race is the opposite task. A child races the same
  // seventy-two words on Monday and on Friday and the two counts can be put
  // next to each other, which is the only way the number means anything.
  //
  // AND IT IS A MIXED LIST. Word reading is not a pattern drill: what it
  // measures is whether the words a child is supposed to have by now come off
  // the page without being worked out. So a third is this lesson's own words,
  // a third is the heart words taught by this level, and the rest is what
  // earlier lessons taught, most recent first -- and then the whole thing is
  // shuffled, so a silent-e word sits next to "because" sits next to a short
  // vowel word from October, which is what the measure actually looks like.
  //
  // Reaching back is also what makes the length possible. Drawing on this
  // lesson alone, twenty-three of the sixty-eight could not reach sixty words
  // and the shortest had twenty-one.
  const mix = [];
  const fill = (from, upTo) => {
    for (const w of from) {
      if (mix.length >= upTo) break;
      if (!mix.includes(w)) mix.push(w);
    }
  };
  const third = Math.ceil(RACE_WORDS / 3);
  fill(shuffled(ownWords, seed + 3), third);
  fill(shuffled(heart, seed + 4), third * 2);
  fill(reviewWords, RACE_WORDS);
  // Whatever is left, from whichever source still has words. The first lesson
  // in the sequence has nothing behind it to review and comes up a few short
  // of a full sheet, which is a shorter race rather than a worse one.
  fill(shuffled(levelWords, seed + 5), RACE_WORDS);
  fill(shuffled(ownWords, seed + 6), RACE_WORDS);
  fill(shuffled(heart, seed + 7), RACE_WORDS);
  const race = shuffled(mix, seed + 8);
  if (race.length < RACE_WORDS) short.push(`${lesson.key}: ${race.length} race words`);

  // A distractor may not be a word from EITHER telling: not from the passage
  // the child just read out loud, and not from the one the sentence came out
  // of.
  const allWords = text.paras.join(" ").split(/\s+/)
    .concat(mazeSource === text ? [] : mazeSource.paras.join(" ").split(/\s+/));
  const sents = mazeable(sentences(mazeSource.paras.join(" ")));
  if (reals.length < WRF_PER_DAY * DAYS || fakes.length < NWF_PER_DAY * DAYS) {
    short.push(`${lesson.key}: ${reals.length} real, ${fakes.length} made-up`);
  }

  /**
   * Take a day's words, wrapping round if the pool is short.
   *
   * Four lessons have fewer words than five days of fresh ones need, and
   * slicing past the end of the list gave those lessons an empty Thursday and
   * Friday. A repeated word on day five is a worse sheet than a fresh one; no
   * sheet at all is not a sheet.
   */
  const take = (pool, d, n) =>
    pool.length === 0
      ? []
      : Array.from({ length: n }, (_, i) => pool[(d * n + i) % pool.length]);

  const words = text.paras.join(" ").split(/\s+/).filter(Boolean).length;

  /*
   * THE SAME WEEK IN MULTISYLLABIC WORDS.
   *
   * The lesson builder has a "Use multisyllabic words" switch, and when it is
   * on the packet's other sheets swap to the harder bank. The mClass rows now
   * do too: six real multisyllabic words and four made-up ones a day, from
   * the same bank, so a child working above single syllables is not handed
   * cat and hop on the one page that is meant to stretch them.
   *
   * The made-up words reach back through earlier lessons, because a lesson
   * holds only eight of them and five days wants twenty. Fourteen lessons
   * have no bank at all -- their patterns have no two-syllable words to make
   * one from -- and those keep the single-syllable rows, which is what the
   * switch does everywhere else on the page.
   */
  // Two lessons hold almost nothing of their own -- the aught/ought families
  // have four two-syllable words between them, and vccvce has six -- so a
  // week drawn from those alone asked for the same four words thirty times.
  // What is short is topped up from lessons already taught, which are still
  // multisyllabic words and ones this child has met.
  // Topped up only where there is something of this lesson's own to top up.
  // Backfilling an empty bank made the switch change the rows on the fourteen
  // lessons whose patterns have no two-syllable words at all -- long e came
  // out as "withdrawn" -- which is a harder word that has nothing to do with
  // the lesson. Everywhere else on the page an empty bank means the switch
  // leaves the sheet alone, and so it does here.
  const msOwn = shuffled((bank.real || []).filter(word), seed + 11);
  const msReal = msOwn.length
    ? [...new Set([
        ...msOwn,
        ...(msOwn.length < WRF_PER_DAY * DAYS ? [...taughtMulti].reverse().filter(word) : []),
      ])]
    : [];
  const msFake = [...new Set([...(bank.fake || []), ...[...taughtFakes].reverse()])];
  const msDays = msReal.length
    ? Array.from({ length: DAYS }, (_, d) => ({
        day: d + 1,
        wrf: take(msReal, d, WRF_PER_DAY),
        nwf: take(msFake, d, NWF_PER_DAY),
      }))
    : null;
  if (!msDays) noMulti.push(lesson.key);

  const days = [];
  for (let d = 0; d < DAYS; d++) {
    // Three sentences, walking through the passage across the week, so each
    // day asks about a different part of the text the child has just read.
    // A passage with six usable sentences comes round twice; that is the
    // design -- the same passage all week is the whole point, and a second
    // pass gets a different blank because the seed has moved.
    const maze = [];
    for (let i = 0; sents.length && maze.length < MAZE_SENTENCES && i < sents.length; i++) {
      const n = d * MAZE_SENTENCES + i;
      const sentence = sents[n % sents.length];
      if (maze.some((x) => x.s === sentence)) continue;
      const item = oneBlank(sentence, seed + 200 + n, allWords, Math.floor(n / sents.length));
      if (item) maze.push(item);
    }
    if (maze.length < MAZE_SENTENCES) noMaze.push(`${lesson.key} day ${d + 1}: ${maze.length}`);

    days.push({
      day: d + 1,
      wrf: take(reals, d, WRF_PER_DAY),
      nwf: take(fakes, d, NWF_PER_DAY),
      maze,
    });
  }

  // The phrase rungs, cut from the passage the child actually reads at the
  // top of every day page -- text, not mazeSource, which is the other
  // telling and never printed beside this sheet.
  const allSents = sentences(text.paras.join(" "));
  const cut = phrasesFrom(allSents);
  const ladderWords = [...new Set([...(lesson.words || []), ...ownWords])].slice(0, 10);
  const phrases = {
    words: ladderWords,
    // Five rungs a step, not six. Six put the sheet 30px over a page, and
    // the climb is the point rather than the count.
    short: shuffled(cut.short, seed + 21).slice(0, 5),
    long: shuffled(cut.long, seed + 22).slice(0, 5),
    sentences: [...allSents]
      .map((x) => x.trim())
      .filter((x) => x.split(/\s+/).length >= 5 && x.split(/\s+/).length <= 14)
      // Three, and none of them long. Four put the longest ladders 46px over
      // a page, and the last step is the one the first three were for.
      .slice(0, 3),
  };

  // Every level up to this one, not just this one. The drills need words
  // with a particular shape -- one whose last sound can come off and still
  // leave a word -- and a single level's pool held one of them: every lesson
  // printed the same "and without /d/" and nothing else.
  const paPool = [];
  for (let lv = 1; lv <= level; lv++) paPool.push(...continuumReals(lv).filter(word));
  const pa = paItems(ownWords, paPool, [...(bank.real || []), ...taughtMulti], seed + 31);

  remember();
  out.push({
    key: lesson.key,
    name: lesson.name,
    level,
    passage: { title: text.title, paras: text.paras, words },
    phrases,
    pa,
    // Which telling the maze sentences were cut from, so the check can go and
    // look rather than take it on trust.
    mazeFrom: mazeSource === text ? "same" : "g2",
    race,
    msDays,
    days,
  });
}

writeFileSync(
  "scripts/reading-daily-practice.json",
  JSON.stringify(
    {
      _note:
        "Five days of daily practice for each lesson in the reading sequence, across the five mClass measures. Each day is a page: the lesson's own decodable passage (the same one all week, because repeated reading is what moves fluency and accuracy), six real words and four made-up ones that change daily, a three-sentence maze over a different part of that passage, and a seventy-two word race on a sheet of its own that stays the same all week so Monday and Friday can be compared. msDays carries the same five days in multisyllabic words, for the lesson builder's multisyllabic switch, and is null for the fourteen lessons whose patterns have no two-syllable words. Generated by scripts/build-daily-practice.mjs; do not hand-edit.",
      perDay: { wrf: WRF_PER_DAY, nwf: NWF_PER_DAY, maze: MAZE_SENTENCES },
      raceWords: RACE_WORDS,
      lessons: out,
    },
    null,
    1,
  ) + "\n",
);

console.log(`${out.length} lessons × ${DAYS} days`);
console.log(`  ${out.length * DAYS} practice days, ${out.length * DAYS * (WRF_PER_DAY + NWF_PER_DAY)} word slots`);
if (noMulti.length) {
  console.log(`\n${noMulti.length} lessons have no multisyllabic bank, so the switch leaves their rows alone:`);
  console.log(`   ${noMulti.join(", ")}`);
}
if (noMaze.length) {
  console.log(`\n⚠ ${noMaze.length} days could not fill ${MAZE_SENTENCES} maze sentences:`);
  for (const s of noMaze.slice(0, 8)) console.log(`   – ${s}`);
}
if (short.length) {
  console.log(`\n⚠ ${short.length} lessons have fewer words than five full days need:`);
  for (const s of short.slice(0, 8)) console.log(`   – ${s}`);
}
