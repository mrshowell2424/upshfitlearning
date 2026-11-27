import Link from "next/link";
import type { Metadata } from "next";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import BENCHMARK from "@/../scripts/reading-benchmark.json";
import { articlesForGrade } from "@/lib/articles-by-grade";
import { mazeTokens, seedFrom } from "@/../scripts/lib/maze.mjs";

/**
 * The three mClass measures the Hub had no practice for.
 *
 * The data chat explains six measures. The fluency page already covers oral
 * reading and its accuracy, and the comprehension work sits beside the
 * articles, which left three with nothing behind them: the timed list of real
 * words, the timed list of made-up ones, and the maze.
 *
 * WHY THE MADE-UP WORDS MATTER, and why they are a chosen list rather than a
 * generated one: a real word can be recognised instead of decoded, so a list
 * of only real words flatters a child who has memorised them. A made-up word
 * can only be decoded. That only holds if the made-up words are genuinely made
 * up, which took four audits to achieve -- see scripts/lib/nwf-pools.mjs.
 *
 * THE MAZE IS A TOGGLE, not a separate page. A teacher wants the same passage
 * either way: read straight through to hear it, or with every seventh word
 * replaced by three choices to see whether the sense is landing. Making it a
 * switch keeps those one click apart on the same text.
 */

type Token =
  | { kind: "text"; s: string }
  | { kind: "blank"; n: number; choices: string[]; answer: string; before: string; after: string };

const B = BENCHMARK as unknown as {
  levels: number[];
  wrf: Record<string, string[]>;
  nwf: Record<string, string[]>;
};

const SANS = "'Poppins', system-ui, -apple-system, sans-serif";
const INK = "#111111";
const MUTED = "#57534e";
const TEAL = "#00897B";
const CORAL = "#733A32";
const LINE = "#E7E5E4";

export const metadata: Metadata = {
  title: "Benchmark Practice",
  description:
    "Practice for the three mClass measures the Hub had nothing for: Word Race, Silly Words, and the Maze.",
  openGraph: ogCard("/og/science-of-reading.png"),
  twitter: twitterCard("/og/science-of-reading.png"),
};

const GRADES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
const gradeName = (g: number) => (g === 0 ? "K" : `${g}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[g] || "th"}`);

/**
 * Which word list a grade reads.
 *
 * The lists follow the reading sequence's own five levels rather than grades,
 * because every other word list on the site does and a second scheme would
 * guarantee the two drift. The page says which level it picked, so the choice
 * is visible rather than silent.
 */
const levelForGrade = (g: number) => (g <= 1 ? 1 : g === 2 ? 2 : g === 3 ? 3 : g === 4 ? 4 : 5);

function Sheet({
  eyebrow,
  title,
  how,
  children,
}: {
  eyebrow: string;
  title: string;
  how: string;
  children: React.ReactNode;
}) {
  return (
    <section className="sheet" style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 12,
          borderBottom: `3px solid ${TEAL}`,
          paddingBottom: 8,
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".18em", color: TEAL }}>{eyebrow}</div>
          <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>Name ________ Date ______</div>
      </div>
      <div
        style={{
          fontSize: 14.5,
          lineHeight: 1.5,
          background: "#F0FAF8",
          border: `1.5px solid ${TEAL}`,
          borderRadius: 10,
          padding: "9px 14px",
        }}
      >
        <b>How:</b> {how}
      </div>
      {children}
    </section>
  );
}

function WordGrid({ words, columns }: { words: string[]; columns: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: "9px 10px" }}>
      {words.map((w, i) => (
        <div
          key={`${w}-${i}`}
          style={{
            fontSize: 20,
            fontWeight: 650,
            letterSpacing: ".01em",
            textAlign: "center",
            padding: "5px 2px",
            borderBottom: `1px solid ${LINE}`,
          }}
        >
          {w}
        </div>
      ))}
    </div>
  );
}

