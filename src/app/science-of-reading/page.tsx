import RESOURCE_COUNTS from "@/../scripts/reading-resources-counts.json";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import { MaterialsPass } from "@/components/shared/MaterialsPass";
import { SKILL_TOTAL } from "@/app/reading/lessons-data";
import { OG_CONCEPTS } from "@/app/reading/og-packs-data";
import ROPE from "@/../scripts/reading-rope.json";
import ARTICLES from "@/../scripts/reading-articles.json";
import SIGHT_WORDS from "@/../scripts/reading-sight-words.json";
import SKILL_SPLITS from "@/../scripts/reading-skill-splits.json";
import THREADS from "@/../scripts/reading-threads.json";
import SENTENCE_LAB from "@/../scripts/reading-sentence-lab.json";

/**
 * The way into the reading programme.
 *
 * Basic Reading and the OG packs are no longer in the top menu: they hang off
 * this page instead, so the toolbar names one reading destination rather than
 * three. Each is still a real page with its own URL — hidden from the menu,
 * not from the site.
 *
 * Each card carries a picture of what it opens. These are screenshots of the
 * real pages, taken by rendering them in a browser — a teacher deciding
 * between three links should be able to see a workbook page and a concept
 * pack rather than infer them from a sentence.
 *
 * The lesson builder is the canvas export, served through /api/materials like
 * the workbooks. It is a self-contained application — pick a skill, filter,
 * and print the lesson, workbook, key, spelling lists or games — so it opens
 * in its own tab rather than being rebuilt here.
 */
export const metadata = {
  title: "Science of Reading — Upshift Learning",
  description:
    "Build a lesson from any skill, open the Basic Reading workbooks, or review an OG concept pack.",
};

/**
 * Brand colours, straight from the Tailwind theme.
 *
 * The road maps had grown their own palette — a warm cream, a slate ink and
 * a brass eyebrow that appear nowhere else on the site. These are the tokens
 * in tailwind.config.ts, so the road maps now look like the rest of Upshift.
 *
 * Each accent is a pair: the brand hue for the 10px card edge, where it is a
 * block of colour, and a darker relative of it for the small bold text, where
 * the brand hue alone does not carry enough contrast against white.
 */
const PAGE = "#FAFAFA";
const INK = "#111111";
const MUTED = "#6A6A6A";
const RULE = "#E9E9E9";
const CORAL = "#FF6A5B";
const CORAL_TEXT = "#C0432F";
const TEAL = "#00B4A6";
const TEAL_TEXT = "#00756C";
const BLUE = "#4C9AFF";
const BLUE_TEXT = "#2F6FD0";
const LAVENDER = "#B87DFF";
const LAVENDER_TEXT = "#6B2FB5";

const BUILDER = "/api/materials/science-of-reading/lesson-builder.html";
const RESOURCES = "/science-of-reading/resources";
// Both run on the article store, so they belong in this hub rather than in
// the top nav: a teacher reaches them from reading, not from the menu bar.
const FLUENCY = "/fluency";
const VOCABULARY = "/vocabulary";
// The two strand pages. Both are views of the article store rather than new
// text, which is why they live beside the resources rather than under them.
const THREADS_PAGE = "/science-of-reading/threads";
const SENTENCE_LAB_PAGE = "/sentence-lab";
// Counted from the data the page is generated from, so the blurb cannot
// drift away from what is actually on it.
const MYSTERY_COUNT = RESOURCE_COUNTS.mysteries;
const ARTICLE_COUNT = RESOURCE_COUNTS.articles;

/**
 * How many of each thing a strand can claim.
 *
 * Counted from the content rather than written into the rope file, so a
 * strand cannot say it has fifty articles when it has none. The feature count
 * is the articles that take a text feature as their subject -- the glossary,
 * the heading, the caption -- which is what literacy knowledge actually means
 * on this site.
 */
