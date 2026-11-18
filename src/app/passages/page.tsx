import Link from "next/link";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import PASSAGE_INDEX from "@/../scripts/reading-passages-index.json";
import SEQUENCE from "@/../scripts/reading-sequence.json";
import SPELLING from "@/../scripts/reading-spelling.json";
import { patternInfo } from "@/app/writing/writing-data";

/**
 * Decodable passages.
 *
 * 636 of them: one story per lesson and per part of a split lesson,
 * written at second, third and fourth grade. 86,000 words, 1,908
 * comprehension questions with their answers, and a writing task on
 * every one. All of it already written and already checked -- a
 * second-grade passage may use only what the sequence has taught by its
 * own lesson plus heart words, and no two concepts share a story.
 *
 * It had no page. The file was a build input and nothing else, which
 * means a teacher who had just taught ai could not reach the one text on
 * the site written to be readable immediately after that lesson. That is
 * the thing decodable text is for: a child who has met ai that morning
 * reads "Rain on Game Day" and succeeds, rather than meeting a levelled
 * reader full of patterns nobody has taught them and learning that
 * reading is guessing.
 *
 * The three levels matter more than the count. For 208 of the 212
 * concepts it is the same story at all three, so a class reading at
 * three different levels can still have one conversation about Gail and
 * Ray. Four concepts have a separate second-grade story, because the
 * second-grade decodability floor could not carry the other one.
 */

/**
 * The passages are loaded inside the request. Importing them here meant the
 * Cloudflare Worker parsed 800 KB before it could serve anything; see the
 * header of scripts/build-reading-index.mjs.
 */
const loadPassages = () =>
  import("@/../scripts/reading-passages.json").then(
    (m) =>
      (m.default as unknown as {
        passages: Record<
          string,
          Record<
            string,
            { title: string; paras: string[]; qs: [string, string][]; write: { type: string; task: string } }
          >
        >;
      }).passages,
  );
const P_KEYS = PASSAGE_INDEX.keys;
// The generated index types every key as a literal; the page looks them
// up by a string off the URL, so widen it once here.
const P_WORDS = PASSAGE_INDEX.words as Record<string, Record<string, number>>;
const LEVELS = ["g2", "g3", "g4"] as const;
const LEVEL_NAME: Record<string, string> = { g2: "2nd grade", g3: "3rd grade", g4: "4th grade" };

const SEQ = (SEQUENCE as { sequence: { key: string; name: string; level: number }[] }).sequence;
const SPELL_KEYS = new Set(
  (SPELLING as unknown as { patterns: { key: string }[] }).patterns.map((p) => p.key),
);

/** Lesson key -> that lesson's passage keys, whole lesson first. */
const BY_LESSON = new Map<string, string[]>();
for (const k of P_KEYS) {
  const base = k.split("|")[0];
  const list = BY_LESSON.get(base) ?? [];
  list.push(k);
  BY_LESSON.set(base, list);
}
for (const [, list] of BY_LESSON) {
  list.sort((a, b) => {
    const as = a.includes("|");
    const bs = b.includes("|");
    if (as !== bs) return as ? 1 : -1;
    return a.localeCompare(b);
  });
}

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
  blueDark: "#2F6FD0",
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

const partOf = (k: string) => (k.includes("|") ? k.split("|")[1] : null);
const words = (paras: string[]) => paras.reduce((n, p) => n + p.split(/\s+/).filter(Boolean).length, 0);

// Counted at build time rather than by walking every passage here.
const TOTAL = PASSAGE_INDEX.keys.length;
const TOTAL_WORDS = Object.values(P_WORDS).reduce(
  (n, byLevel) => n + Object.values(byLevel).reduce((m, w) => m + w, 0),
  0,
);

