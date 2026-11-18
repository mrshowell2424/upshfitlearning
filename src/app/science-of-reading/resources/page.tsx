import Header from "@/components/shared/Header";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import { CopyButton } from "./copy-button";
import ARTICLE_INDEX from "@/../scripts/reading-articles-index.json";
import MYSTERY_INDEX from "@/../scripts/reading-mysteries-index.json";
import MY_COACH from "@/../scripts/reading-mystery-coach.json";
import MY_DEBATE_COACH from "@/../scripts/reading-mystery-debate-coach.json";
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

/**
 * The cases and the articles are loaded inside the request, not at module
 * scope.
 *
 * Production runs on Cloudflare Workers, which evaluates the whole Worker
 * before serving anything and allows about 400ms of CPU to do it. These two
 * files are 5 MB together, and importing them here meant parsing all of it
 * on every cold start — the live site was returning Cloudflare error 1102,
 * "exceeded resource limits", intermittently. scripts/build-reading-index.mjs
 * has the full account.
 *
 * A dynamic import is its own chunk: it is fetched when this function runs,
 * so only a request that is going to show a case or an article pays for it.
 * The types still come from the real files, through the loaders, so nothing
 * here is typed loosely to make the change possible.
 */
const loadMysteries = () =>
  import("@/../scripts/reading-mysteries.json").then((m) => m.default.cases);
const loadArticles = () =>
  import("@/../scripts/reading-articles.json").then((m) => m.default.articles);
type Case = Awaited<ReturnType<typeof loadMysteries>>[number];
type Article = Awaited<ReturnType<typeof loadArticles>>[number];

type Search = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function mysteryPrompt(c: Case) {
  return MY_COACH.lines
    .join("\n")
    .replace(/\{GRADES\}/g, gradeName(c.grade))
    .replace(/\{TITLE\}/g, c.title)
    .replace("{STORY}", c.story)
    .replace("{QUESTION}", c.question)
    .replace("{SUSPECTS}", c.suspects.map((s) => `- ${s.who}: ${s.why}`).join("\n"));
}

/**
 * The debate version's prompt. It is a different prompt rather than the same
 * one with a line added, because the two coaches have to believe different
 * things. The ordinary coach must not know the answer or it leaks it. This
 * one must not think there is an answer, or it will quietly steer the student
 * towards whichever suspect it has decided on.
 */
function debatePrompt(c: Case) {
  const d = c.debate;
  if (!d) return mysteryPrompt(c);
  return MY_DEBATE_COACH.lines
    .join("\n")
    .replace(/\{GRADES\}/g, gradeName(c.grade))
    .replace(/\{TITLE\}/g, c.title)
    .replace("{STORY}", d.story)
    .replace("{QUESTION}", d.question)
    .replace("{SUSPECTS}", d.suspects.map((x) => `- ${x.who}: ${x.why}`).join("\n"))
    .replace("{OPEN}", d.open.map((i) => `- ${d.suspects[i].who}`).join("\n"));
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
const AR_GRADES = [...new Set(ARTICLE_INDEX.articles.map((a) => a.grade))].sort((x, y) => x - y);
const MY_GRADES = [...new Set(MYSTERY_INDEX.cases.map((c) => c.grade))].sort((x, y) => x - y);
const gradeName = (g: number) =>
  g === 0 ? "K" : g === 1 ? "1st" : g === 2 ? "2nd" : g === 3 ? "3rd" : `${g}th`;
const nearestGrade = (want: number, have: number[]) =>
  have.includes(want)
    ? want
    : have.reduce((best, g) => (Math.abs(g - want) < Math.abs(best - want) ? g : best), have[0] ?? 3);

function articlePrompt(a: Article, ver: "higher" | "lower") {
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
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: BRAND.mid,
};
const pill = (on: boolean): React.CSSProperties => ({
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  fontSize: 13,
  fontWeight: 700,
  borderRadius: 100,
  padding: "8px 18px",
  lineHeight: 1.25,
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
  border: `1.5px solid ${BRAND.ink}`,
  background: on ? BRAND.ink : "#FFFFFF",
  color: on ? "#FFFFFF" : BRAND.ink,
});
const select: React.CSSProperties = {
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
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

/** Each tab gets its own accent, so switching tabs looks like switching. */
const ACCENT = { my: BRAND.lavenderDark, ar: BRAND.tealDark } as const;

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
      className="res-actions"
      style={{
        borderTop: `1px solid ${BRAND.line}`,
        background: BRAND.paper,
        margin: "20px -24px -24px",
        padding: "14px 24px 16px",
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
      }}
    >
      {/* Both panels are <details>, so they are flex items in this bar, and a
          closed one is a pill the same size as the buttons beside it. An open
          one was still a flex item: the prompt is 2,000 characters of
          monospace and the answer key is a dozen lines, and both were being
          folded into whatever column width the flex row had left over.
          details[open] takes the whole row, so the panel opens at the full
          width of the bar with its own button sitting on top of it. The
          marker rule is Safari, which draws a triangle that list-style alone
          does not remove. */}
      <style>{`
        .res-actions > details[open] { width: 100%; }
        .res-actions summary::-webkit-details-marker { display: none; }
        .res-actions summary::marker { content: ""; }
      `}</style>
      {children}
    </div>
  );
}

