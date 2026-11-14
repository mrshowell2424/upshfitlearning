import Link from "next/link";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import MORPH from "@/../scripts/reading-morphology.json";

/**
 * Word Parts: the morphology strand, run on words the class has already met.
 *
 * Morphology is normally taught off a list -- here are ten -ment words, now
 * do the worksheet -- and it does not transfer, for the same reason syntax
 * taught on sentences about nothing does not transfer. A child meets
 * "settlement" in a text about a town.
 *
 * So every word here appears in one of the 350 articles, and the sentence
 * under it is the sentence it appeared in, word for word. A teacher can
 * point at it; a child has already read it. The splits themselves are
 * curated by hand in scripts/morphemes.mjs rather than derived, because the
 * derived version offered "mission" as a mis- word and "moment" as a -ment
 * word, which is worse than teaching no morphology at all.
 *
 * Both pickers are rows of links, not selects. Two coupled selects leave the
 * second list stale until submit, which is the bug that made four other
 * pickers on this site show the wrong grade's words.
 */

const MORPHEMES = MORPH.morphemes;
const ROUTINE = MORPH.routine;
const GRADES = [...new Set(MORPHEMES.flatMap((m) => m.words.map((w) => w.grade)))].sort(
  (a, b) => a - b,
);

const BRAND = {
  coral: "#FF6A5B",
  pink: "#FF7DAE",
  lavender: "#B87DFF",
  teal: "#00B4A6",
  ink: "#111111",
  mid: "#444444",
  line: "#E9E9E9",
  panel: "#F2F2F2",
  paper: "#F7F6F4",
  white: "#FFFFFF",
  coralDark: "#C0432F",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
  blueDark: "#2F6FD0",
};
const GRADIENT = `linear-gradient(135deg, ${BRAND.coral}, ${BRAND.pink}, ${BRAND.lavender}, ${BRAND.teal})`;

/** One colour per kind, so the three groups stay apart at a glance. */
const KIND: Record<string, { label: string; color: string; blurb: string }> = {
  prefix: {
    label: "Prefixes",
    color: BRAND.tealDark,
    blurb: "Goes on the front and changes the meaning.",
  },
  suffix: {
    label: "Suffixes",
    color: BRAND.lavenderDark,
    blurb: "Goes on the end, and usually changes the job the word does.",
  },
  root: {
    label: "Roots",
    color: BRAND.blueDark,
    blurb: "The middle that carries the meaning, often from Latin or Greek.",
  },
};

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

/** The lines a child reads get the serif. Chrome stays in Inter. */
const reading: React.CSSProperties = {
  fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
  fontSize: 18,
  lineHeight: 1.6,
};

function pill(on: boolean, color: string): React.CSSProperties {
  return {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: 13,
    fontWeight: 800,
    padding: "7px 14px",
    borderRadius: 999,
    textDecoration: "none",
    border: `1.5px solid ${on ? color : BRAND.line}`,
    background: on ? color : BRAND.white,
    color: on ? BRAND.white : BRAND.ink,
    whiteSpace: "nowrap",
  };
}

/**
 * The split, drawn as separate tiles. A child who sees "un" and "broken" as
 * two objects can move them; a child who sees "un-broken" sees one word with
 * a line in it.
 *
 * `mark` is the tile that is the part being taught, and it is the one that
 * gets the colour. It was briefly always the first tile, which is right for
 * a prefix and backwards for every suffix on the page -- "beautiful" came up
 * with "beauty" marked and "ful", the entire point of the card, in grey.
 */
