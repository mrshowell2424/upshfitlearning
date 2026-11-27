import Link from "next/link";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import SEQUENCE from "@/../scripts/reading-sequence.json";
import PREREQ from "@/../scripts/reading-prerequisites.json";
import SPELLING from "@/../scripts/reading-spelling.json";
import { patternInfo } from "@/app/writing/writing-data";
import { reviewSlots } from "@/../scripts/lib/review-slots.mjs";

/**
 * Spiral review.
 *
 * Spaced review is the best-evidenced thing in the whole literature and
 * the thing teachers most reliably skip. Not because they disagree with
 * it -- because deciding what to review is the work, and it has to be
 * decided again every single day, at the end of the day before.
 *
 * The data to decide it has been in reading-prerequisites.json all along,
 * with a note in the file describing exactly how it was meant to be used:
 * three slots, the prerequisite, the lesson taught just before, and one
 * from the spiral pool for that level, with the teacher able to override
 * any of them. Nothing read the file.
 *
 * Three slots because three is what fits in the front of a lesson, and
 * because each answers a different question. What is today built on --
 * if a child cannot do that, today will not land however well it is
 * taught. What was taught last -- the newest thing is the most fragile,
 * and a day later is exactly when it needs meeting again. What is going
 * cold -- everything else decays quietly, and the pool is where each
 * level's load-bearing patterns are named.
 *
 * Deterministic on purpose. The same lesson gives the same three every
 * time, because a teacher who plans Monday on Sunday needs Monday to
 * still say the same thing on Monday.
 */

const SEQ = (
  SEQUENCE as {
    sequence: { key: string; name: string; level: number; words: string[]; wordSource: string }[];
  }
).sequence;
const WORDS = new Map(SEQ.map((r) => [r.key, r.words]));
const PRE = PREREQ as { prereq: Record<string, string>; spiral: Record<string, string[]> };
const SPELL = SPELLING as unknown as {
  patterns: { key: string; parts: { part: string; words: { word: string }[] }[] }[];
};

const SPELL_BY_KEY = new Map(SPELL.patterns.map((p) => [p.key, p]));

const BRAND = {
  coral: "#EC9388",
  pink: "#DE8FAD",
  lavender: "#B19FDB",
  teal: "#89BECF",
  ink: "#111111",
  mid: "#444444",
  line: "#E9E9E9",
  paper: "#F7F6F4",
  white: "#FFFFFF",
  coralDark: "#733A32",
  lavenderDark: "#4E4168",
  tealDark: "#345561",
  amberDark: "#8A5400",
};
const GRADIENT = `linear-gradient(135deg, ${BRAND.coral}, ${BRAND.pink}, ${BRAND.lavender}, ${BRAND.teal})`;

const SLOT_COLOUR = [BRAND.coralDark, BRAND.tealDark, BRAND.lavenderDark];

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

/**
 * Words to say out loud for a slot.
 *
 * Baked into the sequence at build time rather than worked out here,
 * because working it out here is what went wrong first: the fallback for
 * a lesson with no spelling bank was its word ladder, and a ladder is a
 * chain of one-sound changes rather than a list of examples. The -dge
 * ladder is one, on, in, it, at, sat, saw -- no -dge in it anywhere.
 * build-sequence.mjs now takes the dictation bank where there is one and
 * the OG pack's own word list otherwise, and check-review.mjs asserts
 * that the words carry their pattern.
 */
const wordsFor = (key: string, n = 6): string[] => (WORDS.get(key) ?? []).slice(0, n);

