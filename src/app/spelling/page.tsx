import Link from "next/link";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import SPELLING from "@/../scripts/reading-spelling.json";
import { patternInfo, BASIC_ORDER } from "@/app/writing/writing-data";
import { Dictation, type SpellPart, type Sentence } from "./dictation";

/**
 * Dictation: the write side of the phonics this site already teaches.
 *
 * Every reading page here hands a child a task that ends in reading.
 * Nothing asked them to spell, and spelling is the harder half: reading
 * "rain" is recognising it, spelling it is choosing between ai, ay and
 * a_e with nothing in front of you to choose from. A child can read a
 * pattern for a year before they can write it.
 *
 * Fifty-three patterns, 1,590 words, all of them already written and
 * already checked against their place in the sequence. What is new is
 * that each word knows where its own lesson sits inside it, so the tool
 * can tell a spelling error apart from a lesson that has not landed.
 *
 * It was forty patterns until thirteen lessons with no word bank got a
 * span rule in scripts/lib/lesson-span.mjs. Those thirteen had words all
 * along -- in their OG pack and in reading-extra-words.json -- and what
 * they lacked was the one thing this page is built on: knowing which
 * letters in the word are the lesson. Eight lessons still have none, and
 * that is deliberate: no substring is the lesson when the lesson is
 * where a syllable divides, or a silent e that is not written, or which
 * a in panda is the schwa.
 */

const DATA = SPELLING as unknown as {
  patterns: {
    key: string;
    parts: SpellPart[];
    sub: string[];
    sentence: Sentence;
    /** A second list of words this pattern's first list does not hold. */
    extra?: { parts: SpellPart[]; sentence: Sentence };
    /** "What says /k/?" -- the sound this lesson teaches, and its spellings. */
    whatSays?: string[];
  }[];
};

const KEYS = DATA.patterns
  .map((p) => p.key)
  .sort((a, b) => {
    const ai = BASIC_ORDER.indexOf(a);
    const bi = BASIC_ORDER.indexOf(b);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    return a.localeCompare(b);
  });

