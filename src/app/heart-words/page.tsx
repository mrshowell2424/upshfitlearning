import Link from "next/link";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import HEART from "@/../scripts/reading-heart-words.json";
import { MarkedWord, type HeartWord } from "./word";

/**
 * Heart words.
 *
 * The high-frequency words decoding alone will not give a child. The
 * practice this page is built on is that only PART of such a word is
 * irregular: "said" is s-ai-d, and the s and the d are perfectly
 * ordinary. A heart goes over the ai and nowhere else.
 *
 * That matters more than it looks. Teaching the whole word as a shape to
 * memorise is exactly the practice the science of reading corrected, and
 * it is still what a "sight word list" usually means in practice -- 220
 * words sent home on flashcards, most of them completely decodable.
 * Marking the odd letters says the opposite thing: you can read almost
 * all of this, here is the bit you cannot.
 *
 * The list and its levels are the OG packs' own. The marks are not: they
 * were made word by word, and check-heart-words.mjs holds them to the
 * rule that there must always be something left to decode.
 */

const DATA = HEART as unknown as {
  _note: string;
  _authored: string;
  words: HeartWord[];
};

const WORDS = DATA.words;
const LEVELS = [...new Set(WORDS.map((w) => w.level))].sort((a, b) => a - b);

const BRAND = {
  coral: "#FF6A5B",
  pink: "#FF7DAE",
  lavender: "#B87DFF",
  teal: "#00B4A6",
  ink: "#111111",
  mid: "#444444",
  line: "#E9E9E9",
  paper: "#F7F6F4",
  white: "#FFFFFF",
  coralDark: "#C0432F",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
};
const GRADIENT = `linear-gradient(135deg, ${BRAND.coral}, ${BRAND.pink}, ${BRAND.lavender}, ${BRAND.teal})`;

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

const serif = 'var(--font-serif), Georgia, "Times New Roman", serif';

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
    background: on ? color : BRAND.white,
    color: on ? BRAND.white : BRAND.ink,
    whiteSpace: "nowrap",
  };
}