const FEATURE_STANDARDS = [
  "RI.K.5", "RI.K.6", "RI.K.7",
  "RI.1.5", "RI.1.6", "RI.1.7",
  "RI.2.5", "RI.2.7",
  "RI.6.5", "RI.6.7",
];
const STRAND_COUNTS: Record<string, number> = {
  mysteries: MYSTERY_COUNT,
  threads: THREADS.threads.length,
  // Articles that actually yield a pair, not all 350 -- a count a teacher
  // can click through to and find empty is worse than no count.
  sentence: SENTENCE_LAB.items.filter((i) => i.combine.length || i.expand.length).length,
  words: ARTICLES.articles.reduce((n, a) => {
    const v = a.questions.find((q) => q.kind === "vocabulary");
    return n + (v ? String(v.q).split("\n").filter((x) => x.includes(":")).length : 0);
  }, 0),
  feature: ARTICLES.articles.filter((a) => FEATURE_STANDARDS.includes(a.standard)).length,
  splits: Object.keys(SKILL_SPLITS).length,
  packs: OG_CONCEPTS.length,
  sightLists: (SIGHT_WORDS.lists ?? []).length,
};

/**
 * The rope, as the way into the page.
 *
 * The hub used to be organised by artefact -- workbooks, resources, packs --
 * which is how the material was made rather than how a teacher thinks about
 * reading. A teacher could not look at it and answer "what do I have for
 * verbal reasoning", and the answer was 216 mysteries.
 *
 * Organised by strand, two things happen at once. Material that was already
 * here gets named in the words a teacher uses, so the mysteries stop being
 * invisible. And the two strands with nothing behind them -- background
 * knowledge and language structure -- show up as holes instead of staying
 * theoretical. A gap that is written down is a gap somebody can fill, so the
 * empty strands say so rather than being quietly left out.
 */
function Rope() {
  return (
    <section style={{ marginTop: 34 }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: LAVENDER_TEXT }}>
        THE EIGHT STRANDS
      </div>
      <h2 style={{ margin: "6px 0 0", fontSize: 27, fontWeight: 800, lineHeight: 1.15 }}>
        What we have for each part of reading
      </h2>
      <p style={{ margin: "8px 0 0", fontSize: 15, fontWeight: 500, color: MUTED, maxWidth: "66ch", lineHeight: 1.55 }}>
        {ROPE.intro}
      </p>

      {ROPE.halves.map((half) => (
        <div key={half.key} style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              flexWrap: "wrap",
              borderBottom: `3px solid ${RULE}`,
              paddingBottom: 8,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: half.ink }}>
              {half.name}
            </h3>
            <span style={{ fontSize: 14, fontWeight: 500, color: MUTED }}>
              {half.becomes}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
              marginTop: 12,
            }}
          >
            {ROPE.strands
              .filter((st) => st.half === half.key)
              .map((st) => {
                const empty = st.have.length === 0;
                return (
                  <div
                    key={st.key}
                    style={{
                      background: "#FFFFFF",
                      border: `2px solid ${RULE}`,
                      borderLeft: `8px solid ${empty ? RULE : half.ink}`,
                      borderRadius: 14,
                      padding: "16px 18px",
                    }}
                  >
                    <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.2 }}>
                      {st.name}
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: MUTED,
                        margin: "6px 0 10px",
                        lineHeight: 1.5,
                      }}
                    >
                      {st.what}
                    </p>

                    {st.have.map((h) => (
                      <Link
                        key={h.href}
                        href={h.href}
                        style={{
                          display: "block",
                          background: half.tint,
                          borderRadius: 10,
                          padding: "10px 12px",
                          marginBottom: 8,
                          textDecoration: "none",
                          color: INK,
                        }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 800 }}>
                          {h.count && STRAND_COUNTS[h.count] !== undefined
                            ? `${h.label} · ${STRAND_COUNTS[h.count]}`
                            : h.label}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: MUTED, lineHeight: 1.45 }}>
                          {h.blurb}
                        </div>
                      </Link>
                    ))}

                    {st.gap && (
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: empty ? CORAL_TEXT : MUTED,
                          margin: 0,
                          lineHeight: 1.5,
                          fontStyle: empty ? "normal" : "italic",
                        }}
                      >
                        {empty ? <b>Nothing here yet. </b> : null}
                        {st.gap}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {/* Fluency sits between the halves rather than beside them, because that
          is where it sits in the rope: the two strands weaving. */}
      <Link
        href={ROPE.bridge.href}
        style={{
          display: "block",
          marginTop: 20,
          background: "#FFFFFF",
          border: `2px solid ${RULE}`,
          borderLeft: `8px solid ${TEAL}`,
          borderRadius: 14,
          padding: "16px 18px",
          textDecoration: "none",
          color: INK,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: TEAL_TEXT }}>
          WHERE THE TWO HALVES MEET
        </div>
        <div style={{ fontSize: 19, fontWeight: 800, marginTop: 4 }}>
          {`${ROPE.bridge.name} · ${ARTICLE_COUNT * 2} passages`}
        </div>
        <p style={{ fontSize: 14, fontWeight: 500, color: MUTED, margin: "6px 0 0", lineHeight: 1.5, maxWidth: "70ch" }}>
          {ROPE.bridge.what}
        </p>
      </Link>

      <p style={{ fontSize: 12, fontWeight: 500, color: MUTED, margin: "14px 0 0" }}>
        {ROPE.source}
      </p>
    </section>
  );
}

