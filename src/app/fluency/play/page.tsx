import Link from "next/link";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import ARTICLES from "@/../scripts/reading-articles.json";
import FLU from "@/../scripts/reading-fluency.json";
import PLAY from "@/../scripts/reading-fluency-play.json";
import { SayItLike, BeatYourScore, HearItFirst, PunctuationPower } from "./games";

/**
 * Fluency practice, as opposed to fluency measurement.
 *
 * /fluency times a minute and scores how it sounded against the NAEP scale,
 * one to four. It is a good assessment and it hands a child nothing: told
 * they read "word by word", they have been given a fact about themselves and
 * no way to change it.
 *
 * Expression is practised by rereading, and rereading is dull unless there is
 * a reason to do it again. These four give reasons. A child reads one line
 * six times as a robot, a whisper and a sports announcer and thinks they are
 * messing about; every pass is another repetition of the same words.
 *
 * The student view is not a different tool, it is the same tool with the
 * teaching notes taken out and the type made big enough to read across a
 * desk. A child should not be reading an explanation of why they are doing
 * this, and a teacher should never have to guess.
 */

const AR = ARTICLES.articles;
const GRADES = [...new Set(AR.map((a) => a.grade))].sort((a, b) => a - b);

const GAMES = [
  { key: "say", name: "Say It Like…", blurb: "One line, a spinner of voices. Expression, by rereading." },
  { key: "beat", name: "Beat Your Score", blurb: "The same passage three times, charted." },
  { key: "hear", name: "Hear It First", blurb: "The device reads it, the child matches the phrasing." },
  { key: "punct", name: "Punctuation Power", blurb: "Same words, three endings, three voices." },
] as const;

type GameKey = (typeof GAMES)[number]["key"];

const BRAND = {
  coral: "#FF6A5B",
  pink: "#FF7DAE",
  lavender: "#B87DFF",
  teal: "#00B4A6",
  ink: "#111111",
  mid: "#444444",
  line: "#E9E9E9",
  white: "#FFFFFF",
  tealDark: "#00756C",
  lavenderDark: "#6B2FB5",
};
const GRADIENT = `linear-gradient(135deg, ${BRAND.coral}, ${BRAND.pink}, ${BRAND.lavender}, ${BRAND.teal})`;

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const gradeName = (g: number) =>
  g === 0 ? "K" : g === 1 ? "1st" : g === 2 ? "2nd" : g === 3 ? "3rd" : `${g}th`;

const label: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: BRAND.mid,
};

function pill(on: boolean, color: string): React.CSSProperties {
  return {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: 13,
    fontWeight: 800,
    padding: "8px 15px",
    minHeight: 40,
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    textDecoration: "none",
    border: `1.5px solid ${on ? color : BRAND.line}`,
    background: on ? color : BRAND.white,
    color: on ? BRAND.white : BRAND.ink,
    whiteSpace: "nowrap",
  };
}

