import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import MATH from "@/../scripts/math-prerequisites.json";
import PRACTICE from "@/../scripts/math-practice.json";
import { reviewSlots } from "@/../scripts/lib/review-slots.mjs";

/**
 * Spiral review, for maths.
 *
 * Reading has had this since the prerequisite map was written, and the
 * argument is the same one: spaced review is the best-evidenced thing in
 * the literature and the first thing to go in a real week, because
 * deciding *what* to review is the work and it has to be decided again
 * every evening. This decides it.
 *
 * Three slots, because three is what fits in the front of a lesson and
 * each answers a different question. What today is built on — if a child
 * cannot do that, today will not land however well it is taught. What was
 * taught most recently — the newest thing is the most fragile, and a day
 * later is exactly when it needs meeting again. What is going cold —
 * everything else decays quietly, and the spiral pool names the standards
 * the rest of the grade is built on.
 *
 * The slot logic is the reading page's, unchanged. It takes a sequence, a
 * prerequisite map and pools by level, and maths now has all three; there
 * was no reason to write a second copy that would drift from the first.
 *
 * Deterministic on purpose. The same standard gives the same three every
 * time, because a teacher who plans Monday on Sunday needs Monday to
 * still say the same thing on Monday.
 */

type Slot = { why: string; key: string | null; name: string | null; level: string | null };
type Seq = { key: string; name: string; level: string };

const SEQ = MATH.sequence as Seq[];
const BY_KEY = new Map(SEQ.map((r) => [r.key, r]));
const ITEMS = PRACTICE.items as Record<string, { c: { q: string; a: string }[]; w: { q: string; a: string }[] }>;

const BRAND = {
  ink: "#111111",
  mid: "#444444",
  line: "#E9E9E9",
  coralDark: "#C0432F",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
  amberDark: "#8A5400",
};
const GRADIENT = "linear-gradient(135deg, #FF6A5B, #FF7DAE, #B87DFF, #00B4A6)";
const SLOT_COLOUR = [BRAND.coralDark, BRAND.tealDark, BRAND.lavenderDark];

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const label: React.CSSProperties = {
  fontFamily: "Poppins, system-ui, sans-serif",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: BRAND.mid,
};
// The brand book, in globals.css: Poppins is the whole interface,
// headings and running text alike. The serif belongs to lines a child
// reads, and this is a teacher planning a lesson.
const SANS = "Poppins, system-ui, sans-serif";

function pill(on: boolean, color: string): React.CSSProperties {
  return {
    fontFamily: "Poppins, system-ui, sans-serif",
    fontSize: 12.5,
    fontWeight: 800,
    padding: "7px 13px",
    minHeight: 38,
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    textDecoration: "none",
    border: `1.5px solid ${on ? color : BRAND.line}`,
    background: on ? color : "#FFFFFF",
    color: on ? "#FFFFFF" : BRAND.ink,
    whiteSpace: "nowrap",
  };
}

/**
 * Two questions to put on the board for a slot.
 *
 * From the generated bank, whose answers have each been re-derived by
 * scripts/check-math-practice.mjs. A standard outside that set shows its
 * name and no questions rather than questions from somewhere else: this
 * page says what to review, and where there is nothing to hand out it is
 * better to say so than to fill the space.
 */
function askFor(key: string | null) {
  if (!key || !ITEMS[key]) return [];
  const bank = ITEMS[key];
  return [bank.c[0], bank.w[0]].filter(Boolean);
}