export const metadata = {
  title: "Heart words",
  description:
    "The high-frequency words decoding will not give you — with a heart over only the letters that are irregular, because the rest of the word is not.",
  openGraph: ogCard("/og/heart-words.png"),
  twitter: twitterCard("/og/heart-words.png"),
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const asked = Number(one(sp.l));
  const level = LEVELS.includes(asked) ? asked : null;
  const shown = level === null ? WORDS : WORDS.filter((w) => w.level === level);
  const student = one(sp.view) === "student";

  const href = (next: { l?: number | null; view?: "teacher" | "student" }) => {
    const q = new URLSearchParams();
    const l = next.l === undefined ? level : next.l;
    if (l !== null) q.set("l", String(l));
    const v = next.view ?? (student ? "student" : "teacher");
    if (v === "student") q.set("view", "student");
    const s = q.toString();
    return s ? `/heart-words?${s}` : "/heart-words";
  };

  const byLevel = LEVELS.map((lv) => ({ level: lv, words: shown.filter((w) => w.level === lv) })).filter(
    (g) => g.words.length,
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <SignInGate
          title="Heart words"
          blurb="The words decoding will not give you — with the irregular letters marked, and only those. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />

          <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
            {!student && (
              <>
                <p style={{ ...label, margin: "0 0 6px", color: BRAND.coralDark }}>
                  Irregular words
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
                  Heart words
                </h1>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: 18,
                    lineHeight: 1.65,
                    color: BRAND.mid,
                    maxWidth: "62ch",
                    margin: "0 0 14px",
                  }}
                >
                  <i>said</i> is s-ai-d. The s and the d are perfectly ordinary — it is the{" "}
                  <i>ai</i> that is odd, and that is the only part a child has to learn by heart.
                  A sight-word list says the opposite: memorise the shape of all {WORDS.length} of
                  these, and of another hundred and sixty that are completely decodable. This marks
                  the letters that are actually irregular and leaves the rest alone.
                </p>
                <p style={{ fontSize: 13, color: BRAND.mid, margin: "0 0 22px" }}>
                  <Link
                    href="/science-of-reading"
                    style={{ color: BRAND.tealDark, fontWeight: 700, textDecoration: "none" }}
                  >
                    ← Science of Reading
                  </Link>
                </p>
              </>
            )}

            {student && <h1 className="sr-only">Heart words</h1>}

            <div
              style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "0 0 14px", alignItems: "center" }}
            >
              <span style={{ ...label, marginRight: 4 }}>View</span>
              <Link href={href({ view: "teacher" })} style={pill(!student, BRAND.ink)}>
                Teacher
              </Link>
              <Link href={href({ view: "student" })} style={pill(student, BRAND.ink)}>
                Student
              </Link>
              {!student && (
                <span style={{ fontSize: 12.5, color: BRAND.mid, marginLeft: 4 }}>
                  Student view shows the words without the explanations.
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", margin: "0 0 20px" }}>
              <span style={{ ...label, marginRight: 4 }}>Level</span>
              <Link href={href({ l: null })} style={pill(level === null, BRAND.coralDark)}>
                All {WORDS.length}
              </Link>
              {LEVELS.map((lv) => (
                <Link key={lv} href={href({ l: lv })} style={pill(level === lv, BRAND.coralDark)}>
                  Level {lv} · {WORDS.filter((w) => w.level === lv).length}
                </Link>
              ))}
            </div>

            {byLevel.map((g) => (
              <section key={g.level} style={{ margin: "0 0 26px" }}>
                <p
                  style={{
                    ...label,
                    margin: "0 0 10px",
                    color: BRAND.coralDark,
                    borderTop: `2px solid ${BRAND.ink}`,
                    paddingTop: 9,
                  }}
                >
                  Level {g.level} · {g.words.length} words
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: student
                      ? "repeat(auto-fill, minmax(150px, 1fr))"
                      : "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: student ? 18 : 14,
                  }}
                >
                  {g.words.map((w) => (
                    <div
                      key={w.word}
                      style={{
                        border: `1px solid ${BRAND.line}`,
                        borderRadius: 14,
                        padding: student ? "16px 14px" : "13px 15px",
                        background: BRAND.white,
                        textAlign: student ? "center" : "left",
                      }}
                    >
                      <MarkedWord entry={w} size={student ? 38 : 30} colour={BRAND.coralDark} ink={BRAND.ink} />
                      {!student && (
                        <p
                          style={{
                            fontSize: 13,
                            lineHeight: 1.5,
                            color: BRAND.mid,
                            margin: "8px 0 0",
                          }}
                        >
                          {w.why}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {!student && (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "8px 0 0" }}>
                  <Link
                    href={level === null ? "/heart-words/print" : `/heart-words/print?l=${level}`}
                    style={pill(false, BRAND.ink)}
                  >
                    Print the cards →
                  </Link>
                </div>

                <p style={{ ...label, margin: "32px 0 10px" }}>How to use one</p>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: "0 0 10px", maxWidth: "64ch" }}>
                  Read the word. Say the sounds you <i>can</i> get — in <i>said</i>, /s/ and /d/.
                  Then name what the odd letters do: the <i>ai</i> says /e/. The heart is there so a
                  child can see at a glance that almost all of the word behaved, which is the
                  opposite of what a flashcard teaches.
                </p>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: "0 0 10px", maxWidth: "64ch" }}>
                  Nothing is marked from end to end. If a word had no decodable part the mark would
                  be a false promise, so the check that guards this list refuses it — and a word
                  that turns out to be fully decodable does not belong here at all.
                </p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: BRAND.mid, margin: 0, maxWidth: "64ch" }}>
                  <b>Worth your eye:</b> the word list and its levels come from the OG packs and are
                  yours. The marks and the explanations are not — they were made word by word and
                  have not been checked by anyone who teaches these. Where you disagree, the file is{" "}
                  <code style={{ fontSize: 12.5 }}>scripts/reading-heart-words.json</code> and one
                  line changes one word.
                </p>
              </>
            )}
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
