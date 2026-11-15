import { SignInGate } from "@/components/shared/SignInGate";
import HEART from "@/../scripts/reading-heart-words.json";
import { MarkedWord, type HeartWord } from "../word";

/**
 * Printable heart word cards.
 *
 * Cut-out cards, because this is the one thing on the site that genuinely
 * wants to be a card: a heart word gets met again and again over weeks,
 * and the card goes in a ring or a pocket chart.
 *
 * What makes it different from the flashcards these replace is on the
 * card itself. A flashcard shows the whole word and asks a child to
 * recognise it. This shows the whole word with a heart over the letters
 * that are irregular and nothing over the letters that are not, so the
 * card itself teaches that most of the word behaved.
 *
 * The reason is on the back sheet rather than the card, so the card can
 * be shown to a child without handing them the answer in small print.
 *
 * No Header or Footer: this route is the sheet.
 */

const DATA = HEART as unknown as { words: HeartWord[] };
const WORDS = DATA.words;
const LEVELS = [...new Set(WORDS.map((w) => w.level))].sort((a, b) => a - b);

const INK = "#111111";
const SOFT = "#555555";
const RULE = "#9AA0A6";
const MARK = "#111111";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export const metadata = {
  title: "Heart word cards",
  description:
    "Printable cut-out heart word cards, with a heart over only the irregular letters, and a teacher's sheet saying what each one does.",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const asked = Number(one(sp.l));
  const level = LEVELS.includes(asked) ? asked : null;
  const words = level === null ? WORDS : WORDS.filter((w) => w.level === level);

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
      title="Heart words"
      blurb="Printable cut-out cards, with only the irregular letters marked. Free — an account is all it takes."
    >
      <style>{`
        @page { margin: 12mm; }
        @media print {
          .noprint { display: none !important; }
          body { background: #fff !important; }
          a { text-decoration: none; color: inherit; }
        }
        .sheet2 { break-before: page; }
      `}</style>

      <div className="noprint" style={{ ...sheet, paddingBottom: 0 }}>
        <p style={{ fontSize: 13, color: SOFT, margin: 0 }}>
          This is the printable sheet. Press <b>Cmd/Ctrl + P</b>. The cards first, then your sheet
          saying what each word&rsquo;s letters do.{" "}
          <a
            href={level === null ? "/heart-words" : `/heart-words?l=${level}`}
            style={{ color: "#2F6FD0", textDecoration: "underline" }}
          >
            Back to Heart words
          </a>
        </p>
      </div>

      {/* The cards. */}
      <div style={sheet}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
          {`HEART WORDS · ${level === null ? "ALL LEVELS" : `LEVEL ${level}`} · ${words.length} CARDS`}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
            fontSize: 24,
            fontWeight: 700,
            margin: "2px 0 2px",
          }}
        >
          A heart sits over the letters you cannot sound out.
        </h1>
        <p style={{ fontSize: 12, color: SOFT, margin: "0 0 14px", lineHeight: 1.5 }}>
          Everything without a heart is decodable. Read those sounds first, then say what the
          marked letters do. Cut along the lines.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            borderTop: `1px dashed ${RULE}`,
            borderLeft: `1px dashed ${RULE}`,
          }}
        >
          {words.map((w) => (
            <div
              key={w.word}
              style={{
                borderRight: `1px dashed ${RULE}`,
                borderBottom: `1px dashed ${RULE}`,
                padding: "16px 8px 14px",
                minHeight: 74,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                breakInside: "avoid",
              }}
            >
              <MarkedWord entry={w} size={27} colour={MARK} ink={INK} />
            </div>
          ))}
        </div>
      </div>

      {/* The teacher's sheet. */}
      <div style={sheet} className="sheet2">
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
          {`TEACHER'S SHEET · ${level === null ? "ALL LEVELS" : `LEVEL ${level}`}`}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
            fontSize: 21,
            fontWeight: 700,
            margin: "2px 0 12px",
          }}
        >
          What the marked letters are doing.
        </h2>

        {LEVELS.filter((lv) => words.some((w) => w.level === lv)).map((lv) => (
          <div key={lv} style={{ margin: "0 0 14px" }}>
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
              LEVEL {lv}
            </p>
            {words
              .filter((w) => w.level === lv)
              .map((w) => (
                <div
                  key={w.word}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "baseline",
                    padding: "4px 0",
                    breakInside: "avoid",
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-serif), Georgia, serif',
                      fontSize: 15,
                      fontWeight: 700,
                      width: 92,
                      flexShrink: 0,
                    }}
                  >
                    {w.word}
                  </span>
                  <span style={{ fontSize: 11.5, fontWeight: 800, width: 54, flexShrink: 0, color: SOFT }}>
                    {w.letters.join(" + ")}
                  </span>
                  <span style={{ fontSize: 12.5, lineHeight: 1.45 }}>{w.why}</span>
                </div>
              ))}
          </div>
        ))}

        <p style={{ fontSize: 10.5, color: SOFT, margin: "16px 0 0", lineHeight: 1.5, borderTop: `1px solid ${RULE}`, paddingTop: 8 }}>
          No word here is marked from end to end. If every letter were irregular there would be
          nothing to decode and the card would be a flashcard — the thing these are meant to
          replace.
        </p>
      </div>
    </SignInGate>
  );
}
