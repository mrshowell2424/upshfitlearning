import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import CASES from "@/../scripts/math-cases.json";

/**
 * Maths reasoning cases.
 *
 * The mysteries, in maths. A situation, the information you are given, a
 * question, and candidate answers — in two versions a teacher picks between.
 *
 * Solve: the numbers settle it, and every wrong answer is wrong for a reason
 * a child can point to in the problem. Not "you made a mistake" but "line 3
 * says one tray was short".
 *
 * Debate: one fact has been added or changed, and now more than one answer
 * holds up. Nobody is doing different arithmetic — they are dividing by a
 * different number, or counting a different thing, and the mathematics is in
 * saying which and why. That is the part of the subject a worksheet cannot
 * reach, and it is the part that transfers.
 *
 * Every solve answer on this page has been re-derived by
 * scripts/check-math-cases.mjs from an expression the case carries, using
 * the same parser the generated practice uses. The checker also holds the
 * structure: no option goes unruled-out, no debate position stands without
 * both evidence for it and a line against it.
 */

type Opt = { label: string; value: string };
type Arg = { option: number; evidence: number[]; against: number; why: string };
type Rule = { option: number; because: number; why: string };
type Debate = {
  given: string[];
  question: string;
  options: Opt[];
  opened_by: number | null;
  open: number[];
  arguments: Arg[];
  note: string;
};
type Case = {
  id: string;
  grade: number;
  code: string;
  tag: string;
  title: string;
  given: string[];
  question: string;
  options: Opt[];
  answer: number;
  chk: string;
  uses?: string[];
  decider: number[];
  proof: number[];
  rules_out: Rule[];
  explain: string;
  debate: Debate;
};

const ALL = CASES.cases as Case[];
const GRADES = CASES.grades as string[];

const BRAND = {
  ink: "#111111",
  mid: "#444444",
  soft: "#6A6A6A",
  line: "#E9E9E9",
  coralDark: "#C0432F",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
  amberDark: "#8A5400",
};
const GRADIENT = "linear-gradient(135deg, #FF6A5B, #FF7DAE, #B87DFF, #00B4A6)";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const label: React.CSSProperties = {
  fontFamily: "Poppins, system-ui, sans-serif",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: BRAND.mid,
};
// The brand book, in globals.css: Poppins is the whole interface,
// headings and running text alike. The serif belongs to lines a child
// reads, and this is a teacher planning a lesson.
const SANS = "Poppins, system-ui, sans-serif";

function pill(on: boolean, color: string): React.CSSProperties {
  return {
    fontFamily: "Poppins, system-ui, sans-serif",
    fontSize: 12.5,
    fontWeight: 800,
    padding: "7px 13px",
    minHeight: 38,
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    textDecoration: "none",
    border: `1.5px solid ${on ? color : BRAND.line}`,
    background: on ? color : "#FFFFFF",
    color: on ? "#FFFFFF" : BRAND.ink,
    whiteSpace: "nowrap",
  };
}

