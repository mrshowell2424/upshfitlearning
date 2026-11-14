import Image from "next/image";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SIGNALS, EF, EF_MEANING, strategyIndex, type EFKey, type Signal } from "./signals";
import { EF_YEAR } from "./ef-weeks";

/**
 * Behavior Strategies — start from what you can see.
 *
 * The teacher picks the signals in front of them and the page answers in the
 * order a person actually asks: is this the thing I am seeing, what is going
 * on in there, what do I do in the next few minutes, what makes next month
 * easier. Several signals can be selected at once, because a hard morning is
 * rarely one behavior, and the overlap is the useful part — when three
 * signals load the same executive function skill, that skill is the work.
 *
 * Selection is in the URL, so a coach can send a colleague the exact view they
 * were looking at, and so the page stays a server component with no client
 * bundle at all.
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
  /** The dark end of each ramp: the brand hues fail contrast for text. */
  coralDark: "#C0432F",
  pinkDark: "#B3336E",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
};
const GRADIENT =
  `linear-gradient(135deg, ${BRAND.coral}, ${BRAND.pink}, ${BRAND.lavender}, ${BRAND.teal})`;

type Search = Promise<Record<string, string | string[] | undefined>>;
const all = (v: string | string[] | undefined): string[] =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

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

/**
 * The line length everything readable on this page is held to.
 *
 * The card is nearly nine hundred pixels wide and the body text was running
 * the whole of it -- around 110 characters a line, where the eye starts
 * losing its place on the way back to the left margin. Every list and every
 * paragraph of prose is capped here instead. The panels keep their full
 * width, so the page does not turn into one narrow column.
 */
const MEASURE = 660;

/**
 * Disclosure headings. Pair it with className="disclosure" on the <details>,
 * which draws the chevron -- see globals.css. The default triangle is a
 * different shape, size and colour in every browser.
 */
const summaryStyle: React.CSSProperties = {
  cursor: "pointer",
  listStyle: "none",
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: BRAND.ink,
};

const tag = (color: string): React.CSSProperties => ({
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.04em",
  borderRadius: 100,
  padding: "4px 10px",
  background: "#FFFFFF",
  color,
  border: `1.5px solid ${color}`,
  display: "inline-block",
});

function Card({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: `1px solid ${BRAND.line}`,
        borderTop: accent ? `4px solid ${accent}` : `1px solid ${BRAND.line}`,
        borderRadius: 18,
        padding: "22px 24px",
        margin: "0 0 18px",
      }}
    >
      {children}
    </div>
  );
}

/**
 * The way to the year plan.
 *
 * Every skill tag on this page already links into /behavior/year, but a tag
 * only exists once a signal has been picked -- so a teacher who opened this
 * page and read it without clicking anything had no route to the term plan
 * at all. This is that route, and it sits at the bottom because that is
 * where the question arrives: the signal cards answer the next few minutes
 * and then the next few weeks, and the obvious next question is what to do
 * with the other thirty-four.
 */
function YearCard() {
  const weeks = Math.max(
    ...EF_YEAR.map((b) => Number(b.weeks.match(/(\d+)\D+(\d+)/)?.[2] ?? 0)),
  );
  return (
    <a
      href="/behavior/year"
      style={{
        display: "block",
        background: "#FFFFFF",
        border: `1px solid ${BRAND.line}`,
        borderLeft: `8px solid ${BRAND.tealDark}`,
        borderRadius: 18,
        padding: "22px 24px",
        margin: "0 0 18px",
        textDecoration: "none",
        color: BRAND.ink,
      }}
    >
      {/* The same 20:7 band the reading hub crops, for the same reason: a
          teacher deciding whether to click should see the thing rather than
          infer it from a sentence. */}
      <div
        style={{
          position: "relative",
          aspectRatio: "20 / 7",
          overflow: "hidden",
          borderRadius: 10,
          border: `1px solid ${BRAND.line}`,
          marginBottom: 16,
        }}
      >
        <Image
          src="/previews/ef-year.png"
          alt="The executive function year: a strip of eleven skills across the school year, a week box, and the five two-minute lessons for task initiation."
          width={1200}
          height={1130}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
            objectPosition: "center 0%",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "36%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0), #FFFFFF)",
          }}
        />
      </div>
      <p style={{ ...label, margin: "0 0 4px", color: BRAND.tealDark }}>Over the term</p>
      <h2
        style={{
          fontFamily: "Poppins, Inter, sans-serif",
          fontSize: 22,
          fontWeight: 800,
          margin: "0 0 8px",
          letterSpacing: "-0.4px",
        }}
      >
        The executive function year
      </h2>
      <p style={{ margin: 0, fontSize: 15, color: BRAND.mid, lineHeight: 1.6 }}>
        {`All ${EF_YEAR.length} skills named on this page, taught across ${weeks} weeks at two minutes a day — five lessons a week, an I-can statement the class ends up saying, and something to send home.`}
      </p>
    </a>
  );
}

