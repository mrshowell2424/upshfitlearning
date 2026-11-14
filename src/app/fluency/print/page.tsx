import { SignInGate } from "@/components/shared/SignInGate";
import ARTICLES from "@/../scripts/reading-articles.json";
import FLU from "@/../scripts/reading-fluency.json";

/**
 * The printable running record.
 *
 * /fluency puts the passage on a screen and the scoring beside it, which is
 * fine for the arithmetic and impossible for the actual job: a teacher
 * running a one-minute read is marking errors on the text with a pencil
 * while the child reads it off something else. You cannot do that on one
 * monitor, and the reason every published fluency probe is a sheet of paper
 * is that it has to be two surfaces.
 *
 * So the passage is re-set the way a probe is set -- fixed runs of words
 * with the running total down the right margin -- because the number a
 * teacher needs at sixty seconds is "how many words had they reached", and
 * counting back through prose to find it is the part that goes wrong.
 *
 * No Header or Footer: this route is the sheet. The teacher opens it and
 * presses print.
 */

const AR = ARTICLES.articles;
const GRADES = [...new Set(AR.map((a) => a.grade))].sort((a, b) => a - b);

const INK = "#111111";
const SOFT = "#555555";
const RULE = "#9AA0A6";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const gradeName = (g: number) =>
  g === 0 ? "K" : g === 1 ? "1st" : g === 2 ? "2nd" : g === 3 ? "3rd" : `${g}th`;

/** Words per printed line. Ten is what a published probe uses: short enough
 *  that the running total is easy to read back, long enough not to waste a
 *  page. */
const PER_LINE = 10;

function NameLine() {
  return (
    <div style={{ display: "flex", gap: 22, fontSize: 12, color: SOFT, margin: "4px 0 14px" }}>
      <div style={{ flex: 2, borderBottom: `1px solid ${RULE}`, paddingBottom: 2 }}>Name</div>
      <div style={{ flex: 1, borderBottom: `1px solid ${RULE}`, paddingBottom: 2 }}>Date</div>
      <div style={{ flex: 1, borderBottom: `1px solid ${RULE}`, paddingBottom: 2 }}>Cold / practised</div>
    </div>
  );
}

/** A box the teacher writes a number into. */
function Box({ label, hint }: { label: string; hint?: string }) {
  return (
    <div style={{ flex: "1 1 120px" }}>
      <div
        style={{
          border: `1.5px solid ${INK}`,
          borderRadius: 6,
          height: 46,
        }}
      />
      <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", margin: "5px 0 0" }}>
        {label.toUpperCase()}
      </p>
      {hint && <p style={{ fontSize: 10.5, color: SOFT, margin: "1px 0 0", lineHeight: 1.3 }}>{hint}</p>}
    </div>
  );
}

