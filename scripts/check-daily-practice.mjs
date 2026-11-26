/**
 * Checks the five mClass practice days before a child works one.
 *
 * Each day is a page: the lesson's passage, six real words, four made-up
 * ones, a three-sentence maze and a twenty-four word race. The questions are
 * the ones the file cannot answer about itself.
 *
 *   1. Is a real word real, and is a made-up word actually made up? A
 *      made-up word that turns out to be a word asks a child to read a word
 *      as nonsense, which teaches the opposite of what the measure is for.
 *   2. Does the maze item still match its sentence? The blank is stored as a
 *      word index, so a sentence edited by hand and an index left where it
 *      was would silently ask about the wrong word.
 *   3. Is the answer one of the three choices, and are the other two absent
 *      from the passage? A distractor the child read out loud a minute ago
 *      makes the item about memory rather than sense.
 *   3a. Is the read-aloud long enough to still be being read when the minute
 *      is up, and did the maze sentences come from the telling that is NOT
 *      printed? The passage is the grade 3 telling and the maze is cut from
 *      grade 2, so the answer is never on the page above the question. Both
 *      are checked by going and looking, because "mazeFrom" is a claim the
 *      data makes about itself.
 *   4. Is the word race the same list every day? It is the one part that
 *      repeats on purpose -- Monday's count and Friday's count only mean
 *      something next to each other if the list did not move.
 *
 * WHAT IT CANNOT ASK. Whether the answer is the ONLY choice that makes
 * sense needs a reader, not a script. The distractors are matched on kind
 * and length, never on meaning, so some items are easier than mClass's.
 * Easier is the safe direction for practice.
 *
 *   bun run scripts/check-daily-practice.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { CONCEPTS } from "./lib/continuum-pools.mjs";
import { looksReal, unsafeWord, unsafeRealWord } from "./lib/not-nonsense.mjs";

const D = JSON.parse(readFileSync("scripts/reading-daily-practice.json", "utf8"));
const SEQ = JSON.parse(readFileSync("scripts/reading-sequence.json", "utf8")).sequence;
const PASS = JSON.parse(readFileSync("scripts/reading-passages.json", "utf8")).passages;
const HEART = JSON.parse(readFileSync("scripts/reading-heart-words.json", "utf8")).words.map((h) =>
  String(h.word).toLowerCase(),
);

const SYSTEM_DICT = "/usr/share/dict/words";
const WORDS = existsSync(SYSTEM_DICT)
  ? new Set(
      readFileSync(SYSTEM_DICT, "utf8")
        .split("\n")
        .map((w) => w.trim().toLowerCase())
        .filter(Boolean),
    )
  : new Set();
// web2 lists base forms and leaves out irregular inflections -- no feet, no
// blew, though foot and blow are both there. The continuum pools are the
// hand-vetted real-word lists the thirty-a-day sheets draw from, already
// under check-continuum-daily, so a word that stands on one of those counts.
const POOL = new Set(CONCEPTS.flatMap((c) => c.real || []).map((w) => String(w).toLowerCase()));
const SEQ_WORDS = new Set(SEQ.flatMap((l) => l.words || []).map((w) => String(w).toLowerCase()));
/*
 * Every word of every passage this site serves.
 *
 * The race and the word rows draw on the passage a child reads at the top of
 * the day page, and web2 is silent on plenty of what children's prose uses:
 * it has hang but not hangs, grand but not gran, and nothing at all with a
 * possessive on it. Those are already answered for -- check-passages asserts
 * that every word of every passage is real and decodable at its lesson --
 * so a word that stands in a passage stands here.
 */
