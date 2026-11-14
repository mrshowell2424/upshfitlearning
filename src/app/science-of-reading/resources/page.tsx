import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import { CopyButton } from "./copy-button";
import MYSTERIES from "@/../scripts/reading-mysteries.json";
import ARTICLES from "@/../scripts/reading-articles.json";
import MY_COACH from "@/../scripts/reading-mystery-coach.json";
import AR_COACH from "@/../scripts/reading-article-coach.json";
import READ_THINK from "@/../scripts/reading-read-think.json";

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
  // The dark end of each ramp. The brand hues sit at 2.4-2.8:1 on white and
  // fail for text, so anything carrying meaning uses these instead.
  coralDark: "#C0432F",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
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
    .replace(/\{GRADES\}/g, gradeName(c.grade))
    .replace(/\{TITLE\}/g, c.title)
    .replace("{STORY}", c.story)
    .replace("{QUESTION}", c.question)
    .replace("{SUSPECTS}", c.suspects.map((s) => `- ${s.who}: ${s.why}`).join("\n"));
}

/**
 * Which grades each store holds, in order, and how to say one. All of it is
 * read off the content rather than written down, so a new grade file reaches
 * the pickers with no change here.
 *
 * The two stores fill up at different rates, so a teacher who picks grade 5
 * on the articles and switches to the mysteries may ask for a grade that has
 * not been written yet. Rather than drop them back to the first grade, each
 * tab shows the nearest grade it actually has.
 */
const AR_GRADES = [...new Set(AR.map((a) => a.grade))].sort((x, y) => x - y);
const MY_GRADES = [...new Set(MY.map((c) => c.grade))].sort((x, y) => x - y);
const gradeName = (g: number) =>
  g === 0 ? "K" : g === 1 ? "1st" : g === 2 ? "2nd" : g === 3 ? "3rd" : `${g}th`;
const nearestGrade = (want: number, have: number[]) =>
  have.includes(want)
    ? want
    : have.reduce((best, g) => (Math.abs(g - want) < Math.abs(best - want) ? g : best), have[0] ?? 3);

function articlePrompt(a: (typeof AR)[number], ver: "higher" | "lower") {
  const v = a[ver];
  return AR_COACH.lines
    .join("\n")
    .replace(/\{GRADES\}/g, gradeName(a.grade))
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
  // Was a sage green that appears nowhere else on the site. The hairline grey
  // is the one the cards and rules already use.
  border: `1.5px solid ${BRAND.line}`,
  background: "#FFFFFF",
  color: BRAND.ink,
  maxWidth: "100%",
};

/**
 * The measure, which is the whole point of this page.
 *
 * Running text was set across the full 972px column, about 105 characters a
 * line. Comfortable measure is 55-75; past that the eye loses the line on the
 * return sweep, which is precisely the reader this site is built for. 66ch at
 * 18px lands around 620px and is the single biggest change here.
 */
const reading: React.CSSProperties = {
  maxWidth: "66ch",
  fontSize: 18,
  lineHeight: 1.72,
  // The second half of the fix. Measure got the line length right; the face
  // gets the line itself right. Poppins and Inter run the chrome around this
  // column -- setting the passage in a third, serif face is what tells a
  // reader where the page stops being a website and starts being something
  // to read.
  fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
};

/** Each tab gets its own accent, so switching tabs looks like switching. */
const ACCENT = { my: BRAND.lavenderDark, ar: BRAND.tealDark } as const;

const bandLabel = (color: string): React.CSSProperties => ({
  ...label,
  color,
  margin: "0 0 10px",
});

/** The kind of question an item is, which the prompt has always carried. */
const kindTag: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: BRAND.mid,
  background: BRAND.panel,
  border: `1px solid ${BRAND.line}`,
  borderRadius: 100,
  padding: "2px 8px",
  whiteSpace: "nowrap",
};

/**
 * The card carries one flat accent rather than a second copy of the page's
 * gradient bar. Two gradients forty pixels apart was one gradient too many,
 * and a single colour also tells you which tab you are on.
 */
function Card({ children, accent }: { children: React.ReactNode; accent: string }) {
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
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: "22px 26px 26px" }}>{children}</div>
    </div>
  );
}

