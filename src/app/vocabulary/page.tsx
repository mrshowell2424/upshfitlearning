import Header from "@/components/shared/Header";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import ARTICLES from "@/../scripts/reading-articles.json";
import ROUTINE from "@/../scripts/reading-vocabulary-routine.json";

/**
 * Teach a Word: the three-phase routine, run on words we already wrote.
 *
 * Every article carries two word-and-definition pairs as its vocabulary
 * question. Those were written as an answer key and nobody has used them as
 * anything else, but there are 600 of them, each already tied to a grade and
 * a standard. That is a vocabulary scope and sequence sitting in a field
 * labelled "answers".
 *
 * So this page reads the words out of the article store rather than keeping a
 * second list. A word can never drift from the article it belongs to, and a
 * new grade of articles stocks this page on the same build.
 */

const AR = ARTICLES.articles;

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
  coralDark: "#C0432F",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
};
const GRADIENT =
  `linear-gradient(135deg, ${BRAND.coral}, ${BRAND.pink}, ${BRAND.lavender}, ${BRAND.teal})`;

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const gradeName = (g: number) =>
  g === 0 ? "K" : g === 1 ? "1st" : g === 2 ? "2nd" : g === 3 ? "3rd" : `${g}th`;

interface Word {
  word: string;
  def: string;
  grade: number;
  standard: string;
  from: string;
  id: string;
}

/**
 * Pull every word out of the articles' vocabulary questions.
 *
 * The question holds two definitions on two lines, each written "word: what
 * it means", which is why the newline mattered enough to fix on the reading
 * page. Here it is what makes the field parseable at all.
 */
function allWords(): Word[] {
  const out: Word[] = [];
  for (const a of AR) {
    const v = a.questions.find((q) => q.kind === "vocabulary");
    if (!v) continue;
    for (const line of String(v.q).split("\n")) {
      const at = line.indexOf(":");
      if (at < 1) continue;
      const word = line.slice(0, at).trim();
      const def = line.slice(at + 1).trim();
      if (!word || !def) continue;
      out.push({
        word,
        def,
        grade: a.grade,
        standard: a.standard,
        from: a.title,
        id: `${a.id}-${word.toLowerCase().replace(/[^a-z]+/g, "-")}`,
      });
    }
  }
  return out;
}

const WORDS = allWords();
const GRADES = [...new Set(WORDS.map((w) => w.grade))].sort((x, y) => x - y);

const label: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: BRAND.mid,
};
const pill = (on: boolean): React.CSSProperties => ({
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 13,
  fontWeight: 700,
  borderRadius: 100,
  padding: "8px 16px",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
  border: `1.5px solid ${BRAND.ink}`,
  background: on ? BRAND.ink : "#FFFFFF",
  color: on ? "#FFFFFF" : BRAND.ink,
});
const select: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 14,
  padding: "9px 12px",
  borderRadius: 12,
  border: `1.5px solid ${BRAND.line}`,
  background: "#FFFFFF",
  color: BRAND.ink,
  maxWidth: "100%",
};

/** The script, with the word and its meaning already dropped in. */
function fill(text: string, w: Word) {
  return text.replace(/\{WORD\}/g, w.word).replace(/\{DEF\}/g, w.def);
}