const PASSAGE_WORDS = new Set(
  Object.values(PASS).flatMap((p) =>
    Object.values(p).flatMap((v) =>
      v && v.paras
        ? v.paras.join(" ").split(/\s+/).map((w) => w.toLowerCase().replace(/[^a-z']/g, ""))
        : [],
    ),
  ),
);

/** Real after all? The same four sources the builder drew the word from. */
const isReal = (w) => {
  const x = String(w).toLowerCase();
  if (WORDS.has(x) || POOL.has(x) || HEART.includes(x) || SEQ_WORDS.has(x) || PASSAGE_WORDS.has(x)) return true;
  // A possessive is the noun with 's on it, which web2 never lists.
  const owned = x.replace(/'s$/, "");
  if (owned !== x && (WORDS.has(owned) || PASSAGE_WORDS.has(owned) || SEQ_WORDS.has(owned))) return true;
  // web2 lists walk, not walked; the builder's pools carry both.
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

const problems = [];
const bare = (w) => String(w).replace(/[^A-Za-z'-]/g, "").toLowerCase();
/**
 * Roughly how many syllables, counted as groups of vowel letters.
 *
 * Wrong at the edges -- "couldn't" counts as one because the second syllable
 * has no vowel letter in it -- which is why this only ever has to answer
 * "two or more?" about a bank that was built to be multisyllabic. An
 * apostrophe makes it generous by one for exactly that case.
 */
const syllableish = (w) => {
  const groups = (String(w).toLowerCase().match(/[aeiouy]+/g) || []).length;
  return groups + (String(w).includes("'") ? 1 : 0);
};

let dayCount = 0;
let mazeCount = 0;
let raceCount = 0;

for (const lesson of D.lessons) {
  const say = (m) => problems.push(`${lesson.key}: ${m}`);
  const passageWords = new Set(lesson.passage.paras.join(" ").split(/\s+/).map(bare));

  // Which telling the maze was cut from, and whether that is the right one.
  const p = PASS[lesson.key] || {};
  const printed = lesson.passage.paras.join(" ");
  const g2 = p.g2 ? p.g2.paras.join(" ") : null;

  // The read-aloud has to outlast the minute. Sixty-one to a hundred and one
  // words was the grade 2 telling, which a child who can read finishes.
  if (lesson.passage.words < 100) {
    say(`the read-aloud passage is ${lesson.passage.words} words, and a minute of reading wants at least 100`);
  }

  // And the maze has to come from the telling that is NOT printed, so the
  // answer is not sitting on the page above the question.
  if (lesson.mazeFrom !== "g2" && lesson.mazeFrom !== "same") {
    say(`mazeFrom is "${lesson.mazeFrom}", expected g2 or same`);
  }
  if (g2 && g2 !== printed && lesson.mazeFrom !== "g2") {
    say("takes its maze from the printed passage although a second telling exists");
  }
  const mazeSource = lesson.mazeFrom === "g2" && g2 ? g2 : printed;

  if (lesson.days.length !== 5) say(`${lesson.days.length} days, expected 5`);

  // The race is one list for the week, on its own sheet, so it lives on the
  // lesson rather than on a day. Sixty is a minute at a word a second and the
  // sheet holds seventy-two so it outlasts the fastest reader; the first
  // lesson in the sequence has nothing behind it to review and comes up a
  // little short, which is a shorter race rather than a worse one.
  if (!Array.isArray(lesson.race) || lesson.race.length < 96) {
    say(`word race has ${lesson.race ? lesson.race.length : 0} words, expected at least 96`);
  } else if (new Set(lesson.race).size !== lesson.race.length) {
    say("a word appears twice in the race");
  }
  for (const w of lesson.race || []) {
    // A race word is read off a list with no sentence around it, so a name is
    // unreadable there and a lower-cased one is wrong as well as unreadable.
    if (/^[A-Z]/.test(w) && w.includes("'")) say(`race word "${w}" is a name with a possessive on it`);
  }

  /*
   * The same week in multisyllabic words, for the lesson builder's "Use
   * multisyllabic words" switch. Fourteen lessons have no such bank -- their
   * patterns have no two-syllable words to draw on -- and those carry null,
   * which is the switch leaving the sheet alone rather than a gap.
   */
  if (lesson.msDays !== null) {
    if (!Array.isArray(lesson.msDays) || lesson.msDays.length !== 5) {
      say(`msDays has ${lesson.msDays ? lesson.msDays.length : 0} days, expected 5 or null`);
    } else {
      const seenReal = new Set();
      for (const d of lesson.msDays) {
        const at = (m) => say(`multisyllabic day ${d.day}: ${m}`);
        if (d.wrf.length !== D.perDay.wrf) at(`${d.wrf.length} real words, expected ${D.perDay.wrf}`);
        if (d.nwf.length !== D.perDay.nwf) at(`${d.nwf.length} made-up words, expected ${D.perDay.nwf}`);
        for (const w of d.wrf) {
          if (!isReal(w)) at(`real word "${w}" is not a word`);
          if (unsafeRealWord(w)) at(`"${w}" cannot be printed for a child`);
          // Two vowel groups is the cheap test for two syllables. It is the
          // reason this list exists, so a single-syllable word in it is the
          // switch doing nothing.
          if (syllableish(w) < 2) at(`"${w}" is not a multisyllabic word`);
          if (seenReal.has(w)) at(`"${w}" already appeared this week`);
          seenReal.add(w);
        }
        for (const w of d.nwf) {
          if (looksReal(w, WORDS) || POOL.has(String(w).toLowerCase())) at(`made-up word "${w}" is a real word`);
          if (unsafeWord(w)) at(`"${w}" cannot be printed for a child`);
          if (syllableish(w) < 2) at(`made-up word "${w}" is not multisyllabic`);
        }
      }
    }
  }
  for (const w of lesson.race || []) {
    raceCount++;
    if (!isReal(w)) say(`race word "${w}" is not a word`);
    if (unsafeRealWord(w)) say(`race word "${w}" cannot be printed for a child`);
  }

  for (const d of lesson.days) {
    dayCount++;
    const at = (m) => say(`day ${d.day}: ${m}`);
    if (d.wrf.length !== D.perDay.wrf) at(`${d.wrf.length} real words, expected ${D.perDay.wrf}`);
    if (d.nwf.length !== D.perDay.nwf) at(`${d.nwf.length} made-up words, expected ${D.perDay.nwf}`);
    if (d.maze.length !== D.perDay.maze) at(`${d.maze.length} maze items, expected ${D.perDay.maze}`);

    for (const w of d.wrf) {
      if (!isReal(w)) at(`real word "${w}" is not a word`);
      if (unsafeRealWord(w)) at(`"${w}" cannot be printed for a child`);
    }
    for (const w of d.nwf) {
      if (looksReal(w, WORDS) || POOL.has(String(w).toLowerCase())) {
        at(`made-up word "${w}" is a real word`);
      }
      if (unsafeWord(w)) at(`"${w}" cannot be printed for a child`);
    }

    for (const [i, m] of d.maze.entries()) {
      mazeCount++;
      const words = String(m.s).split(/\s+/);
      const item = (msg) => at(`maze ${i + 1} ${msg}`);
      if (!(m.at >= 0 && m.at < words.length)) { item(`points at word ${m.at}, past the sentence`); continue; }
      if (words[m.at] !== m.before + m.answer + m.after) {
        item(`points at "${words[m.at]}" but its answer is "${m.answer}"`);
      }
      if (m.at === 0) item("blanks the first word, which has nothing before it to read");
      if (m.at === words.length - 1) item("blanks the last word, which has nothing after it");
      if (m.choices.length !== 3) item(`offers ${m.choices.length} choices, expected 3`);
      if (new Set(m.choices).size !== m.choices.length) item("offers the same word twice");
      if (!m.choices.includes(m.answer)) item(`does not offer its own answer "${m.answer}"`);
      if (m.answer[0] !== m.answer[0].toLowerCase()) item(`blanks "${m.answer}", which a capital gives away`);
      for (const c of m.choices) {
        if (c !== m.answer && passageWords.has(bare(c))) {
          item(`offers "${c}", which is in the passage the child just read`);
        }
        if (c !== m.answer && new RegExp(`\\b${bare(c)}\\b`, "i").test(mazeSource)) {
          item(`offers "${c}", which is somewhere in ${lesson.mazeFrom} already`);
        }
        if (unsafeRealWord(c)) item(`offers "${c}", which cannot be printed for a child`);
      }
      // The sentence has to be one the telling actually contains, not a
      // paraphrase of it.
      if (!mazeSource.includes(m.s)) item(`is not a sentence from ${lesson.mazeFrom}`);
    }
  }

  // Monday's race and Friday's race have to be the same race.
  const sheet = JSON.stringify(lesson.race);
  if (lesson.days.some((d) => d.race && JSON.stringify(d.race) !== sheet)) {
    say("the word race changes during the week");
  }
}

console.log(`${D.lessons.length} lessons × 5 days = ${dayCount} practice pages.`);
console.log(`${mazeCount} maze items, ${raceCount} race words, ${dayCount * (D.perDay.wrf + D.perDay.nwf)} word slots.`);
console.log(`problems: ${problems.length}`);
problems.slice(0, 40).forEach((x) => console.log("  " + x));
if (problems.length) {
  console.error("\n✗ fix these before the week ships.");
  process.exit(1);
}
console.log("✅ every day has its words, its maze matches the passage, and the race holds all week");