export const metadata = {
  title: "Fluency running record",
  description:
    "The printable one-minute read: the passage set in ten-word runs with a running total down the margin, and the scoring on the same sheet.",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const asked = Number(one(sp.g));
  const grade = GRADES.includes(asked) ? asked : 3;
  const pool = AR.filter((a) => a.grade === grade);
  const ai = Math.min(Math.max(Number(one(sp.n) ?? 0) || 0, 0), Math.max(pool.length - 1, 0));
  const art = pool[ai];
  const ver: "higher" | "lower" = one(sp.v) === "lo" ? "lower" : "higher";

  const text = (art?.[ver]?.paras ?? []).map((p: { text: string }) => p.text).join(" ");
  const allWords = text.split(/\s+/).filter(Boolean);

  // Fixed runs with the cumulative total, which is the whole point of the
  // sheet: at the minute the teacher reads the number off the margin rather
  // than counting backwards through prose.
  const rows: { words: string[]; total: number }[] = [];
  for (let i = 0; i < allWords.length; i += PER_LINE) {
    const words = allWords.slice(i, i + PER_LINE);
    rows.push({ words, total: Math.min(i + PER_LINE, allWords.length) });
  }

  const norm = (FLU.norms.grades as { grade: number; fall: number | null; winter: number | null; spring: number | null }[])
    .find((n) => n.grade === grade);

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
      title="Fluency"
      blurb="The printable one-minute read, with the running total down the margin. Free — an account is all it takes."
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
          This is the printable sheet. Press <b>Cmd/Ctrl + P</b>. Print two: one for the child to
          read from, one for you to mark.{" "}
          <a href={`/fluency?g=${grade}&n=${ai}&v=${ver === "lower" ? "lo" : "hi"}`} style={{ color: "#2F6FD0" }}>
            Back to Fluency
          </a>
        </p>
      </div>

      {!art ? (
        <div style={sheet}>
          <p>No passage in {gradeName(grade)} yet.</p>
        </div>
      ) : (
        <div style={sheet}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
            {`ONE-MINUTE READ · ${gradeName(grade).toUpperCase()} · ${
              ver === "lower" ? "EASIER" : "HARDER"
            } VERSION · ${allWords.length} WORDS`}
          </div>
          <h1
            style={{
              fontFamily: "Poppins, Inter, sans-serif",
              fontSize: 26,
              fontWeight: 900,
              margin: "2px 0 6px",
            }}
          >
            {art.title}
          </h1>
          <NameLine />

          {/* Marking key. Shape first and colour second, because a classroom
              printer is black and white and "underline it in red" is not an
              instruction on a grey page. */}
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
            <b>As they read: </b>
            <span>
              strike through a word read wrong · write what they said above it · draw a line{" "}
              <b>|</b> where they are at sixty seconds · circle a word you had to give them.
            </span>
          </div>

          {/* The passage, in runs, with the total down the margin. */}
          <div style={{ borderTop: `2px solid ${INK}`, paddingTop: 10 }}>
            {rows.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                  breakInside: "avoid",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
                    fontSize: 17,
                    lineHeight: 2.1,
                    letterSpacing: "0.01em",
                  }}
                >
                  {r.words.join(" ")}
                </div>
                <div
                  style={{
                    width: 34,
                    textAlign: "right",
                    fontSize: 11,
                    color: SOFT,
                    borderLeft: `1px solid ${RULE}`,
                    paddingLeft: 8,
                  }}
                >
                  {r.total}
                </div>
              </div>
            ))}
          </div>

          {/* Scoring, on the same sheet so nothing has to be copied across. */}
          <div style={{ borderTop: `2px solid ${INK}`, margin: "18px 0 0", paddingTop: 12 }}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Box label="Words read" hint="the number in the margin at 60 seconds" />
              <Box label="Errors" hint="struck through, plus any you gave them" />
              <Box label="WCPM" hint="words read minus errors" />
              <Box label="Accuracy" hint="WCPM ÷ words read" />
            </div>

            <p style={{ fontSize: 12, lineHeight: 1.55, margin: "14px 0 0" }}>
              <b>Read the accuracy first.</b> Under {FLU.reading.accuracyFloor} percent the passage
              is too hard to practise fluency on, however fast it was read — use the easier version
              before working on rate.
              {norm && (
                <>
                  {" "}
                  For context, a {gradeName(grade)} median runs about{" "}
                  {[
                    norm.fall != null ? `${norm.fall} in autumn` : null,
                    norm.winter != null ? `${norm.winter} in winter` : null,
                    norm.spring != null ? `${norm.spring} in spring` : null,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  . That describes how a large sample of children read. It is not a number this
                  child owes anybody.
                </>
              )}
            </p>

            {/* Prosody, printed to be circled. The screen tool scores it with
                buttons; on paper it has to carry its own descriptors or the
                number means nothing a week later. */}
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", margin: "16px 0 6px" }}>
              HOW IT SOUNDED — CIRCLE ONE
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[...FLU.prosody.levels].sort((a, b) => a.n - b.n).map((l) => (
                <div
                  key={l.n}
                  style={{
                    flex: "1 1 160px",
                    border: `1.5px solid ${INK}`,
                    borderRadius: 8,
                    padding: "8px 10px",
                  }}
                >
                  <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 2px" }}>
                    {l.n} · {l.t}
                  </p>
                  <p style={{ fontSize: 11, lineHeight: 1.4, color: SOFT, margin: 0 }}>{l.d}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 10.5, color: SOFT, margin: "8px 0 0" }}>
              {FLU.prosody.source}
            </p>
          </div>
        </div>
      )}
    </SignInGate>
  );
}
