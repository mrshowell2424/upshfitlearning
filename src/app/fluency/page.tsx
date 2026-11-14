import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import ARTICLES from "@/../scripts/reading-articles.json";
import FLU from "@/../scripts/reading-fluency.json";
import { Scorer } from "./scorer";

/**
 * Fluency: a one-minute read on a passage we already own.
 *
 * The site had comprehension and word-level work and nothing on fluency, and
 * the thing a fluency check needs is a passage whose word count and level you
 * can trust. We have 700 of those -- 350 articles in two Lexile versions, with
 * the word count measured by the build harness and the Lexile checked by the
 * gate -- so this page is the instrument rather than the content.
 *
 * It does not save a read. Storing a child's scores over time needs a table
 * and a decision about who may see them, and neither should be invented
 * quietly. The printable record sheet is the stopgap and it says so.
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
  tealDark: "#00756C",
};
const GRADIENT =
  `linear-gradient(135deg, ${BRAND.coral}, ${BRAND.pink}, ${BRAND.lavender}, ${BRAND.teal})`;

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const GRADES = [...new Set(AR.map((a) => a.grade))].sort((x, y) => x - y);
const gradeName = (g: number) =>
  g === 0 ? "K" : g === 1 ? "1st" : g === 2 ? "2nd" : g === 3 ? "3rd" : `${g}th`;

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
const reading: React.CSSProperties = {
  maxWidth: "66ch",
  fontSize: 18,
  lineHeight: 1.72,
};

function Band({
  heading,
  first,
  children,
}: {
  heading: string;
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
      <p style={{ ...label, color: BRAND.tealDark, margin: "0 0 10px" }}>{heading}</p>
      {children}
    </section>
  );
}

export const metadata = {
  title: "Fluency",
  description:
    "A one-minute read on any Upshift passage, with words correct per minute, accuracy and a prosody rating.",
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const asked = Number(one(sp.g));
  const grade = GRADES.includes(asked) ? asked : 3;
  const pool = AR.filter((a) => a.grade === grade);
  const ai = Math.min(Math.max(Number(one(sp.n) ?? 0) || 0, 0), Math.max(pool.length - 1, 0));
  const art = pool[ai];
  const ver: "higher" | "lower" = one(sp.v) === "lo" ? "lower" : "higher";
  const v = art ? art[ver] : null;
  const norm = FLU.norms.grades.find((x) => x.grade === grade) ?? null;

  const href = (next: Record<string, string>) => {
    const q = new URLSearchParams({
      g: String(grade),
      n: String(ai),
      v: ver === "lower" ? "lo" : "hi",
      ...next,
    });
    return `/fluency?${q.toString()}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="Fluency"
          blurb="A one-minute read on any Upshift passage, with words correct per minute, accuracy and how it sounded. Free — an account is all it takes."
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
                Fluency
              </h1>
              <p style={{ color: BRAND.mid, margin: "0 0 24px", fontSize: 17, maxWidth: "60ch" }}>
                One minute, one passage, two numbers. Every article in the library already carries
                a measured word count and a Lexile, so any of the 700 passages can be a fluency
                check without anybody retyping a thing.
              </p>

              {/* Grade is a row of links rather than a select in the form.
                  Coupled selects left the passage list showing the previous
                  grade's titles until the button was pressed. A link reloads
                  at once, so the passages on screen belong to the grade on
                  screen, and the passage index resets with the grade. */}
              <p style={{ ...label, margin: "0 0 10px" }}>Grade</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 16px" }}>
                {GRADES.map((g) => (
                  <a
                    key={g}
                    href={`/fluency?g=${g}&v=${ver === "lower" ? "lo" : "hi"}`}
                    style={pill(g === grade)}
                  >
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
                <input type="hidden" name="v" value={ver === "lower" ? "lo" : "hi"} />
                <input type="hidden" name="g" value={grade} />
                <label style={label} htmlFor="n">{`Passage · ${pool.length} in ${gradeName(grade)}`}</label>
                <select id="n" name="n" defaultValue={String(ai)} style={select}>
                  {pool.map((a, i) => (
                    <option key={a.id} value={i}>{`${a.n}. ${a.title}`}</option>
                  ))}
                </select>
                <button type="submit" style={pill(true)}>Show</button>
              </form>

              {art && v ? (
                <>
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: `1px solid ${BRAND.line}`,
                      borderTop: `4px solid ${BRAND.tealDark}`,
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
                        {`${art.standard} · ${gradeName(art.grade)}`}
                      </p>
                      <p style={{ ...label, margin: 0 }}>
                        {`Lexile ${v.lexile} · ${v.words} words`}
                      </p>
                    </div>
                    <h2
                      style={{
                        fontFamily: "Poppins, Inter, sans-serif",
                        fontSize: 30,
                        fontWeight: 800,
                        margin: "4px 0 12px",
                        letterSpacing: "-0.6px",
                        lineHeight: 1.15,
                      }}
                    >
                      {art.title}
                    </h2>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <a href={href({ v: "lo" })} style={pill(ver === "lower")}>Lower Lexile</a>
                      <a href={href({ v: "hi" })} style={pill(ver === "higher")}>Higher Lexile</a>
                    </div>

                    <Band heading="The one-minute read" first>
                      <Scorer
                        totalWords={v.words}
                        grade={art.grade}
                        accuracyFloor={FLU.reading.accuracyFloor}
                        norms={norm}
                      />
                    </Band>

                    <Band heading="The passage">
                      <div style={reading}>
                        {v.paras.map((p) => (
                          <div key={p.label} style={{ display: "flex", gap: 14, margin: "0 0 16px" }}>
                            <b style={{ color: BRAND.coralDark, flex: "0 0 auto", width: "1.1em" }}>
                              {p.label}
                            </b>
                            <div style={{ textWrap: "pretty" }}>{p.text}</div>
                          </div>
                        ))}
                      </div>
                    </Band>

                    <Band heading="How to run it">
                      <ol style={{ ...reading, margin: 0, paddingLeft: 0, listStyle: "none" }}>
                        {FLU.routine.map((r) => (
                          <li key={r.n} style={{ display: "flex", gap: 14, margin: "0 0 14px" }}>
                            <b style={{ color: BRAND.tealDark, flex: "0 0 auto", width: "1.1em" }}>
                              {r.n}
                            </b>
                            <div>
                              <b>{r.t}. </b>
                              {r.d}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </Band>

                    <Band heading={FLU.prosody.label}>
                      <div style={reading}>
                        {FLU.prosody.levels.map((p) => (
                          <div key={p.n} style={{ display: "flex", gap: 14, margin: "0 0 12px" }}>
                            <b style={{ color: BRAND.tealDark, flex: "0 0 auto", width: "1.1em" }}>
                              {p.n}
                            </b>
                            <div>
                              <b>{p.t}. </b>
                              {p.d}
                            </div>
                          </div>
                        ))}
                        <p style={{ fontSize: 13, color: BRAND.mid, margin: "4px 0 0" }}>
                          {FLU.prosody.source}
                        </p>
                      </div>
                    </Band>
                  </div>

                  <details
                    style={{
                      background: "#FFFFFF",
                      border: `1px solid ${BRAND.line}`,
                      borderRadius: 18,
                      padding: "16px 20px",
                      margin: "0 0 18px",
                    }}
                  >
                    <summary style={{ ...label, cursor: "pointer", listStyle: "none" }}>
                      What the median means, and what it does not
                    </summary>
                    <div style={{ ...reading, marginTop: 12 }}>
                      <p style={{ margin: "0 0 10px" }}>
                        {FLU.norms._note}
                      </p>
                      <p style={{ margin: "0 0 10px", fontSize: 13, color: BRAND.mid }}>
                        {FLU.norms.source}
                      </p>
                      <table style={{ borderCollapse: "collapse", fontSize: 15 }}>
                        <thead>
                          <tr>
                            {["Grade", "Fall", "Winter", "Spring"].map((h) => (
                              <th
                                key={h}
                                style={{
                                  ...label,
                                  textAlign: "left",
                                  padding: "6px 18px 6px 0",
                                  borderBottom: `1px solid ${BRAND.line}`,
                                }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {FLU.norms.grades.map((r) => (
                            <tr key={r.grade} style={{ fontWeight: r.grade === grade ? 800 : 400 }}>
                              <td style={{ padding: "6px 18px 6px 0" }}>{r.grade}</td>
                              <td style={{ padding: "6px 18px 6px 0" }}>{r.fall ?? "—"}</td>
                              <td style={{ padding: "6px 18px 6px 0" }}>{r.winter ?? "—"}</td>
                              <td style={{ padding: "6px 18px 6px 0" }}>{r.spring ?? "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>

                  <p style={{ fontSize: 13, color: BRAND.mid, maxWidth: "66ch", lineHeight: 1.6 }}>
                    This page does not save a read. Keeping a child&rsquo;s scores over time needs
                    somewhere to put them and a decision about who may see them, and neither of
                    those should get invented quietly — write the three numbers on your own record
                    sheet for now.
                  </p>
                </>
              ) : (
                <p style={{ color: BRAND.mid }}>No passage matches that filter.</p>
              )}
            </div>
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
