import Link from "next/link";
import type { Metadata } from "next";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import DAILY from "@/../scripts/reading-daily-practice.json";

/**
 * Five days of daily practice, on the five things a child is scored on.
 *
 * THE DATA CHAT REPORTS SIX NUMBERS and leaves a child with a goal and nothing
 * to do about it. This is the something to do: a week of five-minute practice
 * on reading fluency, accuracy, letter sounds, word reading and the maze,
 * built from the concept the lesson is teaching.
 *
 * A DAY IS A PAGE. Five pages, one each for Monday to Friday, and everything
 * on a page is that day's work: the passage, the day's real and made-up words,
 * a three-sentence maze and the word race. A child sits down with one sheet
 * and does not have to find their place on three.
 *
 * WHAT CHANGES AND WHAT DOES NOT. The passage is the same all week, because
 * repeated reading of ONE text is what moves fluency and accuracy -- the log
 * at the foot of each page is where Monday and Friday end up side by side. The
 * word race is the same list all week for the same reason. The six real words,
 * the four made-up ones and the three maze sentences are different every day,
 * because reading the same ten words five times measures memory.
 *
 * WHERE THE MAZE SENTENCES COME FROM. The page prints the lesson's grade 3
 * reading, which is the telling long enough to outlast a minute, and the maze
 * is cut from its grade 2 one. So the sentences are never the ones sitting on
 * the page above the question, at any level, and they are never harder than
 * the passage either.
 */

type Maze = {
  s: string;
  at: number;
  before: string;
  after: string;
  choices: string[];
  answer: string;
};
type Day = { day: number; wrf: string[]; nwf: string[]; maze: Maze[] };
type Lesson = {
  key: string;
  name: string;
  level: number;
  passage: { title: string; paras: string[]; words: number };
  /**
   * The same five days in multisyllabic words, or null where the lesson's
   * pattern has no two-syllable words to build them from. Fourteen lessons
   * carry null, and for those the switch below has nothing to switch to.
   */
  msDays: { day: number; wrf: string[]; nwf: string[] }[] | null;
  /** Which telling the maze sentences were cut from: the printed passage, or g3. */
  mazeFrom: "g2" | "g3";
  race: string[];
  days: Day[];
  /** Words, then phrases, then whole sentences: the rung below the passage. */
  phrases: { words: string[]; short: string[]; long: string[]; sentences: string[] };
  /**
   * The spoken minute. Every item was proved against a pronouncing dictionary
   * when it was generated, because a drill reasoned out of spelling says that
   * "she" without /s/ is "he". See scripts/build-daily-practice.mjs.
   */
  pa: {
    drop: [string, string, string][];
    chop: [string, string, string][];
    swap: [string, string, string, string][];
    syll: [string, string, string][];
  };
};

const D = DAILY as unknown as {
  perDay: { wrf: number; nwf: number; maze: number };
  raceWords: number;
  lessons: Lesson[];
};

const SANS = "'Poppins', system-ui, -apple-system, sans-serif";
const INK = "#111111";
const MUTED = "#57534e";
const TEAL = "#00897B";
const CORAL = "#733A32";
const LINE = "#E7E5E4";
const DAY_NAME = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export const metadata: Metadata = {
  title: "Daily Practice",
  description:
    "Five pages, one a day, on the five measures a child is scored on: the passage, the words, the maze and the word race, built from the concept the lesson is teaching.",
  openGraph: ogCard("/og/science-of-reading.png"),
  twitter: twitterCard("/og/science-of-reading.png"),
};

/** A numbered band: the measure, what to do, and the work. */
function Part({ n, label, measure, how, children }: {
  n: number;
  label: string;
  measure: string;
  how: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 6, breakInside: "avoid" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, borderBottom: `2px solid ${LINE}`, paddingBottom: 3 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", background: TEAL, borderRadius: 999, width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          {n}
        </span>
        <span style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: ".02em" }}>{label}</span>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".12em", color: MUTED }}>{measure}</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11.5, color: MUTED, fontWeight: 600 }}>{how}</span>
      </div>
      {children}
    </section>
  );
}

const box = (w: number, h = 21) => ({
  display: "inline-block",
  width: w,
  height: h,
  border: `2px solid ${INK}`,
  borderRadius: 4,
  verticalAlign: "middle",
});

