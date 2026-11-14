import Link from "next/link";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import ARTICLES from "@/../scripts/reading-articles.json";
import THREADS from "@/../scripts/reading-threads.json";

/**
 * Knowledge threads: the background-knowledge strand, built out of articles
 * that were already here.
 *
 * The 350 articles are filed by grade and standard, which is how a teacher
 * finds a skill and exactly not how background knowledge works. Knowledge is
 * cumulative and domain-shaped -- five articles about water over three weeks
 * build more than five unrelated ones -- so the useful question is not "what
 * does RI.4.5 look like" but "what has this child already met about water, and
 * what is coming".
 *
 * Two things this page does that the resources page cannot. It shows a topic
 * running K through 6, so a third grade teacher opening "How a Seed Crosses an
 * Ocean" can see the seed articles behind it in K and 2nd and use them as the
 * five minutes before reading. And it shows, per thread, which grades have
 * nothing -- the empty grade markers are the point, not a rendering accident.
 *
 * No content is stored here. The assignment comes from reading-threads.json
 * and everything else is read from the article store at render time, so a
 * thread cannot claim an article that no longer exists.
 */

const AR = ARTICLES.articles;
const GRADES = [0, 1, 2, 3, 4, 5, 6];

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

/** Running text gets the serif; the chrome around it stays in Inter. */
const reading: React.CSSProperties = {
  fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
  fontSize: 17,
  lineHeight: 1.65,
};

interface Thread {
  key: string;
  name: string;
  what: string;
  builds: string;
}

const THREAD_LIST = THREADS.threads as Thread[];
const ASSIGN = THREADS.assign as Record<string, string>;

/**
 * Where a thread's articles sit, grade by grade.
 *
 * The index is recomputed with the same filter the resources page uses for
 * "all standards" rather than read off the article's own `n`, so a link lands
 * on the article it names even if the store is ever reordered.
 */
function articlesIn(key: string) {
  const mine = AR.filter((a) => ASSIGN[a.id] === key);
  return GRADES.map((g) => ({
    grade: g,
    items: mine
      .filter((a) => a.grade === g)
      .map((a) => ({
        id: a.id,
        title: a.title,
        standard: a.standard,
        href: `/science-of-reading/resources?tab=ar&g=${a.grade}&s=*&n=${AR.filter(
          (x) => x.grade === a.grade,
        ).findIndex((x) => x.id === a.id)}`,
      })),
  }));
}