/**
 * One labelled band of the card: the text, the questions, the writing.
 *
 * All three used to run together in a single white field with nothing but a
 * small grey label between them, so a teacher projecting the page had nothing
 * to point at. A rule and a coloured label give each part an edge.
 */
function Band({
  heading,
  accent,
  first,
  children,
}: {
  heading: string;
  accent: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        borderTop: first ? "none" : `1px solid ${BRAND.line}`,
        margin: first ? "16px 0 0" : "22px 0 0",
        paddingTop: first ? 0 : 20,
      }}
    >
      <p style={bandLabel(accent)}>{heading}</p>
      {children}
    </section>
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

/**
 * The answer key, which is for the adult in the room and nobody else.
 *
 * It used to be the fourth of four identical pills, so the one control a
 * teacher must not press while projecting looked exactly like the three they
 * press all day. It sits at the far end of the bar, set apart by colour.
 */
function Answers({ children }: { children: React.ReactNode }) {
  return (
    <details style={{ marginTop: 0, marginLeft: "auto" }}>
      <summary
        style={{
          ...pill(false),
          listStyle: "none",
          border: `1.5px solid ${BRAND.mid}`,
          color: BRAND.mid,
        }}
      >
        🔑 Answers (teacher)
      </summary>
      <div style={{ background: BRAND.panel, borderRadius: 12, padding: "12px 16px", marginTop: 10, fontSize: 15 }}>
        {children}
      </div>
    </details>
  );
}

/**
 * A line of the answer key, with its marker drawn.
 *
 * The key used to be bare <p>s and <ul>s, and Tailwind's preflight zeroes
 * the margin on one and the markers on the other -- so three quotes of
 * proof, two clearings and a teacher note arrived as eleven lines of the
 * same weight with nothing between them. On a tab a teacher opens while a
 * class waits, that is the one panel that has to be scannable, and it was
 * the least scannable thing on the page.
 */
function Keyed({
  marker,
  color,
  children,
}: {
  marker: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.1em 1fr",
        gap: 10,
        margin: "0 0 7px",
        lineHeight: 1.55,
      }}
    >
      <b aria-hidden="true" style={{ color, textAlign: "center" }}>
        {marker}
      </b>
      <div style={{ textWrap: "pretty" }}>{children}</div>
    </div>
  );
}

/** A heading inside the answer key. */
function KeyLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return <p style={{ ...label, color, margin: "14px 0 7px" }}>{children}</p>;
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

/**
 * The Read + Think choice board: six Bloom levels, three options each.
 *
 * The board Stephanie uses is written for stories -- name the characters,
 * draw the setting, write a new chapter -- and none of that survives contact
 * with an article about radium poisoning. Same structure, rewritten so every
 * task works on any informational text in the store, which is why it is one
 * board rather than one per article.
 *
 * It is collapsed by default. A teacher who wants it opens it; a class
 * reading the text does not have eighteen extra tasks in the way.
 */
