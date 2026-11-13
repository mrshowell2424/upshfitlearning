import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import { CopyButton } from "./copy-button";
import MYSTERIES from "@/../scripts/reading-mysteries.json";
import ARTICLES from "@/../scripts/reading-articles.json";
import MY_COACH from "@/../scripts/reading-mystery-coach.json";
import AR_COACH from "@/../scripts/reading-article-coach.json";

/**
 * Reading Resources: the mysteries and the informational articles.
 *
 * These are reference texts a teacher browses, so they are a page of their
 * own rather than a step inside the lesson builder, and you pick what you
 * want instead of being handed whatever a lesson mapped to.
 *
 * It is part of the site rather than a material in Postgres. Every other
 * teaching page is served from that table by the seed, and that was the plan
 * here too, but the seed is a production deploy and this page is of no use
 * sitting behind one. Built into the app it ships with the code.
 *
 * All of it renders on the server. The pickers are plain forms, so choosing
 * a case is a GET and the browser does the work it has always done; the only
 * client code on the page is the copy button, which needs the clipboard.
 * That keeps the 500-odd kilobytes of texts on the server where they were
 * read, instead of in a bundle a teacher has to download.
 *
 * The content comes from scripts/reading-mysteries.json and
 * scripts/reading-articles.json, both lifted verbatim from mystery-library
 * and the two reading packs.
 */

const BRAND = {
  coral: "rgb(255,106,91)",
  pink: "rgb(255,125,174)",
  lavender: "rgb(184,125,255)",
  teal: "rgb(0,180,166)",
  ink: "#111111",
  mid: "#444444",
  line: "#E9E9E9",
  panel: "#F2F2F2",
  paper: "#F7F6F4",
};
const GRADIENT =
  `linear-gradient(135deg, ${BRAND.coral}, ${BRAND.pink}, ${BRAND.lavender}, ${BRAND.teal})`;

const MY = MYSTERIES.cases;
const AR = ARTICLES.articles;

type Search = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function mysteryPrompt(c: (typeof MY)[number]) {
  return MY_COACH.lines
    .join("\n")
    .replace(/\{GRADES\}/g, "2nd-4th")
    .replace(/\{TITLE\}/g, c.title)
    .replace("{STORY}", c.story)
    .replace("{QUESTION}", c.question)
    .replace("{SUSPECTS}", c.suspects.map((s) => `- ${s.who}: ${s.why}`).join("\n"));
}

function articlePrompt(a: (typeof AR)[number], ver: "higher" | "lower") {
  const v = a[ver];
  return AR_COACH.lines
    .join("\n")
    .replace(/\{GRADES\}/g, a.grade === 4 ? "4th" : "3rd")
    .replace(/\{TITLE\}/g, a.title)
    .replace("{STANDARD}", a.standard)
    .replace("{ARTICLE}", v.paras.map((p) => `${p.label}. ${p.text}`).join("\n\n"))
    .replace("{QUESTIONS}", a.questions.map((q) => `${q.n} (${q.kind}) ${q.q}`).join("\n"));
}

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
  padding: "8px 18px",
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
  border: "1.5px solid #C9D3C4",
  background: "#FFFFFF",
  color: BRAND.ink,
  maxWidth: "100%",
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: `1px solid ${BRAND.line}`,
        borderRadius: 20,
        overflow: "hidden",
        margin: "0 0 18px",
      }}
    >
      <div style={{ height: 4, background: GRADIENT }} />
      <div style={{ padding: "20px 24px 24px" }}>{children}</div>
    </div>
  );
}

/** Teacher answers, open by default on paper and closed on screen. */
/**
 * The foot of the card, where everything you can press lives.
 *
 * The four controls used to sit loose in the text, so they read as four
 * unrelated things that happened to be near each other rather than as the
 * set of things you can do with this text. Pulled below a rule, against a
 * tint, they read as one bar.
 *
 * The two panels open underneath their own button and push the strip
 * taller, which keeps what opened next to what opened it.
 */
function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderTop: `1px solid ${BRAND.line}`,
        background: BRAND.paper,
        margin: "20px -24px -24px",
        padding: "14px 24px 16px",
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "flex-start",
      }}
    >
      {children}
    </div>
  );
}

function Answers({ children }: { children: React.ReactNode }) {
  return (
    <details style={{ marginTop: 14 }}>
      <summary style={{ ...pill(false), listStyle: "none" }}>Show answers</summary>
      <div style={{ background: BRAND.panel, borderRadius: 12, padding: "12px 16px", marginTop: 10, fontSize: 15 }}>
        {children}
      </div>
    </details>
  );
}

