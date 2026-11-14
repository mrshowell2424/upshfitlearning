import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { EF_YEAR, blockForWeek } from "../ef-weeks";
import { EF_MEANING, type EFKey } from "../signals";

/**
 * The executive function year: the other half of the behavior page.
 *
 * The behavior page diagnoses and stops. A teacher who works out on Tuesday
 * that a child's working memory is the problem has nowhere to go with that,
 * and "work on working memory" is not something anybody can do on Wednesday
 * morning. This page is the Wednesday morning: eleven skills across a
 * thirty-six week year, five two-minute lessons each, one thing that stays on
 * the wall, and one line to send home.
 *
 * Two minutes is not a figure of speech. A lesson that needs ten will not
 * survive a week in a real classroom, and the skill is built by the routine
 * repeating rather than by any single lesson being good.
 *
 * The skill keys match the ones on the behavior page exactly, so a teacher who
 * clicks a skill tag there lands on the block that teaches it. Selection is in
 * the URL, which keeps this a server component with no client bundle and lets
 * a coach send a colleague the exact week they were looking at.
 */

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
  pinkDark: "#B3336E",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
};
const GRADIENT = `linear-gradient(135deg, ${BRAND.coral}, ${BRAND.pink}, ${BRAND.lavender}, ${BRAND.teal})`;

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const label: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: BRAND.mid,
};

/** Running text gets the serif; the interface around it stays in Inter. */
const reading: React.CSSProperties = {
  fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
  fontSize: 17,
  lineHeight: 1.6,
};

/** The four ramp darks, cycled, so neighbouring blocks never share a colour. */
const RAMP = [BRAND.tealDark, BRAND.lavenderDark, BRAND.coralDark, BRAND.pinkDark];
const inkFor = (i: number) => RAMP[i % RAMP.length];

/** First and last week of a block, read off the span it already carries. */
function span(weeks: string): [number, number] {
  const m = weeks.match(/(\d+)\D+(\d+)/);
  return m ? [Number(m[1]), Number(m[2])] : [0, 0];
}

const TOTAL_WEEKS = Math.max(...EF_YEAR.map((b) => span(b.weeks)[1]));

