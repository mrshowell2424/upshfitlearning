import { SignInGate } from "@/components/shared/SignInGate";
import MYSTERIES from "@/../scripts/reading-mysteries.json";
import ARTICLES from "@/../scripts/reading-articles.json";

/**
 * The printable workbook for a mystery or an article.
 *
 * A page built for the screen and sent to a printer gives a child a wall of
 * text and nowhere to put a pencil. This is laid out for paper instead:
 * double-spaced so a line can be underlined without touching the one below,
 * a margin column for notes, ruled space under every question, and the
 * response frame on its own sheet.
 *
 * Marking is given as a shape AND a colour, because a classroom printer is
 * usually black and white and "circle it in blue" is no instruction at all
 * on a grey page. The shape carries the meaning; the colour is the bonus.
 *
 * No Header or Footer: this route is the sheet. The teacher opens it and
 * presses print.
 */

const MY = MYSTERIES.cases;
const AR = ARTICLES.articles;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
type Search = Promise<Record<string, string | string[] | undefined>>;

const INK = "#111111";
const SOFT = "#555555";

/** Ruled writing space. `n` lines, each one a child can actually write on. */
function Lines({ n, gap = 30 }: { n: number; gap?: number }) {
  return (
    <div style={{ margin: "8px 0 0" }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ borderBottom: "1px solid #9AA0A6", height: gap }} />
      ))}
    </div>
  );
}

function Rule() {
  return <div style={{ borderTop: `2px solid ${INK}`, margin: "16px 0 10px" }} />;
}

function NameLine() {
  return (
    <div style={{ display: "flex", gap: 24, fontSize: 12, color: SOFT, margin: "2px 0 14px" }}>
      <div style={{ flex: 2, borderBottom: "1px solid #9AA0A6", paddingBottom: 2 }}>Name</div>
      <div style={{ flex: 1, borderBottom: "1px solid #9AA0A6", paddingBottom: 2 }}>Date</div>
    </div>
  );
}

/** The marking key. Shape first, colour second, so it survives a grey printer. */
function Key({ rows }: { rows: [string, string, string][] }) {
  return (
    <div
      style={{
        border: `1.5px solid ${INK}`,
        borderRadius: 8,
        padding: "8px 12px",
        margin: "0 0 14px",
        breakInside: "avoid",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", marginBottom: 6 }}>
        HOW TO MARK THE TEXT
      </div>
      {rows.map(([mark, colour, what]) => (
        <div key={what} style={{ fontSize: 13, lineHeight: 1.7 }}>
          <b>{mark}</b>
          {` (${colour}) — ${what}`}
        </div>
      ))}
    </div>
  );
}

/** A paragraph with room to write beside it. */
function Annotatable({ letter, text }: { letter?: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: 14, breakInside: "avoid", margin: "0 0 14px" }}>
      <div style={{ flex: "1 1 auto" }}>
        {letter && (
          <span
            style={{
              display: "inline-block",
              border: `1.5px solid ${INK}`,
              borderRadius: 4,
              width: 20,
              height: 20,
              lineHeight: "18px",
              textAlign: "center",
              fontWeight: 800,
              fontSize: 12,
              marginRight: 8,
            }}
          >
            {letter}
          </span>
        )}
        <span style={{ fontSize: 15, lineHeight: 2.1 }}>{text}</span>
      </div>
      <div
        style={{
          flex: "0 0 150px",
          borderLeft: "1px dashed #9AA0A6",
          paddingLeft: 8,
          fontSize: 10,
          color: SOFT,
        }}
      >
        Notes
      </div>
    </div>
  );
}

