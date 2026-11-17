import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SIGNALS, EF, EF_MEANING, strategyIndex, type EFKey, type Signal } from "./signals";
import { EF_YEAR } from "./ef-weeks";

/**
 * Behavior Strategies — start from what you can see.
 *
 * The teacher picks the signals in front of them and the page answers in the
 * order a person actually asks: is this the thing I am seeing, what do I do
 * in the next few minutes, what do I say, and then — later, when the room is
 * calm — why it happens and what builds the skill. Several signals can be
 * picked at once, because a hard morning is rarely one behavior, and the
 * overlap is the useful part.
 *
 * Selection is in the URL, so a coach can send a colleague the exact view
 * they were looking at, and so this stays a server component with no client
 * bundle at all.
 *
 * ON THE LOOK OF IT. This page had grown its own layout vocabulary and
 * looked, correctly, like a page from a different site. Four things did it,
 * and all four are fixed here rather than softened:
 *
 *   1. Two column widths. The column was 1000px, the prose inside it capped
 *      at 720 and the lists at 660, so headings and cards had different
 *      right edges and the page looked like it had slipped. One width now,
 *      880, the same as /math/cases and /math/review.
 *   2. A beige slab. The whole page sat on #F7F6F4 full-bleed, which no
 *      other page does, so it read as a different site the moment you
 *      arrived from anywhere. White, with the brand hairline on top.
 *   3. Type sizes that had drifted. Everything here is Poppins, which is
 *      the brand book's rule and not a thing to work around: "Poppins is
 *      the whole interface, headings and running text alike, because it is
 *      the brand's face". The serif in globals.css is for lines a child
 *      reads — a passage, a decodable, a word ladder — and nothing on this
 *      page is one. It is written for the teacher, including the sentences
 *      they say out loud. An earlier pass set this page's prose in that
 *      serif, which was the wrong reading of a rule already written down.
 *   4. Five accent colours in one card. Teal, coral, lavender, pink and ink
 *      each headed a section, in five sizes, which is what made it feel
 *      unresolved. Two colours carry meaning now and nothing else is
 *      coloured at all: teal is what to do, coral is what not to. Every
 *      other section is a neutral fold with the same small caps summary the
 *      rest of the site uses.
 */

const BRAND = {
  ink: "#111111",
  mid: "#444444",
  soft: "#6A6A6A",
  line: "#E9E9E9",
  panel: "#FAFAFA",
  coralDark: "#C0432F",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
};
const GRADIENT = "linear-gradient(135deg, #FF6A5B, #FF7DAE, #B87DFF, #00B4A6)";
// The brand book, in globals.css: Poppins is the whole interface,
// headings and running text alike, because it is the brand's face.
// The serif is for lines a child reads, and nothing on this page is
// one -- it is written for the teacher, including the sentences they
// say out loud.
const SANS = "Poppins, system-ui, sans-serif";

type Search = Promise<Record<string, string | string[] | undefined>>;
const all = (v: string | string[] | undefined): string[] =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

const label: React.CSSProperties = {
  fontFamily: "Poppins, system-ui, sans-serif",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: BRAND.mid,
};

/**
 * The control, in the shape the rest of the site uses.
 *
 * Same geometry as the pills on /math/cases, so a teacher moving between
 * the two is pressing the same button twice rather than learning two.
 */
function pill(on: boolean, color: string): React.CSSProperties {
  return {
    fontFamily: "Poppins, system-ui, sans-serif",
    fontSize: 13,
    fontWeight: 800,
    padding: "8px 15px",
    minHeight: 40,
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    textDecoration: "none",
    border: `1.5px solid ${on ? color : BRAND.line}`,
    background: on ? color : "#FFFFFF",
    color: on ? "#FFFFFF" : BRAND.ink,
  };
}

/** Small caps, the one summary style on the site. */
const summaryStyle: React.CSSProperties = {
  cursor: "pointer",
  listStyle: "none",
  ...label,
  fontSize: 11,
  color: BRAND.ink,
};

