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
/** Days with fewer than three maze items because the rest could be copied. */
const shortMaze = [];
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

  // And the maze has to come from a telling that is NOT printed, so the
  // answer is not sitting on the page above the question. Grade 2 for most
  // lessons; grade 4, or both pooled, for the ones whose grade 2 telling
  // repeats the printed one too closely to cut a fresh question from.
  if (!["g2", "g4", "g2+g4"].includes(lesson.mazeFrom)) {
    say(`mazeFrom is "${lesson.mazeFrom}", expected g2, g4 or g2+g4`);
  }
  // Which telling the item says it came from. g4 and the pooled g2+g4 exist
  // because for some lessons the grade 2 telling repeats the printed one
  // almost word for word, and a maze whose answer is in the passage above it
  // is a word search rather than a comprehension measure.
  const g4 = PASS[lesson.key] && PASS[lesson.key].g4
    ? PASS[lesson.key].g4.paras.join(" ") : "";
  const mazeSource =
    lesson.mazeFrom === "g2" ? (g2 || printed)
    : lesson.mazeFrom === "g4" ? (g4 || printed)
    : lesson.mazeFrom === "g2+g4" ? `${g2} ${g4}`
    : printed;

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
    /*
     * A day wants three maze items, and two is a shortfall rather than a
     * fault.
     *
     * Every candidate sentence is now checked with its gap filled in, and
     * thrown away if the answer can be read off the passage printed above
     * it. One lesson -- all vowel teams together -- tells its story three
     * times in nearly the same words, so after that check there are days
     * with only two sentences left to ask about. Two honest questions beat
     * three a child can copy, so this counts them and says so rather than
     * failing, and anything below two is still a fault.
     */
    if (d.maze.length < 2) at(`${d.maze.length} maze items, which is too few to be a maze`);
    else if (d.maze.length !== D.perDay.maze) shortMaze.push(`${lesson.key} day ${d.day}: ${d.maze.length} of ${D.perDay.maze}`);

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

      /*
       * AND THE ANSWER MUST NOT BE SITTING ON THE PAGE ABOVE THE QUESTION.
       *
       * The maze is cut from a telling the day page does not print, which is
       * meant to settle this. It does not: for more than half the lessons
       * the two tellings are the same story told almost the same way, and
       * printing a Level 5 packet showed every one of Monday's three items
       * already in the passage above them -- "There is a photograph of [an]
       * elephant on the wall of our school hall" under "There is a large
       * photograph of an elephant on the wall of our school hall". A child
       * can answer that without reading either sentence, and MAZE is the
       * measure the grade-level plan sets its goal on.
       *
       * So this fills the gap in and goes looking for the sentence in the
       * printed passage. A matching run of six words or more that reaches
       * past the gap means the answer is up there to be copied.
       */
      const filledWords = words.slice();
      filledWords[m.at] = m.before + m.answer + m.after;
      const need = (filledWords.join(" ").toLowerCase().match(/[a-z']+/g) || []);
      const lead = (words.slice(0, m.at).join(" ").toLowerCase().match(/[a-z']+/g) || []).length;
      const hay = printed.toLowerCase().match(/[a-z']+/g) || [];
      let run = 0;
      for (let a2 = 0; a2 < hay.length; a2++) {
        for (let b2 = 0; b2 < need.length; b2++) {
          let k = 0;
          while (a2 + k < hay.length && b2 + k < need.length && hay[a2 + k] === need[b2 + k]) k++;
          if (k > run) run = k;
        }
      }
      if (run >= lead + 1 && run >= 6) {
        item(`can be answered off the printed passage (${run} words of it match)`);
      }
    }
  }

  // Monday's race and Friday's race have to be the same race.
  const sheet = JSON.stringify(lesson.race);
  if (lesson.days.some((d) => d.race && JSON.stringify(d.race) !== sheet)) {
    say("the word race changes during the week");
  }
}

/*
 * THE PHONEMIC AWARENESS CARD, CHECKED IN SOUNDS.
 *
 * Every item on it is a claim about what a word sounds like with a sound
 * taken off or swapped, and the generator proved each one against the
 * pronouncing dictionary before writing it down. This proves it again from
 * the file, because the thing that went wrong the first time round was a
 * generator that reasoned about letters: it produced "she" without /s/ is
 * "he", "bone" with /n/ is "none", "ask" without /k/ is "as" and "season" is
 * "sea" plus "son" -- all of which read fine on paper and are wrong out loud.
 * A card a teacher has to mark a right answer wrong on is worse than no card.
 */
const SOUNDS = JSON.parse(readFileSync("scripts/lib/pa-sounds.json", "utf8")).words;
const sayIt = (w) => (SOUNDS[w] ? SOUNDS[w].split(" ") : null);
const alike = (x, y) => x && y && x.length === y.length && x.every((v, i) => v === y[i]);
let paCount = 0;

for (const lesson of D.lessons) {
  const pa = lesson.pa || {};
  const say = (msg) => problems.push(`${lesson.key}: ${msg}`);

  for (const [word, sound, answer] of pa.drop || []) {
    paCount += 1;
    const p = sayIt(word);
    const q = sayIt(answer);
    if (!p || !q) { say(`drop ${word}/${answer}: no pronunciation on file`); continue; }
    if (!alike(p.slice(1), q)) say(`drop: ${word} without the first sound is not ${answer}`);
    if (!sound) say(`drop ${word}: no sound to name`);
  }

  for (const [word, sound, answer] of pa.chop || []) {
    paCount += 1;
    const p = sayIt(word);
    const q = sayIt(answer);
    if (!p || !q) { say(`chop ${word}/${answer}: no pronunciation on file`); continue; }
    if (!alike(p.slice(0, -1), q)) say(`chop: ${word} without the last sound is not ${answer}`);
    if (!sound) say(`chop ${word}: no sound to name`);
  }

  for (const [word, from, to, answer] of pa.swap || []) {
    paCount += 1;
    const p = sayIt(word);
    const q = sayIt(answer);
    if (!p || !q) { say(`swap ${word}/${answer}: no pronunciation on file`); continue; }
    if (!alike(p.slice(1), q.slice(1))) say(`swap: ${word} and ${answer} do not share everything after the first sound`);
    if (p[0] === q[0]) say(`swap: ${word} and ${answer} start with the same sound`);
    if (!from || !to || from === to) say(`swap ${word}: ${from} to ${to} is not a change`);
  }

  for (const [word, part, answer] of pa.syll || []) {
    paCount += 1;
    const p = sayIt(word);
    const a2 = sayIt(part);
    const q = sayIt(answer);
    if (!p || !a2 || !q) { say(`syllable ${word}: no pronunciation on file`); continue; }
    if (!alike([...a2, ...q], p)) say(`syllable: ${part} plus ${answer} is not ${word}`);
    if (part + answer !== word) say(`syllable: ${part} plus ${answer} does not spell ${word}`);
  }

  // The phrase ladder is cut from the passage printed above it, so every
  // word in it has to be a word of that passage -- otherwise the rung
  // between the word list and the text is made of something else.
  const said = new Set(
    (lesson.passage.paras || []).join(" ").toLowerCase().match(/[a-z']+/g) || [],
  );
  const ph = lesson.phrases || {};
  for (const [kind, want] of [["short", [3, 3]], ["long", [4, 6]]]) {
    for (const phrase of ph[kind] || []) {
      const n = phrase.split(/\s+/).length;
      if (n < want[0] || n > want[1]) say(`${kind} phrase "${phrase}" is ${n} words, not ${want[0]}-${want[1]}`);
      for (const w of phrase.toLowerCase().match(/[a-z']+/g) || []) {
        if (!said.has(w)) say(`phrase "${phrase}" uses ${w}, which is not in the passage`);
      }
    }
  }
  for (const sentence of ph.sentences || []) {
    if (!(lesson.passage.paras || []).some((x) => x.includes(sentence))) {
      say(`phrase sentence is not in the passage: ${sentence.slice(0, 40)}`);
    }
  }
}

console.log(`${D.lessons.length} lessons × 5 days = ${dayCount} practice pages.`);
console.log(`${mazeCount} maze items, ${raceCount} race words, ${dayCount * (D.perDay.wrf + D.perDay.nwf)} word slots.`);
console.log(`${paCount} phonemic awareness items, every one proved in sounds.`);
if (shortMaze.length) {
  console.log(`
${shortMaze.length} days carry two maze items rather than three, because the third could be read off the printed passage:`);
  for (const x of shortMaze) console.log(`   – ${x}`);
}
console.log(`problems: ${problems.length}`);
problems.slice(0, 40).forEach((x) => console.log("  " + x));
if (problems.length) {
  console.error("\n✗ fix these before the week ships.");
  process.exit(1);
}
console.log("✅ every day has its words, its maze matches the passage, and the race holds all week");
