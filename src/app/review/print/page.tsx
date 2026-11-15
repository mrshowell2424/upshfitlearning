import { SignInGate } from "@/components/shared/SignInGate";
import SEQUENCE from "@/../scripts/reading-sequence.json";
import PREREQ from "@/../scripts/reading-prerequisites.json";
import { reviewSlots } from "@/../scripts/lib/review-slots.mjs";

/**
 * The printable spiral review.
 *
 * One sheet, and it is for the adult rather than the child -- the thing a
 * teacher props against the board for the first five minutes. So it is
 * the words themselves, big enough to read standing up and at arm's
 * length, with the three slots named and nothing else on the page.
 *
 * There are no blanks on it. A review is spoken: the teacher says the
 * word, the child reads it or segments it, and the next one comes. The
 * moment it has lines to write on it becomes a worksheet and stops being
 * five minutes.
 *
 * No Header or Footer: this route is the sheet.
 */

const SEQ = (
  SEQUENCE as {
    sequence: { key: string; name: string; level: number; words: string[]; wordSource: string }[];
  }
).sequence;
const WORDS = new Map(SEQ.map((r) => [r.key, r.words]));
const PRE = PREREQ as { prereq: Record<string, string>; spiral: Record<string, string[]> };

const INK = "#111111";
const SOFT = "#555555";
const RULE = "#9AA0A6";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** More than the screen shows: on paper there is room, and it costs nothing. */
const wordsFor = (key: string, n = 10): string[] => (WORDS.get(key) ?? []).slice(0, n);

export const metadata = {
  title: "Spiral review sheet",
  description:
    "The printable five-minute review: three earlier lessons and the words to say, chosen from the sequence you are teaching.",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const asked = one(sp.p);
  const key = asked && SEQ.some((r) => r.key === asked) ? asked : SEQ[12].key;
  const here = SEQ.find((r) => r.key === key)!;
  const at = SEQ.findIndex((r) => r.key === key);

  const slots = reviewSlots(
    key,
    { seq: SEQ, prereq: PRE.prereq, spiral: PRE.spiral },
    { s1: one(sp.s1), s2: one(sp.s2), s3: one(sp.s3) },
  ) as { why: string; key: string | null; name: string | null; level: number | null }[];

  const sheet: React.CSSProperties = {
    maxWidth: 760,
    margin: "0 auto",
    padding: "22px 26px 40px",
    background: "#FFFFFF",
    color: INK,
    fontFamily: "Poppins, system-ui, sans-serif",
  };

  return (
    <SignInGate
      title="Spiral review"
      blurb="The printable five-minute review. Free — an account is all it takes."
    >
      <style>{`
        @page { margin: 14mm; }
        @media print {
          .noprint { display: none !important; }
          body { background: #fff !important; }
          a { text-decoration: none; color: inherit; }
        }
      `}</style>

      <div className="noprint" style={{ ...sheet, paddingBottom: 0 }}>
        <p style={{ fontSize: 13, color: SOFT, margin: 0 }}>
          This is the printable sheet. Press <b>Cmd/Ctrl + P</b>.{" "}
          <a href={`/review?p=${key}`} style={{ color: "#2F6FD0", textDecoration: "underline" }}>
            Back to Spiral review
          </a>
        </p>
      </div>

      <div style={sheet}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
          {`FIVE MINUTES BEFORE · LESSON ${at + 1} OF ${SEQ.length} · LEVEL ${here.level}`}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
            fontSize: 27,
            fontWeight: 700,
            margin: "2px 0 2px",
            lineHeight: 1.2,
          }}
        >
          {here.name}
        </h1>
        <p style={{ fontSize: 12.5, color: SOFT, margin: "0 0 14px" }}>
          Today&rsquo;s lesson. Go over the three below first.
        </p>

        <div
          style={{
            border: `1.5px solid ${INK}`,
            borderRadius: 8,
            padding: "9px 12px",
            fontSize: 12,
            lineHeight: 1.5,
            margin: "0 0 18px",
          }}
        >
          <b>Out loud, not on paper. </b>Say the word, the child reads it, next one. If a word
          stalls, break it and move on — the review is a temperature check, not the lesson.
        </div>

        {slots.map((s, i) => (
          <div key={i} style={{ margin: "0 0 18px", breakInside: "avoid" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: SOFT,
                margin: "0 0 4px",
                borderTop: `2px solid ${INK}`,
                paddingTop: 8,
              }}
            >
              {i + 1} · {s.why.toUpperCase()}
            </p>
            {s.key ? (
              <>
                <p
                  style={{
                    fontFamily: 'var(--font-serif), Georgia, serif',
                    fontSize: 17,
                    fontWeight: 700,
                    margin: "0 0 6px",
                  }}
                >
                  {s.name}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-serif), Georgia, serif',
                    fontSize: 23,
                    lineHeight: 1.75,
                    margin: 0,
                    letterSpacing: "0.01em",
                  }}
                >
                  {wordsFor(s.key).join("   ·   ")}
                </p>
              </>
            ) : (
              <p style={{ fontSize: 12.5, color: SOFT, margin: 0 }}>
                Nothing yet — too near the start of the sequence for there to be anything behind it.
              </p>
            )}
          </div>
        ))}

        <p style={{ fontSize: 10.5, color: SOFT, margin: "18px 0 0", lineHeight: 1.5, borderTop: `1px solid ${RULE}`, paddingTop: 8 }}>
          Chosen from the sequence, not at random: what today is built on, what was taught most
          recently, and one pattern from this level that is going cold. Every word here is decodable
          with what has already been taught.
        </p>
      </div>
    </SignInGate>
  );
}