const tag = (color: string): React.CSSProperties => ({
  fontFamily: "Poppins, system-ui, sans-serif",
  fontSize: 12,
  fontWeight: 700,
  borderRadius: 999,
  padding: "5px 11px",
  background: "#FFFFFF",
  color,
  border: `1.5px solid ${color}`,
  display: "inline-block",
  textDecoration: "none",
});

/**
 * The card every block of this page sits in.
 *
 * Ink top edge, rounded at the bottom only — the same card as the cases and
 * review pages, so the three read as one site.
 */
function Card({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: `1px solid ${BRAND.line}`,
        borderTop: `3px solid ${accent || BRAND.ink}`,
        borderRadius: "3px 3px 18px 18px",
        padding: "20px 22px 18px",
        margin: "0 0 18px",
      }}
    >
      {children}
    </div>
  );
}

/**
 * The first clause of an observation, for the one-line confirmation.
 *
 * "Head down on the desk, or turned away from the room." is written to be
 * read on its own; strung together with two others it has to be shorter
 * than that, and the part before the first comma names what was seen.
 */
function firstClause(text: string) {
  const first = String(text).split(/[,—.]/)[0].trim();
  return first.charAt(0).toLowerCase() + first.slice(1);
}

/**
 * A list of moves, with a marker the browser is not asked to draw.
 *
 * Tailwind's preflight sets list-style: none on every ul in the project, so
 * these had been rendering as indented paragraphs. The dot is neutral now:
 * colouring each section differently is what made the card look busy, and a
 * folded section does not need a hue to tell it from its neighbour.
 */