/**
 * Which words a day shows: the ordinary rows, or the multisyllabic ones.
 *
 * The lesson builder's packet has a "Use multisyllabic words" switch and this
 * page now has the same one, as ?multi=1. A lesson with no multisyllabic bank
 * keeps its ordinary rows whatever the switch says, which is what the switch
 * does everywhere else.
 */
function wordsFor(lesson: Lesson, d: Day, multi: boolean): { wrf: string[]; nwf: string[] } {
  const ms = multi && lesson.msDays ? lesson.msDays[d.day - 1] : null;
  return ms ?? { wrf: d.wrf, nwf: d.nwf };
}

/** One word with a tick box in front of it. */
function Tick({ w }: { w: string }) {
  return <span style={{ fontSize: 16.5, fontWeight: 650, whiteSpace: "nowrap" }}>☐ {w}</span>;
}

/** A maze sentence with its three choices in the gap. */
function MazeLine({ m, n }: { m: Maze; n: number }) {
  const words = m.s.split(/\s+/);
  return (
    <div style={{ fontSize: 16, lineHeight: 1.75 }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: TEAL, marginRight: 6 }}>{n}</span>
      {words.map((w, i) =>
        i === m.at ? (
          <span key={i} style={{ whiteSpace: "nowrap" }}>
            {m.before}
            <span style={{ border: `1.5px solid ${INK}`, borderRadius: 7, padding: "1px 7px", fontWeight: 650 }}>
              {m.choices.join("  /  ")}
            </span>
            {m.after}{" "}
          </span>
        ) : (
          <span key={i}>{w} </span>
        ),
      )}
    </div>
  );
}

/** One day: everything that day asks for, on one page. */
function DayPage({ lesson, d, multi }: { lesson: Lesson; d: Day; multi: boolean }) {
  const words = wordsFor(lesson, d, multi);
  const harder = multi && Boolean(lesson.msDays);
  return (
    <section className="sheet" style={{ display: "flex", flexDirection: "column", gap: 13, paddingTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, borderBottom: `3px solid ${TEAL}`, paddingBottom: 7 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".18em", color: TEAL }}>
            {lesson.name.toUpperCase()} · DAY {d.day} OF 5
          </div>
          <div style={{ fontSize: 29, fontWeight: 800, lineHeight: 1.05 }}>{DAY_NAME[d.day - 1]}</div>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 600, textAlign: "right" }}>
          Name ______________<br />Date ____________
        </div>
      </div>

      <Part n={1} label="Read it out loud" measure="ORF + ACCURACY" how="⏱ 1 minute">
        <div style={{ fontSize: 13, fontWeight: 700, color: MUTED }}>
          📖 {lesson.passage.title} · {lesson.passage.words} words
        </div>
        <div style={{ fontSize: 15.5, lineHeight: 1.65 }}>
          {lesson.passage.paras.map((p, i) => (
            <p key={i} style={{ margin: "0 0 5px" }}>{p}</p>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", border: `2px solid ${INK}`, borderRadius: 10, padding: "7px 11px", fontSize: 12, fontWeight: 700 }}>
          <span>Words read <span style={box(46)} /></span>
          <span style={{ color: MUTED }}>−</span>
          <span>Wrong <span style={box(38)} /></span>
          <span style={{ color: MUTED }}>=</span>
          <span>Right <span style={box(46)} /></span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 14 }}>How it felt 🙂 😐 🙁</span>
        </div>
      </Part>

      {/*
        * The retell, straight after the minute and before anything else is
        * read. The grade-level plan scores Retell as its own DIBELS measure,
        * beside ORF and MAZE, and it was the one measure on that form with
        * no sheet behind it.
        *
        * Four prompts rather than an open "tell me about it", because an
        * open prompt is what a struggling reader answers in one word.
        */}
      <Part n={2} label="Say it back" measure="RETELL" how="cover the page first">
        <div style={{ display: "flex", alignItems: "center", gap: "8px 14px", flexWrap: "wrap", border: `2px solid ${INK}`, borderRadius: 10, padding: "7px 11px" }}>
          {["Who it was about", "Where it happened", "What happened first", "How it ended"].map((t) => (
            <span key={t} style={{ fontSize: 14, fontWeight: 650 }}>☐ {t}</span>
          ))}
          <span style={{ fontSize: 12, fontWeight: 700 }}>Ideas told <span style={box(38)} /></span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: MUTED }}>How well&nbsp; 1&nbsp; 2&nbsp; 3&nbsp; 4</span>
        </div>
      </Part>

      <Part n={3} label="Real words and silly words" measure="WRF + NWF" how="read each one, tick it">
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".1em", color: TEAL, width: 74, flex: "none" }}>
            {harder ? "REAL · 2+" : "REAL"}
          </span>
          <span style={{ display: "flex", gap: 9, flexWrap: "wrap", flex: 1 }}>
            {words.wrf.map((w, i) => <Tick key={`${w}-${i}`} w={w} />)}
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>__ / {words.wrf.length}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", borderTop: `1px dashed ${LINE}`, paddingTop: 5 }}>
          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".1em", color: CORAL, width: 74, flex: "none" }}>
            SILLY
          </span>
          <span style={{ display: "flex", gap: 9, flexWrap: "wrap", flex: 1 }}>
            {words.nwf.map((w, i) => <Tick key={`${w}-${i}`} w={w} />)}
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>__ / {words.nwf.length}</span>
        </div>
        <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>
          The silly words are not real. Sound by sound counts, and all at once counts too.
        </div>
      </Part>

      <Part
        n={4}
        label="Fill in the blank"
        measure="MAZE"
        how="from the other reading in this lesson — circle the word that fits"
      >
        {d.maze.map((m, i) => <MazeLine key={i} m={m} n={i + 1} />)}
      </Part>

      <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, borderTop: `1px solid ${LINE}`, paddingTop: 7 }}>
        ⏱ Then the word race — the sheet at the back of the week, one minute, every day.
      </div>
    </section>
  );
}