function Hub() {
  return (
    <div style={{ background: PAGE, color: INK, minHeight: "100vh", padding: "36px 20px 80px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ borderBottom: `3px solid ${RULE}`, paddingBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: CORAL_TEXT }}>
            INTERVENTION · STRUCTURED LITERACY
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: 40, fontWeight: 800, lineHeight: 1.08 }}>
            Science of Reading
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 17, fontWeight: 500, color: MUTED, maxWidth: "62ch", lineHeight: 1.55 }}>
            Your resources sorted by skill, from sounds to meaning.
          </p>
        </div>

        {/* The builder first — it is the thing a teacher opens on a Monday. */}
        <a
          href={BUILDER}
          target="_blank"
          rel="noopener"
          style={{
            display: "block",
            marginTop: 26,
            background: "#FFFFFF",
            border: `3px solid ${RULE}`,
            borderLeft: `10px solid ${TEAL}`,
            borderRadius: 16,
            padding: "24px 26px",
            textDecoration: "none",
            color: INK,
          }}
        >
          {/* auto-fit rather than a breakpoint: the preview sits beside the
              words on a laptop and drops below them on a phone, with no media
              query to keep in step with the column width. */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 22,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: TEAL_TEXT }}>
                BUILD A LESSON
              </div>
              <div style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.15, marginTop: 6 }}>
                Lesson builder
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, color: MUTED, margin: "8px 0 0", lineHeight: 1.55 }}>
                Pick a skill and filter by grade, student, word length or lesson step. It writes
                the lesson for you — the rule, three differentiated word lists, and the steps with
                their timings — then prints the workbook, the key, spelling lists, spiral review,
                the five-lesson check or the word games.
              </p>
            </div>
            <Image
              src="/previews/lesson-builder.png"
              alt="The builder with Silent e chosen: filter rows, print buttons, the rule, and easier, on-level and harder word lists."
              width={1200}
              height={618}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 10,
                border: `2px solid ${RULE}`,
              }}
            />
          </div>
        </a>

        <Rope />

        <div style={{ marginTop: 34 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: CORAL_TEXT }}>
            THE MATERIALS THEMSELVES
          </div>
          <h2 style={{ margin: "6px 0 0", fontSize: 27, fontWeight: 800, lineHeight: 1.15 }}>
            Open one
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 14,
            marginTop: 14,
          }}
        >
          {[
            {
              href: "/reading",
              eyebrow: "PRINT AND TEACH",
              title: "Basic Reading workbooks",
              accent: BLUE,
              accentText: BLUE_TEXT,
              blurb: `All ${SKILL_TOTAL} skills in the scope and sequence, in teaching order, each with its workbook and answer key.`,
              preview: "/previews/workbook.png",
              shape: [751, 1000] as const,
              // Opens on the rule itself, then the READ THE WORDS heading and
              // the word columns with their pattern labels. 29–31% cuts the
              // rule banner into a sliver that reads as a mistake, so this
              // clears it in one step and shows the whole sentence.
              focus: "27%",
              alt: "A workbook page: the rule for short i, three columns of words to read, silly words, and spaces for spelling and dictation.",
            },
            {
              href: RESOURCES,
              eyebrow: "READ AND RESPOND",
              title: "Reading resources",
              accent: CORAL,
              accentText: CORAL_TEXT,
              blurb: `${MYSTERY_COUNT} mysteries and ${ARTICLE_COUNT} science and social studies articles, each with questions, a written response and an AI prompt that carries the whole text.`,
              preview: "/previews/reading-resources.png",
              shape: [1200, 1130] as const,
              // Opens on the masthead and the first case, which is what the
              // page is: pick a text, read it, answer, write.
              focus: "0%",
              alt: "The reading resources page: tabs for mysteries and articles, a case picker, and a mystery with its question and suspects.",
            },
            {
              href: FLUENCY,
              eyebrow: "TIME A READ",
              title: "Fluency",
              accent: TEAL,
              accentText: TEAL_TEXT,
              blurb: `A one-minute read on any of the ${ARTICLE_COUNT * 2} passages, with words correct per minute, accuracy and how it sounded.`,
              preview: "/previews/fluency.png",
              shape: [1200, 1130] as const,
              // Opens on the timer and the two boxes, which is the whole tool.
              focus: "0%",
              alt: "The fluency page: a one-minute timer, boxes for words read and errors, and the words correct per minute it works out.",
            },
            {
              href: VOCABULARY,
              eyebrow: "TEACH A WORD",
              title: "Teach a Word",
              accent: LAVENDER,
              accentText: LAVENDER_TEXT,
              blurb: `Say it, use it, write it, in about ten minutes, on every word the ${ARTICLE_COUNT} articles already define.`,
              preview: "/previews/teach-a-word.png",
              shape: [1200, 1130] as const,
              // Opens on the word itself and the first phase of the script.
              focus: "0%",
              alt: "The Teach a Word page: one word with its meaning, then the three phases of the routine with the script filled in.",
            },
            {
              href: THREADS_PAGE,
              eyebrow: "BUILD THE BACKGROUND",
              title: "Knowledge Threads",
              accent: TEAL,
              accentText: TEAL_TEXT,
              blurb: `The same ${ARTICLE_COUNT} articles in ${THREADS.threads.length} topic threads running K through 6, so you can see what a class already met about water before they read about a glacier.`,
              preview: "/previews/threads.png",
              shape: [1200, 1130] as const,
              // Opens on the board of threads, which is the thing to look at:
              // a teacher reads the topics and the grade bars, not the prose.
              focus: "0%",
              alt: "The Knowledge Threads page: thirteen topic cards, each with a count and a bar per grade, and one thread opened underneath.",
            },
            {
              href: SENTENCE_LAB_PAGE,
              eyebrow: "BUILD A SENTENCE",
              title: "Sentence Lab",
              accent: BLUE,
              accentText: BLUE_TEXT,
              blurb: `Combine, expand, because/but/so — nine minutes on ${STRAND_COUNTS.sentence} of the articles, with the answer key taken from the article's own harder version.`,
              preview: "/previews/sentence-lab.png",
              shape: [1200, 1130] as const,
              // Opens on the three routines and their minutes, which is the
              // whole lesson before a single sentence is picked.
              focus: "0%",
              alt: "The Sentence Lab page: three routine cards with their timings, a grade picker, and a combining exercise with its numbered sentences.",
            },
            {
              href: "/og-packs",
              eyebrow: "REVIEW A CONCEPT",
              title: "OG concept packs",
              accent: LAVENDER,
              accentText: LAVENDER_TEXT,
              blurb: `${OG_CONCEPTS.length} packs, each taking one concept across the whole family of skills it covers.`,
              preview: "/previews/og-pack.png",
              shape: [774, 1000] as const,
              // The roadmap reads from its title down, so start at the top.
              focus: "0%",
              alt: "A concept pack roadmap for the digraphs sh, ch, th and wh: six numbered boxes from Warm up to Teach it, with a week plan.",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              style={{
                display: "block",
                background: "#FFFFFF",
                border: `3px solid ${RULE}`,
                borderLeft: `10px solid ${card.accent}`,
                borderRadius: 16,
                padding: "20px 22px",
                textDecoration: "none",
                color: INK,
              }}
            >
              {/* A band off the top of the page rather than the whole sheet —
                  shrunk to fit, a printable page is unreadable and tells a
                  teacher nothing. Cropped, the masthead and first exercise
                  stay legible. */}
              {/* A ratio, not a fixed height. With object-fit the slice of the
                  page on show is windowHeight ÷ (cardWidth ÷ pageAspect), so a
                  fixed height means a narrow card reveals more of the page
                  than a wide one — on a phone that dragged the rule banner
                  back into frame. Tying height to width keeps that fraction
                  constant, and `focus` then means the same thing everywhere. */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "20 / 7",
                  overflow: "hidden",
                  borderRadius: 10,
                  border: `2px solid ${RULE}`,
                  marginBottom: 14,
                }}
              >
                {/* cover with a percentage rather than a pixel offset, so the
                    band stays put as the card changes width. */}
                <Image
                  src={card.preview}
                  alt={card.alt}
                  width={card.shape[0]}
                  height={card.shape[1]}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "cover",
                    objectPosition: `center ${card.focus}`,
                  }}
                />
                {/* The page is taller than the window, so the crop lands
                    wherever it lands — often mid-sentence. Fading the last
                    stretch into the card makes that a deliberate edge rather
                    than a picture that looks badly cut. */}
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
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: card.accentText }}>
                {card.eyebrow}
              </div>
              <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.2, marginTop: 5 }}>
                {card.title}
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, color: MUTED, margin: "7px 0 0", lineHeight: 1.5 }}>
                {card.blurb}
              </p>
            </Link>
          ))}
        </div>

        {/* The scope and sequence is the map behind the three cards above —
            a reference a teacher checks now and then, not a place they work,
            so it is a line rather than a fourth card.

            /preview, not the /edit link it was sent as: this page is open to
            every signed-in teacher, and an edit link hands the deck itself to
            anyone who already has edit rights on it. */}
        <a
          href="https://docs.google.com/presentation/d/1Pog54goUa9qgtQ4Y16vDKBPYM428Oi-Bv2ETLcuGdQc/preview"
          target="_blank"
          rel="noopener"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            marginTop: 14,
            background: "#FFFFFF",
            border: `3px solid ${RULE}`,
            borderLeft: `10px solid ${CORAL}`,
            borderRadius: 16,
            padding: "16px 22px",
            textDecoration: "none",
            color: INK,
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: CORAL_TEXT }}>
              THE WHOLE MAP
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2, marginTop: 4 }}>
              Basic Reading scope and sequence
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: MUTED, margin: "5px 0 0", lineHeight: 1.5 }}>
              Every skill in teaching order, by level — what comes before a skill and what it sets up.
            </p>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: CORAL_TEXT, whiteSpace: "nowrap" }}>
            Open ↗
          </span>
        </a>

        <div
          style={{
            marginTop: 40,
            paddingTop: 18,
            borderTop: `3px solid ${RULE}`,
            fontSize: 13,
            fontWeight: 500,
            color: MUTED,
          }}
        >
          The lesson builder and the scope and sequence open in a new tab.
        </div>
      </div>
    </div>
  );
}

export default function ScienceOfReadingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="Science of Reading"
          blurb="Build a lesson from any skill, open the Basic Reading workbooks, or review an OG concept pack. Free — an account is all it takes."
        >
          {/* The builder is a link into /api/materials, so the pass has to be
              traded before it is clicked. */}
          <MaterialsPass />
          <Hub />
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
