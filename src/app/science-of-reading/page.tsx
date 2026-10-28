import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import { SKILL_TOTAL } from "@/app/reading/lessons-data";
import { OG_CONCEPTS } from "@/app/reading/og-packs-data";

/**
 * The way into the reading programme.
 *
 * Basic Reading and the OG packs are no longer in the top menu: they hang off
 * this page instead, so the toolbar names one reading destination rather than
 * three. Each is still a real page with its own URL — hidden from the menu,
 * not from the site.
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

const CREAM = "#FAF7F2";
const INK = "#24303D";
const MUTED = "#6B7480";
const RULE = "#E4DED4";
const BRASS = "#B08A2E";
const TEAL = "#2F7A8C";
const NAVY = "#2C4F74";
const GREEN = "#4E7A44";

const BUILDER = "/api/materials/science-of-reading/lesson-builder.html";

function Hub() {
  return (
    <div style={{ background: CREAM, color: INK, minHeight: "100vh", padding: "36px 20px 80px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ borderBottom: `3px solid ${RULE}`, paddingBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: BRASS }}>
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
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: TEAL }}>
            BUILD A LESSON
          </div>
          <div style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.15, marginTop: 6 }}>
            Lesson builder
          </div>
          <p style={{ fontSize: 15, fontWeight: 500, color: MUTED, margin: "8px 0 0", maxWidth: "68ch", lineHeight: 1.55 }}>
            Pick a skill and filter by grade, student, word length or lesson step. It writes the
            lesson for you — the rule, three differentiated word lists, and the steps with their
            timings — then prints the workbook, the key, spelling lists, spiral review, the
            five-lesson check or the word games.
          </p>
        </a>

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
              accent: NAVY,
              blurb: `All ${SKILL_TOTAL} skills in the scope and sequence, in teaching order, each with its workbook and answer key.`,
            },
            {
              href: "/og-packs",
              eyebrow: "REVIEW A CONCEPT",
              title: "OG concept packs",
              accent: GREEN,
              blurb: `${OG_CONCEPTS.length} packs, each taking one concept across the whole family of skills it covers.`,
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
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: card.accent }}>
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
          The lesson builder opens in a new tab.
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
          <Hub />
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
