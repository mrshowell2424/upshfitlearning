import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SIGNALS, EF, EF_MEANING, strategyIndex, type EFKey, type Signal } from "./signals";

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

/** One of the four questions, with its list. */
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
    <section style={{ margin: "0 0 18px" }}>
      <h3
        style={{
          fontFamily: "Poppins, Inter, sans-serif",
          fontSize: 15,
          fontWeight: 800,
          margin: "0 0 2px",
          color,
          letterSpacing: "-0.2px",
        }}
      >
        {heading}
      </h3>
      {note && (
        <p style={{ margin: "0 0 8px", fontSize: 13, color: BRAND.mid, fontStyle: "italic" }}>
          {note}
        </p>
      )}
      <ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>
        {items.map((t) => (
          <li key={t} style={{ margin: "0 0 7px", fontSize: 15, lineHeight: 1.6 }}>
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Supportive statements: the words, set as words.
 *
 * Every other section on this page is a list of moves. This one is a list of
 * sentences, and a teacher reading it has about ten seconds before the moment
 * passes -- so each line is set in the reading face at a size you can take in
 * whole, with nothing in front of it to scan past. No bullets, no numbers.
 *
 * They are written to be said to the student rather than about them, and each
 * one leaves the work standing: none of these excuse the task, and none of
 * them are calm down, you're fine, or I know you can do it.
 */
function SupportiveStatements({ items }: { items: string[] }) {
  return (
    <section style={{ margin: "0 0 22px" }}>
      <p style={{ ...label, margin: "0 0 2px", color: BRAND.pinkDark }}>
        Supportive statements
      </p>
      <p style={{ ...label, margin: "0 0 10px", fontWeight: 500, letterSpacing: 0, textTransform: "none", fontSize: 13 }}>
        What to actually say.
      </p>
      <div
        style={{
          borderLeft: `3px solid ${BRAND.pinkDark}`,
          paddingLeft: 16,
        }}
      >
        {items.map((t, i) => (
          <p
            key={i}
            style={{
              fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
              fontSize: 18,
              lineHeight: 1.45,
              margin: i ? "11px 0 0" : 0,
            }}
          >
            {t}
          </p>
        ))}
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
      <SupportiveStatements items={s.say} />
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
        <details style={{ marginTop: 18, borderTop: `1px solid ${BRAND.line}`, paddingTop: 14 }}>
          <summary
            style={{
              cursor: "pointer",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 800,
              color: BRAND.ink,
            }}
          >
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
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: "28px 5% 80px",
            background: BRAND.paper,
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

          {chosen.length > 0 && (
            <Card>
              <p style={{ ...label, margin: "0 0 8px" }}>Every strategy named on this page</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {strategyIndex().map(([name, signals]) => (
                  <li key={name} style={{ margin: "0 0 6px", fontSize: 15, lineHeight: 1.6 }}>
                    <b>{name}</b>
                    <span style={{ color: BRAND.mid }}>{` — ${signals.join(", ")}`}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

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
      </main>
      <Footer />
    </div>
  );
}
