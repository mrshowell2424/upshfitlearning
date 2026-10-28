"use client";

import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import { LESSONS } from "@/app/reading/lessons-data";
import { OG_PACK_BY_LESSON } from "@/app/reading/og-pack-map";
import { OG_LEVELS, OG_CONCEPTS, ogPackHref } from "@/app/reading/og-packs-data";

/**
 * The OG concept packs, on their own page.
 *
 * They used to sit under the scope and sequence on /reading, which made that
 * page carry two different things: the week-to-week sequence, and the review
 * material that spans it. Split out, each is reachable on its own from the
 * Science of Reading hub.
 *
 * A pack teaches a family rather than a single skill — the consonants pack
 * carries eighteen of them, silent e seven — so each is listed once with the
 * skills it covers, rather than chipped onto every card it touches.
 */

/** The road map's own palette. */
const CREAM = "#FAF7F2";
const INK = "#24303D";
const MUTED = "#6B7480";
const RULE = "#E4DED4";
const BRASS = "#B08A2E";
const OG_TEAL = "#2F7A8C";

const SKILL_NAME = new Map(LESSONS.map((l) => [l.id, l.skill]));

const PACK_SKILLS = new Map<string, string[]>();
for (const [id, code] of Object.entries(OG_PACK_BY_LESSON)) {
  const name = SKILL_NAME.get(Number(id));
  if (!name) continue;
  const list = PACK_SKILLS.get(code) ?? [];
  list.push(name);
  PACK_SKILLS.set(code, list);
}

const PACK_TOTAL = OG_CONCEPTS.length;

function Packs() {
  return (
    <div style={{ background: CREAM, color: INK, minHeight: "100vh", padding: "36px 20px 80px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ borderBottom: `3px solid ${RULE}`, paddingBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: BRASS }}>
            SCIENCE OF READING · REVIEW
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: 38, fontWeight: 800, lineHeight: 1.1 }}>
            OG concept packs
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 15, fontWeight: 500, color: MUTED, maxWidth: "70ch", lineHeight: 1.55 }}>
            Each pack takes one concept across a whole family of skills — a roadmap, activities,
            Survival Island chests, a decodable, reading lists and an answer key. Open one to
            review a concept rather than a single week.
          </p>
          <p style={{ margin: "12px 0 0", fontSize: 14, fontWeight: 500, color: MUTED }}>
            <Link href="/science-of-reading" style={{ color: OG_TEAL, fontWeight: 700, textDecoration: "none" }}>
              ← Science of Reading
            </Link>
            {"  ·  "}
            <Link href="/reading" style={{ color: OG_TEAL, fontWeight: 700, textDecoration: "none" }}>
              Basic Reading workbooks
            </Link>
          </p>
        </div>

      {OG_LEVELS.map((lvl) => {
          const packs = OG_CONCEPTS.filter((c) => c.level === lvl.level);
          if (packs.length === 0) return null;
          return (
            <div key={lvl.level} style={{ marginTop: 26 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{lvl.title}</h3>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: MUTED }}>
                  {lvl.grades.toUpperCase()} · {packs.length} PACKS
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                {packs.map((c) => {
                  const skills = PACK_SKILLS.get(c.id) ?? [];
                  return (
                    <a
                      key={c.id}
                      href={`/api/materials/${ogPackHref(c.id)}`}
                      target="_blank"
                      rel="noopener"
                      style={{
                        display: "block",
                        background: "#FFFFFF",
                        border: `3px solid ${RULE}`,
                        borderLeft: `8px solid ${OG_TEAL}`,
                        borderRadius: 14,
                        padding: "14px 16px",
                        textDecoration: "none",
                        color: INK,
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: OG_TEAL }}>
                        {c.id}
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.25, marginTop: 3, textWrap: "pretty" }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: MUTED, marginTop: 5 }}>
                        {c.patterns}
                      </div>
                      {skills.length > 0 ? (
                        <div style={{ fontSize: 12, fontWeight: 500, color: MUTED, marginTop: 9, lineHeight: 1.5 }}>
                          <span style={{ fontWeight: 700, color: INK }}>
                            {skills.length} {skills.length === 1 ? "skill" : "skills"}:
                          </span>{" "}
                          {skills.join(" · ")}
                        </div>
                      ) : (
                        // Built, but nothing in this road map teaches it yet.
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#9AA3AD", marginTop: 9 }}>
                          Not in the road map yet
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div
          style={{
            marginTop: 44,
            paddingTop: 18,
            borderTop: `3px solid ${RULE}`,
            fontSize: 13,
            fontWeight: 500,
            color: MUTED,
          }}
        >
          {PACK_TOTAL} packs across {OG_LEVELS.length} levels · Packs open in a new tab.
        </div>
      </div>
    </div>
  );
}

export default function OgPacksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="OG concept packs"
          blurb="Fifty-eight Orton-Gillingham concept packs — roadmap, activities, decodable and answer key for each. Free — an account is all it takes."
        >
          <Packs />
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