/**
 * The word race: one sheet for the whole week.
 *
 * IT IS THE SAME LIST EVERY DAY, so printing it on all five day pages was
 * printing it four times for nothing -- and a list long enough to outlast a
 * minute does not fit there anyway. Seventy-two words adds about 132px to a
 * day page, and every one of the lessons overflowed the sheet.
 *
 * SEVENTY-TWO, because the sheet must not run out before the clock does. At
 * roughly a word a second a minute is sixty, and a fluent reader passes sixty
 * on a word list, so there are twelve rows rather than ten.
 *
 * THE FIVE COUNTS SIT TOGETHER at the foot of it, for the same reason the
 * reading log does: Monday and Friday mean something next to each other and
 * very little apart.
 */
function RaceSheet({ lesson }: { lesson: Lesson }) {
  return (
    <section className="sheet" style={{ display: "flex", flexDirection: "column", gap: 13, paddingTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, borderBottom: `3px solid ${TEAL}`, paddingBottom: 7 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".18em", color: TEAL }}>
            {lesson.name.toUpperCase()} · WRF
          </div>
          <div style={{ fontSize: 29, fontWeight: 800, lineHeight: 1.05 }}>🏁 Word race</div>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 600, textAlign: "right" }}>
          Name ______________<br />Week ____________
        </div>
      </div>

      <div style={{ fontSize: 14, lineHeight: 1.5, background: "#F0FAF8", border: `1.5px solid ${TEAL}`, borderRadius: 10, padding: "8px 13px" }}>
        <b>How:</b> one minute, every day. Read across the rows. Mark where you stop and write the
        number in today&apos;s box. Read every word — no skipping. The list is the same all week, so
        Friday should get further than Monday.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "7px 10px" }}>
        {lesson.race.map((w, i) => (
          <span key={`${w}-${i}`} style={{ fontSize: 17, fontWeight: 650, whiteSpace: "nowrap" }}>{w}</span>
        ))}
      </div>

      {/* Under the list, not pushed to the foot of the sheet: the box belongs
          with the thing it is counting. */}
      <div style={{ display: "grid", gridTemplateColumns: "auto repeat(5, minmax(0, 1fr))", gap: 8, alignItems: "center", border: `2px solid ${INK}`, borderRadius: 10, padding: "11px 13px" }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: MUTED }}>HOW FAR?</span>
        {DAY_NAME.map((d) => (
          <span key={d} style={{ textAlign: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: MUTED, display: "block", marginBottom: 3 }}>
              {d.slice(0, 3)}
            </span>
            <span style={box(62, 30)} />
          </span>
        ))}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>
        On Friday I read <span style={{ display: "inline-block", width: 48, borderBottom: `2px solid ${INK}` }} /> more
        words than on Monday.
      </div>
    </section>
  );
}