const BRAND = {
  coral: "#FF6A5B",
  pink: "#FF7DAE",
  lavender: "#B87DFF",
  teal: "#00B4A6",
  ink: "#111111",
  mid: "#444444",
  line: "#E9E9E9",
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
  title: "Dictation",
  description:
    "The write side of phonics: 1,590 words across 53 patterns, dictated aloud, and a check that tells a spelling slip apart from a lesson that has not landed.",
  openGraph: ogCard("/og/spelling.png"),
  twitter: twitterCard("/og/spelling.png"),
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const asked = one(sp.p);
  const key = asked && KEYS.includes(asked) ? asked : KEYS[0];
  const pattern = DATA.patterns.find((p) => p.key === key)!;
  const info = patternInfo(key);
  const student = one(sp.view) === "student";

  const totalWords = DATA.patterns.reduce(
    (n, p) => n + p.parts.reduce((m, q) => m + q.words.length, 0),
    0,
  );

  // Grouped the way a teacher thinks about them.
  const groups: { name: string; keys: string[] }[] = [];
  for (const k of KEYS) {
    const g = patternInfo(k).group;
    const found = groups.find((x) => x.name === g);
    if (found) found.keys.push(k);
    else groups.push({ name: g, keys: [k] });
  }

  // Which list of words. The second exists only where the extra bank held
  // words the first did not, which is six of the forty.
  const second = one(sp.list) === "2" && !!pattern.extra;
  const round = second && pattern.extra ? pattern.extra : { parts: pattern.parts, sentence: pattern.sentence };
  const roundWords = round.parts.reduce((n, p) => n + p.words.length, 0);

  const href = (next: { p?: string; view?: "teacher" | "student"; list?: "1" | "2" }) => {
    const q = new URLSearchParams();
    q.set("p", next.p ?? key);
    const l = next.p && next.p !== key ? "1" : (next.list ?? (second ? "2" : "1"));
    if (l === "2") q.set("list", "2");
    const v = next.view ?? (student ? "student" : "teacher");
    if (v === "student") q.set("view", "student");
    return `/spelling?${q.toString()}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <SignInGate
          title="Dictation"
          blurb="The write side of the same phonics: 1,590 words across 53 patterns, dictated aloud, with a check that says where the spelling went wrong. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />

          <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
            {!student && (
              <>
                <p style={{ ...label, margin: "0 0 6px", color: BRAND.coralDark }}>
                  Spelling · dictation
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
                  Dictation
                </h1>
                <p
                  style={{
                    fontFamily: 'var(--font-serif), Georgia, serif',
                    fontSize: 18,
                    lineHeight: 1.65,
                    color: BRAND.mid,
                    maxWidth: "62ch",
                    margin: "0 0 10px",
                  }}
                >
                  Reading <i>rain</i> is recognising it. Spelling it means choosing between{" "}
                  <i>ai</i>, <i>ay</i> and <i>a&#95;e</i> with nothing in front of you to choose
                  from, which is why a child can read a pattern for a year before they can write it.
                  These are the same {totalWords.toLocaleString()} words the reading pages use,
                  dictated instead of shown.
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

            {/* Student view clears the screen on purpose; the heading stays
                in the document so a screen reader still has a name for it. */}
            {student && <h1 className="sr-only">Dictation — {info.name}</h1>}

            {/* Who is looking. At the top in both views, because the way out
                of student view has to be obvious to the adult behind the
                child -- and here it matters more than usual, since student
                view is what hides the word. */}
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "0 0 18px", alignItems: "center" }}>
              <span style={{ ...label, marginRight: 4 }}>View</span>
              <Link href={href({ view: "teacher" })} style={pill(!student, BRAND.ink)}>
                Teacher
              </Link>
              <Link href={href({ view: "student" })} style={pill(student, BRAND.ink)}>
                Student
              </Link>
              {!student && (
                <span style={{ fontSize: 12.5, color: BRAND.mid, marginLeft: 4 }}>
                  Student view hides the word until it has been checked.
                </span>
              )}
            </div>

            {!student && (
              <details className="disclosure" style={{ margin: "0 0 20px" }}>
                <summary
                  style={{ cursor: "pointer", listStyle: "none", ...label, fontSize: 12, color: BRAND.ink }}
                >
                  Choose a pattern · {KEYS.length} of them, Basic Reading and OG levels 1–5
                </summary>
                <div style={{ paddingTop: 14 }}>
                  {groups.map((g) => (
                    <div key={g.name} style={{ margin: "0 0 12px" }}>
                      <p style={{ ...label, margin: "0 0 7px" }}>{g.name}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {g.keys.map((k) => {
                          const i = patternInfo(k);
                          return (
                            <Link key={k} href={href({ p: k })} style={pill(k === key, BRAND.coralDark)} title={i.name}>
                              {i.name.length > 30 ? `${i.name.slice(0, 29)}…` : i.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* What says? The auditory drill: the teacher names a sound and
                the child names the spelling that makes it. It runs before
                the writing, and only 27 of the 53 patterns have one --
                a lesson that teaches a rule or a meaning rather than a
                sound has no new sound to drill. */}
            {pattern.whatSays && (
              <div
                style={{
                  border: `1px solid ${BRAND.line}`,
                  borderLeft: `3px solid ${BRAND.tealDark}`,
                  borderRadius: "3px 14px 14px 3px",
                  padding: "14px 18px",
                  margin: "0 0 14px",
                }}
              >
                <p style={{ ...label, margin: "0 0 4px", color: BRAND.tealDark }}>
                  First · what says?
                </p>
                <p style={{ fontSize: 13, color: BRAND.mid, margin: "0 0 10px", maxWidth: "58ch", lineHeight: 1.55 }}>
                  Say the sound. The child names the spelling that makes it — out loud, before
                  anything is written.
                </p>
                <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                  {pattern.whatSays.map((line) => {
                    const [sound, spelling] = line.split("\u2192").map((x) => x.trim());
                    return (
                      <div key={line}>
                        <p
                          style={{
                            fontFamily: 'var(--font-serif), Georgia, serif',
                            fontSize: 22,
                            fontWeight: 700,
                            margin: 0,
                            color: BRAND.ink,
                          }}
                        >
                          What says {sound}?
                        </p>
                        {!student && (
                          <p style={{ fontSize: 13.5, color: BRAND.tealDark, margin: "2px 0 0", fontWeight: 700 }}>
                            {spelling}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Which list. Only where there is a second one. */}
            {!student && pattern.extra && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", margin: "0 0 14px" }}>
                <span style={{ ...label, marginRight: 4 }}>Words</span>
                <Link href={href({ list: "1" })} style={pill(!second, BRAND.lavenderDark)}>
                  First list · {pattern.parts.reduce((n, p) => n + p.words.length, 0)}
                </Link>
                <Link href={href({ list: "2" })} style={pill(second, BRAND.lavenderDark)}>
                  More words · {pattern.extra.parts.reduce((n, p) => n + p.words.length, 0)}
                </Link>
                <span style={{ fontSize: 12.5, color: BRAND.mid, marginLeft: 4 }}>
                  None of the second list appears in the first.
                </span>
              </div>
            )}

            {/* The round. */}
            <div
              style={{
                border: `1px solid ${BRAND.line}`,
                borderTop: `3px solid ${BRAND.coralDark}`,
                borderRadius: "3px 3px 16px 16px",
                padding: student ? "26px 24px" : "20px 24px",
              }}
            >
              {!student && (
                <p style={{ ...label, margin: "0 0 12px", color: BRAND.coralDark }}>
                  {info.group}
                  {info.grades ? ` · ${info.grades}` : ""} · {info.name} · {roundWords} words
                  {second ? " · more words" : ""}
                </p>
              )}

              <Dictation
                key={second ? "2" : "1"}
                patternName={info.name}
                parts={round.parts}
                sentence={round.sentence}
                student={student}
              />
            </div>

            {!student && (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 0" }}>
                  <Link href={`/spelling/print?p=${key}`} style={pill(false, BRAND.ink)}>
                    Print the dictation sheet →
                  </Link>
                </div>

                <p style={{ ...label, margin: "32px 0 10px" }}>What the check is actually saying</p>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: "0 0 10px", maxWidth: "64ch" }}>
                  Every word here knows where its own lesson sits inside it — the{" "}
                  <b>ai</b> in <i>rain</i>, the <b>a&#95;e</b> in <i>cake</i>, the <b>un</b> in{" "}
                  <i>unlock</i>. So when a spelling comes back wrong, the tool can say whether the
                  letters that went wrong are the ones being taught.
                </p>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: "0 0 10px", maxWidth: "64ch" }}>
                  <i>rane</i> for <i>rain</i> is a child who has not got <b>ai</b> yet.{" "}
                  <i>paind</i> for <i>paint</i> is a child who has got it and is hearing the last
                  sound wrong. Both are wrong, and they are not the same lesson tomorrow — which
                  is the whole reason to dictate rather than to test.
                </p>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: 0, maxWidth: "64ch" }}>
                  Nothing is stored. No attempt, no score and no name leaves the tab it was typed
                  in.
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
