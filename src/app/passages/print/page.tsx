import { SignInGate } from "@/components/shared/SignInGate";
import PASSAGE_INDEX from "@/../scripts/reading-passages-index.json";
import { patternInfo } from "@/app/writing/writing-data";

/**
 * The printable decodable passage.
 *
 * Two sheets. The child's carries the story, the three questions with
 * ruled space under each, and the writing task with space after it --
 * everything a child needs and no answers anywhere on it.
 *
 * The teacher's copy is the same questions with their answers, and the
 * passage's own numbers: how many words, which lesson it belongs to,
 * which grade it is written at. Those matter when a teacher is deciding
 * which of the three levels to hand to which child, and they are the one
 * thing the child's sheet should not carry.
 *
 * The story is set large and loose on purpose. A decodable passage is
 * read slowly, aloud, often with a finger, and crowded lines are their
 * own obstacle before the phonics is.
 *
 * No Header or Footer: this route is the sheet.
 */

/** Loaded inside the request; see scripts/build-reading-index.mjs. */
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
const P_KEYS = new Set(PASSAGE_INDEX.keys as string[]);
const LEVELS = ["g2", "g3", "g4"];
const LEVEL_NAME: Record<string, string> = { g2: "2nd grade", g3: "3rd grade", g4: "4th grade" };

const INK = "#111111";
const SOFT = "#555555";
const RULE = "#9AA0A6";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const partOf = (k: string) => (k.includes("|") ? k.split("|")[1] : null);
const words = (paras: string[]) => paras.reduce((n, p) => n + p.split(/\s+/).filter(Boolean).length, 0);

function Lines({ n, gap = 28 }: { n: number; gap?: number }) {
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
  title: "Decodable passage sheet",
  description:
    "The printable passage: the story, three questions with space to answer, and the writing task — with a teacher's copy carrying the answers.",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const askedKey = one(sp.k);
  const P = await loadPassages();
  const key = askedKey && P_KEYS.has(askedKey) ? askedKey : "ai-ay";
  const lesson = key.split("|")[0];

  const askedLevel = one(sp.g);
  const level = LEVELS.includes(askedLevel ?? "") ? askedLevel! : "g2";

  const passage = P[key][level];
  const info = patternInfo(lesson);

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
      title="Decodable passages"
      blurb="The printable story, with the questions and a teacher's copy. Free — an account is all it takes."
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
          This is the printable sheet. Press <b>Cmd/Ctrl + P</b>. Two pages: the child&rsquo;s, then
          your copy with the answers.{" "}
          <a
            href={`/passages?p=${lesson}&k=${encodeURIComponent(key)}&g=${level}`}
            style={{ color: "#2F6FD0", textDecoration: "underline" }}
          >
            Back to Decodable passages
          </a>
        </p>
      </div>

      {/* Sheet one: the child's. No answers on it. */}
      <div style={sheet}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
          {`${info.name.toUpperCase()}${partOf(key) ? ` · ${partOf(key)!.toUpperCase()}` : ""}`}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
            fontSize: 27,
            fontWeight: 700,
            margin: "2px 0 2px",
            lineHeight: 1.25,
          }}
        >
          {passage.title}
        </h1>
        <NameLine />

        <div style={{ borderTop: `2px solid ${INK}`, paddingTop: 12, margin: "0 0 16px" }}>
          {passage.paras.map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
                fontSize: 16.5,
                lineHeight: 2.0,
                margin: i ? "12px 0 0" : 0,
              }}
            >
              {para}
            </p>
          ))}
        </div>

        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: SOFT,
            margin: "0 0 2px",
            borderTop: `2px solid ${INK}`,
            paddingTop: 10,
          }}
        >
          AFTER READING
        </p>
        {passage.qs.map(([q], i) => (
          <div key={i} style={{ margin: "10px 0 0", breakInside: "avoid" }}>
            <p
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 14.5,
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              <b>{i + 1}.</b> {q}
            </p>
            <Lines n={2} />
          </div>
        ))}

        <div style={{ breakInside: "avoid", margin: "16px 0 0" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: SOFT,
              margin: "0 0 2px",
              borderTop: `2px solid ${INK}`,
              paddingTop: 10,
            }}
          >
            {`NOW WRITE · ${passage.write.type.toUpperCase()}`}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 14.5,
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            {passage.write.task}
          </p>
          <Lines n={5} />
        </div>
      </div>

      {/* Sheet two: the teacher's. */}
      <div style={sheet} className="sheet2">
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
          {`TEACHER'S COPY · ${LEVEL_NAME[level].toUpperCase()} · ${words(passage.paras)} WORDS`}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
            fontSize: 22,
            fontWeight: 700,
            margin: "2px 0 10px",
            lineHeight: 1.25,
          }}
        >
          {passage.title}
        </h2>

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
          <b>{info.name}</b>
          {partOf(key) ? ` · ${partOf(key)}` : ""} · {LEVEL_NAME[level]}.{" "}
          {level === "g2"
            ? "Uses only what the sequence has taught by this lesson, plus heart words."
            : "Relaxed to what the programme has taught by the end of the level below, so a reader at this grade is not held to a floor they passed long ago."}{" "}
          The same story is written at the other two grades — hand each child the one they can read,
          and the conversation afterwards is still shared.
        </div>

        {passage.qs.map(([q, a], i) => (
          <div key={i} style={{ margin: "0 0 12px", breakInside: "avoid" }}>
            <p style={{ fontSize: 14, lineHeight: 1.45, margin: 0, fontWeight: 700 }}>
              {i + 1}. {q}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 14,
                lineHeight: 1.5,
                margin: "3px 0 0",
                color: SOFT,
                paddingLeft: 11,
                borderLeft: `3px solid ${RULE}`,
              }}
            >
              {a}
            </p>
          </div>
        ))}

        <div style={{ borderTop: `2px solid ${INK}`, paddingTop: 10, margin: "14px 0 0" }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT, margin: "0 0 2px" }}>
            {`THE WRITING · ${passage.write.type.toUpperCase()}`}
          </p>
          <p style={{ fontSize: 13.5, lineHeight: 1.5, margin: 0 }}>{passage.write.task}</p>
        </div>

        <p style={{ fontSize: 10.5, color: SOFT, margin: "18px 0 0", lineHeight: 1.5 }}>
          Written for Upshift and checked before it shipped: every word in the second-grade version
          is decodable with what has been taught by this lesson, and no two lessons share a story.
          Not copied from any published reader.
        </p>
      </div>
    </SignInGate>
  );
}
