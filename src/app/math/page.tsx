import Image from "next/image";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import { MaterialsPass } from "@/components/shared/MaterialsPass";

/**
 * The way into the maths programme, built to match /science-of-reading.
 *
 * There is one destination here rather than three, so the page is the hub
 * card and the steps it runs. It keeps the reading page's shape — same
 * cream, same rule, same card — with green where reading uses teal, so a
 * teacher can tell the two apart at a glance without learning a new layout.
 *
 * The hub is the exported app, served through /api/materials like the
 * workbooks. It is self-contained — pick a grade and standard, work the
 * steps — so it opens in its own tab rather than being rebuilt here.
 */
export const metadata = {
  title: "Math — Upshift Learning",
  description:
    "Pick a grade and standard, then run the OG maths lesson steps in order.",
};

const CREAM = "#FAF7F2";
const INK = "#24303D";
const MUTED = "#6B7480";
const RULE = "#E4DED4";
const BRASS = "#B08A2E";
const GREEN = "#1F7A5C";

const HUB = "/api/materials/math/math-hub.html";

/** The lesson steps the hub runs, in the order it runs them. */
const STEPS = [
  ["1", "Math review"],
  ["2", "Warm-up"],
  ["3", "Tiles"],
  ["4", "Drills"],
  ["5", "Review"],
  ["6", "New info (CRA)"],
  ["7", "Find the Error"],
  ["8", "Word problem"],
  ["9", "Recap"],
];

function Hub() {
  return (
    <div style={{ background: CREAM, color: INK, minHeight: "100vh", padding: "36px 20px 80px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ borderBottom: `3px solid ${RULE}`, paddingBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: BRASS }}>
            INTERVENTION · STRUCTURED MATH
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: 40, fontWeight: 800, lineHeight: 1.08 }}>
            Math
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 17, fontWeight: 500, color: MUTED, maxWidth: "62ch", lineHeight: 1.55 }}>
            Your resources sorted by standard, from counting to algebra.
          </p>
        </div>

        {/* The hub first — it is the thing a teacher opens on a Monday. */}
        <a
          href={HUB}
          target="_blank"
          rel="noopener"
          style={{
            display: "block",
            marginTop: 26,
            background: "#FFFFFF",
            border: `3px solid ${RULE}`,
            borderLeft: `10px solid ${GREEN}`,
            borderRadius: 16,
            padding: "24px 26px",
            textDecoration: "none",
            color: INK,
          }}
        >
          {/* auto-fit rather than a breakpoint, the same as the reading page:
              the preview sits beside the words on a laptop and drops below
              them on a phone, with no media query to keep in step. */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 22,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: GREEN }}>
                BUILD A LESSON
              </div>
              <div style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.15, marginTop: 6 }}>
                OG Math Hub
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, color: MUTED, margin: "8px 0 0", lineHeight: 1.55 }}>
                305 standards across Kindergarten to Grade 12. Pick a grade and a standard and it
                lays out the lesson — the review, the warm-up, the tile task, the drills, the
                concrete-to-abstract teaching, and the error to find — with the extra resources
                beside the lesson rather than inside it.
              </p>
            </div>
            <Image
              src="/previews/math-hub.png"
              alt="The OG Math Hub with a grade and standard chosen: the filter row, the lesson step chips, and the first lesson cards."
              width={1280}
              height={660}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 10,
                border: `2px solid ${RULE}`,
              }}
            />
          </div>
        </a>

        {/* What the hub runs, named in order. These are not links: there is
            one destination on this page, and nine fake doors into it would
            be worse than a list. */}
        <div
          style={{
            marginTop: 14,
            background: "#FFFFFF",
            border: `3px solid ${RULE}`,
            borderLeft: `10px solid ${BRASS}`,
            borderRadius: 16,
            padding: "20px 22px",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: BRASS }}>
            THE LESSON, IN ORDER
          </div>
          <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.2, marginTop: 5 }}>
            Nine steps, every standard
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: MUTED, margin: "7px 0 14px", lineHeight: 1.5 }}>
            The hub writes each one for the standard you pick. Filter to a single step when you
            only have ten minutes.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {STEPS.map(([n, label]) => (
              <span
                key={n}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 14,
                  fontWeight: 700,
                  border: `1.5px solid ${RULE}`,
                  borderRadius: 999,
                  padding: "6px 14px",
                  background: CREAM,
                }}
              >
                <span style={{ color: GREEN, fontWeight: 800 }}>{n}</span>
                {label}
              </span>
            ))}
          </div>
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
          The hub opens in a new tab.
        </div>
      </div>
    </div>
  );
}

export default function MathPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="Math"
          blurb="Pick a grade and standard, then run the OG maths lesson steps in order. Free — an account is all it takes."
        >
          {/* The hub is a link into /api/materials, so the pass has to be
              traded before it is clicked. */}
          <MaterialsPass />
          <Hub />
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