export const metadata = {
  title: "Spiral review",
  description:
    "What to review before today's lesson, decided rather than suggested: what today is built on, what was taught last, and what is going cold.",
  openGraph: ogCard("/og/review.png"),
  twitter: twitterCard("/og/review.png"),
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const asked = one(sp.p);
  const key = asked && SEQ.some((r) => r.key === asked) ? asked : SEQ[12].key;
  const here = SEQ.find((r) => r.key === key)!;
  const info = patternInfo(key);

  const picks = { s1: one(sp.s1), s2: one(sp.s2), s3: one(sp.s3) };
  const slots = reviewSlots(key, { seq: SEQ, prereq: PRE.prereq, spiral: PRE.spiral }, picks) as {
    why: string;
    key: string | null;
    name: string | null;
    level: number | null;
  }[];

  const auto = reviewSlots(key, { seq: SEQ, prereq: PRE.prereq, spiral: PRE.spiral }) as typeof slots;
  const overridden = slots.some((s, i) => s.key !== auto[i].key);

  const href = (next: { p?: string; s1?: string; s2?: string; s3?: string; clear?: boolean }) => {
    const q = new URLSearchParams();
    q.set("p", next.p ?? key);
    if (!next.clear && !next.p) {
      for (const k of ["s1", "s2", "s3"] as const) {
        const v = next[k] ?? picks[k];
        if (v) q.set(k, v);
      }
    }
    return `/review?${q.toString()}`;
  };

  // Earlier lessons only: a slot can never point forwards.
  const at = SEQ.findIndex((r) => r.key === key);
  const earlier = SEQ.slice(0, at);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <SignInGate
          title="Spiral review"
          blurb="What to go over before today's lesson, decided rather than suggested. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />

          <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
            <p style={{ ...label, margin: "0 0 6px", color: BRAND.coralDark }}>
              Before today&rsquo;s lesson
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
              Spiral review
            </h1>
            <p
              style={{
                fontFamily: serif,
                fontSize: 18,
                lineHeight: 1.65,
                color: BRAND.mid,
                maxWidth: "62ch",
                margin: "0 0 10px",
              }}
            >
              Spaced review is the best-evidenced thing in the literature and the first thing to go
              in a real week — not because anyone disagrees with it, but because deciding{" "}
              <i>what</i> to review is the work, and it has to be decided again every day. This
              decides it. Three slots, from the sequence you are already teaching.
            </p>
            {/*
              The other review on the site, and the one a teacher looking for
              "review" may actually want: this page reviews the sequence being
              taught, the continuum review reviews a skill from the fifteen on
              the intervention continuum, five days at a time. Neither replaces
              the other, so each says the other exists.
            */}
            <p style={{ fontSize: 15, color: BRAND.mid, margin: "0 0 10px", lineHeight: 1.6 }}>
              Working from the intervention continuum instead?{" "}
              <Link
                href="/review/continuum"
                style={{ color: BRAND.tealDark, fontWeight: 700, textDecoration: "none" }}
              >
                Continuum review
              </Link>{" "}
              has five days for each of the fifteen skills, P1 to P15 — the rule, real and made-up
              words that use it, and earlier skills mixed in.
            </p>
            <p style={{ fontSize: 13, color: BRAND.mid, margin: "0 0 22px" }}>
              <Link
                href="/science-of-reading"
                style={{ color: BRAND.tealDark, fontWeight: 700, textDecoration: "none" }}
              >
                ← Science of Reading
              </Link>
            </p>

            {/* Which lesson is today. */}
            <details className="disclosure" style={{ margin: "0 0 20px" }}>
              <summary
                style={{ cursor: "pointer", listStyle: "none", ...label, fontSize: 12, color: BRAND.ink }}
              >
                Teaching today · {info.name} · change it
              </summary>
              <div style={{ paddingTop: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {SEQ.map((r) => (
                  <Link
                    key={r.key}
                    href={href({ p: r.key })}
                    style={pill(r.key === key, BRAND.coralDark)}
                    title={r.name}
                  >
                    {r.name.length > 28 ? `${r.name.slice(0, 27)}…` : r.name}
                  </Link>
                ))}
              </div>
            </details>

            <div
              style={{
                border: `1px solid ${BRAND.line}`,
                borderTop: `3px solid ${BRAND.ink}`,
                borderRadius: "3px 3px 16px 16px",
                padding: "18px 22px",
                margin: "0 0 20px",
              }}
            >
              <p style={{ ...label, margin: "0 0 4px" }}>
                Today · lesson {at + 1} of {SEQ.length} · Level {here.level}
              </p>
              <h2
                style={{
                  fontFamily: serif,
                  fontSize: 26,
                  fontWeight: 700,
                  margin: "0 0 2px",
                  lineHeight: 1.2,
                }}
              >
                {here.name}
              </h2>
              <p style={{ fontSize: 13, color: BRAND.mid, margin: 0 }}>
                Review these three first. Five minutes, out loud.
              </p>
            </div>

            {slots.map((s, i) => {
              const colour = SLOT_COLOUR[i];
              const words = s.key ? wordsFor(s.key) : [];
              const isOverride = s.key !== auto[i].key;
              return (
                <div
                  key={i}
                  style={{
                    border: `1px solid ${BRAND.line}`,
                    borderLeft: `3px solid ${colour}`,
                    borderRadius: "3px 14px 14px 3px",
                    padding: "16px 20px",
                    margin: "0 0 12px",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ ...label, color: colour }}>
                      {i + 1} · {s.why}
                    </span>
                    {isOverride && (
                      <span style={{ ...label, color: BRAND.amberDark, fontSize: 10 }}>
                        your pick
                      </span>
                    )}
                  </div>

                  {s.key ? (
                    <>
                      <h3
                        style={{
                          fontFamily: serif,
                          fontSize: 21,
                          fontWeight: 700,
                          margin: "4px 0 8px",
                          lineHeight: 1.25,
                        }}
                      >
                        {s.name}
                      </h3>

                      {words.length > 0 && (
                        <p
                          style={{
                            fontFamily: serif,
                            fontSize: 19,
                            lineHeight: 1.7,
                            margin: "0 0 10px",
                            color: BRAND.ink,
                          }}
                        >
                          {words.join(" · ")}
                        </p>
                      )}

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Link href={`/word-ladders?p=${s.key}`} style={pill(false, colour)}>
                          Ladder →
                        </Link>
                        {SPELL_BY_KEY.has(s.key) && (
                          <Link href={`/spelling?p=${s.key}`} style={pill(false, colour)}>
                            Dictate →
                          </Link>
                        )}
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: 14.5, color: BRAND.mid, margin: "6px 0 0", maxWidth: "58ch" }}>
                      Nothing to put here yet — this is near the start of the sequence, and there is
                      not enough behind it to review. That is the honest answer rather than a
                      filler.
                    </p>
                  )}

                  {/* The override. Earlier lessons only, because a review
                      cannot point forwards. */}
                  {earlier.length > 0 && (
                    <details className="disclosure" style={{ margin: "10px 0 0" }}>
                      <summary
                        style={{
                          cursor: "pointer",
                          listStyle: "none",
                          ...label,
                          fontSize: 10,
                          color: BRAND.mid,
                        }}
                      >
                        Use something else
                      </summary>
                      <div style={{ paddingTop: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {earlier.map((r) => (
                          <Link
                            key={r.key}
                            href={href({ [`s${i + 1}`]: r.key } as { s1?: string })}
                            style={{
                              ...pill(r.key === s.key, colour),
                              fontSize: 11.5,
                              padding: "5px 10px",
                              minHeight: 32,
                            }}
                            title={r.name}
                          >
                            {r.name.length > 24 ? `${r.name.slice(0, 23)}…` : r.name}
                          </Link>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              );
            })}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 0" }}>
              <Link href={`/review/print?${new URLSearchParams({ p: key, ...(picks.s1 ? { s1: picks.s1 } : {}), ...(picks.s2 ? { s2: picks.s2 } : {}), ...(picks.s3 ? { s3: picks.s3 } : {}) }).toString()}`} style={pill(false, BRAND.ink)}>
                Print the review sheet →
              </Link>
              {overridden && (
                <Link href={href({ clear: true })} style={pill(false, BRAND.ink)}>
                  Back to the automatic three
                </Link>
              )}
            </div>

            <p style={{ ...label, margin: "32px 0 10px" }}>How the three are chosen</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: "0 0 10px", maxWidth: "64ch" }}>
              Each slot answers a different question, which is why three and not one.{" "}
              <b>What today is built on</b> comes from the prerequisite map — if a child cannot do
              that, today will not land however well it is taught. <b>What was taught last</b> is
              the newest thing and therefore the most fragile, and a day later is exactly when it
              needs meeting again. <b>What is going cold</b> is drawn from the pool of patterns that
              carry that level, because everything else decays quietly and nothing on a timetable
              reminds you.
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: "0 0 10px", maxWidth: "64ch" }}>
              Nothing here reaches forwards. Every slot is checked to be a lesson taught before this
              one, no lesson fills two slots, and a pattern that the sequence has not got to yet is
              never offered as something to revisit.
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: 0, maxWidth: "64ch" }}>
              The same lesson gives the same three every time. A review that shuffled would be worse
              than no review: planning Monday on Sunday only works if Monday still says the same
              thing.
            </p>
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
