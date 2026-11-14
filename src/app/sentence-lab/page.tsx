import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import LAB from "@/../scripts/reading-sentence-lab.json";

/**
 * Sentence Lab: the language-structure strand, run on our own sentences.
 *
 * Syntax work is usually done on worksheet sentences about nothing, which is
 * why it does not transfer. These sentences come out of an article the class
 * has read, and the answer key is not a judgement call -- it is the same
 * paragraph as written for the higher Lexile. A teacher can check any key
 * against the article it came from.
 *
 * Grade is a row of links rather than a second select. Two coupled selects in
 * one form leave the second list stale until submit, which is the bug that
 * made the word lists look identical across grades, and it was on four
 * pickers before it was found. One picker, one trip.
 */

const ITEMS = LAB.items;
const ROUTINE = LAB.routine;
const GRADES = [...new Set(ITEMS.map((i) => i.grade))].sort((a, b) => a - b);

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
  white: "#FFFFFF",
  coralDark: "#C0432F",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
  blueDark: "#2F6FD0",
};
const GRADIENT = `linear-gradient(135deg, ${BRAND.coral}, ${BRAND.pink}, ${BRAND.lavender}, ${BRAND.teal})`;

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const gradeName = (g: number) =>
  g === 0 ? "K" : g === 1 ? "1st" : g === 2 ? "2nd" : g === 3 ? "3rd" : `${g}th`;

const label: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: BRAND.mid,
};

/** The lines a child reads get the serif. Chrome stays in Inter. */
const reading: React.CSSProperties = {
  fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
  fontSize: 18,
  lineHeight: 1.6,
};

const ACCENT: Record<string, string> = {
  combine: BRAND.tealDark,
  expand: BRAND.lavenderDark,
  bso: BRAND.blueDark,
};

/** A numbered line, drawn by hand: Tailwind preflight kills list markers. */
function Numbered({ n, children }: { n: number | string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, margin: "0 0 10px", alignItems: "flex-start" }}>
      <span
        style={{
          flex: "0 0 auto",
          minWidth: 24,
          height: 24,
          padding: "0 6px",
          borderRadius: 999,
          background: BRAND.ink,
          color: BRAND.white,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 12,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <details style={{ margin: "10px 0 0" }}>
      <summary
        style={{
          listStyle: "none",
          display: "inline-block",
          cursor: "pointer",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: BRAND.mid,
          border: `1.5px solid ${BRAND.mid}`,
          borderRadius: 999,
          padding: "5px 14px",
        }}
      >
        How the article wrote it
      </summary>
      <div
        style={{
          background: BRAND.panel,
          borderRadius: 12,
          padding: "12px 16px",
          margin: "10px 0 0",
        }}
      >
        {children}
      </div>
    </details>
  );
}