/** The numbered information, which is what every answer has to point at. */
function Given({ lines, mark }: { lines: string[]; mark?: number | null }) {
  return (
    <ol style={{ margin: "0 0 16px", padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
      {lines.map((t, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "baseline",
            border: `1px solid ${i === mark ? BRAND.amberDark : BRAND.line}`,
            borderRadius: 10,
            padding: "9px 12px",
            fontSize: 15.5,
            lineHeight: 1.5,
            fontFamily: SANS,
          }}
        >
          <span style={{ ...label, fontSize: 10, color: i === mark ? BRAND.amberDark : BRAND.soft }}>
            {i + 1}
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ol>
  );
}

export const metadata = {
  title: "Maths reasoning cases",
  description:
    "A situation, the information given, and candidate answers — in two versions. Solve, where the numbers settle it. Debate, where more than one answer holds up if the student can justify it.",
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const askedGrade = Number(one(sp.g));
  const grade = ALL.some((c) => c.grade === askedGrade) ? askedGrade : 3;
  const here = ALL.filter((c) => c.grade === grade);
  const debate = one(sp.v) === "debate";

  const href = (next: { g?: number; v?: "solve" | "debate" }) => {
    const q = new URLSearchParams();
    q.set("g", String(next.g ?? grade));
    const v = next.v ?? (debate ? "debate" : "solve");
    if (v === "debate") q.set("v", "debate");
    return `/math/cases?${q.toString()}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <SignInGate
          title="Maths reasoning cases"
          blurb="A situation, the numbers you are given, and answers worth arguing about. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />

          <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
            <p style={{ ...label, margin: "0 0 6px", color: BRAND.coralDark }}>
              Ten minutes, out loud
            </p>
            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 40,
                fontWeight: 900,
                letterSpacing: "-1px",
                margin: "0 0 6px",
                lineHeight: 1.1,
              }}
            >
              Maths reasoning cases
            </h1>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 17,
                lineHeight: 1.65,
                color: BRAND.mid,
                maxWidth: "62ch",
                margin: "0 0 10px",
              }}
            >
              The mysteries, in maths. A situation, the information you are given, and answers to
              choose between — in two versions. <b>Solve</b>, where the numbers settle it and every
              wrong answer is wrong for a reason a child can point to. <b>Debate</b>, where one fact
              has changed and more than one answer holds up, so long as the student can say what
              their number assumes.
            </p>
            <p style={{ fontSize: 13, color: BRAND.mid, margin: "0 0 22px" }}>
              <Link href="/math" style={{ color: BRAND.tealDark, fontWeight: 700, textDecoration: "none" }}>
                ← Math Hub
              </Link>
            </p>

            {/* Which version. The toggle comes first, because it changes what
                is printed on the board rather than only what is shown here. */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 16px" }}>
              <Link href={href({ v: "solve" })} style={pill(!debate, BRAND.coralDark)}>
                Solve — one right answer
              </Link>
              <Link href={href({ v: "debate" })} style={pill(debate, BRAND.lavenderDark)}>
                Debate — justify any of them
              </Link>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "0 0 26px" }}>
              {GRADES.map((g, i) =>
                ALL.some((c) => c.grade === i) ? (
                  <Link
                    key={g}
                    href={href({ g: i })}
                    style={{ ...pill(i === grade, BRAND.tealDark), fontSize: 11.5, padding: "5px 11px", minHeight: 32 }}
                  >
                    {i === 0 ? "K" : i}
                  </Link>
                ) : null,
              )}
              <span style={{ ...label, alignSelf: "center", marginLeft: 4 }}>{GRADES[grade]}</span>
            </div>

            {here.map((c) => {
              const d = c.debate;
              const given = debate ? d.given : c.given;
              const options = debate ? d.options : c.options;
              const question = debate ? d.question : c.question;
              const accent = debate ? BRAND.lavenderDark : BRAND.coralDark;

              return (
                <article
                  key={c.id}
                  style={{
                    border: `1px solid ${BRAND.line}`,
                    borderTop: `3px solid ${BRAND.ink}`,
                    borderRadius: "3px 3px 18px 18px",
                    padding: "20px 22px 18px",
                    margin: "0 0 20px",
                  }}
                >
                  <p style={{ ...label, margin: "0 0 4px", color: accent }}>
                    {c.tag} · {c.code} · {debate ? "debate" : "solve"}
                  </p>
                  <h2 style={{ fontFamily: SANS, fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 14px", lineHeight: 1.2 }}>
                    {c.title}
                  </h2>

                  <p style={{ ...label, margin: "0 0 8px" }}>What you are given</p>
                  <Given lines={given} mark={debate ? d.opened_by : null} />

                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 19,
                      fontWeight: 700,
                      lineHeight: 1.45,
                      margin: "0 0 14px",
                      paddingLeft: 12,
                      borderLeft: `3px solid ${accent}`,
                    }}
                  >
                    {question}
                  </p>

                  <div style={{ display: "grid", gap: 8, margin: "0 0 14px" }}>
                    {options.map((o, i) => (
                      <div
                        key={o.value}
                        style={{
                          border: `1px solid ${BRAND.line}`,
                          borderRadius: 10,
                          padding: "10px 13px",
                          fontSize: 15.5,
                          fontFamily: SANS,
                          display: "flex",
                          gap: 10,
                          alignItems: "baseline",
                        }}
                      >
                        <span style={{ ...label, fontSize: 10, color: BRAND.soft }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{o.label}</span>
                      </div>
                    ))}
                  </div>

                  {debate ? (
                    <details className="disclosure">
                      <summary style={{ cursor: "pointer", listStyle: "none", ...label, fontSize: 11, color: BRAND.ink }}>
                        What each answer can argue, and what argues back
                      </summary>
                      <div style={{ paddingTop: 12, display: "grid", gap: 10 }}>
                        {d.arguments.map((a) => (
                          <div
                            key={a.option}
                            style={{
                              border: `1px solid ${BRAND.line}`,
                              borderLeft: `3px solid ${BRAND.lavenderDark}`,
                              borderRadius: "3px 10px 10px 3px",
                              padding: "11px 14px",
                            }}
                          >
                            <p style={{ ...label, margin: "0 0 4px", color: BRAND.lavenderDark }}>
                              {String.fromCharCode(65 + a.option)} · {d.options[a.option].label}
                            </p>
                            <p style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 6px", color: BRAND.ink }}>
                              {a.why}
                            </p>
                            <p style={{ fontSize: 13.5, lineHeight: 1.55, margin: 0, color: BRAND.mid }}>
                              <b>Leans on</b> line{a.evidence.length > 1 ? "s" : ""}{" "}
                              {a.evidence.map((n) => n + 1).join(", ")}. <b>Argued against by</b> line{" "}
                              {a.against + 1}.
                            </p>
                          </div>
                        ))}
                        <p
                          style={{
                            fontSize: 15,
                            lineHeight: 1.65,
                            margin: 0,
                            padding: "12px 14px",
                            background: "#FAFAFA",
                            borderRadius: 10,
                            color: BRAND.mid,
                          }}
                        >
                          <b style={{ color: BRAND.ink }}>For you, not the board. </b>
                          {d.note}
                        </p>
                      </div>
                    </details>
                  ) : (
                    <details className="disclosure">
                      <summary style={{ cursor: "pointer", listStyle: "none", ...label, fontSize: 11, color: BRAND.ink }}>
                        The answer, and why each other one is out
                      </summary>
                      <div style={{ paddingTop: 12 }}>
                        <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 4px", fontFamily: SANS }}>
                          {String.fromCharCode(65 + c.answer)} · {c.options[c.answer].label}
                        </p>
                        <p style={{ fontSize: 13.5, color: BRAND.mid, margin: "0 0 10px" }}>
                          From line{c.proof.length > 1 ? "s" : ""} {c.proof.map((n) => n + 1).join(", ")}.
                        </p>
                        <p style={{ fontSize: 15.5, lineHeight: 1.65, margin: "0 0 12px" }}>{c.explain}</p>
                        <div style={{ display: "grid", gap: 7 }}>
                          {c.rules_out.map((r) => (
                            <p
                              key={r.option}
                              style={{
                                fontSize: 14.5,
                                lineHeight: 1.55,
                                margin: 0,
                                padding: "9px 12px",
                                border: `1px solid ${BRAND.line}`,
                                borderRadius: 10,
                                color: BRAND.mid,
                              }}
                            >
                              <b style={{ color: BRAND.ink }}>
                                {String.fromCharCode(65 + r.option)} is out.{" "}
                              </b>
                              {r.why} <span style={{ color: BRAND.soft }}>(line {r.because + 1})</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </details>
                  )}
                </article>
              );
            })}

            <p style={{ ...label, margin: "32px 0 10px" }}>How to run one</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: "0 0 10px", maxWidth: "64ch" }}>
              Put the information and the question on the board and keep the answers folded away.
              Give it two minutes alone, then ask for a show of hands on each option before anyone
              explains. The disagreement is the lesson; a room that agrees immediately has not been
              given a case worth running.
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: "0 0 10px", maxWidth: "64ch" }}>
              In the solve version, no student may say an answer is wrong without naming the line
              that rules it out. In the debate version, no student may defend an answer without
              saying what it assumes — and the highlighted line is the one that opened the case.
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: 0, maxWidth: "64ch" }}>
              The cases are written by hand, because a situation worth arguing about cannot be
              generated. The arithmetic is not trusted to the same hand: every solve answer is
              worked out a second time by a checker before it reaches this page.
            </p>
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
