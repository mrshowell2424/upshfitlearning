import { SignInGate } from "@/components/shared/SignInGate";
import LADDERS from "@/../scripts/reading-word-ladders.json";
import { patternInfo } from "@/app/writing/writing-data";
import type { LadderData } from "../ladder";

/**
 * The printable word ladder sheet.
 *
 * Two sheets, and the split matters more here than on most of them. The
 * child's sheet carries the start word and every clue and nothing else --
 * no answers anywhere on it, not in small print, not upside down at the
 * bottom. A ladder with the answers on the page is a copying exercise.
 *
 * The teacher's copy is the same ladders filled in, with the changed
 * letters marked so an adult can see at a glance what each rung is
 * actually teaching: which sound moved, and whether it moved at the start,
 * the middle or the end.
 *
 * Up to four ladders, which is a lesson's worth -- the whole-lesson one
 * first, then the parts. More than that and the rungs get too tight to
 * write on, which defeats the object.
 *
 * No Header or Footer: this route is the sheet.
 */

const DATA = LADDERS as unknown as { ladders: Record<string, LadderData> };
const ALL = DATA.ladders;

const PER_SHEET = 4;

const INK = "#111111";
const SOFT = "#555555";
const RULE = "#9AA0A6";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const partOf = (k: string) => (k.includes("|") ? k.split("|")[1] : null);

/**
 * Which letters changed between two rungs.
 *
 * Only for the teacher's copy, and deliberately simple: the longest run
 * of letters shared at the front and at the back is left alone, and
 * whatever sits between them is what moved. That is exactly what a
 * one-change clue does, so it lands on the right letters without needing
 * to parse the clue itself.
 */
function changed(a: string, b: string): [number, number] {
  let head = 0;
  while (head < a.length && head < b.length && a[head] === b[head]) head++;
  let tail = 0;
  while (
    tail < a.length - head &&
    tail < b.length - head &&
    a[a.length - 1 - tail] === b[b.length - 1 - tail]
  )
    tail++;
  return [head, b.length - tail];
}

function Rung({ word, from }: { word: string; from: string | null }) {
  if (!from) {
    return (
      <span style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 19, fontWeight: 700 }}>
        {word}
      </span>
    );
  }
  const [s, e] = changed(from, word);
  return (
    <span style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 19, fontWeight: 700 }}>
      {word.slice(0, s)}
      <span style={{ borderBottom: `2.5px solid ${INK}`, paddingBottom: 1 }}>
        {word.slice(s, e)}
      </span>
      {word.slice(e)}
    </span>
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
  title: "Word ladder sheet",
  description:
    "The printable word ladder: the start word and the clues on the child's sheet, the answers on the teacher's copy with the changed letters marked.",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const keys = Object.keys(ALL);
  const asked = one(sp.p);
  const base = asked && keys.some((k) => k.split("|")[0] === asked) ? asked : keys[0].split("|")[0];

  const mine = keys
    .filter((k) => k.split("|")[0] === base)
    .sort((a, b) => {
      const as = a.includes("|");
      const bs = b.includes("|");
      if (as !== bs) return as ? 1 : -1;
      return a.localeCompare(b);
    })
    .slice(0, PER_SHEET);

  const info = patternInfo(base);

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
      title="Word ladders"
      blurb="The printable ladder sheet, with a teacher's copy. Free — an account is all it takes."
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
          ladders, then your copy with the answers.{" "}
          <a href={`/word-ladders?p=${base}`} style={{ color: "#2F6FD0", textDecoration: "underline" }}>
            Back to Word ladders
          </a>
        </p>
      </div>

      {/* Sheet one: the child's. No answers anywhere on it. */}
      <div style={sheet}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
          {`WORD LADDERS · ${info.group.toUpperCase()}${
            info.grades ? ` · ${info.grades.toUpperCase()}` : ""
          }`}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
            fontSize: 26,
            fontWeight: 700,
            margin: "2px 0 2px",
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
          <b>Each rung: </b>read the word above it. Make the one change the clue asks for.{" "}
          <b>Say the new word out loud</b> before you write it — if you cannot say it, the change
          has not happened yet.
        </div>

        {mine.map((k) => {
          const l = ALL[k];
          const part = partOf(k);
          return (
            <div key={k} style={{ margin: "0 0 20px", breakInside: "avoid" }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: SOFT,
                  margin: "0 0 6px",
                  borderTop: `2px solid ${INK}`,
                  paddingTop: 7,
                }}
              >
                {part ? part.toUpperCase() : "WHOLE LESSON"}
              </p>

              <div style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "0 0 4px" }}>
                <span style={{ fontSize: 10.5, color: SOFT, width: 46, flexShrink: 0 }}>START</span>
                <span
                  style={{
                    fontFamily: 'var(--font-serif), Georgia, serif',
                    fontSize: 19,
                    fontWeight: 700,
                  }}
                >
                  {l.start}
                </span>
              </div>

              {l.clues.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 12,
                    padding: "7px 0 3px",
                  }}
                >
                  <span style={{ fontSize: 10.5, color: SOFT, width: 46, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span
                    style={{
                      borderBottom: `1px solid ${RULE}`,
                      width: 150,
                      height: 22,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12.5, lineHeight: 1.45 }}>{c}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Sheet two: the teacher's, with the letters that moved marked. */}
      <div style={sheet} className="sheet2">
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
          {`TEACHER'S COPY · ${info.name.toUpperCase()}`}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
            fontSize: 21,
            fontWeight: 700,
            margin: "2px 0 10px",
          }}
        >
          The letters underlined are the ones that moved.
        </h2>

        {mine.map((k) => {
          const l = ALL[k];
          const part = partOf(k);
          return (
            <div key={k} style={{ margin: "0 0 18px", breakInside: "avoid" }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: SOFT,
                  margin: "0 0 6px",
                  borderTop: `2px solid ${INK}`,
                  paddingTop: 7,
                }}
              >
                {part ? part.toUpperCase() : "WHOLE LESSON"}
              </p>
              {l.words.map((w, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "3px 0" }}
                >
                  <span style={{ fontSize: 10.5, color: SOFT, width: 46, flexShrink: 0 }}>
                    {i === 0 ? "START" : i}
                  </span>
                  <span style={{ width: 150, flexShrink: 0 }}>
                    <Rung word={w} from={i === 0 ? null : l.words[i - 1]} />
                  </span>
                  <span style={{ fontSize: 12, color: SOFT, lineHeight: 1.45 }}>
                    {i === 0 ? "" : l.clues[i - 1]}
                  </span>
                </div>
              ))}
            </div>
          );
        })}

        <p style={{ fontSize: 10.5, color: SOFT, margin: "16px 0 0", lineHeight: 1.5 }}>
          Every rung is decodable with what the sequence has taught by this lesson, and every clue
          has exactly one answer. When a child writes something else, the question worth asking is
          whether they changed one sound and picked the wrong one, or wrote a different word
          altogether — the first has the method and missed the target, the second has not started
          changing yet.
        </p>
      </div>
    </SignInGate>
  );
}