function Block({ note, items }: { note?: string; items: string[] }) {
  return (
    <section style={{ margin: "0 0 4px" }}>
      {note && (
        <p style={{ margin: "0 0 10px", fontSize: 13.5, color: BRAND.soft, fontStyle: "italic" }}>
          {note}
        </p>
      )}
      <ul style={{ margin: 0, padding: 0, listStyle: "none", maxWidth: "66ch" }}>
        {items.map((t) => (
          <li
            key={t}
            style={{
              display: "grid",
              gridTemplateColumns: "14px 1fr",
              gap: 10,
              margin: "0 0 10px",
              fontSize: 15.5,
              fontFamily: SANS,
              lineHeight: 1.65,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: BRAND.soft,
                // Centred on the first line of text rather than its top.
                marginTop: 10,
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
 * Every other section is a list of moves. This one is a list of sentences,
 * and a teacher reading it has about ten seconds before the moment passes —
 * so each line is set in the reading face at a size you can take in whole,
 * with nothing in front of it to scan past.
 *
 * The two halves belong in one panel. A page that only lists better
 * sentences does not displace the ones already in a teacher's mouth: in a
 * hard moment you reach for whatever is nearest, and the nearest words are
 * the well-meant ones on the right. Side by side is what makes it a swap.
 *
 * These are the two colours on the page that mean something — teal for what
 * to say, coral for what not to. Nothing else is coloured, so these read.
 */
function Words({ say, avoid }: { say: string[]; avoid: { words: string; why: string }[] }) {
  return (
    <section
      style={{
        margin: "0 0 20px",
        border: `1px solid ${BRAND.line}`,
        borderRadius: 14,
        overflow: "hidden",
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
        <div style={{ padding: "16px 18px", borderTop: `3px solid ${BRAND.tealDark}` }}>
          <p style={{ ...label, margin: "0 0 2px", color: BRAND.tealDark }}>Say this</p>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: BRAND.soft, fontStyle: "italic" }}>
            Short enough to say across a room.
          </p>
          {say.map((t, i) => (
            <p key={i} style={{ fontFamily: SANS, fontSize: 16.5, lineHeight: 1.5, margin: i ? "13px 0 0" : 0 }}>
              {t}
            </p>
          ))}
        </div>

        <div style={{ padding: "16px 18px", borderTop: `3px solid ${BRAND.coralDark}`, background: BRAND.panel }}>
          <p style={{ ...label, margin: "0 0 2px", color: BRAND.coralDark }}>Not this</p>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: BRAND.soft, fontStyle: "italic" }}>
            All of them kind. All of them in daily use.
          </p>
          {avoid.map((a, i) => (
            <div key={i} style={{ margin: i ? "14px 0 0" : 0 }}>
              <p style={{ fontFamily: SANS, fontSize: 16.5, lineHeight: 1.5, margin: 0, color: BRAND.coralDark }}>
                {a.words}
              </p>
              <p style={{ margin: "3px 0 0", fontSize: 14, lineHeight: 1.55, color: BRAND.mid }}>{a.why}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * A section folded away until it is wanted.
 *
 * The card holds about two thousand words and a teacher in the moment needs
 * two hundred of them. These keep every word and change when it is in front
 * of somebody. The summary is the site's small caps rather than a coloured
 * heading of its own size — four folds in four colours was the single
 * busiest thing on the page.
 */
function Fold({ heading, count, children }: { heading: string; count: number; children: React.ReactNode }) {
  return (
    <details className="disclosure" style={{ borderTop: `1px solid ${BRAND.line}`, padding: "13px 0" }}>
      <summary style={summaryStyle}>
        {heading} <span style={{ color: BRAND.soft }}>· {count}</span>
      </summary>
      <div style={{ paddingTop: 13 }}>{children}</div>
    </details>
  );
}

function SignalCard({ s, remove }: { s: Signal; remove: string }) {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <p style={{ ...label, margin: 0, color: BRAND.coralDark }}>What you are seeing</p>
        <a href={remove} style={{ ...label, margin: 0, color: BRAND.soft, textDecoration: "none" }}>
          Remove ✕
        </a>
      </div>
      <h2
        style={{
          fontFamily: SANS,
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: "-0.5px",
          margin: "3px 0 3px",
          lineHeight: 1.15,
        }}
      >
        {s.name}
      </h2>
      <p style={{ margin: "0 0 14px", fontSize: 16, color: BRAND.mid }}>{s.short}</p>

      {/* What you saw, as a line rather than a list. It was six bullets at
          the top of the card, which is a reading task in front of a teacher
          who has already done the observing — that is how they got here. It
          confirms the pick and gets out of the way. */}
      <p
        style={{
          margin: "0 0 20px",
          fontSize: 15,
          fontFamily: SANS,
          color: BRAND.mid,
          borderLeft: `3px solid ${BRAND.line}`,
          paddingLeft: 12,
          lineHeight: 1.55,
        }}
      >
        <b style={{ color: BRAND.ink, fontFamily: "Poppins, sans-serif", fontSize: 13.5 }}>YOU SAW </b>
        {s.look.slice(0, 3).map(firstClause).join(" · ")}
      </p>

      {/* The next five minutes, first and numbered. A teacher opens this page
          because something is happening now; the moves and the words belong
          where the eye lands, and the understanding belongs below them for
          when the room is calm. */}
      <section style={{ margin: "0 0 20px" }}>
        <p style={{ ...label, margin: "0 0 2px", color: BRAND.tealDark }}>Right now</p>
        <p style={{ margin: "0 0 12px", fontSize: 13, fontStyle: "italic", color: BRAND.soft }}>
          The next few minutes.
        </p>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
          {s.now.map((item, i) => (
            <li
              key={item}
              style={{
                display: "flex",
                gap: 11,
                alignItems: "flex-start",
                border: `1px solid ${BRAND.line}`,
                borderRadius: 12,
                padding: "11px 13px",
                fontSize: 15.5,
                fontFamily: SANS,
                lineHeight: 1.6,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flex: "0 0 auto",
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: BRAND.tealDark,
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: "Poppins, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 2,
                }}
              >
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <Words say={s.say} avoid={s.avoid} />

      {/* Everything that is not the next five minutes, folded away. None of
          it is cut — a shutdown is not understood from a list of moves — but
          it is read at a different time of day than it was being shown at. */}
      <Fold heading="Why this happens" count={s.inside.length}>
        <Block note="Why the student feels the way they do." items={s.inside} />
      </Fold>
      <Fold heading="What makes it worse" count={s.worse.length}>
        <Block note="The reasonable-sounding reflex." items={s.worse} />
      </Fold>
      <Fold heading="What builds the skill over time" count={s.build.length}>
        <Block note="Once the moment has passed." items={s.build} />
      </Fold>
      <Fold heading="Everything you might see" count={s.look.length}>
        <Block note="Observable only — no inference yet." items={s.look} />
      </Fold>

      {s.research && s.research.length > 0 && (
        <Fold heading="Research behind this" count={s.research.length}>
          {s.research.map((r) => (
            <div
              key={r.source}
              style={{
                background: BRAND.panel,
                border: `1px solid ${BRAND.line}`,
                borderRadius: 14,
                padding: "14px 16px",
                margin: "0 0 10px",
              }}
            >
              <p style={{ margin: "0 0 8px", fontSize: 15, lineHeight: 1.65, fontFamily: SANS }}>{r.claim}</p>
              <p style={{ margin: "0 0 8px", fontSize: 12.5, color: BRAND.soft, lineHeight: 1.55 }}>{r.source}</p>
              <p style={{ margin: "0 0 6px", fontSize: 14.5, lineHeight: 1.6 }}>
                <b style={{ color: BRAND.tealDark }}>What it supports: </b>
                {r.supports}
              </p>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>
                <b style={{ color: BRAND.coralDark }}>What it does not say: </b>
                {r.limits}
              </p>
            </div>
          ))}
        </Fold>
      )}

      {/* The skill tags sit at the bottom now rather than under the title.
          They are the route to the term plan, which is the question after
          the moment has passed — not the one a teacher arrived with. */}
      <section style={{ borderTop: `1px solid ${BRAND.line}`, padding: "16px 0 0", margin: "6px 0 0" }}>
        <p style={{ ...label, margin: "0 0 8px" }}>The skills under this one</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "0 0 14px" }}>
          {s.ef.map((k) => (
            <a key={k} href={`/behavior/year?s=${k}`} style={tag(BRAND.lavenderDark)}>
              {EF[k]} →
            </a>
          ))}
        </div>
        <p style={{ ...label, margin: "0 0 8px" }}>Strategies that fit this</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {s.strategies.map((name) => (
            <span key={name} style={tag(BRAND.tealDark)}>
              {name}
            </span>
          ))}
        </div>
      </section>
    </Card>
  );
}

/**
 * What a card holds, shown before anything is picked.
 *
 * The empty state used to be a glossary of eleven executive function skills
 * — reference material standing in for the thing the page does. A teacher
 * who had not clicked yet saw no reason to. This is four lines that say
 * what arrives when they do, which is the only question at that moment.
 *
 * It sits above the signals rather than under them. Someone arriving here
 * for the first time is not choosing yet; they are deciding whether the
 * page is worth a click, and a row of twelve buttons does not answer that.
 * Say what a card holds, then offer the buttons.
 */
function WhatYouGet() {
  const parts: [string, string][] = [
    ["Right now", "Numbered moves for the next few minutes, most important first."],
    ["Say this, not this", "The words, beside the well-meant ones that make it worse."],
    ["Why this happens", "What is going on inside, written to the student rather than about them."],
    ["What builds the skill", "The longer arc, for once the moment has passed."],
  ];
  return (
    <Card>
      <p style={{ ...label, margin: "0 0 4px", color: BRAND.coralDark }}>Pick one below</p>
      <h2 style={{ fontFamily: SANS, fontSize: 22, fontWeight: 800, letterSpacing: "-0.4px", margin: "0 0 8px", lineHeight: 1.2 }}>
        What you get for each one
      </h2>
      <p style={{ fontFamily: SANS, fontSize: 15.5, lineHeight: 1.65, color: BRAND.mid, margin: "0 0 16px", maxWidth: "62ch" }}>
        Pick more than one if the morning had more than one. Where several signals load the same
        executive function skill, that skill is the thing to work on — not the behaviors one at a
        time — and the page says so.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))", gap: 10 }}>
        {parts.map(([h, t], i) => (
          <div key={h} style={{ border: `1px solid ${BRAND.line}`, borderRadius: 12, padding: "12px 14px" }}>
            <p style={{ ...label, margin: "0 0 4px", fontSize: 10, color: BRAND.soft }}>{i + 1}</p>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 14.5, fontWeight: 800, margin: "0 0 3px" }}>
              {h}
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: BRAND.mid, margin: 0 }}>{t}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/**
 * The way to the year plan.
 *
 * Every skill tag on a signal card links into /behavior/year, but a tag only
 * exists once a signal has been picked — so a teacher who read this page
 * without clicking had no route to the term plan at all. This is that
 * route, and it sits at the bottom because that is where the question
 * arrives: the cards answer the next few minutes, and the obvious next
 * question is what to do with the other thirty-four weeks.
 */
function YearCard() {
  const weeks = Math.max(...EF_YEAR.map((b) => Number(b.weeks.match(/(\d+)\D+(\d+)/)?.[2] ?? 0)));
  return (
    <a
      href="/behavior/year"
      style={{
        display: "block",
        background: "#FFFFFF",
        border: `1px solid ${BRAND.line}`,
        borderLeft: `3px solid ${BRAND.tealDark}`,
        borderRadius: "3px 14px 14px 3px",
        padding: "18px 20px",
        margin: "0 0 18px",
        textDecoration: "none",
        color: BRAND.ink,
      }}
    >
      <p style={{ ...label, margin: "0 0 4px", color: BRAND.tealDark }}>Over the term</p>
      <h2 style={{ fontFamily: SANS, fontSize: 21, fontWeight: 800, letterSpacing: "-0.4px", margin: "0 0 7px", lineHeight: 1.2 }}>
        The executive function year
      </h2>
      <p style={{ margin: "0 0 14px", fontSize: 15, color: BRAND.mid, lineHeight: 1.6, maxWidth: "62ch" }}>
        {`All ${EF_YEAR.length} skills named on this page, taught across ${weeks} weeks at two minutes a day — five lessons a week, an I-can statement the class ends up saying, and something to send home. →`}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {EF_YEAR.map((bk) => (
          <span
            key={bk.key}
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: BRAND.ink,
              border: `1px solid ${BRAND.line}`,
              borderRadius: 999,
              padding: "4px 10px",
              whiteSpace: "nowrap",
            }}
          >
            <span aria-hidden="true" style={{ marginRight: 5 }}>
              {bk.icon}
            </span>
            {bk.name}
          </span>
        ))}
      </div>
    </a>
  );
}

export const metadata = {
  title: "Behavior Strategies",
  description:
    "Start from what you are seeing in a student. What it looks like, what is happening inside, what helps in the moment, and what builds the skill over time.",
  openGraph: ogCard("/og/behavior.png"),
  twitter: twitterCard("/og/behavior.png"),
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
      <main id="main" tabIndex={-1} className="flex-1">
        <div style={{ height: 4, background: GRADIENT }} />

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px", color: BRAND.ink }}>
          <p style={{ ...label, margin: "0 0 6px", color: BRAND.coralDark }}>
            Start from what you can see
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
            Behavior Strategies
          </h1>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 17,
              lineHeight: 1.65,
              color: BRAND.mid,
              maxWidth: "62ch",
              margin: "0 0 26px",
            }}
          >
            Most behavior resources are filed by strategy, which only helps if you already know
            what you are looking at. This one starts where you actually start: with what you can
            see from across the room.
          </p>

          {/* Before anything is picked, what a card holds comes first and the
              signals come after it. A teacher who has not clicked yet is not
              yet choosing — they are deciding whether this page is worth a
              click at all, and twelve buttons do not answer that. Once a
              signal is picked the explainer has done its job and goes, which
              puts the signals back at the top where a second pick is made. */}
          {chosen.length === 0 && <WhatYouGet />}

          <p style={{ ...label, margin: "0 0 10px" }}>What are you seeing?</p>
          <div
            style={{
              display: "flex",
              gap: 7,
              flexWrap: "wrap",
              margin: picked.length > 0 ? "0 0 14px" : "0 0 26px",
            }}
          >
            {SIGNALS.map((s) => (
              <a key={s.id} href={toggle(s.id)} style={pill(picked.includes(s.id), BRAND.ink)} title={s.short}>
                {s.name}
              </a>
            ))}
          </div>
          {picked.length > 0 && (
            <p style={{ margin: "0 0 24px" }}>
              <a href="/behavior" style={{ ...label, color: BRAND.coralDark, textDecoration: "none" }}>
                Clear all ✕
              </a>
            </p>
          )}

          {chosen.length > 1 && (
            <Card accent={BRAND.lavenderDark}>
              <p style={{ ...label, margin: "0 0 3px", color: BRAND.lavenderDark }}>
                {`Across the ${chosen.length} you picked`}
              </p>
              <h2 style={{ fontFamily: SANS, fontSize: 22, fontWeight: 800, letterSpacing: "-0.4px", margin: "0 0 10px", lineHeight: 1.2 }}>
                Where these overlap
              </h2>
              {shared.length > 0 ? (
                <>
                  <p style={{ margin: "0 0 12px", fontSize: 15.5, fontFamily: SANS, lineHeight: 1.65, maxWidth: "62ch" }}>
                    These skills are under load in more than one of the signals you picked. Start
                    here rather than with the behaviors separately.
                  </p>
                  <ul style={{ margin: "0 0 16px", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                    {shared.map(([k, names]) => (
                      <li
                        key={k}
                        style={{
                          border: `1px solid ${BRAND.line}`,
                          borderRadius: 10,
                          padding: "10px 13px",
                          fontSize: 15.5,
                          lineHeight: 1.6,
                        }}
                      >
                        <a href={`/behavior/year?s=${k}`} style={{ color: BRAND.lavenderDark, fontWeight: 700, textDecoration: "none" }}>
                          {EF[k]} →
                        </a>
                        <span style={{ fontFamily: SANS }}>{` ${EF_MEANING[k]} `}</span>
                        <span style={{ color: BRAND.soft, fontSize: 14 }}>{`(${names.join(", ")})`}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p style={{ margin: "0 0 16px", fontSize: 15.5, fontFamily: SANS, lineHeight: 1.65, maxWidth: "62ch" }}>
                  These signals do not share an executive function skill, which is worth knowing on
                  its own: they are probably separate problems and will need separate work.
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

          {/* Reference, folded. The eleven skills and the strategy index are
              both indexes of the whole page rather than answers to the signal
              that was picked, so they behave like references: available,
              never the loudest thing on the screen. */}
          <Card>
            <details className="disclosure">
              <summary style={summaryStyle}>The eleven skills behind these signals · 11</summary>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 10,
                  paddingTop: 14,
                }}
              >
                {(Object.keys(EF) as EFKey[]).map((k) => (
                  <a
                    key={k}
                    href={`/behavior/year?s=${k}`}
                    style={{
                      display: "block",
                      border: `1px solid ${BRAND.line}`,
                      borderRadius: 12,
                      padding: "11px 13px",
                      textDecoration: "none",
                      color: BRAND.ink,
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        marginBottom: 2,
                      }}
                    >
                      {EF[k]}
                    </span>
                    <span style={{ fontSize: 13.5, lineHeight: 1.5, color: BRAND.mid }}>{EF_MEANING[k]}</span>
                  </a>
                ))}
              </div>
            </details>
          </Card>

          {chosen.length > 0 && (
            <Card>
              <details className="disclosure">
                <summary style={summaryStyle}>
                  {`Every strategy named on this page · ${strategyIndex().length}`}
                </summary>
                <ul style={{ margin: "14px 0 0", padding: 0, listStyle: "none", maxWidth: "66ch" }}>
                  {strategyIndex().map(([name, signals]) => (
                    <li key={name} style={{ margin: "0 0 8px", fontSize: 15.5, lineHeight: 1.6 }}>
                      <b>{name}</b>
                      <span style={{ color: BRAND.soft }}>{` — ${signals.join(", ")}`}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </Card>
          )}

          <YearCard />

          <p
            style={{
              fontSize: 13.5,
              color: BRAND.soft,
              lineHeight: 1.65,
              borderTop: `1px solid ${BRAND.line}`,
              paddingTop: 16,
              margin: "14px 0 0",
              maxWidth: "70ch",
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
