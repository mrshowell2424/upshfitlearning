"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import { useAuth } from "@/providers/AuthProvider";
import {
  DESIGN_GRADES,
  DESIGN_WEEK_TOTAL,
  PHASES,
  type DesignGrade,
  type GradeYear,
} from "./constants";

/**
 * Design Thinking: a design challenge for every week of the year,
 * in every grade from K to 12.
 *
 * The weeks are fetched from /api/design-thinking/year rather than imported,
 * so a signed-out visitor receives no week titles, no driving questions and no
 * material links — not even in the page source. Importing them would have put
 * all 468 into the client bundle regardless of what this rendered.
 *
 * The three things a teacher actually opens — the teacher slides, the student
 * workbook and the answer key — are canvas pages stored under design-thinking/
 * in the materials table and served through /api/materials, which refuses
 * anyone without an account. Each takes ?week= and &grade=, so one template
 * renders any of the 468 weeks.
 *
 * Grade lives in the URL rather than in state alone, so a teacher can bookmark
 * their own grade and send it to a colleague.
 */

/** The canvas's own palette. */
const CREAM = "#FBF7F0";
const INK = "#211E33";
const PLUM = "#7A2E6E";
const CORAL = "#F26D5B";
const MUTED = "#54506B";
const FAINT = "#8B8699";
const RULE = "#E6DFD3";

const MATERIALS = "/api/materials/design-thinking";

