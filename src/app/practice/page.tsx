import Link from "next/link";
import type { Metadata } from "next";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import DAILY from "@/../scripts/reading-daily-practice.json";
import { mazeTokens } from "@/../scripts/lib/maze.mjs";

/**
 * Five days of daily practice, on the five things a child is scored on.
 *
 * THE DATA CHAT REPORTS SIX NUMBERS and leaves a child with a goal and nothing
 * to do about it. This is the something to do: a week's worth of five-minute
 * practice on reading fluency, accuracy, letter sounds, word reading and the
 * maze, built from the concept the lesson is teaching.
 *
 * THREE SHEETS FOR A WHOLE WEEK, not five. The passage is printed once because
 * repeated reading of ONE passage is what moves fluency and accuracy -- the
 * child reads it Monday and again Friday and the log shows the change. Word
 * reading and letter sounds are different words every day, because reading the
 * same ten words five times measures memory. The maze is numbered so three
 * items a day gets through it by Friday.
 */

type Token =
  | { kind: "text"; s: string }
  | { kind: "blank"; n: number; choices: string[]; answer: string; before: string; after: string };

type Day = { day: number; wrf: string[]; nwf: string[]; every: number; seed: number };
type Lesson = {
  key: string;
  name: string;
  level: number;
  passage: { title: string; paras: string[]; words: number };
  days: Day[];
};

const D = DAILY as unknown as { perDay: { wrf: number; nwf: number }; lessons: Lesson[] };

const SANS = "'Poppins', system-ui, -apple-system, sans-serif";
const INK = "#111111";
const MUTED = "#57534e";
const TEAL = "#00897B";
const CORAL = "#C0432F";
const LINE = "#E7E5E4";
const DAY_NAME = ["MON", "TUE", "WED", "THU", "FRI"];

export const metadata: Metadata = {
  title: "Daily Practice",
  description:
    "Five days of five-minute practice on the five measures a child is scored on, built from the concept the lesson is teaching.",
  openGraph: ogCard("/og/science-of-reading.png"),
  twitter: twitterCard("/og/science-of-reading.png"),
};

function Sheet({ eyebrow, title, how, children }: {
  eyebrow: string;
  title: string;
  how: string;
  children: React.ReactNode;
}) {
  return (
    <section className="sheet" style={{ display: "flex", flexDirection: "column", gap: 11, paddingTop: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, borderBottom: `3px solid ${TEAL}`, paddingBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".18em", color: TEAL }}>{eyebrow}</div>
          <div style={{ fontSize: 25, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>Name ________ Week ______</div>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.5, background: "#F0FAF8", border: `1.5px solid ${TEAL}`, borderRadius: 10, padding: "8px 13px" }}>
        <b>How:</b> {how}
      </div>
      {children}
    </section>
  );
}

