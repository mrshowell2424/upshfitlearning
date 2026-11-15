import Link from "next/link";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import LADDERS from "@/../scripts/reading-word-ladders.json";
import { patternInfo, BASIC_ORDER } from "@/app/writing/writing-data";
import { Ladder, type LadderData } from "./ladder";

/**
 * Word ladders.
 *
 * 212 of them, one per lesson and one per part of a split lesson, and
 * every one already built and already checked: each rung a real word, each
 * rung decodable with what the sequence has taught by that lesson, each
 * clue turning its rung into the next, and no other word a child could
 * reach answering the same clue. None of them comes out of a published
 * book.
 *
 * They had no page. They existed inside the seeded material HTML and
 * nowhere a teacher could open them, which is a strange place for the best
 * phoneme-manipulation exercise on the site to be sitting -- changing one
 * sound and saying what is left is the skill decoding rests on, and it is
 * the one a worksheet almost never asks for.
 *
 * This is the other half of the dictation tool. Dictation asks a child to
 * write a pattern; a ladder asks them to take one apart.
 */

const DATA = LADDERS as unknown as {
  _note: string;
  ladders: Record<string, LadderData>;
};

const ALL = DATA.ladders;

/** Pattern key -> the ladders that belong to it, whole lesson first. */
const BY_PATTERN = new Map<string, string[]>();
for (const k of Object.keys(ALL)) {
  const base = k.split("|")[0];
  const list = BY_PATTERN.get(base) ?? [];
  list.push(k);
  BY_PATTERN.set(base, list);
}
for (const [, list] of BY_PATTERN) {
  list.sort((a, b) => {
    const as = a.includes("|");
    const bs = b.includes("|");
    if (as !== bs) return as ? 1 : -1;
    return a.localeCompare(b);
  });
}