export const metadata = {
  title: "Maths spiral review",
  description:
    "What to review before today's maths lesson, decided rather than suggested: what today is built on, what was taught most recently, and what is going cold.",
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const asked = one(sp.s);
  const key = asked && BY_KEY.has(asked) ? asked : "3.OA.7";
  const here = BY_KEY.get(key)!;
  const at = SEQ.findIndex((r) => r.key === key);

  const picks = { s1: one(sp.s1), s2: one(sp.s2), s3: one(sp.s3) };
  const data = { seq: SEQ, prereq: MATH.prereq as Record<string, string>, spiral: MATH.spiral as Record<string, string[]> };
  const slots = reviewSlots(key, data, picks) as Slot[];
  const auto = reviewSlots(key, data) as Slot[];
  const overridden = slots.some((s, i) => s.key !== auto[i].key);

  const href = (next: { s?: string; s1?: string; s2?: string; s3?: string; clear?: boolean }) => {
    const q = new URLSearchParams();
    q.set("s", next.s ?? key);
    if (!next.clear && !next.s) {
      for (const k of ["s1", "s2", "s3"] as const) {
        const v = next[k] ?? picks[k];
        if (v) q.set(k, v);
      }
    }
    return `/math/review?${q.toString()}`;
  };

  // A slot can only reach backwards, so the override list is what has
  // already been taught.
  const earlier = SEQ.slice(0, at);
  const grades = MATH.grades as string[];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <SignInGate
          title="Maths spiral review"
          blurb="What to go over before today's maths lesson, decided rather than suggested. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />

          <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
            <p style={{ ...label, margin: "0 0 6px", color: BRAND.coralDark }}>
              Before today&rsquo;s lesson
            </p>
            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 40,
                fontWeight: 900,
                letterSpacing: "-1px",
                margin: "0 0 6px",
                lineHeight: 1.1,
              }}
            >
              Maths spiral review
            </h1>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 17,
                lineHeight: 1.65,
                color: BRAND.mid,
                maxWidth: "62ch",
                margin: "0 0 10px",
              }}
            >
              Spaced review is the best-evidenced thing in the literature and the first thing to go
              in a real week — not because anyone disagrees with it, but because deciding{" "}
              <i>what</i> to review is the work, and it has to be decided again every day. This
              decides it. Three standards, from the sequence you are already teaching.
            </p>
            <p style={{ fontSize: 13, color: BRAND.mid, margin: "0 0 22px" }}>
              <Link href="/math" style={{ color: BRAND.tealDark, fontWeight: 700, textDecoration: "none" }}>
                ← Math Hub
              </Link>
            </p>

            {/* Which standard is today. */}
            <details className="disclosure" style={{ margin: "0 0 20px" }}>
              <summary
                style={{ cursor: "pointer", listStyle: "none", ...label, fontSize: 12, color: BRAND.ink }}
              >
                Teaching today · {here.name} · change it
              </summary>
              <div style={{ paddingTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
                {grades.map((g) => {
                  const codes = SEQ.filter((r) => r.level === g);
                  if (!codes.length) return null;
                  return (
                    <div key={g}>
                      <p style={{ ...label, margin: "0 0 6px" }}>{g}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {codes.map((r) => (
                          <Link
                            key={r.key}
                            href={href({ s: r.key })}
                            style={{ ...pill(r.key === key, BRAND.coralDark), fontSize: 11.5, padding: "5px 10px", minHeight: 32 }}
                            title={r.name}
                          >
                            {r.key}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>

            <div
              style={{
                border: `1px solid ${BRAND.line}`,
                borderTop: `3px solid ${BRAND.ink}`,
                borderRadius: "3px 3px 16px 16px",
                padding: "18px 22px",
                margin: "0 0 20px",
              }}
            >
              <p style={{ ...label, margin: "0 0 4px" }}>
                Today · {here.level} · standard {at + 1} of {SEQ.length}
              </p>
              <h2 style={{ fontFamily: SANS, fontSize: 23, fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 2px", lineHeight: 1.2 }}>
                {here.name}
              </h2>
              <p style={{ fontSize: 13, color: BRAND.mid, margin: 0 }}>
                Review these three first. Five minutes, on the board.
              </p>
            </div>

            {slots.map((s, i) => {
              const colour = SLOT_COLOUR[i];
              const ask = askFor(s.key);
              const isOverride = s.key !== auto[i].key;
              return (
                <div
                  key={i}
                  style={{
                    border: `1px solid ${BRAND.line}`,
                    borderLeft: `3px solid ${colour}`,
                    borderRadius: "3px 14px 14px 3px",
                    padding: "16px 20px",
                    margin: "0 0 12px",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ ...label, color: colour }}>
                      {i + 1} · {s.why}
                    </span>
                    {isOverride && (
                      <span style={{ ...label, color: BRAND.amberDark, fontSize: 10 }}>your pick</span>
                    )}
                    {s.level && s.level !== here.level && (
                      <span style={{ ...label, color: BRAND.mid, fontSize: 10 }}>{s.level}</span>
                    )}
                  </div>

                  {s.key ? (
                    <>
                      <h3 style={{ fontFamily: SANS, fontSize: 19, fontWeight: 800, letterSpacing: "-0.3px", margin: "4px 0 8px", lineHeight: 1.25 }}>
                        {s.name}
                      </h3>

                      {ask.length > 0 ? (
                        <ul style={{ margin: "0 0 10px", padding: 0, listStyle: "none", display: "grid", gap: 7 }}>
                          {ask.map((x) => (
                            <li
                              key={x.q}
                              style={{
                                border: `1px solid ${BRAND.line}`,
                                borderRadius: 10,
                                padding: "9px 12px",
                                fontSize: 15.5,
                                lineHeight: 1.5,
                              }}
                            >
                              {x.q}
                              <span style={{ color: BRAND.mid, fontSize: 13.5 }}> — {x.a}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: 14, color: BRAND.mid, margin: "0 0 10px", maxWidth: "58ch" }}>
                          No generated practice for this one — it is geometry, statistics or
                          trigonometry, where an item that looks right and is not would be worse
                          than none. Open it in the hub for its own questions.
                        </p>
                      )}

                      <Link href={`/math?s=${encodeURIComponent(s.key)}`} style={pill(false, colour)}>
                        Open in the hub →
                      </Link>
                    </>
                  ) : (
                    <p style={{ fontSize: 14.5, color: BRAND.mid, margin: "6px 0 0", maxWidth: "58ch" }}>
                      Nothing to put here yet — this is near the start of the sequence, and there is
                      not enough behind it to review. That is the honest answer rather than a
                      filler.
                    </p>
                  )}

                  {earlier.length > 0 && (
                    <details className="disclosure" style={{ margin: "10px 0 0" }}>
                      <summary
                        style={{ cursor: "pointer", listStyle: "none", ...label, fontSize: 10, color: BRAND.mid }}
                      >
                        Use something else
                      </summary>
                      <div style={{ paddingTop: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {earlier.slice(-60).map((r) => (
                          <Link
                            key={r.key}
                            href={href({ [`s${i + 1}`]: r.key } as { s1?: string })}
                            style={{ ...pill(r.key === s.key, colour), fontSize: 11, padding: "4px 9px", minHeight: 30 }}
                            title={r.name}
                          >
                            {r.key}
                          </Link>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              );
            })}

            {overridden && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 0" }}>
                <Link href={href({ clear: true })} style={pill(false, BRAND.ink)}>
                  Back to the automatic three
                </Link>
              </div>
            )}

            <p style={{ ...label, margin: "32px 0 10px" }}>How the three are chosen</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: "0 0 10px", maxWidth: "64ch" }}>
              Each slot answers a different question, which is why three and not one.{" "}
              <b>What today is built on</b> comes from the prerequisite map — 3.NF.1 stands on
              2.G.3, because fractions begin by partitioning shapes. <b>What was taught most
              recently</b> is the newest thing and therefore the most fragile. <b>What is going
              cold</b> is drawn from the standards of that grade the most later ones depend on,
              counted rather than chosen.
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: "0 0 10px", maxWidth: "64ch" }}>
              Nothing here reaches forwards. Every slot is a standard taught before this one, no
              standard fills two slots, and the questions come from the generated bank, where every
              answer has been worked out a second time by a checker before it reached this page.
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: BRAND.mid, margin: 0, maxWidth: "64ch" }}>
              The same standard gives the same three every time. A review that shuffled would be
              worse than no review: planning Monday on Sunday only works if Monday still says the
              same thing.
            </p>
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