function ReadThink() {
  return (
    <details style={{ margin: "0 0 18px" }}>
      <summary style={{ ...pill(false), listStyle: "none", display: "inline-block" }}>
        {`\u{1F9E0} ${READ_THINK.title} \u2014 choice board`}
      </summary>
      <div
        style={{
          background: "#FFFFFF",
          border: `1px solid ${BRAND.line}`,
          borderRadius: 18,
          padding: "20px 22px",
          marginTop: 12,
        }}
      >
        <h3
          style={{
            fontFamily: "Poppins, Inter, sans-serif",
            fontSize: 24,
            fontWeight: 900,
            margin: "0 0 2px",
            letterSpacing: "-0.5px",
          }}
        >
          {READ_THINK.title}
        </h3>
        <p style={{ color: BRAND.mid, margin: "0 0 16px", fontSize: 15 }}>{READ_THINK.blurb}</p>
        <div style={{ display: "grid", gap: 10 }}>
          {READ_THINK.rows.map((row) => (
            <div
              key={row.level}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(110px, 150px) repeat(3, 1fr)",
                gap: 10,
              }}
            >
              <div
                style={{
                  background: row.tint,
                  borderRadius: 14,
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 16, color: row.ink, lineHeight: 1.2 }}>
                  {row.level}
                </div>
                <div style={{ fontSize: 13, color: BRAND.mid }}>{row.verb}</div>
              </div>
              {row.tasks.map((task) => (
                <div
                  key={task.t}
                  style={{
                    background: BRAND.paper,
                    border: `1px solid ${BRAND.line}`,
                    borderRadius: 14,
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3, marginBottom: 3 }}>
                    {task.t}
                  </div>
                  <div style={{ fontSize: 13, color: BRAND.mid, lineHeight: 1.45 }}>{task.d}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

export const metadata = {
  title: "Reading Resources",
  description:
    "Extra texts for comprehension and writing. Pick one, read it together, answer the questions from the text, then write the response - with a teacher answer key and a prompt you can hand to a student-safe AI space.",
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const tab = one(sp.tab) === "ar" ? "ar" : "my";

  // One grade choice, shared by both tabs, each falling back to what it has.
  const asked = Number(one(sp.g));
  const wanted = Number.isFinite(asked) ? asked : 3;

  // Mysteries: the grade, then the week inside it.
  const myGrade = nearestGrade(wanted, MY_GRADES);
  const myPool = MY.filter((c) => c.grade === myGrade).sort((a, b) => a.week - b.week);
  const ci = Math.min(Math.max(Number(one(sp.c) ?? 0) || 0, 0), Math.max(myPool.length - 1, 0));
  const myCase = myPool[ci];

  // Articles: grade, then standard, then the article inside what is left.
  const grade = nearestGrade(wanted, AR_GRADES);
  const stds = [...new Set(AR.filter((a) => a.grade === grade).map((a) => a.standard))].sort();
  const std = stds.includes(one(sp.s) ?? "") ? (one(sp.s) as string) : "*";
  const pool = AR.filter((a) => a.grade === grade && (std === "*" || a.standard === std));
  const ai = Math.min(Math.max(Number(one(sp.n) ?? 0) || 0, 0), Math.max(pool.length - 1, 0));
  const art = pool[ai];
  const ver: "higher" | "lower" = one(sp.v) === "lo" ? "lower" : "higher";
  const v = art ? art[ver] : null;

  const href = (next: Record<string, string>) => {
    const q = new URLSearchParams({ tab, g: String(tab === "my" ? myGrade : grade), s: std, n: String(ai), v: ver === "lower" ? "lo" : "hi", c: String(ci), ...next });
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
          {/* The paper is painted on the full-width wrapper and the column is
              centred inside it. Painting it on the column itself left a bare
              white band down the right of any wide screen. */}
          <div style={{ background: BRAND.paper, color: BRAND.ink, fontFamily: "Inter, system-ui, sans-serif", lineHeight: 1.6 }}>
          <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
            <p style={{ ...label, margin: "0 0 6px" }}>Upshift Learning</p>
            <h1 style={{ fontFamily: "Poppins, Inter, sans-serif", fontSize: 40, fontWeight: 900, letterSpacing: "-1px", margin: "0 0 4px", lineHeight: 1.1 }}>
              Reading Resources
            </h1>
            <p style={{ color: BRAND.mid, margin: "0 0 24px", fontSize: 17, maxWidth: "60ch" }}>
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
                {/* Grade is a row of links, not a select in the form. As two
                    coupled selects, changing the grade left the case list
                    showing the previous grade's titles until Show was pressed,
                    which reads as every grade having the same cases. */}
                <p style={{ ...label, margin: "0 0 10px" }}>Grade</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 14px" }}>
                  {MY_GRADES.map((g) => (
                    <a key={g} href={`/science-of-reading/resources?tab=my&g=${g}`} style={pill(g === myGrade)}>
                      {gradeName(g)}
                    </a>
                  ))}
                </div>
                <form method="get" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", margin: "0 0 16px" }}>
                  <input type="hidden" name="tab" value="my" />
                  <input type="hidden" name="g" value={myGrade} />
                  <label style={label} htmlFor="c">{`Case · ${myPool.length} in ${gradeName(myGrade)}`}</label>
                  <select id="c" name="c" defaultValue={String(ci)} style={select}>
                    {myPool.map((c, i) => (
                      <option key={c.id} value={i}>{`Week ${c.week} · ${c.title}`}</option>
                    ))}
                  </select>
                  <button type="submit" style={pill(true)}>Show</button>
                </form>

                <Card accent={ACCENT.my}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <p style={{ ...label, margin: 0 }}>{`Mystery · ${gradeName(myCase.grade)} · Week ${myCase.week}`}</p>
                    <p style={{ ...label, margin: 0 }}>{myCase.tag}</p>
                  </div>
                  <h2 style={{ fontFamily: "Poppins, Inter, sans-serif", fontSize: 30, fontWeight: 800, margin: "4px 0 2px", letterSpacing: "-0.6px", lineHeight: 1.15 }}>
                    {myCase.title}
                  </h2>

                  <Band heading="The case" accent={ACCENT.my} first>
                    <div style={{ ...reading, textWrap: "pretty" }}>{myCase.story}</div>
                  </Band>

                  <Band heading="The question" accent={ACCENT.my}>
                    <p style={{ ...reading, fontWeight: 700, margin: "0 0 14px" }}>{myCase.question}</p>
                    <p style={{ ...label, margin: "0 0 8px" }}>Who could it be?</p>
                    <div style={{ ...reading, fontSize: 17 }}>
                      {myCase.suspects.map((s) => (
                        <div key={s.who} style={{ margin: "0 0 10px", textWrap: "pretty" }}>
                          <b>{s.who}</b>
                          <span style={{ color: BRAND.mid }}>{` — ${s.why}`}</span>
                        </div>
                      ))}
                    </div>
                  </Band>

                  <Band heading="Then write" accent={ACCENT.my}>
                    <div style={reading}>
                      Who did it, and how do you know? Quote the words from the case that prove it,
                      and say what rules each of the others out.
                    </div>
                  </Band>
                  <Actions>
                    <CopyButton text={mysteryPrompt(myCase)} label="Copy mystery prompt" />
                    <Prompt text={mysteryPrompt(myCase)} />
                    <a href={`/science-of-reading/resources/print?tab=my&g=${myGrade}&c=${ci}`} style={pill(false)}>
                      🖨 Printable workbook
                    </a>
                  <Answers>
                    <p style={{ fontSize: 17, fontWeight: 700, margin: 0, textWrap: "pretty" }}>
                      {myCase.answer}
                    </p>
                    <KeyLabel color={ACCENT.my}>{`Key proof · ${myCase.proof.length}`}</KeyLabel>
                    {/* A bullet rather than a quote mark: the proof strings
                        carry their own quotes already. */}
                    {myCase.proof.map((p, i) => (
                      <Keyed key={i} marker="•" color={ACCENT.my}>
                        {p}
                      </Keyed>
                    ))}
                    {myCase.clears.length > 0 && (
                      <>
                        <KeyLabel color={BRAND.coralDark}>
                          {`Clears · ${myCase.clears.length}`}
                        </KeyLabel>
                        {myCase.clears.map((p, i) => (
                          <Keyed key={i} marker="×" color={BRAND.coralDark}>
                            {p}
                          </Keyed>
                        ))}
                      </>
                    )}
                    {myCase.explain && (
                      <p
                        style={{
                          margin: "14px 0 0",
                          paddingTop: 12,
                          borderTop: `1px solid ${BRAND.line}`,
                          fontStyle: "italic",
                          color: BRAND.mid,
                          lineHeight: 1.55,
                          textWrap: "pretty",
                        }}
                      >
                        {myCase.explain}
                      </p>
                    )}
                  </Answers>
                  </Actions>
                </Card>
              </>
            ) : (
              <>
                {/* Same reason as the mystery grades: a link reloads at once,
                    so the standards and the articles on screen belong to the
                    grade on screen. */}
                <p style={{ ...label, margin: "0 0 10px" }}>Grade</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 14px" }}>
                  {AR_GRADES.map((g) => (
                    <a
                      key={g}
                      href={`/science-of-reading/resources?tab=ar&g=${g}&s=*&v=${ver === "lower" ? "lo" : "hi"}`}
                      style={pill(g === grade)}
                    >
                      {gradeName(g)}
                    </a>
                  ))}
                </div>
                <form method="get" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", margin: "0 0 16px" }}>
                  <input type="hidden" name="tab" value="ar" />
                  <input type="hidden" name="v" value={ver === "lower" ? "lo" : "hi"} />
                  <input type="hidden" name="g" value={grade} />
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
                  <Card accent={ACCENT.ar}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <p style={{ ...label, margin: 0 }}>{`${art.standard} · Grade ${art.grade}`}</p>
                      <p style={{ ...label, margin: 0 }}>{`Lexile ${v.lexile} · ${v.words} words`}</p>
                    </div>
                    <h2 style={{ fontFamily: "Poppins, Inter, sans-serif", fontSize: 30, fontWeight: 800, margin: "4px 0 12px", letterSpacing: "-0.6px", lineHeight: 1.15 }}>
                      {art.title}
                    </h2>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 4px" }}>
                      <a href={href({ v: "lo" })} style={pill(ver === "lower")}>Lower Lexile</a>
                      <a href={href({ v: "hi" })} style={pill(ver === "higher")}>Higher Lexile</a>
                    </div>

                    <Band heading="The text" accent={ACCENT.ar} first>
                      <div style={reading}>
                        {v.paras.map((p) => (
                          <div key={p.label} style={{ display: "flex", gap: 14, margin: "0 0 16px" }}>
                            <b style={{ color: BRAND.coralDark, flex: "0 0 auto", width: "1.1em" }}>{p.label}</b>
                            <div style={{ textWrap: "pretty" }}>{p.text}</div>
                          </div>
                        ))}
                      </div>
                    </Band>

                    <Band heading="Five questions" accent={ACCENT.ar}>
                      {/* The number is drawn rather than left to the list marker:
                          Tailwind's preflight sets list-style to none, so an <ol>
                          here renders with no numbers at all. */}
                      <div style={{ ...reading, fontSize: 17 }}>
                        {art.questions.map((q) => (
                          <div key={q.n} style={{ display: "flex", gap: 14, margin: "0 0 16px" }}>
                            <b style={{ color: ACCENT.ar, flex: "0 0 auto", width: "1.1em" }}>{q.n}</b>
                            <div>
                              <span style={{ ...kindTag, display: "inline-block", marginBottom: 5 }}>{q.kind}</span>
                              {/* A vocabulary item is two definitions on two lines; the
                                  newline in the data used to collapse and run them together. */}
                              <div style={{ whiteSpace: "pre-line", textWrap: "pretty" }}>{q.q}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Band>

                    <Band heading="Then write" accent={ACCENT.ar}>
                      <div style={reading}>
                        What is the most important idea in this article, and how do you know? Name
                        the paragraph letter for every piece of evidence.
                      </div>
                    </Band>
                    <Actions>
                      <CopyButton text={articlePrompt(art, ver)} label="Copy article prompt" />
                      <Prompt text={articlePrompt(art, ver)} />
                      <a href={href({}).replace("/resources?", "/resources/print?")} style={pill(false)}>
                        🖨 Printable workbook
                      </a>
                    <Answers>
                      {art.questions
                        .filter((q) => q.a)
                        .map((q) => (
                          <Keyed key={q.n} marker={String(q.n)} color={ACCENT.ar}>
                            {/* Vocabulary answers are two definitions on two
                                lines, and the newline in the data collapses
                                without this -- the same fault the question
                                side had. */}
                            <span style={{ whiteSpace: "pre-line" }}>{q.a}</span>
                          </Keyed>
                        ))}
                      {art.note && (
                        <p
                          style={{
                            margin: "14px 0 0",
                            paddingTop: 12,
                            borderTop: `1px solid ${BRAND.line}`,
                            fontStyle: "italic",
                            color: BRAND.mid,
                            lineHeight: 1.55,
                            textWrap: "pretty",
                          }}
                        >
                          {`Teacher note: ${art.note}`}
                        </p>
                      )}
                    </Answers>
                    </Actions>
                  </Card>
                ) : (
                  <p style={{ color: BRAND.mid }}>No article matches that filter.</p>
                )}
                <ReadThink />
              </>
            )}

            <p style={{ fontSize: 13, color: BRAND.mid, margin: "6px 0 0", maxWidth: "66ch" }}>
              These are not decodable texts. They are written to meaning and reading level rather
              than to the phonics sequence, so they use spellings a given lesson has not taught.
              Read them with the class.
            </p>
          </div>
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
