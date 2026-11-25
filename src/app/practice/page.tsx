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
  race: string[];
  days: Day[];
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
const CORAL = "#C0432F";
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
function DayPage({ lesson, d }: { lesson: Lesson; d: Day }) {
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

      <Part n={2} label="Real words and silly words" measure="WRF + NWF" how="read each one, tick it">
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".1em", color: TEAL, width: 74, flex: "none" }}>
            REAL
          </span>
          <span style={{ display: "flex", gap: 9, flexWrap: "wrap", flex: 1 }}>
            {d.wrf.map((w, i) => <Tick key={`${w}-${i}`} w={w} />)}
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>__ / {d.wrf.length}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", borderTop: `1px dashed ${LINE}`, paddingTop: 5 }}>
          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".1em", color: CORAL, width: 74, flex: "none" }}>
            SILLY
          </span>
          <span style={{ display: "flex", gap: 9, flexWrap: "wrap", flex: 1 }}>
            {d.nwf.map((w, i) => <Tick key={`${w}-${i}`} w={w} />)}
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>__ / {d.nwf.length}</span>
        </div>
        <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>
          The silly words are not real. Sound by sound counts, and all at once counts too.
        </div>
      </Part>

      <Part n={3} label="Fill in the blank" measure="MAZE" how="circle the word that fits">
        {d.maze.map((m, i) => <MazeLine key={i} m={m} n={i + 1} />)}
      </Part>

      <Part n={4} label="Word race" measure="WRF" how="⏱ 1 minute — how far do you get?">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "4px 8px" }}>
          {lesson.race.map((w, i) => (
            <span key={`${w}-${i}`} style={{ fontSize: 15.5, fontWeight: 650 }}>{w}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, fontWeight: 700, borderTop: `1px dashed ${LINE}`, paddingTop: 6 }}>
          <span>Words read in a minute <span style={box(50)} /></span>
          <span style={{ color: MUTED, fontWeight: 600 }}>
            Same list every day. Friday should be further down it than Monday.
          </span>
        </div>
      </Part>

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
function KeySheet({ lesson }: { lesson: Lesson }) {
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
              Real words: {d.wrf.join(", ")} · Silly words: {d.nwf.join(", ")}
            </div>
          </div>
        </div>
      ))}
      <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5 }}>
        <b style={{ color: INK }}>Word race, the same list all week:</b> {lesson.race.join(", ")}.
      </div>
    </section>
  );
}

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const sp = await searchParams;
  const lesson = D.lessons.find((l) => l.key === sp.lesson) ?? D.lessons[8];
  const levels = [...new Set(D.lessons.map((l) => l.level))].sort();

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
              built from the concept the lesson is teaching. The passage and the word race stay the
              same all week; the words and the maze change every day.
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
                        href={`/practice?lesson=${l.key}`}
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
            <hr style={{ border: 0, borderTop: `1.5px solid ${LINE}`, margin: "14px 0 0" }} />
          </div>

          {lesson.days.map((d) => (
            <DayPage key={d.day} lesson={lesson} d={d} />
          ))}
          <KeySheet lesson={lesson} />
        </main>
      </SignInGate>
      <div className="noprint"><Footer /></div>
    </>
  );
}
