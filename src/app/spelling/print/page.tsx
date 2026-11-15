import { SignInGate } from "@/components/shared/SignInGate";
import SPELLING from "@/../scripts/reading-spelling.json";
import { patternInfo } from "@/app/writing/writing-data";
import type { SpellPart, Sentence } from "../dictation";

/**
 * The printable dictation sheet.
 *
 * On screen the child types and the tool marks it. On paper the teacher
 * reads the words out and the child writes them by hand, which is the way
 * dictation has always been run and the way that builds the motor memory
 * typing does not.
 *
 * Two sheets. The child's has numbered lines and nothing else -- a word
 * list visible anywhere on it would turn dictation into copying. The
 * teacher's has the words with the lesson letters underlined, so marking
 * is a glance rather than a comparison, and a column to tally whether each
 * error was on the pattern or somewhere else, because that tally is what
 * decides tomorrow's lesson.
 *
 * No Header or Footer: this route is the sheet.
 */

const DATA = SPELLING as unknown as {
  patterns: { key: string; parts: SpellPart[]; sub: string[]; sentence: Sentence }[];
};

const INK = "#111111";
const SOFT = "#555555";
const RULE = "#9AA0A6";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Twelve to a sheet: enough to show a pattern, few enough to finish. */
const PER_SHEET = 12;

function NameLine() {
  return (
    <div style={{ display: "flex", gap: 22, fontSize: 12, color: SOFT, margin: "4px 0 14px" }}>
      <div style={{ flex: 2, borderBottom: `1px solid ${RULE}`, paddingBottom: 2 }}>Name</div>
      <div style={{ flex: 1, borderBottom: `1px solid ${RULE}`, paddingBottom: 2 }}>Date</div>
    </div>
  );
}