/**
 * One of the questions, with its list.
 *
 * The markers are drawn here rather than left to the browser. Tailwind's
 * preflight sets list-style: none on every ul and ol in the project, so the
 * <li>s on this page had been rendering as indented paragraphs since the day
 * it was written -- five sections of six sentences each, with nothing to
 * tell the eye where one ended and the next began. A dot in the section's
 * own colour does that, and ties the item to the heading above it.
 *
 * The heading gets a short bar of the same colour. Five headings that differ
 * only in hue are hard to tell apart while scrolling; a bar above each one
 * gives the section a top edge.
 */
function Block({
  heading,
  note,
  items,
  color,
}: {
  heading: string;
  note?: string;
  items: string[];
  color: string;
}) {
  return (
    <section style={{ margin: "0 0 26px" }}>
      <div style={{ width: 26, height: 3, borderRadius: 2, background: color, margin: "0 0 9px" }} />
      <h3
        style={{
          fontFamily: "Poppins, Inter, sans-serif",
          fontSize: 16,
          fontWeight: 800,
          margin: "0 0 2px",
          color,
          letterSpacing: "-0.2px",
        }}
      >
        {heading}
      </h3>
      {note && (
        <p style={{ margin: "0 0 10px", fontSize: 13, color: BRAND.mid, fontStyle: "italic" }}>
          {note}
        </p>
      )}
      <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", maxWidth: MEASURE }}>
        {items.map((t) => (
          <li
            key={t}
            style={{
              display: "grid",
              gridTemplateColumns: "14px 1fr",
              gap: 10,
              margin: "0 0 9px",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: color,
                // Centred on the first line of text rather than its top.
                marginTop: 9,
              }}
            />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The words, set as words.
 *
 * Every other section on this page is a list of moves. This one is a list of
 * sentences, and a teacher reading it has about ten seconds before the
 * moment passes -- so each line is set in the reading face at a size you can
 * take in whole, with nothing in front of it to scan past. No bullets, no
 * numbers.
 *
 * The two halves belong in one panel. A page that only lists better
 * sentences does not displace the ones already in a teacher's mouth: in a
 * hard moment you reach for whatever is nearest, and the nearest words are
 * the well-meant ones on the right. Putting them side by side is what makes
 * it a swap rather than a wish.
 *
 * What to say is written to be said to the student rather than about them,
 * and every line leaves the work standing: none of them excuse the task, and
 * none of them are calm down, you're fine, or I know you can do it.
 */
function Words({ say, avoid }: { say: string[]; avoid: { words: string; why: string }[] }) {
  return (
    <section
      style={{
        margin: "0 0 26px",
        border: `1px solid ${BRAND.line}`,
        borderRadius: 14,
        overflow: "hidden",
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          display: "grid",
          // One column until there is room for two. Side by side is the whole
          // point of the panel, but not at the cost of a 30-character line.
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
        }}
      >
        <div style={{ padding: "18px 20px", borderTop: `3px solid ${BRAND.tealDark}` }}>
          <p style={{ ...label, margin: "0 0 2px", color: BRAND.tealDark }}>Say this</p>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: BRAND.mid, fontStyle: "italic" }}>
            Short enough to say across a room.
          </p>
          {say.map((t, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
                fontSize: 18,
                lineHeight: 1.45,
                margin: i ? "13px 0 0" : 0,
              }}
            >
              {t}
            </p>
          ))}
        </div>

        <div
          style={{
            padding: "18px 20px",
            borderTop: `3px solid ${BRAND.coralDark}`,
            background: BRAND.paper,
          }}
        >
          <p style={{ ...label, margin: "0 0 2px", color: BRAND.coralDark }}>Not this</p>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: BRAND.mid, fontStyle: "italic" }}>
            All of them kind. All of them in daily use.
          </p>
          {avoid.map((a, i) => (
            <div key={i} style={{ margin: i ? "14px 0 0" : 0 }}>
              <p
                style={{
                  fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
                  fontSize: 18,
                  lineHeight: 1.45,
                  margin: 0,
                  color: BRAND.coralDark,
                }}
              >
                {a.words}
              </p>
              <p style={{ margin: "3px 0 0", fontSize: 14, lineHeight: 1.55, color: BRAND.mid }}>
                {a.why}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SignalCard({ s, remove }: { s: Signal; remove: string }) {
  return (
    <Card accent={BRAND.coralDark}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <p style={{ ...label, margin: 0 }}>What you are seeing</p>
        <a href={remove} style={{ ...label, margin: 0, color: BRAND.coralDark, textDecoration: "none" }}>
          Hide
        </a>
      </div>
      <h2
        style={{
          fontFamily: "Poppins, Inter, sans-serif",
          fontSize: 28,
          fontWeight: 900,
          margin: "2px 0 4px",
          letterSpacing: "-0.6px",
          lineHeight: 1.15,
        }}
      >
        {s.name}
      </h2>
      <p style={{ margin: "0 0 14px", fontSize: 16, color: BRAND.mid }}>{s.short}</p>

      {/* The tags are links now. Naming the skill under a behavior is only
          half an answer -- the other half is the block of the year that
          teaches it, and the keys match so the tag can go straight there. */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "0 0 20px" }}>
        {s.ef.map((k) => (
          <a
            key={k}
            href={`/behavior/year?s=${k}`}
            style={{ ...tag(BRAND.lavenderDark), textDecoration: "none" }}
          >
            {EF[k]}
          </a>
        ))}
      </div>

      <Block
        heading="What it looks like in the classroom"
        note="Observable only — no inference yet."
        items={s.look}
        color={BRAND.ink}
      />
      <Block
        heading="What's happening inside"
        note="Why the student feels the way they do."
        items={s.inside}
        color={BRAND.lavenderDark}
      />
      <Block
        heading="What might help in the moment"
        note="The next few minutes."
        items={s.now}
        color={BRAND.tealDark}
      />
      <Words say={s.say} avoid={s.avoid} />
      <Block
        heading="What usually makes it worse"
        note="The reasonable-sounding reflex."
        items={s.worse}
        color={BRAND.coralDark}
      />
      <Block
        heading="What builds the skill over time"
        note="Once the moment has passed."
        items={s.build}
        color={BRAND.pinkDark}
      />

      <section style={{ margin: "0 0 4px" }}>
        <p style={{ ...label, margin: "0 0 8px" }}>Strategies that fit this</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {s.strategies.map((name) => (
            <span key={name} style={tag(BRAND.tealDark)}>
              {name}
            </span>
          ))}
        </div>
      </section>

      {s.research && s.research.length > 0 && (
        <details
          className="disclosure"
          style={{ marginTop: 18, borderTop: `1px solid ${BRAND.line}`, paddingTop: 14 }}
        >
          <summary style={summaryStyle}>
            {`Research behind this (${s.research.length})`}
          </summary>
          <div style={{ marginTop: 12 }}>
            {s.research.map((r) => (
              <div
                key={r.source}
                style={{
                  background: BRAND.paper,
                  border: `1px solid ${BRAND.line}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  margin: "0 0 10px",
                }}
              >
                <p style={{ margin: "0 0 8px", fontSize: 15, lineHeight: 1.6, fontWeight: 600 }}>
                  {r.claim}
                </p>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: BRAND.mid, lineHeight: 1.55 }}>
                  {r.source}
                </p>
                <p style={{ margin: "0 0 6px", fontSize: 14, lineHeight: 1.6 }}>
                  <b style={{ color: BRAND.tealDark }}>What it supports: </b>
                  {r.supports}
                </p>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                  <b style={{ color: BRAND.coralDark }}>What it does not say: </b>
                  {r.limits}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}
    </Card>
  );
}

export const metadata = {
  title: "Behavior Strategies · Upshift Learning",
  description:
    "Start from what you are seeing in a student. What it looks like, what is happening inside, what helps in the moment, and what builds the skill over time.",
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const ids = SIGNALS.map((s) => s.id);
  const picked = all(sp.s).filter((x) => ids.includes(x));
  const chosen = SIGNALS.filter((s) => picked.includes(s.id));

  const href = (next: string[]) => {
    const q = new URLSearchParams();
    for (const id of next) q.append("s", id);
    const qs = q.toString();
    return qs ? `/behavior?${qs}` : "/behavior";
  };
  const toggle = (id: string) =>
    href(picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]);

  // With more than one signal picked, the overlap is what to act on first.
  const skillLoad = new Map<EFKey, string[]>();
  for (const s of chosen) {
    for (const k of s.ef) skillLoad.set(k, [...(skillLoad.get(k) || []), s.name]);
  }
  const shared = [...skillLoad.entries()]
    .filter(([, names]) => names.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  const strategyLoad = new Map<string, string[]>();
  for (const s of chosen) {
    for (const name of s.strategies) {
      strategyLoad.set(name, [...(strategyLoad.get(name) || []), s.name]);
    }
  }
  const sharedStrategies = [...strategyLoad.entries()]
    .filter(([, names]) => names.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div style={{ height: 4, background: GRADIENT }} />
        {/* The paper runs the full width and the column sits on it. It used
            to be the other way round -- the background was on the 1000px
            column, so on any wide screen the page was a beige rectangle with
            two hard vertical edges standing in a white room. */}
        <div style={{ background: BRAND.paper }}>
          <div
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              padding: "28px 5% 80px",
              color: BRAND.ink,
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: 1.6,
            }}
          >
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
            Behavior Strategies
          </h1>
          <p style={{ color: BRAND.mid, margin: "0 0 10px", fontSize: 17, maxWidth: 720 }}>
            Most behavior resources are filed by strategy, which only helps if you already know
            what you are looking at. This one starts where you actually start: with what you can
            see from across the room.
          </p>
          <p style={{ color: BRAND.mid, margin: "0 0 26px", fontSize: 17, maxWidth: 720 }}>
            Click everything you are seeing. Each one tells you what it looks like, what is
            happening inside and why the student feels that way, what might help in the next few
            minutes, and what builds the skill over the term.
          </p>

          <p style={{ ...label, margin: "0 0 10px" }}>What are you seeing?</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 10px" }}>
            {SIGNALS.map((s) => (
              <a key={s.id} href={toggle(s.id)} style={pill(picked.includes(s.id))}>
                {s.name}
              </a>
            ))}
          </div>
          {picked.length > 0 && (
            <p style={{ margin: "0 0 26px" }}>
              <a href="/behavior" style={{ ...label, color: BRAND.coralDark, textDecoration: "none" }}>
                Clear all
              </a>
            </p>
          )}

          {chosen.length === 0 && (
            <Card>
              <h2
                style={{
                  fontFamily: "Poppins, Inter, sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  margin: "0 0 8px",
                  letterSpacing: "-0.4px",
                }}
              >
                Pick what you are seeing
              </h2>
              <p style={{ margin: "0 0 14px", fontSize: 16 }}>
                Pick more than one if the morning had more than one. Where several signals load
                the same executive function skill, that skill is the thing to work on — not the
                behaviors one at a time.
              </p>
              <p style={{ ...label, margin: "0 0 8px" }}>The executive function skills used here</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {(Object.keys(EF) as EFKey[]).map((k) => (
                  <li key={k} style={{ margin: "0 0 6px", fontSize: 15, lineHeight: 1.6 }}>
                    <a href={`/behavior/year?s=${k}`} style={{ color: BRAND.ink }}>
                      <b>{EF[k]}</b>
                    </a>
                    {` — ${EF_MEANING[k]}`}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {chosen.length > 1 && (
            <Card accent={BRAND.lavenderDark}>
              <p style={{ ...label, margin: "0 0 4px" }}>{`Across the ${chosen.length} you picked`}</p>
              <h2
                style={{
                  fontFamily: "Poppins, Inter, sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  margin: "0 0 12px",
                  letterSpacing: "-0.4px",
                }}
              >
                Where these overlap
              </h2>
              {shared.length > 0 ? (
                <>
                  <p style={{ margin: "0 0 8px", fontSize: 15 }}>
                    These skills are under load in more than one of the signals you picked. Start
                    here rather than with the behaviors separately.
                  </p>
                  <ul style={{ margin: "0 0 16px", paddingLeft: 20 }}>
                    {shared.map(([k, names]) => (
                      <li key={k} style={{ margin: "0 0 7px", fontSize: 15, lineHeight: 1.6 }}>
                        <a href={`/behavior/year?s=${k}`} style={{ color: BRAND.ink }}>
                          <b>{EF[k]}</b>
                        </a>
                        {` — ${EF_MEANING[k]} `}
                        <span style={{ color: BRAND.mid }}>{`(${names.join(", ")})`}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p style={{ margin: "0 0 16px", fontSize: 15 }}>
                  These signals do not share an executive function skill, which is worth knowing
                  on its own: they are probably separate problems and will need separate work.
                </p>
              )}
              {sharedStrategies.length > 0 && (
                <>
                  <p style={{ ...label, margin: "0 0 8px" }}>Strategies that serve more than one</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {sharedStrategies.map(([name, names]) => (
                      <span key={name} style={tag(BRAND.tealDark)}>
                        {`${name} (${names.length})`}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </Card>
          )}

          {chosen.map((s) => (
            <SignalCard key={s.id} s={s} remove={href(picked.filter((x) => x !== s.id))} />
          ))}

          {/* Closed by default. This is an index of every strategy on the
              site, not an answer to the signal that was picked, and open it
              ran to sixty lines -- longer than the signal card above it and
              the last thing on the screen, which made it look like the point
              of the page. It is a reference, so it behaves like one. */}
          {chosen.length > 0 && (
            <Card>
              <details className="disclosure">
                <summary style={summaryStyle}>
                  {`Every strategy named on this page (${strategyIndex().length})`}
                </summary>
                <ul style={{ margin: "14px 0 0", padding: 0, listStyle: "none", maxWidth: MEASURE }}>
                  {strategyIndex().map(([name, signals]) => (
                    <li key={name} style={{ margin: "0 0 7px", fontSize: 15, lineHeight: 1.6 }}>
                      <b>{name}</b>
                      <span style={{ color: BRAND.mid }}>{` — ${signals.join(", ")}`}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </Card>
          )}

          <YearCard />

          <p
            style={{
              fontSize: 13,
              color: BRAND.mid,
              lineHeight: 1.6,
              borderTop: `1px solid ${BRAND.line}`,
              paddingTop: 16,
              margin: "10px 0 0",
            }}
          >
            This is a teaching aid for classroom decisions, not a clinical or diagnostic tool.
            Where a signal is frequent, intense, or getting worse, it belongs in a conversation
            with your student support team and the family rather than on a card. Every research
            note says what the finding does not establish as well as what it does, because a
            teacher handed a neuroscience claim deserves both halves.
          </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
