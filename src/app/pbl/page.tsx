import Image from "next/image";
import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import { MaterialsPass } from "@/components/shared/MaterialsPass";
import { DESIGN_WEEK_TOTAL } from "@/app/design-thinking/constants";

/**
 * The way into project work, built to match /math and /science-of-reading.
 *
 * Two destinations rather than one, because Design Thinking belongs here: a
 * design challenge is a project, and a teacher looking for project work
 * should not have to know which of two tabs we filed it under. The nav says
 * PBL and this page holds both.
 *
 * Same cream, same rule, same cards as the other two road maps, with indigo
 * where reading uses teal and maths uses green. Design Thinking keeps the
 * plum of its own canvas, so the two cards read as two different things
 * rather than one list.
 *
 * The hub is a self-contained export served through /api/materials like the
 * workbooks, so it opens in its own tab. Design Thinking is a page of this
 * app, so it does not.
 */
export const metadata = {
  title: "PBL — Upshift Learning",
  description:
    "Project-based learning and design thinking: plan a project, or run a design challenge every week of the year.",
};

const CREAM = "#FAF7F2";
const INK = "#24303D";
const MUTED = "#6B7480";
const RULE = "#E4DED4";
const BRASS = "#B08A2E";
const INDIGO = "#3E5FB0";
const PLUM = "#7A2E6E";

const HUB = "/api/materials/pbl/pbl-hub.html";

/** The cycle the hub runs a project through, in order. */
const CYCLE = [
  ["1", "Launch"],
  ["2", "Build knowledge"],
  ["3", "Create"],
  ["4", "Share"],
  ["5", "Reflect"],
];

function Hub() {
  return (
    <div style={{ background: CREAM, color: INK, minHeight: "100vh", padding: "36px 20px 80px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ borderBottom: `3px solid ${RULE}`, paddingBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: BRASS }}>
            PROJECT WORK · K&ndash;12
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: 40, fontWeight: 800, lineHeight: 1.08 }}>
            Project-Based Learning
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 17, fontWeight: 500, color: MUTED, maxWidth: "62ch", lineHeight: 1.55 }}>
            Plan a project from a standard, or run a design challenge every week of the year.
          </p>
        </div>

        {/* The hub first — it is the thing a teacher opens to plan. */}
        <a
          href={HUB}
          target="_blank"
          rel="noopener"
          style={{
            display: "block",
            marginTop: 26,
            background: "#FFFFFF",
            border: `3px solid ${RULE}`,
            borderLeft: `10px solid ${INDIGO}`,
            borderRadius: 16,
            padding: "24px 26px",
            textDecoration: "none",
            color: INK,
          }}
        >
          {/* auto-fit rather than a breakpoint, the same as the other road
              maps: the preview sits beside the words on a laptop and drops
              below them on a phone, with no media query to keep in step. */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 22,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: INDIGO }}>
                PLAN A PROJECT
              </div>
              <div style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.15, marginTop: 6 }}>
                Project-Based Learning Hub
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, color: MUTED, margin: "8px 0 0", lineHeight: 1.55 }}>
                Four grade bands, the five-part project cycle, six starter projects you can run this
                week, the seven Gold Standard elements, and a planning checklist that carries a
                project from launch to reflection. Its builder turns any of 87 Grade 2 Ohio
                standards into a project with a driving question and a student product.
              </p>
            </div>
            <Image
              src="/previews/pbl-hub.png"
              alt="The Project-Based Learning Hub: the hero, its section links, and the start of the grade bands."
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

        {/* Design Thinking is a page of this app, not a stored material, so
            this is a Link and it opens in place. */}
        <Link
          href="/design-thinking"
          style={{
            display: "block",
            marginTop: 14,
            background: "#FFFFFF",
            border: `3px solid ${RULE}`,
            borderLeft: `10px solid ${PLUM}`,
            borderRadius: 16,
            padding: "24px 26px",
            textDecoration: "none",
            color: INK,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: PLUM }}>
            A CHALLENGE EVERY WEEK
          </div>
          <div style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.15, marginTop: 6 }}>
            Design Thinking
          </div>
          <p style={{ fontSize: 15, fontWeight: 500, color: MUTED, margin: "8px 0 0", lineHeight: 1.55, maxWidth: "70ch" }}>
            {DESIGN_WEEK_TOTAL} weeks of design challenges — thirty-six for every grade from K to 12.
            Each week has a driving question, someone real to test the work on, and three things to
            print: the teacher slides, the student workbook, and the answer key.
          </p>
        </Link>

        {/* What the hub runs a project through, named in order. These are not
            links: there is one destination above, and five fake doors into it
            would be worse than a list. */}
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
            THE PROJECT CYCLE
          </div>
          <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.2, marginTop: 5 }}>
            Five stages, every project
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: MUTED, margin: "7px 0 14px", lineHeight: 1.5 }}>
            The hub writes each stage for the project you pick, with the checklist that goes with it.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CYCLE.map(([n, label]) => (
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
                <span style={{ color: INDIGO, fontWeight: 800 }}>{n}</span>
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
          The hub opens in a new tab. Design Thinking opens here.
        </div>
      </div>
    </div>
  );
}

export default function PblPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="Project-Based Learning"
          blurb="Plan a project from a standard, or run a design challenge every week of the year. Free — an account is all it takes."
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