export const metadata = {
  title: "Teach a Word",
  description:
    "A three-phase vocabulary routine — say it, use it, write it — on every word in the Upshift article library.",
  openGraph: ogCard("/og/vocabulary.png"),
  twitter: twitterCard("/og/vocabulary.png"),
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const asked = Number(one(sp.g));
  const grade = GRADES.includes(asked) ? asked : 3;
  const pool = WORDS.filter((w) => w.grade === grade).sort((a, b) =>
    a.word.localeCompare(b.word),
  );
  const wi = Math.min(Math.max(Number(one(sp.w) ?? 0) || 0, 0), Math.max(pool.length - 1, 0));
  const word = pool[wi];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="Teach a Word"
          blurb="A three-phase vocabulary routine on every word in the article library, with the script already filled in. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />
          <div
            style={{
              background: BRAND.paper,
              color: BRAND.ink,
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: 1.6,
            }}
          >
            <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
              <p style={{ ...label, margin: "0 0 6px" }}>Upshift Learning</p>
              <h1
                style={{
                  fontFamily: "Poppins, Inter, sans-serif",
                  fontSize: 42,
                  fontWeight: 900,
                  letterSpacing: "-1.2px",
                  margin: "0 0 6px",
                  lineHeight: 1.08,
                }}
              >
                {ROUTINE.title}
              </h1>
              <p style={{ color: BRAND.mid, margin: "0 0 10px", fontSize: 17, maxWidth: "60ch" }}>
                {ROUTINE.blurb}
              </p>
              <p style={{ color: BRAND.mid, margin: "0 0 24px", fontSize: 15, maxWidth: "60ch" }}>
                {`All ${WORDS.length} words come from the articles themselves, so every word already belongs to a grade, a standard and a text it turns up in.`}
              </p>

              {/* Grade is a row of links, not a select inside the form.
                  As two coupled selects, changing the grade left the word list
                  showing the previous grade's words until the button was
                  pressed -- which reads as every grade having the same list.
                  A link reloads straight away, so the words on screen always
                  belong to the grade on screen. It also drops the word index,
                  since word 40 of one grade has nothing to do with word 40 of
                  another. */}
              <p style={{ ...label, margin: "0 0 10px" }}>Grade</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 16px" }}>
                {GRADES.map((g) => (
                  <a key={g} href={`/vocabulary?g=${g}`} style={pill(g === grade)}>
                    {gradeName(g)}
                  </a>
                ))}
              </div>

              <form
                method="get"
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                  margin: "0 0 18px",
                }}
              >
                <input type="hidden" name="g" value={grade} />
                <label style={label} htmlFor="w">{`Word · ${pool.length} in ${gradeName(grade)}`}</label>
                <select id="w" name="w" defaultValue={String(wi)} style={select}>
                  {pool.map((w, i) => (
                    <option key={w.id} value={i}>{w.word}</option>
                  ))}
                </select>
                <button type="submit" style={pill(true)}>Teach it</button>
              </form>

              {word ? (
                <>
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: `1px solid ${BRAND.line}`,
                      borderTop: `4px solid ${BRAND.lavenderDark}`,
                      borderRadius: 20,
                      padding: "22px 26px 26px",
                      margin: "0 0 18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <p style={{ ...label, margin: 0 }}>
                        {`${word.standard} · ${gradeName(word.grade)}`}
                      </p>
                      <p style={{ ...label, margin: 0 }}>{`from "${word.from}"`}</p>
                    </div>
                    <h2
                      style={{
                        fontFamily: "Poppins, Inter, sans-serif",
                        fontSize: 44,
                        fontWeight: 900,
                        margin: "4px 0 4px",
                        letterSpacing: "-1.4px",
                        lineHeight: 1.05,
                      }}
                    >
                      {word.word}
                    </h2>
                    <p style={{ fontSize: 19, lineHeight: 1.6, margin: "0 0 4px", maxWidth: "60ch" }}>
                      {word.def}
                    </p>
                  </div>

                  {ROUTINE.phases.map((phase) => (
                    <div
                      key={phase.key}
                      style={{
                        background: "#FFFFFF",
                        border: `1px solid ${BRAND.line}`,
                        borderTop: `4px solid ${phase.ink}`,
                        borderRadius: 20,
                        padding: "20px 24px 24px",
                        margin: "0 0 14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 12,
                          flexWrap: "wrap",
                          marginBottom: 14,
                        }}
                      >
                        <span
                          style={{
                            background: phase.tint,
                            color: phase.ink,
                            borderRadius: 100,
                            padding: "4px 12px",
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          {`Phase ${phase.n}`}
                        </span>
                        <h3
                          style={{
                            fontFamily: "Poppins, Inter, sans-serif",
                            fontSize: 24,
                            fontWeight: 800,
                            margin: 0,
                            letterSpacing: "-0.5px",
                          }}
                        >
                          {phase.name}
                        </h3>
                        <span style={{ ...label, margin: 0 }}>{phase.minutes}</span>
                      </div>

                      {phase.steps.map((step, i) => (
                        <div
                          key={step.t}
                          style={{
                            display: "flex",
                            gap: 14,
                            margin: "0 0 16px",
                            maxWidth: "70ch",
                          }}
                        >
                          <b
                            style={{
                              color: phase.ink,
                              flex: "0 0 auto",
                              width: "1.4em",
                              fontSize: 17,
                            }}
                          >
                            {i + 1}
                          </b>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>
                              {step.t}
                            </div>
                            <div
                              style={{
                                background: phase.tint,
                                borderRadius: 12,
                                padding: "10px 14px",
                                fontSize: 17,
                                lineHeight: 1.6,
                                marginBottom: 6,
                              }}
                            >
                              <span style={{ ...label, display: "block", marginBottom: 2 }}>
                                You say
                              </span>
                              {fill(step.say, word)}
                            </div>
                            <div style={{ fontSize: 15, color: BRAND.mid, lineHeight: 1.6 }}>
                              <b style={{ color: BRAND.ink }}>They do: </b>
                              {step.do}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  <div
                    style={{
                      background: "#FFFFFF",
                      border: `1px solid ${BRAND.line}`,
                      borderRadius: 18,
                      padding: "18px 22px",
                      margin: "0 0 18px",
                    }}
                  >
                    <p style={{ ...label, margin: "0 0 10px" }}>Where this sits in the lesson</p>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", maxWidth: "66ch" }}>
                      {ROUTINE.placement.lines.map((line) => (
                        <li
                          key={line}
                          style={{ display: "flex", gap: 12, margin: "0 0 10px", fontSize: 16, lineHeight: 1.6 }}
                        >
                          <b style={{ color: BRAND.tealDark, flex: "0 0 auto" }}>·</b>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p style={{ fontSize: 13, color: BRAND.mid, maxWidth: "66ch", lineHeight: 1.6 }}>
                    Say it, use it, write it is a common shape for teaching a word, and Kate
                    Kinsella&rsquo;s vocabulary work is the version most teachers have met. The
                    script on this page is ours.
                  </p>
                </>
              ) : (
                <p style={{ color: BRAND.mid }}>No word matches that filter.</p>
              )}
            </div>
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