/**
 * The week's maze answers, on their own sheet.
 *
 * They were printed at the foot of each day page first, which put the answer
 * to every maze item about two inches under the item. The child does not have
 * to cheat to be told; they only have to look down.
 */
function KeySheet({ lesson, multi }: { lesson: Lesson; multi: boolean }) {
  return (
    <section className="sheet" style={{ display: "flex", flexDirection: "column", gap: 11, paddingTop: 16 }}>
      <div style={{ borderBottom: `3px solid ${CORAL}`, paddingBottom: 7 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".18em", color: CORAL }}>
          {lesson.name.toUpperCase()} · TEACHER COPY
        </div>
        <div style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.05 }}>Answers for the week</div>
        <div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>
          The last page of this print. Take it out before you copy the week for a child.
        </div>
      </div>
      {lesson.days.map((d) => (
        <div key={d.day} style={{ display: "flex", gap: 12, alignItems: "baseline", borderBottom: `1px solid ${LINE}`, paddingBottom: 7 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: CORAL, width: 86, flex: "none" }}>
            {DAY_NAME[d.day - 1]}
          </span>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            {d.maze.map((m, i) => {
              const words = m.s.split(/\s+/);
              return (
                <div key={i} style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                  <b style={{ marginRight: 5 }}>{i + 1}.</b>
                  {words.map((w, j) => (j === m.at ? <b key={j} style={{ color: CORAL }}>{m.before}{m.answer}{m.after} </b> : <span key={j}>{w} </span>))}
                </div>
              );
            })}
            <div style={{ fontSize: 12, color: MUTED }}>
              Real words: {wordsFor(lesson, d, multi).wrf.join(", ")} · Silly words:{" "}
              {wordsFor(lesson, d, multi).nwf.join(", ")}
            </div>
          </div>
        </div>
      ))}
      {/*
        The race list used to be reprinted here. At seventy-two words it ran
        this sheet onto an eighth page, and it is not an answer to anything --
        the child's own race sheet is the list.
      */}
    </section>
  );
}

/**
 * THE RUNG BETWEEN A WORD LIST AND A PAGE OF TEXT.
 *
 * The week went from the word race straight to the passage, and phrasing is
 * what moves an oral reading RATE once the words themselves are accurate --
 * the first measure the grade-level plan circles. Every phrase is cut from
 * the passage on the day pages, so the practice transfers to the text it
 * came from.
 *
 * Each row prints the same phrase more than once on purpose: the rung works
 * by repetition, which is what reading it once is not.
 */