function DesignThinkingRoadMap() {
  const { session } = useAuth();
  const [grade, setGrade] = useState<DesignGrade>("3");
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const [year, setYear] = useState<GradeYear | null>(null);
  const [failed, setFailed] = useState(false);

  // Grade comes off the URL on arrival so a bookmarked grade opens on it.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("grade");
    const match = DESIGN_GRADES.find((g) => g === fromUrl);
    if (match) setGrade(match);
  }, []);

  const pickGrade = (g: DesignGrade) => {
    setGrade(g);
    setOpenWeek(null);
    const url = new URL(window.location.href);
    url.searchParams.set("grade", g);
    window.history.replaceState(null, "", url);
  };

  /**
   * Trade the token for the cookie that opens materials, then fetch the year.
   *
   * The cookie exists because a material is opened by clicking a link, and a
   * link carries cookies rather than an Authorization header — see
   * lib/auth/materials-pass.ts. Unlocking first means the week links work the
   * moment they appear.
   */
  useEffect(() => {
    const token = session?.access_token;
    if (!token) {
      setYear(null);
      return;
    }
    let live = true;
    setFailed(false);
    (async () => {
      await fetch("/api/materials/unlock", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      }).catch(() => {
        /* the links will 401 and a reload fixes it */
      });
      try {
        const res = await fetch(`/api/design-thinking/year?grade=${grade}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (live) setYear(data);
      } catch {
        if (live) setFailed(true);
      }
    })();
    return () => {
      live = false;
    };
  }, [session?.access_token, grade]);

  // Nine weeks to a quarter, walked in teaching order.
  const quarters = useMemo(
    () =>
      (year?.quarters ?? []).map((q, i) => ({
        ...q,
        weeks: (year?.weeks ?? []).slice(i * 9, i * 9 + 9),
      })),
    [year]
  );

  const gradeLabel = grade === "K" ? "Kindergarten" : `Grade ${grade}`;
  const link = (kind: string, week: number) =>
    `${MATERIALS}/${kind}?week=${week}&grade=${grade}`;

  return (
    <div style={{ background: CREAM, color: INK, minHeight: "100vh", padding: "36px 20px 80px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Masthead */}
        <div style={{ borderBottom: `1px solid ${RULE}`, paddingBottom: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: PLUM }}>
            MORNING MEETING
          </div>
          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 54px)",
              lineHeight: 1.04,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              margin: "14px 0 0",
              maxWidth: "18ch",
            }}
          >
            A design challenge every week of the year.
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: MUTED,
              maxWidth: "62ch",
              margin: "18px 0 0",
              textWrap: "pretty",
            }}
          >
            Thirty-six weeks. Five days each — empathize Monday, define Tuesday, ideate
            Wednesday, prototype Thursday, test Friday. Five to ten minutes a day. Pick your
            grade, find the week, print what you need.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 28, margin: "26px 0 0" }}>
            {([
              ["36", "WEEKS A YEAR"],
              ["180", "DAILY ACTIVITIES"],
              ["5–10", "MINUTES A DAY"],
              ["K–12", "GRADE SPAN"],
            ] as const).map(([n, label]) => (
              <div key={label}>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>{n}</div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: FAINT }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade */}
        <div style={{ marginTop: 30 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: FAINT, marginBottom: 10 }}>
            GRADE
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DESIGN_GRADES.map((g) => {
              const on = g === grade;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => pickGrade(g)}
                  aria-pressed={on}
                  aria-label={g === "K" ? "Kindergarten" : `Grade ${g}`}
                  className="cursor-pointer transition-colors"
                  style={{
                    fontFamily: "inherit",
                    minWidth: 44,
                    minHeight: 44,
                    padding: "0 14px",
                    borderRadius: 5,
                    fontSize: 15,
                    fontWeight: 600,
                    background: on ? INK : "#FFFFFF",
                    color: on ? CREAM : INK,
                    border: `1px solid ${on ? INK : RULE}`,
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* What a day letter means, said once rather than on every row. */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            alignItems: "center",
            margin: "22px 0 0",
            padding: "14px 18px",
            background: "#FFFFFF",
            border: `1px solid ${RULE}`,
            borderLeft: `5px solid ${CORAL}`,
            borderRadius: 4,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: CORAL }}>
            {gradeLabel.toUpperCase()} · ALL 36 WEEKS BUILT
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {PHASES.map((p, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: MUTED }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    background: p.color,
                  }}
                >
                  {p.letter}
                </span>
                {p.phase}
              </span>
            ))}
          </div>
        </div>

        {/* A signed-in teacher waiting on the fetch, or one whose fetch failed.
            Signed out there is nothing to say here — the gate is already
            saying it, and the weeks were never sent. */}
        {session && !year && !failed && (
          <div style={{ marginTop: 40, fontSize: 15, color: MUTED }}>Loading the year…</div>
        )}
        {session && failed && (
          <div
            style={{
              marginTop: 40,
              padding: "22px 24px",
              background: "#FFFFFF",
              border: `1px solid ${RULE}`,
              borderLeft: `5px solid ${CORAL}`,
              borderRadius: 4,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600 }}>The year would not load.</div>
            <div style={{ fontSize: 14, color: MUTED, marginTop: 6 }}>
              Reload the page. If it keeps happening, your session may have expired — sign in
              again.
            </div>
          </div>
        )}

        {/* The year */}
        {quarters.map((q) => (
          <div key={q.name} style={{ marginTop: 46 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "baseline",
                paddingBottom: 12,
                borderBottom: `2px solid ${INK}`,
              }}
            >
              <h2 style={{ fontSize: 27, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
                {q.name}
              </h2>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: FAINT }}>
                {q.meta}
              </span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: MUTED, maxWidth: "70ch", margin: "12px 0 0" }}>
              {q.blurb}
            </p>

            <div style={{ marginTop: 16, border: `1px solid ${RULE}`, borderRadius: 6, overflow: "hidden" }}>
              {q.weeks.map((w, i) => {
                const open = openWeek === w.n;
                return (
                  <div
                    key={w.n}
                    style={{
                      background: "#FFFFFF",
                      borderTop: i === 0 ? "none" : `1px solid ${RULE}`,
                    }}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", padding: "14px 18px" }}>
                      <div style={{ flex: "0 0 46px", fontSize: 22, fontWeight: 700, color: FAINT, letterSpacing: "-0.02em" }}>
                        {w.n}
                      </div>
                      <div style={{ flex: "1 1 260px", minWidth: 0 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: PLUM }}>
                          {w.tag}
                        </div>
                        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", marginTop: 3 }}>
                          {w.title}
                        </div>
                      </div>

                      {/* One square per day, straight to that day's slide. */}
                      <div style={{ display: "flex", gap: 5 }}>
                        {PHASES.map((p, di) => (
                          <a
                            key={di}
                            href={`${link("Teacher Slides.dc.html", w.n)}#${di + 2}`}
                            target="_blank"
                            rel="noopener"
                            title={`${p.day} — ${p.phase}`}
                            style={{
                              width: 24,
                              height: 24,
                              display: "grid",
                              placeItems: "center",
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 800,
                              color: "#FFFFFF",
                              textDecoration: "none",
                              background: p.color,
                            }}
                          >
                            {p.letter}
                          </a>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setOpenWeek(open ? null : w.n)}
                        aria-expanded={open}
                        className="cursor-pointer transition-colors"
                        style={{
                          fontFamily: "inherit",
                          minHeight: 34,
                          padding: "0 13px",
                          borderRadius: 4,
                          fontSize: 13,
                          fontWeight: 600,
                          background: open ? INK : "#FFFFFF",
                          color: open ? CREAM : INK,
                          border: `1px solid ${open ? INK : RULE}`,
                        }}
                      >
                        {open ? "Hide" : "Open"}
                      </button>
                    </div>

                    {open && (
                      <div style={{ padding: "0 18px 18px 78px", background: "#FFFFFF" }}>
                        <div style={{ fontSize: 16, lineHeight: 1.5, color: INK, maxWidth: "64ch", textWrap: "pretty" }}>
                          {w.hmw}
                        </div>
                        <div style={{ fontSize: 13, color: MUTED, marginTop: 8 }}>
                          <span style={{ fontWeight: 700 }}>Tested on</span> {w.audience}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                          {([
                            ["Teacher slides", "Teacher Slides.dc.html", PLUM, CREAM],
                            ["Student workbook", "Workbook.dc.html", "#2FA39B", "#FFFFFF"],
                            ["Answer key", "Workbook Key.dc.html", "#FFFFFF", INK],
                          ] as const).map(([label, file, bg, fg]) => (
                            <a
                              key={label}
                              href={link(file, w.n)}
                              target="_blank"
                              rel="noopener"
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                padding: "8px 14px",
                                borderRadius: 4,
                                background: bg,
                                color: fg,
                                border: `1px solid ${bg === "#FFFFFF" ? RULE : bg}`,
                                textDecoration: "none",
                              }}
                            >
                              {label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: 44,
            paddingTop: 18,
            borderTop: `1px solid ${RULE}`,
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 24px",
            fontSize: 13,
            color: MUTED,
          }}
        >
          <span>
            {DESIGN_WEEK_TOTAL.toLocaleString()} weeks built across K–12 · 36 a grade
          </span>
          <span>Materials open in a new tab.</span>
        </div>
      </div>
    </div>
  );
}

export default function DesignThinkingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="Design Thinking"
          blurb="A design challenge for every week of the year, K to 12, with teacher slides, a student workbook and an answer key for all 36 weeks. Free — an account is all it takes."
        >
          <DesignThinkingRoadMap />
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