/**
 * The answer key, which is for the adult in the room and nobody else.
 *
 * It used to be the fourth of four identical pills, so the one control a
 * teacher must not press while projecting looked exactly like the three they
 * press all day. The grey outline is what sets it apart now.
 *
 * It used to be held at the far end of the bar by marginLeft:auto. An auto
 * margin eats the free space on its flex line, which pushed it away from the
 * three buttons it belongs with and dropped it onto a line of its own as
 * soon as the bar got the least bit tight. Sitting it in the row with the
 * others costs the right-hand position and keeps all four together, which is
 * the thing worth having.
 */
function Answers({ children, label: text = "🔑 Answers (teacher)" }: { children: React.ReactNode; label?: string }) {
  return (
    <details>
      <summary
        style={{
          ...pill(false),
          listStyle: "none",
          border: `1.5px solid ${BRAND.mid}`,
          color: BRAND.mid,
        }}
      >
        {text}
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

/* ------------------------------------------------------------------ *
 * The case file.
 *
 * The mystery tab used to be the article tab with different words in it:
 * one white card, three labelled bands, and the suspects set as a run of
 * bold-then-grey sentences. That is a readable way to present a text and a
 * poor way to present a puzzle. Nothing on screen said a case was open,
 * nothing said what to do first, and the four or five people a child is
 * meant to rule out -- the actual work -- had less visual weight than the
 * word "Mystery" above them.
 *
 * So the mystery renders as a case file instead: a dark header that looks
 * like a cover, three numbered steps in the order a class does them, and
 * the suspects as a line-up of cards a child can point at. The article tab
 * is untouched and still uses Card and Band.
 * ------------------------------------------------------------------ */

const POPPINS = "var(--font-poppins), system-ui, sans-serif";

/**
 * The text a student reads, on both tabs, in Poppins.
 *
 * This used to be Source Serif, on the reasoning that a reading page should
 * not be set in the same face as its own navigation. Stephanie asked for
 * Poppins, first on the mysteries and then on the articles, so both are
 * Poppins and the page has one reading face again. Poppins runs wider with a
 * taller x-height than Source Serif at the same size, so the measure comes
 * down to 60ch and the leading opens a little, which holds the line length
 * where it reads comfortably.
 */
const bodyText: React.CSSProperties = {
  maxWidth: "60ch",
  fontSize: 18,
  lineHeight: 1.78,
  fontFamily: POPPINS,
  fontWeight: 400,
};

/**
 * The cover of an article, the twin of CaseCover.
 *
 * The standard code is the thing a teacher came here for, so it is the file
 * number. Lexile and word count were two words of grey 11px type at the top
 * of the old card; they are the numbers that decide whether this text suits
 * this group, so they are chips you can read across a room.
 */
function ArticleCover({
  standard,
  grade,
  title,
  lexile,
  words,
}: {
  standard: string;
  grade: string;
  title: string;
  lexile: number;
  words: number;
}) {
  const chip: React.CSSProperties = {
    fontFamily: POPPINS,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.04em",
    color: "#FFFFFF",
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.26)",
    borderRadius: 100,
    padding: "4px 11px",
  };
  return (
    <div style={{ background: BRAND.ink, color: "#FFFFFF", padding: "22px 26px 24px" }}>
      <p style={{ ...label, color: "rgba(255,255,255,0.62)", margin: "0 0 4px" }}>
        {`${standard} · ${grade}`}
      </p>
      <h2
        style={{
          fontFamily: POPPINS,
          fontSize: 32,
          fontWeight: 900,
          letterSpacing: "-0.8px",
          lineHeight: 1.1,
          margin: "0 0 12px",
          textWrap: "balance",
        }}
      >
        {title}
      </h2>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        <span style={chip}>{`Lexile ${lexile}`}</span>
        <span style={chip}>{`${words} words`}</span>
      </div>
    </div>
  );
}

/**
 * One lettered paragraph.
 *
 * The letter was a bold character in the text colour, the width of one em,
 * sitting in a column beside the paragraph. Four of the five questions on
 * every article ask the student to name a paragraph by its letter, and the
 * write task asks for a letter against every piece of evidence, so the
 * letters are the index the whole task runs on. Drawn as badges they can be
 * found at a glance and pointed at from the back of a room.
 */
function Para({ letter, text, accent }: { letter: string; text: string; accent: string }) {
  return (
    <div style={{ display: "flex", gap: 14, margin: "0 0 18px" }}>
      <span
        aria-hidden="true"
        style={{
          flex: "0 0 auto",
          width: 26,
          height: 26,
          borderRadius: 8,
          background: accent,
          color: "#FFFFFF",
          fontFamily: POPPINS,
          fontSize: 13,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 4,
        }}
      >
        {letter}
      </span>
      <div style={{ ...bodyText, textWrap: "pretty" }}>{text}</div>
    </div>
  );
}

/**
 * One of the five questions, as a card.
 *
 * They were five lines of a list with a small grey tag above each. The kind
 * tag is the useful part -- it says which sort of thinking the item wants --
 * and in grey on grey it was the least visible thing on the row. On the
 * accent, against a card, the five read as five separate asks.
 */
function Question({
  n,
  kind,
  q,
  accent,
}: {
  n: number;
  kind: string;
  q: string;
  accent: string;
}) {
  return (
    <li
      style={{
        listStyle: "none",
        background: "#FFFFFF",
        border: `1.5px solid ${BRAND.line}`,
        borderRadius: 16,
        padding: "14px 16px",
        display: "grid",
        gridTemplateColumns: "28px 1fr",
        gap: 12,
        alignItems: "start",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 26,
          height: 26,
          borderRadius: 100,
          border: `2px solid ${accent}`,
          color: accent,
          fontFamily: POPPINS,
          fontSize: 13,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </span>
      <div style={{ minWidth: 0 }}>
        <span
          style={{
            display: "inline-block",
            fontFamily: POPPINS,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: accent,
            marginBottom: 6,
          }}
        >
          {kind}
        </span>
        {/* A vocabulary item is two definitions on two lines; the newline in
            the data collapses without this. */}
        <div
          style={{
            fontFamily: POPPINS,
            fontSize: 16,
            lineHeight: 1.6,
            whiteSpace: "pre-line",
            textWrap: "pretty",
          }}
        >
          {q}
        </div>
      </div>
    </li>
  );
}

/**
 * The cover of the file. Ink rather than white, because the one thing the
 * old layout never did was change colour when you opened a mystery.
 */
function CaseCover({ tag, grade, week, title }: { tag: string; grade: string; week: number; title: string }) {
  return (
    <div style={{ background: BRAND.ink, color: "#FFFFFF", padding: "22px 26px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span aria-hidden="true" style={{ fontSize: 40, lineHeight: 1 }}>
          {tag.split(" ")[0]}
        </span>
        <div>
          <p style={{ ...label, color: "rgba(255,255,255,0.62)", margin: "0 0 2px" }}>
            {`Case file ${String(week).padStart(2, "0")} · ${grade} · ${tag.split(" ").slice(1).join(" ")}`}
          </p>
          <h2
            style={{
              fontFamily: POPPINS,
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: "-0.8px",
              lineHeight: 1.1,
              margin: 0,
              textWrap: "balance",
            }}
          >
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}

/**
 * One numbered step. The number is the point: a child reading this page
 * should be able to say which part they are on without being told.
 */
function Step({
  n,
  heading,
  hint,
  accent,
  children,
}: {
  n: number;
  heading: string;
  hint?: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 16, margin: "0 0 26px" }}>
      <div>
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            borderRadius: 100,
            background: accent,
            color: "#FFFFFF",
            fontFamily: POPPINS,
            fontSize: 17,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {n}
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <h3
          style={{
            fontFamily: POPPINS,
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: "-0.2px",
            margin: "6px 0 0",
          }}
        >
          {heading}
        </h3>
        {hint && (
          <p style={{ color: BRAND.mid, fontSize: 14, margin: "2px 0 0", textWrap: "pretty" }}>{hint}</p>
        )}
        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </section>
  );
}

/**
 * One suspect, as a card rather than a line of prose.
 *
 * The emoji each suspect already carries was being swallowed inside a
 * sentence. Pulled out and set large it gives every suspect a face, which
 * is what makes a line-up scannable and what lets a teacher say "the third
 * one" and have the room land on the same card.
 */
function Suspect({ who, why, open }: { who: string; why: string; open?: boolean }) {
  const [face, ...rest] = who.split(" ");
  return (
    <li
      style={{
        listStyle: "none",
        background: "#FFFFFF",
        // In the debate version the three suspects still in play are drawn in,
        // because "any of them could be right" is a claim a child should be
        // able to see on the card rather than take on trust from a teacher.
        border: open ? `2px solid ${ACCENT.my}` : `1.5px solid ${BRAND.line}`,
        borderRadius: 16,
        padding: "14px 16px",
        display: "grid",
        gridTemplateColumns: "28px 1fr",
        gap: 12,
        alignItems: "start",
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 22, lineHeight: 1.2 }}>
        {face}
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontFamily: POPPINS, fontSize: 15, fontWeight: 800, margin: "0 0 3px", textWrap: "pretty" }}>
          {rest.join(" ")}
          {open && (
            <span style={{ ...label, color: ACCENT.my, marginLeft: 8, fontSize: 11 }}>in play</span>
          )}
        </p>
        <p style={{ color: BRAND.mid, fontSize: 14, lineHeight: 1.5, margin: 0, textWrap: "pretty" }}>
          {why}
        </p>
      </div>
    </li>
  );
}

/** The question, given the weight the thing being asked deserves. */
function Ask({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <p
      style={{
        fontFamily: POPPINS,
        fontSize: 21,
        fontWeight: 800,
        lineHeight: 1.3,
        letterSpacing: "-0.3px",
        margin: 0,
        padding: "16px 20px",
        background: "#FFFFFF",
        border: `2px solid ${accent}`,
        borderRadius: 16,
        textWrap: "pretty",
      }}
    >
      {children}
    </p>
  );
}

function Prompt({ text }: { text: string }) {
  return (
    <details>
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
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
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
  openGraph: ogCard("/og/science-of-reading.png"),
  twitter: twitterCard("/og/science-of-reading.png"),
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const tab = one(sp.tab) === "ar" ? "ar" : "my";

  // One grade choice, shared by both tabs, each falling back to what it has.
  const asked = Number(one(sp.g));
  const wanted = Number.isFinite(asked) ? asked : 3;

  // Mysteries: the grade, then the week inside it.
  const myGrade = nearestGrade(wanted, MY_GRADES);
  const MY = await loadMysteries();
  const myPool = MY.filter((c) => c.grade === myGrade).sort((a, b) => a.week - b.week);
  const ci = Math.min(Math.max(Number(one(sp.c) ?? 0) || 0, 0), Math.max(myPool.length - 1, 0));
  const myCase = myPool[ci];
  // Two versions of the same case. "solve" is the original: one culprit, the
  // rest ruled out by the text. "debate" withholds the deciding line, leaves
  // three suspects standing, and grades the argument instead of the name. A
  // case without a debate version stays on solve whatever the URL asks for.
  const dbt = myCase?.debate;
  const mode: "solve" | "debate" = one(sp.m) === "db" && dbt ? "debate" : "solve";
  const myStory = mode === "debate" && dbt ? dbt.story : myCase?.story;
  const myQ = mode === "debate" && dbt ? dbt.question : myCase?.question;
  // The suspect cards sit beside the story, so they carry the same weight as
  // it does. The solve version's reasons are often the clearing itself, which
  // would settle the debate on the card, so the debate brings its own.
  const mySuspects = mode === "debate" && dbt ? dbt.suspects : (myCase?.suspects ?? []);

  // Articles: grade, then standard, then the article inside what is left.
  const grade = nearestGrade(wanted, AR_GRADES);
  const AR = await loadArticles();
  const stds = [...new Set(AR.filter((a) => a.grade === grade).map((a) => a.standard))].sort();
  const std = stds.includes(one(sp.s) ?? "") ? (one(sp.s) as string) : "*";
  const pool = AR.filter((a) => a.grade === grade && (std === "*" || a.standard === std));
  const ai = Math.min(Math.max(Number(one(sp.n) ?? 0) || 0, 0), Math.max(pool.length - 1, 0));
  const art = pool[ai];
  const ver: "higher" | "lower" = one(sp.v) === "lo" ? "lower" : "higher";
  const v = art ? art[ver] : null;

  const href = (next: Record<string, string>) => {
    const q = new URLSearchParams({ tab, g: String(tab === "my" ? myGrade : grade), s: std, n: String(ai), v: ver === "lower" ? "lo" : "hi", c: String(ci), m: mode === "debate" ? "db" : "s", ...next });
    return `/science-of-reading/resources?${q.toString()}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <SignInGate
          title="Reading Resources"
          blurb="Mysteries and informational articles with questions, a written response, and an AI prompt that carries the whole text. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />
          {/* White, like every other page.
              This used to paint BRAND.paper across the full width with the
              column centred on it, which made the page a beige band in a
              white site — arriving here from anywhere felt like leaving.
              The paper tone is still used, on the panels inside, where a
              tint separates one block from another instead of separating
              this page from the rest of them. */}
          <div style={{ color: BRAND.ink, fontFamily: "var(--font-poppins), system-ui, sans-serif", lineHeight: 1.6 }}>
          <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
            <p style={{ ...label, margin: "0 0 6px" }}>Upshift Learning</p>
            <h1 style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif", fontSize: 40, fontWeight: 900, letterSpacing: "-1px", margin: "0 0 4px", lineHeight: 1.1 }}>
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
                {/* The dropdown is still how you jump to a known week, but
                    thirty-six titles behind a Show button is a poor way to
                    browse. The arrows step through the pool one case at a
                    time, which is what a teacher working the year in order
                    actually does. They wrap, so neither end is a dead end. */}
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
                  <span style={{ display: "inline-flex", gap: 6 }}>
                    <a
                      href={href({ c: String((ci - 1 + myPool.length) % myPool.length) })}
                      style={{ ...pill(false), padding: "8px 14px" }}
                      aria-label="Previous case"
                    >
                      ←
                    </a>
                    <a
                      href={href({ c: String((ci + 1) % myPool.length) })}
                      style={{ ...pill(false), padding: "8px 14px" }}
                      aria-label="Next case"
                    >
                      →
                    </a>
                  </span>
                </form>

                {/* Two versions of the case. The toggle only appears where
                    the case has a debate version written, so a grade still
                    waiting for one does not show a control that does nothing. */}
                {dbt && (
                  <div style={{ margin: "0 0 16px" }}>
                    <p style={{ ...label, margin: "0 0 8px" }}>Version</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <a href={href({ m: "s" })} style={pill(mode === "solve")}>&#128269; Solve it</a>
                      <a href={href({ m: "db" })} style={pill(mode === "debate")}>&#128172; Debate it</a>
                      <span style={{ color: BRAND.mid, fontSize: 14, textWrap: "pretty" }}>
                        {mode === "debate"
                          ? "No answer key. Three suspects are arguable; the evidence is what counts."
                          : "One culprit. The case rules the others out."}
                      </span>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${BRAND.line}`,
                    borderRadius: 20,
                    overflow: "hidden",
                    margin: "0 0 18px",
                  }}
                >
                  <CaseCover
                    tag={myCase.tag}
                    grade={gradeName(myCase.grade)}
                    week={myCase.week}
                    title={myCase.title}
                  />
                  <div style={{ padding: "26px 24px 24px" }}>
                    <Step
                      n={1}
                      heading="Read the case"
                      hint={
                        mode === "debate"
                          ? "Everything you can use is in these sentences. Nothing in them settles it."
                          : "Every clue you need is in these sentences. Nothing is hidden."
                      }
                      accent={ACCENT.my}
                    >
                      {/* The one place on the page set in the serif. The
                          left rule marks where the website stops and the
                          thing to be read starts. */}
                      <div
                        style={{
                          ...bodyText,
                          textWrap: "pretty",
                          borderLeft: `3px solid ${ACCENT.my}`,
                          paddingLeft: 18,
                        }}
                      >
                        {myStory}
                      </div>
                    </Step>

                    <Step
                      n={2}
                      heading="Line up the suspects"
                      hint={
                        mode === "debate" && dbt
                          ? `${myCase.suspects.length} of them. Three could be argued. Pick one and prove it.`
                          : `${myCase.suspects.length} of them. One did it. The case rules out the rest.`
                      }
                      accent={ACCENT.my}
                    >
                      <ul
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                          gap: 10,
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {mySuspects.map((s, i) => (
                          <Suspect
                            key={s.who}
                            who={s.who}
                            why={s.why}
                            open={mode === "debate" && !!dbt && dbt.open.includes(i)}
                          />
                        ))}
                      </ul>
                    </Step>

                    <Step n={3} heading={mode === "debate" ? "Take a side" : "Make the call"} accent={ACCENT.my}>
                      <Ask accent={ACCENT.my}>{myQ}</Ask>
                      <div
                        style={{
                          background: BRAND.paper,
                          border: `1px solid ${BRAND.line}`,
                          borderRadius: 16,
                          padding: "14px 18px",
                          marginTop: 12,
                        }}
                      >
                        <p style={{ ...label, color: ACCENT.my, margin: "0 0 6px" }}>Then write</p>
                        <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, textWrap: "pretty" }}>
                          {mode === "debate"
                            ? "Name the one you are charging. Quote at least two lines from the case, and after each one say what it shows. Then name the strongest line against you and answer it."
                            : "Say who did it. Quote the words from the case that prove it, and say what rules each of the others out."}
                        </p>
                      </div>
                    </Step>
                  <Actions>
                    <CopyButton
                      text={mode === "debate" ? debatePrompt(myCase) : mysteryPrompt(myCase)}
                      label={mode === "debate" ? "Copy debate prompt" : "Copy mystery prompt"}
                    />
                    <Prompt text={mode === "debate" ? debatePrompt(myCase) : mysteryPrompt(myCase)} />
                    <a
                      href={`/science-of-reading/resources/print?tab=my&g=${myGrade}&c=${ci}${mode === "debate" ? "&m=db" : ""}`}
                      style={pill(false)}
                    >
                      🖨 Workbook
                    </a>
                  {mode === "debate" && dbt ? (
                  <Answers label="🔑 Teacher notes">
                    <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 2px", textWrap: "pretty" }}>
                      There is no answer to this one.
                    </p>
                    <p style={{ fontSize: 15, color: BRAND.mid, margin: 0, textWrap: "pretty" }}>
                      Any of the three below can be argued from the text. What is being marked is
                      the evidence and the reasoning, not the name.
                    </p>
                    {dbt.arguments.map((a, i) => (
                      <div key={i} style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BRAND.line}` }}>
                        <p style={{ fontFamily: POPPINS, fontSize: 15, fontWeight: 800, margin: "0 0 7px", textWrap: "pretty" }}>
                          {dbt.suspects[a.who]?.who}
                        </p>
                        {a.evidence.map((q, j) => (
                          <Keyed key={j} marker="•" color={ACCENT.my}>
                            {q}
                          </Keyed>
                        ))}
                        {a.against && (
                          <Keyed marker="×" color={BRAND.coralDark}>
                            <span style={{ color: BRAND.mid }}>Has to answer: </span>
                            {a.against}
                          </Keyed>
                        )}
                      </div>
                    ))}
                    {dbt.clears.length > 0 && (
                      <>
                        <KeyLabel color={BRAND.coralDark}>
                          {`Really is ruled out · ${dbt.clears.length}`}
                        </KeyLabel>
                        {dbt.clears.map((q, i) => (
                          <Keyed key={i} marker="×" color={BRAND.coralDark}>
                            {q}
                          </Keyed>
                        ))}
                      </>
                    )}
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
                      {dbt.note}
                    </p>
                  </Answers>
                  ) : (
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
                  )}
                  </Actions>
                  </div>
                </div>
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
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: `1px solid ${BRAND.line}`,
                      borderRadius: 20,
                      overflow: "hidden",
                      margin: "0 0 18px",
                    }}
                  >
                    <ArticleCover
                      standard={art.standard}
                      grade={`Grade ${art.grade}`}
                      title={art.title}
                      lexile={v.lexile}
                      words={v.words}
                    />
                    <div style={{ padding: "26px 24px 24px" }}>
                      {/* The two Lexiles were a pair of small pills under the
                          title, which is where a teacher looks last. Picking
                          the level is the whole reason both versions exist,
                          so it is labelled and it comes first. */}
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          flexWrap: "wrap",
                          background: BRAND.paper,
                          border: `1px solid ${BRAND.line}`,
                          borderRadius: 100,
                          padding: "8px 8px 8px 16px",
                          margin: "0 0 26px",
                          width: "fit-content",
                        }}
                      >
                        <span style={{ ...label, margin: 0 }}>Reading level</span>
                        <span style={{ display: "inline-flex", gap: 6 }}>
                          <a href={href({ v: "lo" })} style={pill(ver === "lower")}>Lower</a>
                          <a href={href({ v: "hi" })} style={pill(ver === "higher")}>Higher</a>
                        </span>
                      </div>

                      {/* Every article has carried standard_text since the
                          store was built -- the wording of the standard, what
                          it spirals to, and the lower Lexile band -- and the
                          page has never once shown it. Closed by default,
                          because a class reading the article does not need
                          the standard on screen and the teacher planning
                          from it does. */}
                      {art.standard_text && (
                        <details style={{ margin: "-14px 0 24px" }}>
                          <summary
                            style={{
                              ...pill(false),
                              listStyle: "none",
                              border: `1.5px solid ${BRAND.line}`,
                              color: BRAND.mid,
                            }}
                          >
                            {`What ${art.standard} asks`}
                          </summary>
                          <p
                            style={{
                              whiteSpace: "pre-line",
                              fontSize: 15,
                              lineHeight: 1.65,
                              color: BRAND.mid,
                              background: BRAND.paper,
                              border: `1px solid ${BRAND.line}`,
                              borderRadius: 14,
                              padding: "14px 18px",
                              margin: "10px 0 0",
                              maxWidth: "66ch",
                              textWrap: "pretty",
                            }}
                          >
                            {art.standard_text}
                          </p>
                        </details>
                      )}

                      <Step
                        n={1}
                        heading="Read the article"
                        hint={`${v.paras.length} paragraphs, lettered ${v.paras[0]?.label} to ${v.paras[v.paras.length - 1]?.label}. The letters are how you point at your evidence.`}
                        accent={ACCENT.ar}
                      >
                        {v.paras.map((p) => (
                          <Para key={p.label} letter={p.label} text={p.text} accent={ACCENT.ar} />
                        ))}
                      </Step>

                      <Step
                        n={2}
                        heading="Answer five questions"
                        hint="Each one says which kind of thinking it asks for."
                        accent={ACCENT.ar}
                      >
                        <ul style={{ display: "grid", gap: 10, margin: 0, padding: 0 }}>
                          {art.questions.map((q) => (
                            <Question key={q.n} n={q.n} kind={q.kind} q={q.q} accent={ACCENT.ar} />
                          ))}
                        </ul>
                      </Step>

                      <Step n={3} heading="Then write" accent={ACCENT.ar}>
                        <Ask accent={ACCENT.ar}>
                          What is the most important idea in this article, and how do you know?
                        </Ask>
                        <div
                          style={{
                            background: BRAND.paper,
                            border: `1px solid ${BRAND.line}`,
                            borderRadius: 16,
                            padding: "14px 18px",
                            marginTop: 12,
                          }}
                        >
                          <p style={{ ...label, color: ACCENT.ar, margin: "0 0 6px" }}>How to answer</p>
                          <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, textWrap: "pretty" }}>
                            Name the paragraph letter for every piece of evidence you use.
                          </p>
                        </div>
                      </Step>
                    <Actions>
                      <CopyButton text={articlePrompt(art, ver)} label="Copy article prompt" />
                      <Prompt text={articlePrompt(art, ver)} />
                      <a href={href({}).replace("/resources?", "/resources/print?")} style={pill(false)}>
                        🖨 Workbook
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
                    </div>
                  </div>
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
