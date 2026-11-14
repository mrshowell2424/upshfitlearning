import { SignInGate } from "@/components/shared/SignInGate";
import WRITING from "@/../scripts/reading-writing-passages.json";
import { FRAME } from "../frame";
import { patternInfo } from "../writing-data";

/**
 * The printable writing frame.
 *
 * Two sheets. The passage on its own, because a child arguing from a text
 * needs to be able to look at it while they write rather than turning the
 * page over; then the frame, with each part's sentence starter already
 * printed and ruled space after it.
 *
 * The starter is printed rather than left blank on purpose. The frame is
 * scaffolding, and a child who has to remember "In the story, ______" as
 * well as find the quote is being asked to do two things at once. The
 * scaffolding comes away later by printing fewer of them, not by making the
 * first attempt harder.
 *
 * No Header or Footer: this route is the sheet.
 */

const SETS = WRITING as Record<string, { prompt: string; passage: string }>;

const INK = "#111111";
const SOFT = "#555555";
const RULE = "#9AA0A6";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function Lines({ n, gap = 30 }: { n: number; gap?: number }) {
  return (
    <div style={{ margin: "6px 0 0" }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${RULE}`, height: gap }} />
      ))}
    </div>
  );
}

function NameLine() {
  return (
    <div style={{ display: "flex", gap: 22, fontSize: 12, color: SOFT, margin: "4px 0 14px" }}>
      <div style={{ flex: 2, borderBottom: `1px solid ${RULE}`, paddingBottom: 2 }}>Name</div>
      <div style={{ flex: 1, borderBottom: `1px solid ${RULE}`, paddingBottom: 2 }}>Date</div>
    </div>
  );
}

export const metadata = {
  title: "Opinion writing frame",
  description:
    "The printable frame: the passage on one sheet, then the eight parts with their sentence starters and ruled space to write.",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const asked = one(sp.p);
  const key = asked && SETS[asked] ? asked : Object.keys(SETS)[0];
  const set = SETS[key];
  const info = patternInfo(key);
  const paras = set.passage.split(/\n+/).map((p) => p.trim()).filter(Boolean);

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
      title="Opinion writing"
      blurb="The printable frame, with the passage on its own sheet. Free — an account is all it takes."
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
          This is the printable sheet. Press <b>Cmd/Ctrl + P</b>. Two pages: the passage, then the
          frame.{" "}
          <a href={`/writing?p=${key}`} style={{ color: "#2F6FD0" }}>
            Back to Opinion writing
          </a>
        </p>
      </div>

      {/* Sheet one: the text, on its own, so it can sit beside the writing. */}
      <div style={sheet}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
          {`OPINION WRITING · ${info.group.toUpperCase()}${
            info.grades ? ` · ${info.grades.toUpperCase()}` : ""
          } · ${info.name.toUpperCase()}`}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.3,
            margin: "4px 0 6px",
          }}
        >
          {set.prompt}
        </h1>
        <NameLine />

        <div
          style={{
            border: `1.5px solid ${INK}`,
            borderRadius: 8,
            padding: "9px 12px",
            fontSize: 12,
            lineHeight: 1.5,
            margin: "0 0 14px",
          }}
        >
          <b>Before you write: </b>read it twice. The second time, <b>underline</b> anything that
          helps answer the question — you will need the exact words later.
        </div>

        <div style={{ borderTop: `2px solid ${INK}`, paddingTop: 12 }}>
          {paras.map((p, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
                fontSize: 16.5,
                lineHeight: 2.0,
                margin: i ? "14px 0 0" : 0,
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Sheet two: the frame. */}
      <div style={sheet} className="sheet2">
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
          MY ANSWER
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 19,
            fontWeight: 700,
            lineHeight: 1.3,
            margin: "2px 0 10px",
          }}
        >
          {set.prompt}
        </h2>

        {(["Intro", "Body", "Ending"] as const).map((part) => (
          <div key={part} style={{ margin: "0 0 10px" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: SOFT,
                margin: "14px 0 4px",
                borderTop: `2px solid ${INK}`,
                paddingTop: 8,
              }}
            >
              {part.toUpperCase()} PARAGRAPH
            </p>
            {FRAME.filter((f) => f.part === part).map((f) => (
              <div key={f.n} style={{ margin: "0 0 10px", breakInside: "avoid" }}>
                <p style={{ fontSize: 13, margin: 0 }}>
                  <b>
                    {f.n}. {f.name}
                  </b>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif), Georgia, serif',
                      fontSize: 15,
                      color: SOFT,
                    }}
                  >
                    {" "}
                    {f.starter}
                  </span>
                </p>
                <Lines n={f.n === 6 ? 3 : 2} />
              </div>
            ))}
          </div>
        ))}

        <p style={{ fontSize: 11, color: SOFT, margin: "14px 0 0", lineHeight: 1.5 }}>
          For <b>My Evidence</b>, copy the words from the passage exactly, and put them in quote
          marks. If it is not word for word, it is not evidence.
        </p>
      </div>
    </SignInGate>
  );
}