export default async function BenchmarkPage({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string; maze?: string }>;
}) {
  const sp = await searchParams;
  const grade = GRADES.includes(Number(sp.grade) as never) ? Number(sp.grade) : 2;
  const mazeOn = sp.maze !== "off";
  const level = levelForGrade(grade);

  const race = B.wrf[String(level)] ?? [];
  const silly = B.nwf[String(level)] ?? [];

  // One passage for the maze, from this grade's own articles. The lower Lexile
  // version, because the maze is about whether the sense is landing and the
  // harder text turns it into a vocabulary test.
  const articles = await articlesForGrade(grade);
  const article = articles[0] ?? null;
  const passage = article ? article.lower.paras.map((p) => p.text).join(" ") : "";
  const tokens: Token[] = passage
    ? (mazeTokens(passage, { every: 7, seed: seedFrom(article!.id), max: 30 }) as Token[])
    : [];
  const answers = tokens.filter((t): t is Extract<Token, { kind: "blank" }> => t.kind === "blank");

  const href = (next: { grade?: number; maze?: boolean }) => {
    const g = next.grade ?? grade;
    const m = next.maze ?? mazeOn;
    return `/benchmark?grade=${g}${m ? "" : "&maze=off"}`;
  };

  return (
    <>
      <div className="noprint">
        <Header />
      </div>
      <SignInGate
        title="Benchmark practice"
        blurb="Word Race, Silly Words and the Maze — the three mClass measures with no practice behind them. Free, an account is all it takes."
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

        <main
          style={{
            fontFamily: SANS,
            color: INK,
            background: "#fff",
            maxWidth: 880,
            margin: "0 auto",
            padding: "28px 20px 64px",
          }}
        >
          <div className="noprint">
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".16em", color: TEAL }}>
              MCLASS PRACTICE
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 800, margin: "4px 0 6px", lineHeight: 1.1 }}>
              Benchmark practice
            </h1>
            <p style={{ fontSize: 16, color: MUTED, margin: "0 0 18px", lineHeight: 1.55 }}>
              The three measures the data chat explains and the Hub had nothing for. Oral reading and
              its accuracy are on the fluency page; comprehension sits with the articles.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", color: MUTED, marginRight: 4 }}>
                GRADE
              </span>
              {GRADES.map((g) => (
                <Link
                  key={g}
                  href={href({ grade: g })}
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                    border: `1.5px solid ${g === grade ? TEAL : LINE}`,
                    background: g === grade ? TEAL : "#fff",
                    color: g === grade ? "#fff" : INK,
                    borderRadius: 999,
                    padding: "5px 13px",
                  }}
                >
                  {gradeName(g)}
                </Link>
              ))}
              <span style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, marginLeft: 6 }}>
                reads the level {level} lists
              </span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", color: MUTED, marginRight: 4 }}>
                MAZE
              </span>
              <Link
                href={href({ maze: true })}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                  border: `1.5px solid ${mazeOn ? TEAL : LINE}`,
                  background: mazeOn ? TEAL : "#fff",
                  color: mazeOn ? "#fff" : INK,
                  borderRadius: 999,
                  padding: "5px 15px",
                }}
              >
                On
              </Link>
              <Link
                href={href({ maze: false })}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                  border: `1.5px solid ${!mazeOn ? TEAL : LINE}`,
                  background: !mazeOn ? TEAL : "#fff",
                  color: !mazeOn ? "#fff" : INK,
                  borderRadius: 999,
                  padding: "5px 15px",
                }}
              >
                Off
              </Link>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: MUTED }}>
                {mazeOn
                  ? "the passage with every seventh word replaced by three choices"
                  : "the same passage, read straight through"}
              </span>
            </div>
            <hr style={{ border: 0, borderTop: `1.5px solid ${LINE}`, margin: "16px 0 0" }} />
          </div>

          <Sheet
            eyebrow={`WORD RACE · LEVEL ${level} · ${race.length} WORDS`}
            title="🏁 Word Race"
            how="One minute. The child reads down the columns. Mark anything missed or skipped, and count the words read correctly. These are real words — the ones taught up to this level plus the heart words that cannot be sounded out."
          >
            <WordGrid words={race} columns={6} />
          </Sheet>

          <Sheet
            eyebrow={`SILLY WORDS · LEVEL ${level} · ${silly.length} WORDS`}
            title="🤪 Silly Words"
            how="One minute. None of these are real words, and the child should be told so. Score it twice: sounds read correctly, and whole words read as one piece rather than sound by sound. The second number is the one that moves last."
          >
            <WordGrid words={silly} columns={6} />
            <div style={{ display: "flex", gap: 18, fontSize: 14, fontWeight: 700, paddingTop: 4 }}>
              <span>
                Sounds correct: <span style={{ display: "inline-block", width: 56, borderBottom: `2px solid ${INK}` }} />
              </span>
              <span>
                Whole words read: <span style={{ display: "inline-block", width: 56, borderBottom: `2px solid ${INK}` }} />
              </span>
            </div>
          </Sheet>

          {article && (
            <Sheet
              eyebrow={`MAZE · ${gradeName(grade)} · ${mazeOn ? `${answers.length} CHOICES` : "PLAIN TEXT"}`}
              title={`🧩 ${article.title}`}
              how={
                mazeOn
                  ? "Three minutes. The first sentence is whole. After that, circle the word in each set of three that makes the sentence make sense. Count the ones circled correctly."
                  : "The same passage with no choices in it, for reading straight through. Switch the maze on above to put the choices back."
              }
            >
              <div style={{ fontSize: 18, lineHeight: 2.1 }}>
                {mazeOn
                  ? tokens.map((t, i) =>
                      t.kind === "text" ? (
                        <span key={i}>{t.s} </span>
                      ) : (
                        <span key={i} style={{ whiteSpace: "nowrap" }}>
                          {t.before}
                          <span
                            style={{
                              border: `1.5px solid ${INK}`,
                              borderRadius: 7,
                              padding: "2px 8px",
                              fontWeight: 650,
                            }}
                          >
                            {t.choices.join("  /  ")}
                          </span>
                          {t.after}{" "}
                        </span>
                      ),
                    )
                  : article.lower.paras.map((p, i) => (
                      <p key={i} style={{ margin: "0 0 10px" }}>
                        {p.text}
                      </p>
                    ))}
              </div>

              {mazeOn && answers.length > 0 && (
                <div
                  style={{
                    border: `2px dashed ${CORAL}`,
                    borderRadius: 10,
                    padding: "10px 14px",
                    marginTop: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: ".14em",
                      color: CORAL,
                      marginBottom: 6,
                    }}
                  >
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
              )}
            </Sheet>
          )}
        </main>
      </SignInGate>
      <div className="noprint">
        <Footer />
      </div>
    </>
  );
}
