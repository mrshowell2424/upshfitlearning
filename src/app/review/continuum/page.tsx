import Link from "next/link";
import type { Metadata } from "next";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import REVIEW from "@/../scripts/continuum-review.json";

/**
 * The continuum review: fifteen skills, five days each.
 *
 * WHAT IT IS FOR. The 95% Group continuum names fifteen skills from letters
 * and sounds through vowel-r syllables, and a child working in one of them
 * needs the rule in front of them and words to read it in -- five days of
 * them, different each day, so the week is practice rather than a single
 * sheet re-read.
 *
 * WHY EARLIER SKILLS ARE MIXED IN. A sheet of nothing but today's pattern
 * can be read without reading: once a child sees that every word has a
 * silent e they stop looking at the vowel. Four words from skills already
 * taught sit among the eight new ones, in no fixed position, so the only way
 * through the list is to decode each word.
 *
 * WHY HALF THE WORDS ARE MADE UP. A real word can be recognised rather than
 * decoded, so a list of only real words flatters a child who has memorised
 * them; a made-up word can only be decoded. The sheet does not say which are
 * which. The key does.
 *
 * URL-DRIVEN, SERVER-RENDERED. The skill and the key are in the query string
 * rather than in component state, so there is no client bundle, nothing to
 * hydrate and nothing to go wrong between the preview and the print.
 */

type Item = { w: string; kind: "real" | "made-up" | "letter"; from: string; sound?: string };
type Day = { day: number; rule: string; items: Item[] };
type Skill = {
  id: string;
  band: string;
  name: string;
  rule: string;
  kind: "letters" | "words";
  days: Day[];
};

const DATA = REVIEW as unknown as {
  perDay: { real: number; madeUp: number; review: number };
  skills: Skill[];
};
const SKILLS = DATA.skills;

const SANS = "'Poppins', system-ui, -apple-system, sans-serif";
const INK = "#111111";
const MUTED = "#57534e";
const TEAL = "#00897B";
const CORAL = "#733A32";
const LINE = "#E7E5E4";

export const metadata: Metadata = {
  title: "Continuum Review",
  description:
    "Five review days for each of the fifteen phonics intervention continuum skills: the rule, real and made-up words, and earlier skills mixed in.",
  openGraph: ogCard("/og/science-of-reading.png"),
  twitter: twitterCard("/og/science-of-reading.png"),
};

const BANDS = ["Basic", "Advanced", "Multisyllabic"];

export default async function ContinuumReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string; key?: string }>;
}) {
  const sp = await searchParams;
  const skill = SKILLS.find((s) => s.id === (sp.skill || "").toUpperCase()) ?? SKILLS[4];
  const showKey = sp.key === "1";

  return (
    <>
      <div className="noprint">
        <Header />
      </div>
      <SignInGate
        title="Continuum review"
        blurb="Five review days for each of the fifteen intervention continuum skills. Free — an account is all it takes."
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
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: ".16em",
                color: TEAL,
              }}
            >
              PHONICS INTERVENTION CONTINUUM
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 800, margin: "4px 0 6px", lineHeight: 1.1 }}>
              Continuum Review
            </h1>
            <p style={{ fontSize: 16, color: MUTED, margin: "0 0 18px", lineHeight: 1.5 }}>
              Fifteen skills, five days each. Every day carries the rule, {DATA.perDay.real} real
              and {DATA.perDay.madeUp} made-up words that use it, and {DATA.perDay.review} words
              from skills already taught, mixed in rather than listed after.
            </p>

            {BANDS.map((band) => (
              <div key={band} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: ".12em",
                    color: MUTED,
                    marginBottom: 5,
                  }}
                >
                  {band.toUpperCase()}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {SKILLS.filter((s) => s.band === band).map((s) => {
                    const on = s.id === skill.id;
                    return (
                      <Link
                        key={s.id}
                        href={`/review/continuum?skill=${s.id}${showKey ? "&key=1" : ""}`}
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          textDecoration: "none",
                          border: `1.5px solid ${on ? TEAL : LINE}`,
                          background: on ? TEAL : "#fff",
                          color: on ? "#fff" : INK,
                          borderRadius: 999,
                          padding: "5px 12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.id} · {s.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "18px 0 8px" }}>
              <Link
                href={`/review/continuum?skill=${skill.id}${showKey ? "" : "&key=1"}`}
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  border: `1.5px solid ${showKey ? CORAL : TEAL}`,
                  color: showKey ? CORAL : TEAL,
                  background: "#fff",
                  borderRadius: 9,
                  padding: "8px 14px",
                }}
              >
                {showKey ? "Hide the answer key" : "Show the answer key"}
              </Link>
            </div>
            <hr style={{ border: 0, borderTop: `1.5px solid ${LINE}`, margin: "16px 0 0" }} />
          </div>

          {skill.days.map((d) => (
            <section
              key={d.day}
              className="sheet"
              style={{ paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}
            >
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
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: ".18em",
                      color: TEAL,
                    }}
                  >
                    {skill.id} · {skill.band.toUpperCase()} · DAY {d.day} OF 5
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>{skill.name}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                  Name ____________ Date ______
                </div>
              </div>

              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.5,
                  background: "#F0FAF8",
                  border: `1.5px solid ${TEAL}`,
                  borderRadius: 10,
                  padding: "9px 14px",
                }}
              >
                <b>Remember:</b> {d.rule}
              </div>

              <div style={{ fontSize: 14, fontWeight: 700, color: MUTED }}>
                {skill.kind === "letters"
                  ? "Say the letter name, then the sound. Tick each one you get right."
                  : "Read every word out loud. Tick each one you read right the first time. Some of these words are not real words — read them anyway."}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                {d.items.map((it, i) => (
                  <div
                    key={`${it.from}-${it.w}-${i}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      border: `1.5px solid ${LINE}`,
                      borderRadius: 9,
                      padding: "10px 12px",
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        border: `2px solid ${INK}`,
                        borderRadius: 4,
                        flex: "none",
                      }}
                    />
                    <span style={{ fontSize: 21, fontWeight: 700, letterSpacing: ".01em" }}>
                      {it.w}
                    </span>
                  </div>
                ))}
              </div>

              {showKey && (
                <div
                  style={{
                    border: `2px dashed ${CORAL}`,
                    borderRadius: 10,
                    padding: "10px 14px",
                    marginTop: 4,
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
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "3px 16px",
                      fontSize: 13,
                    }}
                  >
                    {d.items.map((it, i) => (
                      <div key={`k-${it.from}-${it.w}-${i}`} style={{ lineHeight: 1.5 }}>
                        <b>{it.w}</b>{" "}
                        <span
                          style={{
                            color: it.kind === "made-up" ? CORAL : MUTED,
                            fontWeight: it.kind === "made-up" ? 700 : 500,
                          }}
                        >
                          {it.kind === "letter" ? it.sound : it.kind}
                        </span>{" "}
                        <span style={{ color: MUTED }}>
                          {it.from === skill.id ? "" : `· review ${it.from}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12.5, color: MUTED, marginTop: 8, lineHeight: 1.5 }}>
                    A made-up word read correctly is the strongest evidence the child is decoding
                    rather than recognising. A real word missed while the made-up words are right
                    usually means the word is unfamiliar, not that the pattern is.
                  </div>
                </div>
              )}
            </section>
          ))}
        </main>
      </SignInGate>
      <div className="noprint">
        <Footer />
      </div>
    </>
  );
}