export const metadata = {
  title: "Decodable passages",
  description:
    "636 stories written to be readable the day a pattern is taught: one per lesson, at second, third and fourth grade, with comprehension questions and a writing task.",
  openGraph: ogCard("/og/passages.png"),
  twitter: twitterCard("/og/passages.png"),
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const askedLesson = one(sp.p);
  const lesson = askedLesson && BY_LESSON.has(askedLesson) ? askedLesson : "ai-ay";
  const inLesson = BY_LESSON.get(lesson)!;

  const askedKey = one(sp.k);
  const key = askedKey && inLesson.includes(askedKey) ? askedKey : inLesson[0];

  const askedLevel = one(sp.g);
  const level = (LEVELS as readonly string[]).includes(askedLevel ?? "") ? askedLevel! : "g2";

  const P = await loadPassages();
  const passage = P[key][level];
  const info = patternInfo(lesson);
  const student = one(sp.view) === "student";

  const groups: { name: string; keys: string[] }[] = [];
  for (const r of SEQ) {
    if (!BY_LESSON.has(r.key)) continue;
    const g = patternInfo(r.key).group;
    const found = groups.find((x) => x.name === g);
    if (found) found.keys.push(r.key);
    else groups.push({ name: g, keys: [r.key] });
  }

  const href = (next: { p?: string; k?: string; g?: string; view?: "teacher" | "student" }) => {
    const q = new URLSearchParams();
    const p = next.p ?? lesson;
    q.set("p", p);
    const k = next.p && next.p !== lesson ? undefined : (next.k ?? key);
    if (k) q.set("k", k);
    q.set("g", next.g ?? level);
    const v = next.view ?? (student ? "student" : "teacher");
    if (v === "student") q.set("view", "student");
    return `/passages?${q.toString()}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <SignInGate
          title="Decodable passages"
          blurb="636 stories written to be readable the day the pattern is taught. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />

          <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
            {!student && (
              <>
                <p style={{ ...label, margin: "0 0 6px", color: BRAND.coralDark }}>
                  Connected text
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
                  Decodable passages
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
                  A child who met <i>ai</i> this morning should be able to read something this
                  afternoon and get it right. That is what decodable text is for — and a levelled
                  reader full of patterns nobody has taught yet teaches the opposite lesson, which
                  is that reading is guessing. {TOTAL} stories,{" "}
                  {TOTAL_WORDS.toLocaleString()} words, one per lesson and per part, at three
                  grades.
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

            {student && (
              <h1 className="sr-only">
                {passage.title} — {LEVEL_NAME[level]}
              </h1>
            )}

            <div
              style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "0 0 18px", alignItems: "center" }}
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
                  Student view hides the answers.
                </span>
              )}
            </div>

            {!student && (
              <details className="disclosure" style={{ margin: "0 0 16px" }}>
                <summary
                  style={{ cursor: "pointer", listStyle: "none", ...label, fontSize: 12, color: BRAND.ink }}
                >
                  Choose a lesson · {BY_LESSON.size} of them, in teaching order
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
                              style={pill(k === lesson, BRAND.coralDark)}
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

            {!student && inLesson.length > 1 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", margin: "0 0 14px" }}>
                <span style={{ ...label, marginRight: 4 }}>Story</span>
                {inLesson.map((k) => (
                  <Link key={k} href={href({ k })} style={pill(k === key, BRAND.lavenderDark)}>
                    {partOf(k) ?? "Whole lesson"}
                  </Link>
                ))}
              </div>
            )}

            {/* The level. Word counts shown because that is the thing a
                teacher is actually choosing between, and "2nd grade" on its
                own does not say how much text a child is about to face. */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", margin: "0 0 18px" }}>
              <span style={{ ...label, marginRight: 4 }}>Reading level</span>
              {LEVELS.map((lv) => (
                <Link key={lv} href={href({ g: lv })} style={pill(lv === level, BRAND.tealDark)}>
                  {LEVEL_NAME[lv]} · {P_WORDS[key][lv]} words
                </Link>
              ))}
            </div>

            {/* The story. */}
            <article
              style={{
                border: `1px solid ${BRAND.line}`,
                borderTop: `3px solid ${BRAND.coralDark}`,
                borderRadius: "3px 3px 16px 16px",
                padding: student ? "26px 26px 30px" : "20px 26px 26px",
              }}
            >
              {!student && (
                <p style={{ ...label, margin: "0 0 8px", color: BRAND.coralDark }}>
                  {info.group}
                  {info.grades ? ` · ${info.grades}` : ""} · {info.name}
                  {partOf(key) ? ` · ${partOf(key)}` : ""} · {LEVEL_NAME[level]}
                </p>
              )}

              <h2
                style={{
                  fontFamily: serif,
                  fontSize: student ? 30 : 26,
                  fontWeight: 700,
                  margin: "0 0 12px",
                  lineHeight: 1.2,
                }}
              >
                {passage.title}
              </h2>

              <div className="reading-text">
                {passage.paras.map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: serif,
                      fontSize: student ? 21 : 18.5,
                      lineHeight: 1.85,
                      color: BRAND.ink,
                      margin: i ? "0 0 14px" : "0 0 14px",
                      maxWidth: "58ch",
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </article>

            {/* The questions. Answers are the teacher's. */}
            <div
              style={{
                border: `1px solid ${BRAND.line}`,
                borderLeft: `3px solid ${BRAND.tealDark}`,
                borderRadius: "3px 14px 14px 3px",
                padding: "16px 20px",
                margin: "14px 0 0",
              }}
            >
              <p style={{ ...label, margin: "0 0 10px", color: BRAND.tealDark }}>
                After reading
              </p>
              <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {passage.qs.map(([q, a], i) => (
                  <li key={i} style={{ margin: i ? "12px 0 0" : 0 }}>
                    <p style={{ fontFamily: serif, fontSize: 17, lineHeight: 1.5, margin: 0 }}>
                      <b style={{ ...label, fontSize: 11, marginRight: 8, color: BRAND.mid }}>
                        {i + 1}
                      </b>
                      {q}
                    </p>
                    {!student && (
                      <p
                        style={{
                          fontSize: 14,
                          lineHeight: 1.55,
                          color: BRAND.tealDark,
                          margin: "3px 0 0 26px",
                        }}
                      >
                        {a}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {/* The writing task. */}
            <div
              style={{
                border: `1px solid ${BRAND.line}`,
                borderLeft: `3px solid ${BRAND.lavenderDark}`,
                borderRadius: "3px 14px 14px 3px",
                padding: "16px 20px",
                margin: "12px 0 0",
              }}
            >
              <p style={{ ...label, margin: "0 0 6px", color: BRAND.lavenderDark }}>
                Then write · {passage.write.type}
              </p>
              <p style={{ fontFamily: serif, fontSize: 17, lineHeight: 1.55, margin: 0, maxWidth: "58ch" }}>
                {passage.write.task}
              </p>
            </div>

            {!student && (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 0" }}>
                  <Link
                    href={`/passages/print?p=${lesson}&k=${encodeURIComponent(key)}&g=${level}`}
                    style={pill(false, BRAND.ink)}
                  >
                    Print it →
                  </Link>
                  <Link href={`/word-ladders?p=${lesson}`} style={pill(false, BRAND.ink)}>
                    Ladder →
                  </Link>
                  {SPELL_KEYS.has(lesson) && (
                    <Link href={`/spelling?p=${lesson}`} style={pill(false, BRAND.ink)}>
                      Dictate →
                    </Link>
                  )}
                  <Link href={`/review?p=${lesson}`} style={pill(false, BRAND.ink)}>
                    Review first →
                  </Link>
                </div>

                <p style={{ ...label, margin: "32px 0 10px" }}>Why three levels of one story</p>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: "0 0 10px", maxWidth: "64ch" }}>
                  A class reads at more than one level and has one conversation. For 208 of the 212
                  concepts the story is the same at all three grades, so every child can be handed
                  the version they can actually read and still talk about the same thing afterwards.
                  Four concepts have a different second-grade story, because the second-grade floor
                  could not carry the other one.
                </p>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: 0, maxWidth: "64ch" }}>
                  The second-grade passages use only what the sequence has taught by their own
                  lesson, plus heart words. Third and fourth grade relax that — a fourth grader
                  reviewing short a has met digraphs, and pretending otherwise makes the text
                  unreadable rather than careful — but neither runs past where the programme has
                  got to. Every one of these is checked before it ships, and none is copied from a
                  published reader.
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