export const metadata = {
  title: "The executive function year",
  description:
    "Eleven executive function skills across a school year, two minutes a day. The behavior page names the skill under a hard morning; this is the week-by-week plan for building it.",
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  /**
   * A week beats a skill when both are given: a teacher who typed "we are in
   * week 12" has said something more specific than a skill name.
   */
  const askedWeek = Number(one(sp.w));
  const byWeek =
    Number.isFinite(askedWeek) && askedWeek >= 1 && askedWeek <= TOTAL_WEEKS
      ? blockForWeek(askedWeek)
      : null;
  const askedSkill = one(sp.s);
  const block = byWeek ?? EF_YEAR.find((b) => b.key === askedSkill) ?? EF_YEAR[0];
  const index = EF_YEAR.findIndex((b) => b.key === block.key);
  const ink = inkFor(index);
  const [from, to] = span(block.weeks);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
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
              Behavior strategies
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
              The executive function year
            </h1>
            <p style={{ ...reading, color: BRAND.mid, maxWidth: "62ch", margin: "0 0 6px" }}>
              Eleven skills across {TOTAL_WEEKS} weeks, two minutes a day. The behavior page tells
              you which skill is under a hard morning; this is what you do about it on Wednesday.
            </p>
            <p style={{ fontSize: 13, color: BRAND.mid, margin: "0 0 22px" }}>
              <Link href="/behavior" style={{ color: BRAND.tealDark, fontWeight: 700 }}>
                ← Start from what you can see
              </Link>
            </p>

            {/* ---------- the year, as a strip ---------- */}
            <p style={{ ...label, margin: "0 0 8px" }}>The year</p>
            <div style={{ display: "flex", gap: 3, margin: "0 0 10px" }}>
              {EF_YEAR.map((b) => {
                const [f, t] = span(b.weeks);
                const on = b.key === block.key;
                return (
                  <Link
                    key={b.key}
                    href={`/behavior/year?s=${b.key}`}
                    title={`${b.name} · ${b.weeks}`}
                    style={{
                      flexGrow: t - f + 1,
                      flexBasis: 0,
                      height: 34,
                      borderRadius: 7,
                      background: on ? ink : BRAND.white,
                      border: `1.5px solid ${on ? ink : BRAND.line}`,
                      color: on ? BRAND.white : BRAND.mid,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    {b.icon}
                  </Link>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 18px" }}>
              <span style={{ ...label, fontSize: 10 }}>Week 1</span>
              <span style={{ ...label, fontSize: 10 }}>Week {TOTAL_WEEKS}</span>
            </div>

            {/* ---------- jump to a week ---------- */}
            <form
              method="get"
              action="/behavior/year"
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
                margin: "0 0 22px",
              }}
            >
              <label style={{ ...label, margin: 0 }} htmlFor="w">
                We are in week
              </label>
              <input
                id="w"
                name="w"
                type="number"
                min={1}
                max={TOTAL_WEEKS}
                defaultValue={byWeek ? askedWeek : ""}
                placeholder={`1–${TOTAL_WEEKS}`}
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 14,
                  padding: "9px 12px",
                  borderRadius: 12,
                  border: `1.5px solid ${BRAND.line}`,
                  background: BRAND.white,
                  color: BRAND.ink,
                  width: 110,
                }}
              />
              <button
                type="submit"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 100,
                  padding: "9px 20px",
                  border: `1.5px solid ${BRAND.ink}`,
                  background: BRAND.ink,
                  color: BRAND.white,
                  cursor: "pointer",
                }}
              >
                Show me
              </button>
              <span style={{ fontSize: 13, color: BRAND.mid }}>
                or pick a skill from the strip.
              </span>
            </form>

            {/* ---------- the block ---------- */}
            <section
              style={{
                background: BRAND.white,
                border: `1.5px solid ${BRAND.line}`,
                borderLeft: `8px solid ${ink}`,
                borderRadius: 18,
                padding: "22px 26px 26px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "baseline",
                }}
              >
                <p style={{ ...label, margin: 0, color: ink }}>{block.weeks}</p>
                <p style={{ ...label, margin: 0 }}>
                  Skill {index + 1} of {EF_YEAR.length}
                </p>
              </div>
              <h2
                style={{
                  fontFamily: "Poppins, Inter, sans-serif",
                  fontSize: 30,
                  fontWeight: 800,
                  letterSpacing: "-0.6px",
                  margin: "4px 0 2px",
                  lineHeight: 1.15,
                }}
              >
                <span style={{ marginRight: 10 }}>{block.icon}</span>
                {block.name}
              </h2>
              <p style={{ ...reading, color: BRAND.mid, margin: "0 0 18px" }}>
                {EF_MEANING[block.key as EFKey]}
              </p>

              {/* What the class can say about itself. The I-can line is the
                  point of the block, so it is the biggest thing in it. */}
              <div
                style={{
                  background: BRAND.panel,
                  borderRadius: 14,
                  padding: "16px 20px",
                  margin: "0 0 20px",
                }}
              >
                <p style={{ ...label, margin: "0 0 5px", color: ink }}>By the end, the class says</p>
                <p
                  style={{
                    ...reading,
                    fontSize: 21,
                    fontWeight: 700,
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {block.ican}
                </p>
              </div>

              <p style={{ ...label, margin: "0 0 12px", color: ink }}>
                Five lessons, two minutes each
              </p>
              {block.days.map((d) => (
                <div
                  key={d.day}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    borderTop: `1px solid ${BRAND.line}`,
                    padding: "12px 0",
                  }}
                >
                  <span
                    style={{
                      flex: "0 0 auto",
                      width: 44,
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: ink,
                      paddingTop: 3,
                    }}
                  >
                    {d.day}
                  </span>
                  <p style={{ ...reading, margin: 0, flex: 1 }}>{d.text}</p>
                </div>
              ))}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 12,
                  marginTop: 22,
                }}
              >
                <div
                  style={{
                    background: BRAND.paper,
                    border: `1px solid ${BRAND.line}`,
                    borderRadius: 14,
                    padding: "14px 16px",
                  }}
                >
                  <p style={{ ...label, margin: "0 0 5px", color: ink }}>On the wall</p>
                  <p style={{ ...reading, fontSize: 16, margin: 0 }}>{block.tool}</p>
                </div>
                <div
                  style={{
                    background: BRAND.paper,
                    border: `1px solid ${BRAND.line}`,
                    borderRadius: 14,
                    padding: "14px 16px",
                  }}
                >
                  <p style={{ ...label, margin: "0 0 5px", color: ink }}>Send home</p>
                  <p style={{ ...reading, fontSize: 16, margin: 0 }}>{block.home}</p>
                </div>
              </div>
            </section>

            {/* ---------- move along the year ---------- */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 18,
              }}
            >
              {index > 0 ? (
                <Link
                  href={`/behavior/year?s=${EF_YEAR[index - 1].key}`}
                  style={{ fontSize: 14, fontWeight: 700, color: BRAND.tealDark }}
                >
                  ← {EF_YEAR[index - 1].name}
                </Link>
              ) : (
                <span />
              )}
              {index < EF_YEAR.length - 1 && (
                <Link
                  href={`/behavior/year?s=${EF_YEAR[index + 1].key}`}
                  style={{ fontSize: 14, fontWeight: 700, color: BRAND.tealDark }}
                >
                  {EF_YEAR[index + 1].name} →
                </Link>
              )}
            </div>

            <p style={{ fontSize: 12, color: BRAND.mid, margin: "26px 0 0", maxWidth: "70ch" }}>
              The eleven skills and their names are the Dawson and Guare executive-function
              vocabulary most schools already use, which is why a skill tag on the behavior page
              lands here. Every lesson, tool and line home is ours. Week {from}–{to} is a
              suggestion, not a scope and sequence: run a block for as long as the class needs it.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