const KEYS = [...BY_PATTERN.keys()].sort((a, b) => {
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

/** "ai-ay|ai" -> "ai". The whole-lesson ladder has no part. */
const partOf = (k: string) => (k.includes("|") ? k.split("|")[1] : null);

const TOTAL_RUNGS = Object.values(ALL).reduce((n, l) => n + l.words.length - 1, 0);

export const metadata = {
  title: "Word ladders",
  description:
    "212 word ladders, one per lesson: change one sound at a time and say what is left. Every rung decodable at that point in the sequence, every clue with exactly one answer.",
  openGraph: ogCard("/og/word-ladders.png"),
  twitter: twitterCard("/og/word-ladders.png"),
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const askedPattern = one(sp.p);
  const key = askedPattern && BY_PATTERN.has(askedPattern) ? askedPattern : KEYS[0];
  const inPattern = BY_PATTERN.get(key)!;

  const askedLadder = one(sp.l);
  const ladderKey = askedLadder && inPattern.includes(askedLadder) ? askedLadder : inPattern[0];
  const ladder = ALL[ladderKey];

  const info = patternInfo(key);
  const student = one(sp.view) === "student";

  // Grouped the way a teacher thinks about them.
  const groups: { name: string; keys: string[] }[] = [];
  for (const k of KEYS) {
    const g = patternInfo(k).group;
    const found = groups.find((x) => x.name === g);
    if (found) found.keys.push(k);
    else groups.push({ name: g, keys: [k] });
  }

  const href = (next: { p?: string; l?: string; view?: "teacher" | "student" }) => {
    const q = new URLSearchParams();
    const p = next.p ?? key;
    q.set("p", p);
    // Changing pattern drops the ladder, because its key belongs to the
    // pattern that was open.
    const l = next.p && next.p !== key ? undefined : (next.l ?? ladderKey);
    if (l) q.set("l", l);
    const v = next.view ?? (student ? "student" : "teacher");
    if (v === "student") q.set("view", "student");
    return `/word-ladders?${q.toString()}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <SignInGate
          title="Word ladders"
          blurb="212 ladders: change one sound at a time and say what is left. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />

          <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
            {!student && (
              <>
                <p style={{ ...label, margin: "0 0 6px", color: BRAND.coralDark }}>
                  Phoneme manipulation
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
                  Word ladders
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
                  <i>set</i> becomes <i>sat</i> becomes <i>sad</i> becomes <i>said</i>. To climb a
                  rung a child has to hold a word in mind, take one sound out or put one in, and say
                  what is left — which is the skill the whole of decoding rests on, and the one a
                  worksheet almost never asks for. {Object.keys(ALL).length} ladders,{" "}
                  {TOTAL_RUNGS.toLocaleString()} rungs, one for every lesson and every part of a
                  split lesson.
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

            {student && <h1 className="sr-only">Word ladder — {info.name}</h1>}

            {/* Who is looking. At the top in both views, because the way
                out of student view has to be obvious to the adult behind
                the child -- and here it hides the answer. */}
            <div
              style={{
                display: "flex",
                gap: 7,
                flexWrap: "wrap",
                margin: "0 0 18px",
                alignItems: "center",
              }}
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
                  Student view hides the answer to the rung being worked.
                </span>
              )}
            </div>

            {!student && (
              <details className="disclosure" style={{ margin: "0 0 20px" }}>
                <summary
                  style={{
                    cursor: "pointer",
                    listStyle: "none",
                    ...label,
                    fontSize: 12,
                    color: BRAND.ink,
                  }}
                >
                  Choose a lesson · {KEYS.length} of them, Basic Reading and OG levels 1–5
                </summary>
                <div style={{ paddingTop: 14 }}>
                  {groups.map((g) => (
                    <div key={g.name} style={{ margin: "0 0 12px" }}>
                      <p style={{ ...label, margin: "0 0 7px" }}>{g.name}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {g.keys.map((k) => {
                          const i = patternInfo(k);
                          return (
                            <Link
                              key={k}
                              href={href({ p: k })}
                              style={pill(k === key, BRAND.coralDark)}
                              title={i.name}
                            >
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

            {/* Which ladder within the lesson. Only worth showing when the
                lesson has more than one, which most of them do. */}
            {!student && inPattern.length > 1 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", margin: "0 0 18px" }}>
                <span style={{ ...label, marginRight: 4 }}>Ladder</span>
                {inPattern.map((k) => {
                  const part = partOf(k);
                  return (
                    <Link key={k} href={href({ l: k })} style={pill(k === ladderKey, BRAND.lavenderDark)}>
                      {part ?? "Whole lesson"}
                    </Link>
                  );
                })}
              </div>
            )}

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
                  {info.grades ? ` · ${info.grades}` : ""} · {info.name}
                  {partOf(ladderKey) ? ` · ${partOf(ladderKey)}` : ""}
                </p>
              )}

              <Ladder key={ladderKey} data={ladder} student={student} />
            </div>

            {!student && (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 0" }}>
                  <Link href={`/word-ladders/print?p=${key}`} style={pill(false, BRAND.ink)}>
                    Print the ladder sheet →
                  </Link>
                  <Link href={`/spelling?p=${key}`} style={pill(false, BRAND.ink)}>
                    Dictate this pattern →
                  </Link>
                </div>

                <p style={{ ...label, margin: "32px 0 10px" }}>What the check is actually saying</p>
                <p
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.7,
                    color: BRAND.mid,
                    margin: "0 0 10px",
                    maxWidth: "64ch",
                  }}
                >
                  A ladder is a manipulation exercise, so the question worth asking about a wrong
                  rung is whether the child manipulated at all. <i>sit</i> for <i>sat</i> is a child
                  who held the word, changed one sound and chose the wrong one — the method is
                  there and the target is not. <i>mat</i> for <i>sat</i> is a child writing a new
                  word rather than changing this one, which is the method missing. Both are wrong,
                  and they are not the same lesson tomorrow.
                </p>
                <p
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.7,
                    color: BRAND.mid,
                    margin: "0 0 10px",
                    maxWidth: "64ch",
                  }}
                >
                  Every clue here has been checked to have exactly one answer — not one word, one
                  answer. &ldquo;Change the t to n&rdquo; is no use on <i>that</i>, where it could
                  mean either t, and a clue two readings answer is not a clue. None of those
                  survived, which is why the tool can say plainly that a rung is wrong rather than
                  hedging.
                </p>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: 0, maxWidth: "64ch" }}>
                  Nothing is stored. No attempt, no score and no name leaves the tab it was typed in.
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