const box = (w: number) => ({
  display: "inline-block",
  width: w,
  height: 22,
  border: `2px solid ${INK}`,
  borderRadius: 4,
  verticalAlign: "middle",
});

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const sp = await searchParams;
  const lesson = D.lessons.find((l) => l.key === sp.lesson) ?? D.lessons[8];
  const text = lesson.passage.paras.join(" ");

  // One maze for the week, numbered so three a day gets through it. Monday's
  // spacing is used, because the blanks have to be in one printed text.
  const tokens = mazeTokens(text, {
    every: lesson.days[0].every,
    seed: lesson.days[0].seed,
    max: 15,
  }) as Token[];
  const answers = tokens.filter((t): t is Extract<Token, { kind: "blank" }> => t.kind === "blank");

  const levels = [...new Set(D.lessons.map((l) => l.level))].sort();

  return (
    <>
      <div className="noprint"><Header /></div>
      <SignInGate
        title="Daily practice"
        blurb="Five days of five-minute practice on the five measures a child is scored on. Free — an account is all it takes."
      >
        <style>{`
          @page { size: letter portrait; margin: 0.5in; }
          @media print {
            .noprint { display: none !important; }
            .sheet { break-after: page; page-break-after: always; min-height: 9.4in; }
            .sheet:last-of-type { break-after: auto; page-break-after: auto; }
            body { background: #fff; }
          }
        `}</style>

        <main style={{ fontFamily: SANS, color: INK, background: "#fff", maxWidth: 880, margin: "0 auto", padding: "26px 20px 60px" }}>
          <div className="noprint">
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".16em", color: TEAL }}>FIVE MINUTES A DAY</div>
            <h1 style={{ fontSize: 33, fontWeight: 800, margin: "4px 0 6px", lineHeight: 1.1 }}>Daily practice</h1>
            <p style={{ fontSize: 15.5, color: MUTED, margin: "0 0 16px", lineHeight: 1.55 }}>
              The data chat reports five numbers and leaves a child with a goal and nothing to do
              about it. This is the something to do — a week on all five, built from the concept the
              lesson is teaching. Three sheets cover the whole week.
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

          {/* 1 — the passage, read every day, and the log that shows the change */}
          <Sheet
            eyebrow={`READING OUT LOUD + GETTING WORDS RIGHT · ${lesson.name.toUpperCase()}`}
            title={`📖 ${lesson.passage.title}`}
            how="Read it out loud for one minute every day. Mark where you stop. Count the words you read and the ones you missed, and write both in the log. Read the SAME passage all week — that is what makes it faster."
          >
            <div style={{ fontSize: 17.5, lineHeight: 1.85 }}>
              {lesson.passage.paras.map((p, i) => (
                <p key={i} style={{ margin: "0 0 9px" }}>{p}</p>
              ))}
            </div>
            <div style={{ fontSize: 12.5, color: MUTED, fontWeight: 600 }}>
              {lesson.passage.words} words in all
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "auto repeat(4, minmax(0, 1fr))", gap: 7, alignItems: "center", border: `2px solid ${INK}`, borderRadius: 10, padding: "9px 12px" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: MUTED }}>DAY</span>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: MUTED, textAlign: "center" }}>WORDS READ</span>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: MUTED, textAlign: "center" }}>WORDS WRONG</span>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: MUTED, textAlign: "center" }}>RIGHT</span>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: MUTED, textAlign: "center" }}>HOW IT FELT</span>
              {DAY_NAME.map((d) => (
                <Fragmentish key={d} day={d} />
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              Friday I read <span style={{ display: "inline-block", width: 48, borderBottom: `2px solid ${INK}` }} /> more
              words than on Monday.
            </div>
          </Sheet>

          {/* 2 — the week's word work, different words every day */}
          <Sheet
            eyebrow={`WORD RACE + SILLY WORD SOUNDS · ${lesson.name.toUpperCase()}`}
            title="🏁 Words for the week"
            how="One row a day. Read the real words down the row, then the silly words. Tick each one you read right the first time. The silly words are not real — read them anyway, sound by sound or all at once."
          >
            {lesson.days.map((d) => (
              <div key={d.day} style={{ border: `1.5px solid ${LINE}`, borderRadius: 10, padding: "8px 11px", display: "flex", flexDirection: "column", gap: 6, breakInside: "avoid" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: TEAL, flex: "none", width: 34 }}>
                    {DAY_NAME[d.day - 1]}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: MUTED, flex: "none", width: 74 }}>
                    REAL WORDS
                  </span>
                  <span style={{ display: "flex", gap: 7, flexWrap: "wrap", flex: 1 }}>
                    {d.wrf.map((w, i) => (
                      <span key={`${w}-${i}`} style={{ fontSize: 17, fontWeight: 650, whiteSpace: "nowrap" }}>
                        ☐ {w}
                      </span>
                    ))}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap" }}>
                    __ / {d.wrf.length}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: `1px dashed ${LINE}`, paddingTop: 5 }}>
                  <span style={{ flex: "none", width: 34 }} />
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: CORAL, flex: "none", width: 74 }}>
                    SILLY WORDS
                  </span>
                  <span style={{ display: "flex", gap: 7, flexWrap: "wrap", flex: 1 }}>
                    {d.nwf.map((w, i) => (
                      <span key={`${w}-${i}`} style={{ fontSize: 17, fontWeight: 650, whiteSpace: "nowrap" }}>
                        ☐ {w}
                      </span>
                    ))}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap" }}>
                    __ / {d.nwf.length}
                  </span>
                </div>
              </div>
            ))}
            <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.45, borderTop: `1.5px solid ${LINE}`, paddingTop: 7 }}>
              A silly word read sound by sound counts, and read all at once counts too. Both ways are
              right — the second one is the one that comes last.
            </div>
          </Sheet>

          {/* 3 — the maze, numbered so three a day gets through it */}
          {answers.length > 0 && (
            <Sheet
              eyebrow={`UNDERSTANDING WHAT I READ · ${answers.length} CHOICES`}
              title="🧩 Fill in the blank"
              how="Three a day gets you through it by Friday. Read the whole sentence first, then circle the word in the brackets that makes it make sense."
            >
              <div style={{ fontSize: 17.5, lineHeight: 2.15 }}>
                {tokens.map((t, i) =>
                  t.kind === "text" ? (
                    <span key={i}>{t.s} </span>
                  ) : (
                    <span key={i} style={{ whiteSpace: "nowrap" }}>
                      {t.before}
                      <span style={{ border: `1.5px solid ${INK}`, borderRadius: 7, padding: "2px 7px", fontWeight: 650 }}>
                        <sup style={{ fontSize: 10, fontWeight: 800, color: TEAL, marginRight: 4 }}>{t.n}</sup>
                        {t.choices.join("  /  ")}
                      </span>
                      {t.after}{" "}
                    </span>
                  ),
                )}
              </div>
              <div style={{ border: `2px dashed ${CORAL}`, borderRadius: 10, padding: "9px 13px", marginTop: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: CORAL, marginBottom: 5 }}>
                  ANSWER KEY · TEACHER COPY
                </div>
                <div style={{ fontSize: 13.5, lineHeight: 1.7, color: MUTED }}>
                  {answers.map((a) => (
                    <span key={a.n} style={{ marginRight: 14, whiteSpace: "nowrap" }}>
                      <b style={{ color: INK }}>{a.n}.</b> {a.answer}
                    </span>
                  ))}
                </div>
              </div>
            </Sheet>
          )}
        </main>
      </SignInGate>
      <div className="noprint"><Footer /></div>
    </>
  );
}

/** One row of the fluency log: the day, then boxes to write the numbers in. */
function Fragmentish({ day }: { day: string }) {
  return (
    <>
      <span style={{ fontSize: 13, fontWeight: 800, color: INK }}>{day}</span>
      <span style={{ textAlign: "center" }}><span style={box(58)} /></span>
      <span style={{ textAlign: "center" }}><span style={box(58)} /></span>
      <span style={{ textAlign: "center" }}><span style={box(58)} /></span>
      <span style={{ textAlign: "center", fontSize: 15 }}>🙂 😐 🙁</span>
    </>
  );
}