/** The eight-part frame, with somewhere to write each part. */
function Frame({ what }: { what: string }) {
  const parts: [string, string][] = [
    ["Topic", `The ${what} is ______.`],
    ["What It Is About", "It is about ______."],
    ["My Claim", "I think ______."],
    ["My Reason", "One reason is ______."],
    ["In the Story", "In the story, ______"],
    ["My Evidence", "For example, ______."],
    ["Why It Matters", "This shows ______."],
    ["Wrap It Up", "That is why ______."],
  ];
  return (
    <div>
      {parts.map(([name, stem]) => (
        <div key={name} style={{ breakInside: "avoid", margin: "0 0 10px" }}>
          <div style={{ fontSize: 12, fontWeight: 800 }}>
            {name}
            <span style={{ fontWeight: 400, color: SOFT }}>{`  ${stem}`}</span>
          </div>
          <Lines n={name === "My Evidence" || name === "Why It Matters" ? 2 : 1} />
        </div>
      ))}
    </div>
  );
}

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const kind = one(sp.tab) === "ar" ? "ar" : "my";

  const ci = Math.min(Math.max(Number(one(sp.c) ?? 0) || 0, 0), MY.length - 1);
  const myCase = MY[ci];

  // Follow whatever grades the store holds, so a workbook link from the
  // resources page lands on the grade it was asked for.
  const grades = [...new Set(AR.map((a) => a.grade))].sort((x, y) => x - y);
  const asked = Number(one(sp.g));
  const grade = grades.includes(asked) ? asked : (grades[0] ?? 3);
  const std = one(sp.s) ?? "*";
  const pool = AR.filter((a) => a.grade === grade && (std === "*" || a.standard === std));
  const ai = Math.min(Math.max(Number(one(sp.n) ?? 0) || 0, 0), Math.max(pool.length - 1, 0));
  const art = pool[ai];
  const ver: "higher" | "lower" = one(sp.v) === "lo" ? "lower" : "higher";

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
      title="Reading Resources"
      blurb="Printable workbooks for the mysteries and articles. Free — an account is all it takes."
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
          This is the printable sheet. Press <b>Cmd/Ctrl + P</b>. Two pages: the text with room to
          mark it, then the written response.{" "}
          <a href="/science-of-reading/resources" style={{ color: "#2F6FD0" }}>
            Back to Reading Resources
          </a>
        </p>
      </div>

      {kind === "my" ? (
        <div style={sheet}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
            {`MYSTERY · WEEK ${myCase.week}`}
          </div>
          <h1 style={{ fontFamily: "Poppins, Inter, sans-serif", fontSize: 26, fontWeight: 900, margin: "2px 0 6px" }}>
            {myCase.title}
          </h1>
          <NameLine />
          <Key
            rows={[
              ["Circle", "blue", "every person or animal who could have done it"],
              ["Underline", "green", "words that prove who did it"],
              ["Cross out", "red", "words that show somebody could NOT have done it"],
              ["Box", "yellow", "a word you do not know"],
            ]}
          />
          <Annotatable text={myCase.story} />

          <Rule />
          <div style={{ fontSize: 15, fontWeight: 800, margin: "0 0 8px" }}>{myCase.question}</div>
          <div style={{ fontSize: 12, color: SOFT, margin: "0 0 6px" }}>
            Write what the text says about each one. Then tick the one you think did it.
          </div>
          {myCase.suspects.map((s) => (
            <div key={s.who} style={{ breakInside: "avoid", margin: "0 0 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700 }}>
                <span style={{ border: `1.5px solid ${INK}`, width: 14, height: 14, display: "inline-block" }} />
                {s.who}
              </div>
              <Lines n={1} gap={26} />
            </div>
          ))}

          <div className="sheet2" style={{ paddingTop: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
              WRITE YOUR ANSWER
            </div>
            <h2 style={{ fontFamily: "Poppins, Inter, sans-serif", fontSize: 20, fontWeight: 800, margin: "2px 0 4px" }}>
              {myCase.title}
            </h2>
            <NameLine />
            <div style={{ fontSize: 12, color: SOFT, margin: "0 0 10px" }}>
              Say who did it, then prove it with the exact words from the mystery.
            </div>
            <Frame what="mystery" />
          </div>
        </div>
      ) : art ? (
        <div style={sheet}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
            {`${art.standard} · GRADE ${art.grade} · LEXILE ${art[ver].lexile}`}
          </div>
          <h1 style={{ fontFamily: "Poppins, Inter, sans-serif", fontSize: 26, fontWeight: 900, margin: "2px 0 6px" }}>
            {art.title}
          </h1>
          <NameLine />
          <Key
            rows={[
              ["Underline", "green", "the most important idea in each paragraph"],
              ["Circle", "blue", "a number, a date or a name that proves something"],
              ["Box", "yellow", "a word you do not know"],
              ["Star", "red", "the one sentence you would keep if you kept only one"],
            ]}
          />
          {art[ver].paras.map((p) => (
            <Annotatable key={p.label} letter={p.label} text={p.text} />
          ))}

          <Rule />
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", margin: "0 0 8px" }}>
            QUESTIONS
          </div>
          <div style={{ fontSize: 12, color: SOFT, margin: "0 0 10px" }}>
            Answer in your own words. For each one, write the paragraph letter you found it in.
          </div>
          {art.questions.map((q) => (
            <div key={q.n} style={{ breakInside: "avoid", margin: "0 0 12px" }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{`${q.n}. ${q.q}`}</div>
              <div style={{ fontSize: 11, color: SOFT }}>Paragraph: ____</div>
              <Lines n={2} />
            </div>
          ))}

          <div className="sheet2" style={{ paddingTop: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: SOFT }}>
              RESPONSE TO READING
            </div>
            <h2 style={{ fontFamily: "Poppins, Inter, sans-serif", fontSize: 20, fontWeight: 800, margin: "2px 0 4px" }}>
              {art.title}
            </h2>
            <NameLine />
            <div style={{ fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>
              What is the most important idea in this article, and how do you know?
            </div>
            <div style={{ fontSize: 12, color: SOFT, margin: "0 0 10px" }}>
              Name the paragraph letter for every piece of evidence.
            </div>
            <Frame what="article" />
          </div>
        </div>
      ) : (
        <div style={sheet}>No article matches that filter.</div>
      )}
    </SignInGate>
  );
}