export const metadata = {
  title: "Knowledge Threads",
  description:
    "A text about a glacier is harder if you have never heard of one. The same articles you already have, grouped by what they are about rather than which standard they teach, so you can see a topic run from kindergarten to sixth grade.",
  openGraph: ogCard("/og/science-of-reading.png"),
  twitter: twitterCard("/og/science-of-reading.png"),
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const asked = one(sp.t);
  const picked = THREAD_LIST.find((t) => t.key === asked) ?? null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="Knowledge Threads"
          blurb="The same 350 articles, grouped by what they are about instead of which standard they teach — so you can see what a child has already met on a topic, and what is coming. Free — an account is all it takes."
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
              <p style={{ ...label, margin: "0 0 6px", color: BRAND.coralDark }}>
                Background knowledge
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
                Knowledge Threads
              </h1>
              <p style={{ ...reading, color: BRAND.mid, maxWidth: "62ch", margin: "0 0 24px" }}>
                A text about a glacier is harder if you have never heard of one. These are the
                same {AR.length} articles you already have, grouped by what they are about rather
                than which standard they teach, so you can see the topic running from
                kindergarten to sixth grade — and spend five minutes on what came before it.
              </p>

              {/* ---------- the board ---------- */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 10,
                  margin: "0 0 28px",
                }}
              >
                {THREAD_LIST.map((t) => {
                  const rows = articlesIn(t.key);
                  const n = rows.reduce((s, r) => s + r.items.length, 0);
                  const on = picked?.key === t.key;
                  return (
                    <Link
                      key={t.key}
                      href={on ? "/science-of-reading/threads" : `/science-of-reading/threads?t=${t.key}`}
                      style={{
                        display: "block",
                        background: on ? BRAND.ink : BRAND.white,
                        color: on ? BRAND.white : BRAND.ink,
                        border: `1.5px solid ${on ? BRAND.ink : BRAND.line}`,
                        borderRadius: 14,
                        padding: "13px 15px",
                        textDecoration: "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 8,
                          alignItems: "baseline",
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.25 }}>
                          {t.name}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: on ? BRAND.white : BRAND.coralDark,
                          }}
                        >
                          {n}
                        </span>
                      </div>
                      {/* Which grades this thread reaches. An empty marker is
                          the whole reason the board exists: a teacher can see
                          at a glance that a topic stops before their grade. */}
                      <div style={{ display: "flex", gap: 3, marginTop: 9 }}>
                        {rows.map((r) => (
                          <span
                            key={r.grade}
                            title={`${gradeName(r.grade)}: ${r.items.length}`}
                            style={{
                              flex: 1,
                              height: 5,
                              borderRadius: 3,
                              background: r.items.length
                                ? on
                                  ? BRAND.white
                                  : BRAND.tealDark
                                : on
                                  ? "#555555"
                                  : BRAND.line,
                            }}
                          />
                        ))}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* ---------- one thread, opened ---------- */}
              {!picked ? (
                <p style={{ ...reading, color: BRAND.mid, maxWidth: "62ch" }}>
                  Pick a thread to see it laid out K through 6. The bars under each name are the
                  grades — a pale bar is a grade with nothing in that topic yet.
                </p>
              ) : (
                (() => {
                  const rows = articlesIn(picked.key);
                  const total = rows.reduce((s, r) => s + r.items.length, 0);
                  const empty = rows.filter((r) => !r.items.length).map((r) => gradeName(r.grade));
                  return (
                    <section>
                      <div
                        style={{
                          background: BRAND.white,
                          border: `1.5px solid ${BRAND.line}`,
                          borderLeft: `8px solid ${BRAND.tealDark}`,
                          borderRadius: 18,
                          padding: "20px 24px",
                          margin: "0 0 20px",
                        }}
                      >
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
                          {picked.name}
                        </h2>
                        <p style={{ ...reading, margin: "0 0 10px" }}>{picked.what}</p>
                        <p style={{ ...reading, color: BRAND.mid, margin: 0, fontSize: 16 }}>
                          {picked.builds}
                        </p>
                        {empty.length > 0 && (
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: BRAND.coralDark,
                              margin: "12px 0 0",
                            }}
                          >
                            Nothing yet for {empty.join(", ")}.
                          </p>
                        )}
                      </div>

                      {/* The five minutes before the reading. Generic on
                          purpose: the questions work on any article in any
                          thread, and a routine a teacher can run from memory
                          beats a script they have to find. */}
                      <div
                        style={{
                          background: BRAND.panel,
                          borderRadius: 16,
                          padding: "18px 22px",
                          margin: "0 0 24px",
                        }}
                      >
                        <p style={{ ...label, margin: "0 0 10px", color: BRAND.lavenderDark }}>
                          Before you read · five minutes
                        </p>
                        {[
                          ["Ask what they already know.", `"What do you know about ${picked.name.toLowerCase()}?" Take everything, write it where they can see it, correct nothing yet.`],
                          ["Name the thread.", "Say which article from earlier in the year this one sits next to. If it was a different grade, read two sentences of it aloud."],
                          ["Pre-teach the two words.", "The article's vocabulary question already holds them. Say each one, use it in a sentence about the topic, move on."],
                          ["Plant one fact.", "Give them the single fact the text assumes they have. One sentence, not a lecture."],
                          ["Ask what they expect.", "“What do you think this one will tell us?” Then read, and check."],
                        ].map(([head, body], i) => (
                          <div key={i} style={{ display: "flex", gap: 12, margin: "0 0 9px" }}>
                            <span
                              style={{
                                flex: "0 0 auto",
                                width: 22,
                                height: 22,
                                borderRadius: 999,
                                background: BRAND.ink,
                                color: BRAND.white,
                                fontSize: 12,
                                fontWeight: 800,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {i + 1}
                            </span>
                            <p style={{ ...reading, fontSize: 16, margin: 0 }}>
                              <b>{head}</b> {body}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* The span this thread actually covers, not the span
                          the site covers. "Kindergarten to sixth" was
                          hard-coded, so a thread that starts in third said so
                          directly above three rows reading "Nothing in this
                          thread yet" -- on the page whose whole argument is
                          that an empty grade is worth naming. */}
                      <p style={{ ...label, margin: "0 0 12px", color: BRAND.tealDark }}>
                        {(() => {
                          const filled = rows.filter((r) => r.items.length);
                          if (!filled.length) return `${total} articles`;
                          const lo = gradeName(filled[0].grade);
                          const hi = gradeName(filled[filled.length - 1].grade);
                          const span = lo === hi ? lo : `${lo} to ${hi}`;
                          return `${total} article${total === 1 ? "" : "s"}, ${span}`;
                        })()}
                      </p>

                      {rows.map((r) => (
                        <div
                          key={r.grade}
                          style={{
                            borderTop: `1px solid ${BRAND.line}`,
                            padding: "16px 0 4px",
                          }}
                        >
                          <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                            <Link
                              href={`/science-of-reading/resources?tab=ar&g=${r.grade}&s=*&n=0`}
                              style={{
                                flex: "0 0 auto",
                                width: 52,
                                fontSize: 19,
                                fontWeight: 900,
                                fontFamily: "Poppins, Inter, sans-serif",
                                color: r.items.length ? BRAND.ink : BRAND.line,
                                textDecoration: "none",
                              }}
                            >
                              {gradeName(r.grade)}
                            </Link>
                            <div style={{ flex: 1 }}>
                              {r.items.length === 0 ? (
                                <p
                                  style={{
                                    ...reading,
                                    fontSize: 16,
                                    color: BRAND.mid,
                                    margin: 0,
                                    fontStyle: "italic",
                                  }}
                                >
                                  Nothing in this thread yet.
                                </p>
                              ) : (
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                                    gap: "6px 16px",
                                  }}
                                >
                                  {r.items.map((a) => (
                                    <Link
                                      key={a.id}
                                      href={a.href}
                                      style={{
                                        ...reading,
                                        fontSize: 16,
                                        color: BRAND.ink,
                                        textDecoration: "none",
                                        borderBottom: `1px solid ${BRAND.line}`,
                                        padding: "4px 0",
                                      }}
                                    >
                                      {a.title}
                                      <span
                                        style={{
                                          fontFamily: "Inter, system-ui, sans-serif",
                                          fontSize: 11,
                                          fontWeight: 700,
                                          color: BRAND.mid,
                                          marginLeft: 7,
                                        }}
                                      >
                                        {a.standard}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </section>
                  );
                })()
              )}

              <p style={{ fontSize: 12, color: BRAND.mid, margin: "26px 0 0", maxWidth: "70ch" }}>
                {THREADS.source}
              </p>
            </div>
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