function PhraseLadder({ lesson }: { lesson: Lesson }) {
  const ph = lesson.phrases;
  return (
    <section className="sheet" style={{ display: "flex", flexDirection: "column", gap: 13, paddingTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, borderBottom: `3px solid ${TEAL}`, paddingBottom: 7 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".18em", color: TEAL }}>
            {lesson.name.toUpperCase()} · PHRASE LADDER · ORF
          </div>
          <div style={{ fontSize: 29, fontWeight: 800, lineHeight: 1.05 }}>🪜 Climb to the sentence</div>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 600, textAlign: "right" }}>
          Name ______________<br />Date ____________
        </div>
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.45, border: `1.5px solid ${LINE}`, borderRadius: 10, padding: "8px 12px" }}>
        <b>How:</b> read each row across — the same words again, smoother each time. Do not stop
        between the words in a box: a box is one piece of reading, not three. Climb a step a day
        and read the whole ladder on Friday.
      </div>

      <Part n={1} label="The words" measure="WRF" how="read down the columns">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "5px 10px" }}>
          {ph.words.map((w) => (
            <span key={w} style={{ fontSize: 17, fontWeight: 650, whiteSpace: "nowrap" }}>{w}</span>
          ))}
        </div>
      </Part>

      <Part n={2} label="Three words together" measure="PHRASE" how="three times across">
        {ph.short.map((x) => (
          <div key={x} style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 9 }}>
            {[0, 1, 2].map((i) => <span key={i} style={{ fontSize: 16, fontWeight: 600 }}>{x}</span>)}
          </div>
        ))}
      </Part>

      <Part n={3} label="Longer pieces" measure="PHRASE" how="twice across">
        {ph.long.map((x) => (
          <div key={x} style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            {[0, 1].map((i) => <span key={i} style={{ fontSize: 16, fontWeight: 600 }}>{x}</span>)}
          </div>
        ))}
      </Part>

      <Part n={4} label="The whole sentence" measure="ORF" how="where the ladder was going">
        {ph.sentences.map((x, i) => (
          <div key={i} style={{ fontSize: 16, lineHeight: 1.55 }}>{i + 1}. {x}</div>
        ))}
      </Part>

      <div style={{ display: "grid", gridTemplateColumns: "auto repeat(5, minmax(0, 1fr))", gap: 8, alignItems: "center", border: `2px solid ${INK}`, borderRadius: 10, padding: "9px 12px" }}>
        <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".12em", color: TEAL }}>WHICH STEP?</span>
        {DAY_NAME.map((d) => (
          <span key={d} style={{ textAlign: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, display: "block", marginBottom: 3 }}>{d.slice(0, 3)}</span>
            <span style={{ display: "inline-block", width: 62, height: 28, border: `2px solid ${INK}`, borderRadius: 4 }} />
          </span>
        ))}
      </div>
    </section>
  );
}

/**
 * A MINUTE OF PHONEMIC AWARENESS, WHICH THE WEEK DID NOT HAVE.
 *
 * The grade-level plan's decision chart puts "Kilpatrick, 1 minute" against
 * Well Below and Below for phonemic awareness, and nothing here did any. It
 * is aural -- no letters, no text, nothing shown to the child and nothing
 * written down by them -- so this is a teacher's card, and it says so.
 */