function Split({ parts, mark, color }: { parts: string[]; mark: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {parts.map((p, i) => (
        <span key={`${p}-${i}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {i > 0 && (
            <span
              aria-hidden="true"
              style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 800, color: BRAND.mid }}
            >
              +
            </span>
          )}
          <span
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 19,
              fontWeight: i === mark ? 700 : 600,
              padding: "4px 12px",
              borderRadius: 8,
              background: i === mark ? BRAND.white : BRAND.panel,
              border: `1.5px solid ${i === mark ? color : BRAND.line}`,
              color: i === mark ? color : BRAND.ink,
            }}
          >
            {p}
          </span>
        </span>
      ))}
    </div>
  );
}

export const metadata = {
  title: "Word Parts",
  description:
    "Prefixes, suffixes and roots, taught on words your class has already read. Every word appears in an Upshift article, and the sentence under it is the article's own.",
  openGraph: ogCard("/og/morphology.png"),
  twitter: twitterCard("/og/morphology.png"),
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const asked = one(sp.m);
  const morpheme = MORPHEMES.find((m) => m.key === asked) ?? MORPHEMES[0];
  const accent = KIND[morpheme.kind]?.color ?? BRAND.ink;

  const askedGrade = Number(one(sp.g));
  const grade = GRADES.includes(askedGrade) ? askedGrade : null;

  const shown = grade === null ? morpheme.words : morpheme.words.filter((w) => w.grade === grade);

  const href = (next: { m?: string; g?: number | null }) => {
    const q = new URLSearchParams();
    q.set("m", next.m ?? morpheme.key);
    const g = next.g === undefined ? grade : next.g;
    if (g !== null && g !== undefined) q.set("g", String(g));
    return `/morphology?${q}`;
  };

  /**
   * How this word comes apart, and which tile is the part being taught.
   * A root can sit anywhere in the word -- first in "graphic", second in
   * "pre + dict", middle in "geo + graph + y" -- so it is found, not assumed.
   */
  const partsOf = (w: (typeof morpheme.words)[number]) => {
    const bare = morpheme.form.replace(/-/g, "");
    if (morpheme.kind === "prefix") return { parts: [bare, w.base], mark: 0 };
    if (morpheme.kind === "suffix") return { parts: [w.base, bare], mark: 1 };
    const parts = w.base.split(" + ");
    const mark = parts.findIndex((p) => p.includes(bare));
    return { parts, mark: mark === -1 ? 0 : mark };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="Word Parts"
          blurb="Prefixes, suffixes and roots, taught on words your class has already met in an article — with the sentence each one came from. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />

          <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
            <p style={{ ...label, margin: "0 0 6px", color: BRAND.blueDark }}>Word structure</p>
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
              Word Parts
            </h1>
            <p style={{ ...reading, color: BRAND.mid, maxWidth: "62ch", margin: "0 0 10px" }}>
              A child who can take a word apart can read words nobody taught them. These are{" "}
              {MORPHEMES.reduce((s, m) => s + m.words.length, 0)} words from articles your class
              has already read, grouped by the part they share — so the strategy is practised on
              words they have met, and the example sentence is the one they met it in.
            </p>
            <p style={{ fontSize: 13, color: BRAND.mid, margin: "0 0 26px" }}>
              <Link
                href="/science-of-reading"
                style={{ color: BRAND.tealDark, fontWeight: 700, textDecoration: "none" }}
              >
                ← Science of Reading
              </Link>
            </p>

            {/* The routine, three steps, before any word list. */}
            <div
              style={{
                border: `1px solid ${BRAND.line}`,
                borderRadius: 14,
                padding: "18px 20px",
                margin: "0 0 26px",
                background: BRAND.paper,
              }}
            >
              <p style={{ ...label, margin: "0 0 12px" }}>
                The routine · about {ROUTINE.reduce((s, r) => s + r.minutes, 0)} minutes a word
              </p>
              <div
                style={{
                  display: "grid",
                  // Three steps, so three columns where they fit. auto-fit at
                  // 230px settled on two and left the third stranded beside
                  // an empty cell.
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 185px), 1fr))",
                  gap: 16,
                }}
              >
                {ROUTINE.map((r, i) => (
                  <div key={r.key}>
                    <p
                      style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        margin: "0 0 4px",
                        color: accent,
                      }}
                    >
                      {i + 1}. {r.name}
                      <span style={{ color: BRAND.mid, fontWeight: 600 }}> · {r.minutes} min</span>
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.5, margin: "0 0 5px" }}>{r.what}</p>
                    <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, color: BRAND.mid }}>
                      {r.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pick a part. Grouped, because a prefix and a suffix are not the same move. */}
            {(["prefix", "suffix", "root"] as const).map((kind) => {
              const group = MORPHEMES.filter((m) => m.kind === kind);
              if (!group.length) return null;
              return (
                <div key={kind} style={{ margin: "0 0 14px" }}>
                  <p style={{ ...label, margin: "0 0 7px", color: KIND[kind].color }}>
                    {KIND[kind].label} · {KIND[kind].blurb}
                  </p>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {group.map((m) => (
                      <Link
                        key={m.key}
                        href={href({ m: m.key })}
                        style={pill(m.key === morpheme.key, KIND[kind].color)}
                      >
                        {m.form}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Narrow to one grade, for a teacher who only wants their own. */}
            <div style={{ margin: "20px 0 0" }}>
              <p style={{ ...label, margin: "0 0 7px" }}>Grade the word first appears in</p>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                <Link href={href({ g: null })} style={pill(grade === null, BRAND.ink)}>
                  All
                </Link>
                {GRADES.map((g) => {
                  const n = morpheme.words.filter((w) => w.grade === g).length;
                  return (
                    <Link
                      key={g}
                      href={href({ g })}
                      style={{
                        ...pill(grade === g, BRAND.ink),
                        opacity: n ? 1 : 0.38,
                      }}
                    >
                      {gradeName(g)}
                      <span style={{ fontWeight: 600, color: grade === g ? BRAND.white : BRAND.mid }}>
                        {" "}
                        {n}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* The part itself. */}
            <div
              style={{
                borderTop: `3px solid ${accent}`,
                borderRadius: "3px 3px 14px 14px",
                border: `1px solid ${BRAND.line}`,
                borderTopWidth: 3,
                borderTopColor: accent,
                padding: "20px 22px",
                margin: "26px 0 0",
              }}
            >
              <p style={{ ...label, margin: "0 0 6px", color: accent }}>
                {morpheme.kind} · {shown.length} word{shown.length === 1 ? "" : "s"}
                {grade !== null ? ` in ${gradeName(grade)}` : ""}
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontSize: 38,
                  fontWeight: 700,
                  margin: "0 0 4px",
                  letterSpacing: "-0.5px",
                }}
              >
                {morpheme.form}
              </h2>
              <p style={{ ...reading, margin: 0 }}>
                means <b>{morpheme.means}</b>
              </p>
              {/* On screen the split and the meaning are both given, which is
                  right beside a teacher and useless as practice. The sheet
                  gives the part and keeps the work. */}
              <p style={{ fontSize: 13, margin: "12px 0 0" }}>
                <Link
                  href={`/morphology/print?m=${morpheme.key}${grade !== null ? `&g=${grade}` : ""}`}
                  style={{ color: accent, fontWeight: 700, textDecoration: "none" }}
                >
                  Print this as a worksheet →
                </Link>
              </p>
            </div>

            {/* The words. */}
            {shown.length === 0 ? (
              <p style={{ ...reading, color: BRAND.mid, margin: "22px 0 0" }}>
                No {morpheme.form} word turns up in a {gradeName(grade as number)} article. That is
                a real gap, not a filter problem —{" "}
                <Link href={href({ g: null })} style={{ color: accent, fontWeight: 700 }}>
                  see every grade
                </Link>
                .
              </p>
            ) : (
              <div style={{ margin: "18px 0 0" }}>
                {shown.map((w) => (
                  <div
                    key={w.word}
                    style={{
                      border: `1px solid ${BRAND.line}`,
                      borderRadius: 14,
                      padding: "18px 20px",
                      margin: "0 0 12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        margin: "0 0 12px",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif), Georgia, serif',
                          fontSize: 26,
                          fontWeight: 700,
                          margin: 0,
                        }}
                      >
                        {w.word}
                      </h3>
                      <span style={{ ...label, color: BRAND.mid }}>{w.gradeName}</span>
                    </div>

                    <Split {...partsOf(w)} color={accent} />

                    <p style={{ ...reading, margin: "12px 0 0" }}>
                      so it means <b>{w.means}</b>
                    </p>

                    {w.note && (
                      <p
                        style={{
                          fontSize: 13,
                          lineHeight: 1.5,
                          margin: "8px 0 0",
                          color: BRAND.mid,
                          borderLeft: `3px solid ${BRAND.line}`,
                          paddingLeft: 11,
                        }}
                      >
                        {/* On an affix the note is a spelling trap at the
                            join; on a root it is what the other part means.
                            One label cannot honestly cover both. */}
                        {morpheme.kind === "root" ? "The other part: " : "Watch this one: "}
                        {w.note}
                      </p>
                    )}

                    <div
                      style={{
                        background: BRAND.panel,
                        borderRadius: 12,
                        padding: "13px 16px",
                        margin: "13px 0 0",
                      }}
                    >
                      <p style={{ ...label, margin: "0 0 6px" }}>Where they met it</p>
                      <p style={{ ...reading, margin: "0 0 6px" }}>{w.sentence}</p>
                      <p style={{ fontSize: 13, color: BRAND.mid, margin: 0 }}>
                        {w.article.title} · {w.gradeName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