export const metadata = {
  title: "Dictation sheet",
  description:
    "The printable dictation sheet: numbered lines for the child, and a teacher's copy with the lesson letters underlined and a column for where each error fell.",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const asked = one(sp.p);
  const pattern = DATA.patterns.find((p) => p.key === asked) ?? DATA.patterns[0];
  const info = patternInfo(pattern.key);

  // Spread the picks across the sub-patterns rather than taking the first
  // twelve, which on a pattern like ai/ay would be twelve of the ai and
  // none of the choice the lesson is actually about.
  const picked: { word: string; span: [number, number]; part: string }[] = [];
  const per = Math.ceil(PER_SHEET / pattern.parts.length);
  for (const part of pattern.parts) {
    for (const w of part.words.slice(0, per)) {
      picked.push({ word: w.word, span: w.span as [number, number], part: part.part });
    }
  }
  const words = picked.slice(0, PER_SHEET);

  const sheet: React.CSSProperties = {
    maxWidth: 760,
    margin: "0 auto",
    padding: "22px 26px 40px",
    background: "#FFFFFF",
    color: INK,
    fontFamily: "Inter, system-ui, sans-serif",
  };

  return (
    <SignInGate
      title="Dictation"
      blurb="The printable sheet: numbered lines for the child, the words and the marking column for you. Free — an account is all it takes."
    >
      <style>{`
        @page { margin: 14mm; }
        @media print {
          .noprint { display: none !important; }
          body { background: #fff !important; }
          a { text-decoration: none; color: inherit; }
        }
        .sheet2 { break-before: page; }
      `}</style>

      <div className="noprint" style={{ ...sheet, paddingBottom: 0 }}>
        <p style={{ fontSize: 13, color: SOFT, margin: 0 }}>
          This is the printable sheet. Press <b>Cmd/Ctrl + P</b>. Two pages: the child&rsquo;s
          lines, then your copy with the answers — print page one for the class.{" "}
          <a href={`/spelling?p=${pattern.key}`} style={{ color: "#2F6FD0", textDecoration: "underline" }}>
            Back to Dictation
          </a>
        </p>
      </div>

      {/* Sheet one: the child's. No words anywhere on it. */}
      <div style={sheet}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
          {`DICTATION · ${info.group.toUpperCase()}${
            info.grades ? ` · ${info.grades.toUpperCase()}` : ""
          }`}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 1.25,
            margin: "4px 0 6px",
          }}
        >
          {info.name}
        </h1>
        <NameLine />

        <div
          style={{
            border: `1.5px solid ${INK}`,
            borderRadius: 8,
            padding: "9px 12px",
            fontSize: 12,
            lineHeight: 1.5,
            margin: "0 0 16px",
          }}
        >
          <b>Each time: </b>listen to the whole word, say it yourself, say the sounds, then write
          it. Do not start writing until you have said it.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 34px" }}>
          {Array.from({ length: words.length }).map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 42 }}>
              <span style={{ fontSize: 12, color: SOFT, width: 16, textAlign: "right" }}>
                {i + 1}.
              </span>
              <span style={{ flex: 1, borderBottom: `1px solid ${RULE}`, height: 26 }} />
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: SOFT,
            margin: "22px 0 4px",
            borderTop: `2px solid ${INK}`,
            paddingTop: 10,
          }}
        >
          THE SENTENCE
        </p>
        <p style={{ fontSize: 11.5, color: SOFT, margin: "0 0 8px" }}>
          A capital at the start, a space between every word, and a mark at the end.
        </p>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ borderBottom: `1px solid ${RULE}`, height: 34 }} />
        ))}
      </div>

      {/* Sheet two: the teacher's. */}
      <div style={sheet} className="sheet2">
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
          TEACHER&rsquo;S COPY · {info.name.toUpperCase()}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 20,
            fontWeight: 700,
            margin: "2px 0 10px",
          }}
        >
          Read each word, use it in a sentence, read it again.
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["", "Word", "Teaches", "Pattern", "Elsewhere"].map((h, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: i > 2 ? "center" : "left",
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    color: SOFT,
                    borderBottom: `2px solid ${INK}`,
                    padding: "0 6px 6px",
                    width: i === 0 ? 20 : i > 2 ? 72 : undefined,
                  }}
                >
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {words.map((w, i) => (
              <tr key={w.word}>
                <td style={{ color: SOFT, fontSize: 11, padding: "7px 6px", borderBottom: `1px solid ${RULE}` }}>
                  {i + 1}
                </td>
                <td
                  style={{
                    fontFamily: 'var(--font-serif), Georgia, serif',
                    fontSize: 17,
                    fontWeight: 700,
                    padding: "7px 6px",
                    borderBottom: `1px solid ${RULE}`,
                  }}
                >
                  {w.word.slice(0, w.span[0])}
                  <span style={{ borderBottom: `2.5px solid ${INK}` }}>
                    {w.word.slice(w.span[0], w.span[1])}
                  </span>
                  {w.word.slice(w.span[1])}
                </td>
                <td style={{ fontSize: 12, color: SOFT, padding: "7px 6px", borderBottom: `1px solid ${RULE}` }}>
                  {w.part}
                </td>
                <td style={{ borderBottom: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}` }} />
                <td style={{ borderBottom: `1px solid ${RULE}`, borderLeft: `1px solid ${RULE}` }} />
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            border: `1.5px solid ${INK}`,
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 12,
            lineHeight: 1.55,
            margin: "16px 0 0",
          }}
        >
          <b>The two columns are the point. </b>Underlined letters are what this lesson teaches.
          Tick <b>Pattern</b> when the error is in them and <b>Elsewhere</b> when it is not.{" "}
          <i>rane</i> for <i>rain</i> is a child who has not got <b>ai</b> yet; <i>paind</i> for{" "}
          <i>paint</i> is a child who has it and is hearing the last sound wrong. Only the first
          column is a reason to reteach this lesson.
        </div>

        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: SOFT,
            margin: "18px 0 4px",
            borderTop: `2px solid ${INK}`,
            paddingTop: 10,
          }}
        >
          THE SENTENCE
        </p>
        <p
          style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 18,
            lineHeight: 1.5,
            margin: "0 0 4px",
          }}
        >
          {pattern.sentence.text}
        </p>
        <p style={{ fontSize: 11, color: SOFT, margin: 0 }}>
          Read it twice, whole, at normal speed. Mark the capital, the spacing and the end mark
          separately from the spelling — they are three different lessons.{" "}
          {pattern.sentence.source === "written for dictation"
            ? "Written for dictation."
            : `From ${pattern.sentence.source}.`}
        </p>
      </div>
    </SignInGate>
  );
}