function SoundDrill({ lesson }: { lesson: Lesson }) {
  const drills: [string, string[]][] = [
    ["TAKE THE FIRST SOUND OFF", lesson.pa.drop.map(([w, g, a]) => `Say "${w}". Now say it without /${g}/.  [${a}]`)],
    ["TAKE THE LAST SOUND OFF", lesson.pa.chop.map(([w, g, a]) => `Say "${w}". Now say it without /${g}/.  [${a}]`)],
    ["CHANGE THE FIRST SOUND", lesson.pa.swap.map(([w, f, t, a]) => `Say "${w}". Change /${f}/ to /${t}/.  [${a}]`)],
    ["TAKE A WHOLE SYLLABLE OFF", lesson.pa.syll.map(([w, part, a]) => `Say "${w}". Now say it without "${part}".  [${a}]`)],
  ];
  return (
    <section className="sheet" style={{ display: "flex", flexDirection: "column", gap: 13, paddingTop: 16 }}>
      <div style={{ borderBottom: `3px solid ${CORAL}`, paddingBottom: 7 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".18em", color: CORAL }}>
          {lesson.name.toUpperCase()} · SOUND DRILL · TEACHER COPY
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.05 }}>🔊 One minute, no letters</div>
        <div style={{ fontSize: 12.5, color: MUTED, marginTop: 3 }}>
          Say the word, ask the question, the child answers out loud. Nothing is shown and nothing
          is written — if a child needs help, use counters for the sounds, never letters. The
          answer is in brackets. Two minutes at most; stop while it is still fast.
        </div>
      </div>
      {drills.map(([head, items]) => (
        <section key={head} style={{ display: "flex", flexDirection: "column", gap: 4, breakInside: "avoid" }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".12em", color: CORAL, borderBottom: `2px solid ${LINE}`, paddingBottom: 3 }}>
            {head}
          </div>
          {items.map((t, i) => (
            <div key={i} style={{ fontSize: 14, lineHeight: 1.4 }}>{i + 1}. {t}</div>
          ))}
        </section>
      ))}
    </section>
  );
}

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string; multi?: string }>;
}) {
  const sp = await searchParams;
  const lesson = D.lessons.find((l) => l.key === sp.lesson) ?? D.lessons[8];
  const levels = [...new Set(D.lessons.map((l) => l.level))].sort();
  // The switch lives in the URL, the way the lesson does, so a teacher can
  // send somebody the harder week as a link and a print carries what the page
  // was showing.
  const multi = sp.multi === "1";
  const hasMulti = Boolean(lesson.msDays);
  const href = (key: string, m: boolean) => `/practice?lesson=${key}${m ? "&multi=1" : ""}`;

  return (
    <>
      <div className="noprint"><Header /></div>
      <SignInGate
        title="Daily practice"
        blurb="Five pages, one a day, on the five measures a child is scored on. Free — an account is all it takes."
      >
        <style>{`
          @page { size: letter portrait; margin: 0.5in; }
          @media print {
            .noprint { display: none !important; }
            .sheet { break-after: page; page-break-after: always; min-height: 9.3in; }
            .sheet:last-of-type { break-after: auto; page-break-after: auto; }
            body { background: #fff; }
            /* The screen padding below the last page is still 60px of box in
               print, and a Level 5 day page fills enough of the sheet that
               those 60px landed on a sixth, blank page. */
            main { padding-top: 0 !important; padding-bottom: 0 !important; }
          }
        `}</style>

        <main style={{ fontFamily: SANS, color: INK, background: "#fff", maxWidth: 880, margin: "0 auto", padding: "26px 20px 60px" }}>
          <div className="noprint">
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".16em", color: TEAL }}>FIVE MINUTES A DAY</div>
            <h1 style={{ fontSize: 33, fontWeight: 800, margin: "4px 0 6px", lineHeight: 1.1 }}>Daily practice</h1>
            <p style={{ fontSize: 15.5, color: MUTED, margin: "0 0 16px", lineHeight: 1.55 }}>
              The data chat reports five numbers and leaves a child with a goal and nothing to do
              about it. This is the something to do — five pages, one a day, on all five measures,
              built from the concept the lesson is teaching. Five day pages, then the word race and
              the answers. The passage and the race stay the same all week; the words and the maze
              change every day.
            </p>

            {levels.map((lv) => (
              <div key={lv} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", color: MUTED, marginBottom: 5 }}>
                  LEVEL {lv}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {D.lessons.filter((l) => l.level === lv).map((l) => {
                    const on = l.key === lesson.key;
                    return (
                      <Link
                        key={l.key}
                        href={href(l.key, multi)}
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          textDecoration: "none",
                          border: `1.5px solid ${on ? TEAL : LINE}`,
                          background: on ? TEAL : "#fff",
                          color: on ? "#fff" : INK,
                          borderRadius: 999,
                          padding: "4px 11px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {l.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <Link
                href={href(lesson.key, !multi)}
                aria-disabled={!hasMulti}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                  border: `1.5px solid ${multi && hasMulti ? CORAL : LINE}`,
                  background: multi && hasMulti ? CORAL : "#fff",
                  color: multi && hasMulti ? "#fff" : hasMulti ? INK : MUTED,
                  borderRadius: 999,
                  padding: "6px 14px",
                  pointerEvents: hasMulti ? undefined : "none",
                  opacity: hasMulti ? 1 : 0.55,
                }}
              >
                🧗 {multi && hasMulti ? "Multisyllabic words: ON" : "Use multisyllabic words"}
              </Link>
              <span style={{ fontSize: 12.5, color: MUTED }}>
                {hasMulti
                  ? "Swaps the six real words and four silly words for two-syllable ones. The passage, the maze and the race do not change."
                  : "This lesson's pattern has no two-syllable words, so there is nothing to switch to."}
              </span>
            </div>
            <hr style={{ border: 0, borderTop: `1.5px solid ${LINE}`, margin: "14px 0 0" }} />
          </div>

          {lesson.days.map((d) => (
            <DayPage key={d.day} lesson={lesson} d={d} multi={multi} />
          ))}
          <RaceSheet lesson={lesson} />
          <PhraseLadder lesson={lesson} />
          <SoundDrill lesson={lesson} />
          <KeySheet lesson={lesson} multi={multi} />
        </main>
      </SignInGate>
      <div className="noprint"><Footer /></div>
    </>
  );
}