export const metadata = {
  title: "Fluency games",
  description:
    "Four ways to practise the thing a fluency score measures: a spinner of voices, three timed reads charted, the device reading it first, and one sentence read three ways.",
  openGraph: ogCard("/og/fluency.png"),
  twitter: twitterCard("/og/fluency.png"),
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const askedGrade = Number(one(sp.g));
  const grade = GRADES.includes(askedGrade) ? askedGrade : 2;

  const askedGame = one(sp.game) as GameKey | undefined;
  const game = GAMES.some((x) => x.key === askedGame) ? (askedGame as GameKey) : "say";

  const student = one(sp.view) === "student";

  const lines = (PLAY.lines as Record<string, typeof PLAY.lines["0"]>)[String(grade)] ?? [];
  const stems = (PLAY.stems as Record<string, typeof PLAY.stems["0"]>)[String(grade)] ?? [];

  // Beat Your Score reads a whole article, the same unit /fluency times, at
  // the easier of its two Lexiles -- a passage being reread for speed is not
  // the place to also be meeting new vocabulary.
  const nth = Math.max(0, Number(one(sp.p) ?? 0) || 0);
  const pool = AR.filter((a) => a.grade === grade && a.lower?.paras?.length);
  const picked = pool[nth % Math.max(pool.length, 1)];
  const passage = picked
    ? {
        title: picked.title,
        words: picked.lower.words,
        text: picked.lower.paras.map((p: { text: string }) => p.text).join(" "),
      }
    : null;

  const href = (next: { g?: number; game?: GameKey; view?: "teacher" | "student"; p?: number }) => {
    const q = new URLSearchParams();
    q.set("g", String(next.g ?? grade));
    q.set("game", next.game ?? game);
    const v = next.view ?? (student ? "student" : "teacher");
    if (v === "student") q.set("view", "student");
    const p = next.p ?? nth;
    if (p) q.set("p", String(p));
    return `/fluency/play?${q}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="Fluency games"
          blurb="Four ways to practise what a fluency score measures — a spinner of voices, three timed reads charted, and one sentence read three ways. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />

          <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
            {!student && (
              <>
                <p style={{ ...label, margin: "0 0 6px", color: BRAND.tealDark }}>
                  Fluency · practice
                </p>
                <h1
                  style={{
                    fontFamily: "Poppins, Inter, sans-serif",
                    fontSize: 40,
                    fontWeight: 900,
                    letterSpacing: "-1px",
                    margin: "0 0 6px",
                    lineHeight: 1.1,
                  }}
                >
                  Fluency games
                </h1>
                <p
                  style={{
                    fontFamily: 'var(--font-serif), Georgia, serif',
                    fontSize: 18,
                    lineHeight: 1.6,
                    color: BRAND.mid,
                    maxWidth: "62ch",
                    margin: "0 0 10px",
                  }}
                >
                  The scorer tells you a child reads word by word. It does not tell them what to do
                  about it. Expression is practised by rereading, and rereading needs a reason — so
                  these are four reasons to read the same line again, built on lines from articles
                  your class has already read.
                </p>
                <p style={{ fontSize: 13, color: BRAND.mid, margin: "0 0 22px" }}>
                  <Link href="/fluency" style={{ color: BRAND.tealDark, fontWeight: 700, textDecoration: "none" }}>
                    ← Score a one-minute read
                  </Link>
                </p>
              </>
            )}

            {/* Who is looking. Kept at the top in both views, because the way
                out of student view has to be obvious to the adult standing
                behind the child. */}
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "0 0 18px", alignItems: "center" }}>
              <span style={{ ...label, marginRight: 4 }}>View</span>
              <Link href={href({ view: "teacher" })} style={pill(!student, BRAND.ink)}>
                Teacher
              </Link>
              <Link href={href({ view: "student" })} style={pill(student, BRAND.ink)}>
                Student
              </Link>
            </div>

            {/* Pick a game. */}
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "0 0 10px" }}>
              {GAMES.map((x) => (
                <Link key={x.key} href={href({ game: x.key })} style={pill(x.key === game, BRAND.lavenderDark)}>
                  {x.name}
                </Link>
              ))}
            </div>
            {!student && (
              <p style={{ fontSize: 13, color: BRAND.mid, margin: "0 0 18px" }}>
                {GAMES.find((x) => x.key === game)?.blurb}
              </p>
            )}

            {/* Pick a grade. */}
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "0 0 26px", alignItems: "center" }}>
              <span style={{ ...label, marginRight: 4 }}>Grade</span>
              {GRADES.map((g) => (
                <Link key={g} href={href({ g })} style={pill(g === grade, BRAND.tealDark)}>
                  {gradeName(g)}
                </Link>
              ))}
            </div>

            <div
              style={{
                border: `1px solid ${BRAND.line}`,
                borderRadius: 16,
                padding: student ? "28px 26px" : "22px 24px",
              }}
            >
              {game === "say" && (
                <SayItLike lines={lines} voices={PLAY.voices} student={student} />
              )}
              {game === "beat" && (
                <BeatYourScore
                  passage={passage}
                  accuracyFloor={FLU.reading.accuracyFloor}
                  student={student}
                />
              )}
              {game === "hear" && (
                <HearItFirst lines={lines} student={student} />
              )}
              {game === "punct" && (
                <PunctuationPower stems={stems} marks={PLAY.punctuation} student={student} />
              )}
            </div>

            {game === "beat" && pool.length > 1 && (
              <p style={{ fontSize: 13, margin: "14px 0 0" }}>
                <Link href={href({ p: nth + 1 })} style={{ color: BRAND.tealDark, fontWeight: 700 }}>
                  Different passage →
                </Link>
              </p>
            )}

            {!student && (
              <p style={{ fontSize: 13, lineHeight: 1.6, color: BRAND.mid, margin: "26px 0 0" }}>
                Nothing here is saved. The three reads, the voice and the speed live in this tab
                and go when it closes — there is no score to chase across sessions and no record of
                a child kept anywhere.
              </p>
            )}
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