export const metadata = {
  title: "Sentence Lab",
  description:
    "Nine minutes on how a sentence is built, using sentences from an article your class has read. Every article exists at two levels, so the answer key is not an opinion - it is the article.",
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const askedGrade = Number(one(sp.g));
  const grade = GRADES.includes(askedGrade) ? askedGrade : 3;
  const pool = ITEMS.filter((i) => i.grade === grade && (i.combine.length || i.expand.length));
  const idx = Math.min(Math.max(Number(one(sp.n) ?? 0) || 0, 0), Math.max(pool.length - 1, 0));
  const item = pool[idx];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="Sentence Lab"
          blurb="Sentence combining and expanding, run on sentences from articles your class has already read — with the answer key taken from the article's own harder version. Free — an account is all it takes."
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
              <p style={{ ...label, margin: "0 0 6px", color: BRAND.lavenderDark }}>
                Language structure
              </p>
              <h1
                style={{
                  fontFamily: "Poppins, Inter, sans-serif",
                  fontSize: 40,
                  fontWeight: 900,
                  letterSpacing: "-1px",
                  margin: "0 0 6px",
                  lineHeight: 1.1,
                }}
              >
                Sentence Lab
              </h1>
              <p style={{ ...reading, color: BRAND.mid, maxWidth: "62ch", margin: "0 0 10px" }}>
                Nine minutes on how a sentence is built, using sentences from an article your
                class has read. Every article was written at two levels, and the harder version
                is the same content combined and expanded — so the answer key is not an opinion,
                it is the article.
              </p>

              {/* ---------- the routine ---------- */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                  gap: 10,
                  margin: "18px 0 26px",
                }}
              >
                {ROUTINE.map((r) => (
                  <div
                    key={r.key}
                    style={{
                      background: BRAND.white,
                      border: `1.5px solid ${BRAND.line}`,
                      borderLeft: `7px solid ${ACCENT[r.key]}`,
                      borderRadius: 14,
                      padding: "13px 16px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 800 }}>{r.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: ACCENT[r.key] }}>
                        {r.minutes} min
                      </span>
                    </div>
                    <p style={{ ...reading, fontSize: 15, margin: "5px 0 0", color: BRAND.mid }}>
                      {r.what}
                    </p>
                  </div>
                ))}
              </div>

              {/* ---------- pickers ---------- */}
              <p style={{ ...label, margin: "0 0 8px" }}>Grade</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 16px" }}>
                {GRADES.map((g) => (
                  <Link
                    key={g}
                    href={`/sentence-lab?g=${g}&n=0`}
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      borderRadius: 999,
                      padding: "8px 18px",
                      border: `1.5px solid ${BRAND.ink}`,
                      background: g === grade ? BRAND.ink : BRAND.white,
                      color: g === grade ? BRAND.white : BRAND.ink,
                      textDecoration: "none",
                    }}
                  >
                    {gradeName(g)}
                  </Link>
                ))}
              </div>

              <form
                method="get"
                action="/sentence-lab"
                style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", margin: "0 0 22px" }}
              >
                <input type="hidden" name="g" value={grade} />
                <label style={{ ...label, margin: 0 }} htmlFor="n">
                  Article
                </label>
                <select
                  id="n"
                  name="n"
                  defaultValue={String(idx)}
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 14,
                    padding: "9px 12px",
                    borderRadius: 12,
                    border: `1.5px solid ${BRAND.line}`,
                    background: BRAND.white,
                    color: BRAND.ink,
                    maxWidth: "100%",
                  }}
                >
                  {pool.map((it, i) => (
                    <option key={it.id} value={i}>
                      {i + 1}. {it.title}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    borderRadius: 999,
                    padding: "9px 20px",
                    border: `1.5px solid ${BRAND.ink}`,
                    background: BRAND.ink,
                    color: BRAND.white,
                    cursor: "pointer",
                  }}
                >
                  Show
                </button>
              </form>

              {!item ? (
                <p style={reading}>No article in this grade yields a sentence pair yet.</p>
              ) : (
                <>
                  <div
                    style={{
                      background: BRAND.white,
                      border: `1.5px solid ${BRAND.line}`,
                      borderRadius: 18,
                      padding: "20px 24px 24px",
                    }}
                  >
                    <p style={{ ...label, margin: "0 0 3px", color: BRAND.coralDark }}>
                      {item.standard} · {gradeName(item.grade)}
                    </p>
                    <h2
                      style={{
                        fontFamily: "Poppins, Inter, sans-serif",
                        fontSize: 28,
                        fontWeight: 800,
                        letterSpacing: "-0.5px",
                        margin: "0 0 4px",
                        lineHeight: 1.15,
                      }}
                    >
                      {item.title}
                    </h2>
                    <Link
                      href={`/science-of-reading/resources?tab=ar&g=${item.grade}&s=*&n=${item.n - 1}`}
                      style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: BRAND.tealDark,
                      }}
                    >
                      Read the article first →
                    </Link>

                    {/* ---------- combine ---------- */}
                    {item.combine.length > 0 && (
                      <section style={{ marginTop: 24, borderTop: `1px solid ${BRAND.line}`, paddingTop: 18 }}>
                        <p style={{ ...label, margin: "0 0 4px", color: ACCENT.combine }}>
                          1 · Combine
                        </p>
                        <p style={{ ...reading, fontSize: 15, color: BRAND.mid, margin: "0 0 14px" }}>
                          Put these together into fewer sentences without losing anything.
                        </p>
                        {item.combine.map((c, ci) => (
                          <div key={ci} style={{ margin: "0 0 18px" }}>
                            {c.from.map((s, si) => (
                              <Numbered key={si} n={si + 1}>
                                <p style={{ ...reading, margin: 0 }}>{s}</p>
                              </Numbered>
                            ))}
                            <Key>
                              {c.to.map((s, si) => (
                                <p key={si} style={{ ...reading, fontSize: 17, margin: si ? "8px 0 0" : 0 }}>
                                  {s}
                                </p>
                              ))}
                            </Key>
                          </div>
                        ))}
                      </section>
                    )}

                    {/* ---------- expand ---------- */}
                    {item.expand.length > 0 && (
                      <section style={{ marginTop: 20, borderTop: `1px solid ${BRAND.line}`, paddingTop: 18 }}>
                        <p style={{ ...label, margin: "0 0 4px", color: ACCENT.expand }}>
                          {item.combine.length > 0 ? "2" : "1"} · Expand
                        </p>
                        <p style={{ ...reading, fontSize: 15, color: BRAND.mid, margin: "0 0 14px" }}>
                          Each of these is already true. Add when, where, how or why — and do not
                          add a second sentence.
                        </p>
                        {item.expand.map((e, ei) => (
                          <div key={ei} style={{ margin: "0 0 18px" }}>
                            <Numbered n={ei + 1}>
                              <p style={{ ...reading, margin: 0 }}>{e.kernel}</p>
                            </Numbered>
                            <Key>
                              <p style={{ ...reading, fontSize: 17, margin: 0 }}>{e.expanded}</p>
                            </Key>
                          </div>
                        ))}
                      </section>
                    )}

                    {/* ---------- because / but / so ---------- */}
                    {item.stem && (
                      <section style={{ marginTop: 20, borderTop: `1px solid ${BRAND.line}`, paddingTop: 18 }}>
                        <p style={{ ...label, margin: "0 0 4px", color: ACCENT.bso }}>
                          {(item.combine.length > 0 ? 1 : 0) + (item.expand.length > 0 ? 1 : 0) + 1} ·
                          Because · but · so
                        </p>
                        <p style={{ ...reading, fontSize: 15, color: BRAND.mid, margin: "0 0 14px" }}>
                          One stem, finished three ways. Two minutes, and it shows whether they
                          understood the article.
                        </p>
                        {["because", "but", "so"].map((conj) => (
                          <p
                            key={conj}
                            style={{
                              ...reading,
                              margin: "0 0 12px",
                              paddingBottom: 10,
                              borderBottom: `1px solid ${BRAND.line}`,
                            }}
                          >
                            {item.stem!.replace(/[.!?]$/, "")}{" "}
                            <b style={{ color: ACCENT.bso }}>{conj}</b>{" "}
                            <span style={{ color: BRAND.line }}>
                              ______________________________
                            </span>
                          </p>
                        ))}
                      </section>
                    )}
                  </div>

                  <p style={{ fontSize: 12, color: BRAND.mid, margin: "20px 0 0", maxWidth: "72ch" }}>
                    {LAB.source}
                  </p>
                </>
              )}
            </div>
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