function Prompt({ text }: { text: string }) {
  return (
    <details style={{ marginTop: 10 }}>
      <summary style={{ ...pill(false), listStyle: "none" }}>Show prompt</summary>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 12,
          lineHeight: 1.5,
          background: BRAND.panel,
          borderRadius: 12,
          padding: 14,
          maxHeight: 360,
          overflow: "auto",
          marginTop: 10,
        }}
      >
        {text}
      </pre>
    </details>
  );
}

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const tab = one(sp.tab) === "ar" ? "ar" : "my";

  // Mysteries
  const ci = Math.min(Math.max(Number(one(sp.c) ?? 0) || 0, 0), MY.length - 1);
  const myCase = MY[ci];

  // Articles: grade, then standard, then the article inside what is left.
  const grade = one(sp.g) === "4" ? 4 : 3;
  const stds = [...new Set(AR.filter((a) => a.grade === grade).map((a) => a.standard))].sort();
  const std = stds.includes(one(sp.s) ?? "") ? (one(sp.s) as string) : "*";
  const pool = AR.filter((a) => a.grade === grade && (std === "*" || a.standard === std));
  const ai = Math.min(Math.max(Number(one(sp.n) ?? 0) || 0, 0), Math.max(pool.length - 1, 0));
  const art = pool[ai];
  const ver: "higher" | "lower" = one(sp.v) === "lo" ? "lower" : "higher";
  const v = art ? art[ver] : null;

  const href = (next: Record<string, string>) => {
    const q = new URLSearchParams({ tab, g: String(grade), s: std, n: String(ai), v: ver === "lower" ? "lo" : "hi", c: String(ci), ...next });
    return `/science-of-reading/resources?${q.toString()}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="Reading Resources"
          blurb="Mysteries and informational articles with questions, a written response, and an AI prompt that carries the whole text. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 5% 80px", background: BRAND.paper, color: BRAND.ink, fontFamily: "Inter, system-ui, sans-serif", lineHeight: 1.6 }}>
            <p style={{ ...label, margin: "0 0 6px" }}>Upshift Learning</p>
            <h1 style={{ fontFamily: "Poppins, Inter, sans-serif", fontSize: 40, fontWeight: 900, letterSpacing: "-1px", margin: "0 0 4px", lineHeight: 1.1 }}>
              Reading Resources
            </h1>
            <p style={{ color: BRAND.mid, margin: "0 0 22px", fontSize: 17 }}>
              Extra texts for comprehension and writing. Pick one, read it together, answer the
              questions from the text, then write the response. Copy the prompt to hand the whole
              text to a student-safe AI space.
            </p>

            <div style={{ display: "flex", gap: 8, margin: "0 0 18px", flexWrap: "wrap" }}>
              <a href={href({ tab: "my" })} style={pill(tab === "my")}>&#128269; Mysteries</a>
              <a href={href({ tab: "ar" })} style={pill(tab === "ar")}>&#128240; Articles</a>
            </div>

            {tab === "my" ? (
              <>
                <form method="get" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", margin: "0 0 16px" }}>
                  <input type="hidden" name="tab" value="my" />
                  <label style={label} htmlFor="c">Case</label>
                  <select id="c" name="c" defaultValue={String(ci)} style={select}>
                    {MY.map((c, i) => (
                      <option key={c.id} value={i}>{`Week ${c.week} · ${c.title}`}</option>
                    ))}
                  </select>
                  <button type="submit" style={pill(true)}>Show</button>
                </form>

                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <p style={{ ...label, margin: 0 }}>{`Mystery · Week ${myCase.week}`}</p>
                    <p style={{ ...label, margin: 0 }}>{myCase.tag}</p>
                  </div>
                  <h2 style={{ fontFamily: "Poppins, Inter, sans-serif", fontSize: 26, fontWeight: 800, margin: "2px 0 10px", letterSpacing: "-0.4px", lineHeight: 1.2 }}>
                    {myCase.title}
                  </h2>
                  <p style={{ fontSize: 17, lineHeight: 1.75, margin: "0 0 16px" }}>{myCase.story}</p>
                  <p style={{ fontWeight: 700, margin: "14px 0 6px", fontSize: 15 }}>{`❓ ${myCase.question}`}</p>
                  <ul style={{ margin: "6px 0 14px", paddingLeft: 22 }}>
                    {myCase.suspects.map((s) => (
                      <li key={s.who} style={{ margin: "0 0 5px" }}>
                        <b>{s.who}</b>{` — ${s.why}`}
                      </li>
                    ))}
                  </ul>
                  <Actions>
                    <CopyButton text={mysteryPrompt(myCase)} label="Copy mystery prompt" />
                    <Prompt text={mysteryPrompt(myCase)} />
                    <a href={`/science-of-reading/resources/print?tab=my&c=${ci}`} style={pill(false)}>
                      🖨 Printable workbook
                    </a>
                  <Answers>
                    <p><b>Answer:</b> {myCase.answer}</p>
                    <p><b>Key proof:</b></p>
                    <ul>{myCase.proof.map((p, i) => <li key={i}>{p}</li>)}</ul>
                    {myCase.clears.length > 0 && (
                      <>
                        <p><b>Clears:</b></p>
                        <ul>{myCase.clears.map((p, i) => <li key={i}>{p}</li>)}</ul>
                      </>
                    )}
                    {myCase.explain && <p><i>{myCase.explain}</i></p>}
                  </Answers>
                  </Actions>
                </Card>
              </>
            ) : (
              <>
                <form method="get" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", margin: "0 0 16px" }}>
                  <input type="hidden" name="tab" value="ar" />
                  <input type="hidden" name="v" value={ver === "lower" ? "lo" : "hi"} />
                  <label style={label} htmlFor="g">Grade</label>
                  <select id="g" name="g" defaultValue={String(grade)} style={select}>
                    <option value="3">Grade 3</option>
                    <option value="4">Grade 4</option>
                  </select>
                  <label style={label} htmlFor="s">Standard</label>
                  <select id="s" name="s" defaultValue={std} style={select}>
                    <option value="*">All standards</option>
                    {stds.map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                  <label style={label} htmlFor="n">Article</label>
                  <select id="n" name="n" defaultValue={String(ai)} style={select}>
                    {pool.map((a, i) => <option key={a.id} value={i}>{`${a.n}. ${a.title}`}</option>)}
                  </select>
                  <button type="submit" style={pill(true)}>Show</button>
                </form>

                {art && v ? (
                  <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <p style={{ ...label, margin: 0 }}>{`${art.standard} · Grade ${art.grade}`}</p>
                      <p style={{ ...label, margin: 0 }}>{`Lexile ${v.lexile} · ${v.words} words`}</p>
                    </div>
                    <h2 style={{ fontFamily: "Poppins, Inter, sans-serif", fontSize: 26, fontWeight: 800, margin: "2px 0 10px", letterSpacing: "-0.4px", lineHeight: 1.2 }}>
                      {art.title}
                    </h2>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 14px" }}>
                      <a href={href({ v: "lo" })} style={pill(ver === "lower")}>Lower Lexile</a>
                      <a href={href({ v: "hi" })} style={pill(ver === "higher")}>Higher Lexile</a>
                    </div>
                    {v.paras.map((p) => (
                      <div key={p.label} style={{ display: "flex", gap: 10, margin: "0 0 12px", fontSize: 16, lineHeight: 1.7 }}>
                        <b style={{ color: "#2F6FD0", flex: "0 0 auto" }}>{p.label}</b>
                        <div>{p.text}</div>
                      </div>
                    ))}
                    <p style={{ ...label, margin: "18px 0 2px" }}>Questions</p>
                    {art.questions.map((q) => (
                      <p key={q.n} style={{ margin: "6px 0", fontSize: 15 }}>{`${q.n}. ${q.q}`}</p>
                    ))}
                    <div style={{ borderTop: `1px solid ${BRAND.line}`, margin: "14px 0 0", padding: "12px 0 0", fontSize: 15 }}>
                      <b>Then write a response to reading.</b> What is the most important idea in this
                      article, and how do you know? Name the paragraph letter for every piece of evidence.
                    </div>
                    <Actions>
                      <CopyButton text={articlePrompt(art, ver)} label="Copy article prompt" />
                      <Prompt text={articlePrompt(art, ver)} />
                      <a href={href({}).replace("/resources?", "/resources/print?")} style={pill(false)}>
                        🖨 Printable workbook
                      </a>
                    <Answers>
                      {art.questions.filter((q) => q.a).map((q) => (
                        <p key={q.n}><b>{q.n}.</b> {q.a}</p>
                      ))}
                      {art.note && <p><i>Teacher note: {art.note}</i></p>}
                    </Answers>
                    </Actions>
                  </Card>
                ) : (
                  <p style={{ color: BRAND.mid }}>No article matches that filter.</p>
                )}
              </>
            )}

            <p style={{ fontSize: 13, color: BRAND.mid, margin: "6px 0 0" }}>
              These are not decodable texts. They are written to meaning and reading level rather
              than to the phonics sequence, so they use spellings a given lesson has not taught.
              Read them with the class.
            </p>
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
