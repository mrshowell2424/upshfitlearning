"use client";

// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import { LESSONS, SECTIONS, SKILL_TOTAL } from "./lessons-data";

/**
 * The lesson materials live under public/reading/materials/, laid out with the
 * same relative paths that lessons-data.ts records, so a chip's href is just
 * that path under /reading/materials/. Each .dc.html page loads support.js and
 * deck-stage.js as siblings, which is why those runtime files are copied into
 * every directory that holds pages.
 *
 * Note that public/ is served to anyone with the URL — the sign-in gate is on
 * this page, not on the files behind it.
 */



const STORAGE_KEY = "basicReading.taught.v1";

/** The road map's own palette, kept from the design. */
const NAVY = "#2C4F74";
const GOLD = "#D8A846";
const BLUE = "#B2C5CB";
const PINK = "#E8BDB3";
const CREAM = "#FAF7F2";
const INK = "#24303D";
const MUTED = "#6B7480";
const RULE = "#E4DED4";
const BRASS = "#B08A2E";
const GREEN = "#4E7A44";

/** Each material type gets its own colour, so the mix is readable at a glance. */
const LINK_STYLE: Record<string, [string, string]> = {
  Lesson: [NAVY, CREAM],
  "Answer key": [BLUE, INK],
  Slides: [GOLD, INK],
  Maze: [PINK, INK],
  Workbook: [GREEN, "#FFFFFF"],
  "Workbook key": ["#EDE7DC", INK],
};

/**
 * The material types a card offers. The lessons, answer keys, slides and maze
 * packets are still on the site and still in lessons-data.ts — they are simply
 * not on show, so putting a label back here is all it takes to return one.
 */
const SHOWN_MATERIALS = ["Workbook", "Workbook key"];

const shown = <T extends { label: string }>(links: T[]) =>
  links.filter((l) => SHOWN_MATERIALS.includes(l.label));

/** Counted off what is on show, so the footer cannot promise more than it gives. */
const SKILLS_ON_SHOW = LESSONS.filter((l) => shown(l.links).length > 0).length;

const LEVELS = ["all", 1, 2, 3, 4] as const;

function ReadingFiler() {
  const [taught, setTaught] = useState<Record<string, boolean>>({});
  const [level, setLevel] = useState<"all" | number>("all");
  const [section, setSection] = useState("all");
  const [query, setQuery] = useState("");

  // Marks live in the browser, so they survive a refresh without an account.
  // Wrapped because a private window or blocked site data throws on access.
  useEffect(() => {
    try {
      setTaught(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {});
    } catch {
      /* no stored marks, start clean */
    }
  }, []);

  const toggle = (id: number) => {
    setTaught((current) => {
      const next = { ...current };
      if (next[id]) delete next[id];
      else next[id] = true;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* the mark still works for this session */
      }
      return next;
    });
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LESSONS.filter((r) => {
      if (level !== "all" && r.level !== level) return false;
      if (section !== "all" && r.section !== section) return false;
      if (
        q &&
        !r.skill.toLowerCase().includes(q) &&
        !r.section.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [level, section, query]);

  // Grouped by walking the filtered rows, so sections stay in teaching order.
  const groups = useMemo(() => {
    const out: { name: string; level: number; items: typeof LESSONS }[] = [];
    for (const r of rows) {
      const last = out[out.length - 1];
      if (!last || last.name !== r.section)
        out.push({ name: r.section, level: r.level, items: [r] });
      else last.items.push(r);
    }
    return out;
  }, [rows]);

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="cursor-pointer rounded-full transition-colors"
      style={{
        fontSize: 14,
        fontWeight: 700,
        padding: "10px 18px",
        border: `3px solid ${active ? NAVY : RULE}`,
        background: active ? NAVY : "#FFFFFF",
        color: active ? CREAM : INK,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ background: CREAM, color: INK, minHeight: "100vh", padding: "36px 20px 80px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Masthead */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 18,
            borderBottom: `3px solid ${RULE}`,
            paddingBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: BRASS }}>
              BASIC READING ROAD MAP
            </div>
            <h1 style={{ margin: "6px 0 0", fontSize: 38, fontWeight: 800, lineHeight: 1.1 }}>
              Lesson Filer
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 15,
                fontWeight: 500,
                color: MUTED,
                maxWidth: "52ch",
              }}
            >
              Every skill in the scope and sequence. Filter down, find the skill, mark it taught.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ background: NAVY, color: CREAM, borderRadius: 12, padding: "12px 18px", minWidth: 98 }}>
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{rows.length}</div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: BLUE }}>
                SHOWING
              </div>
            </div>
          </div>
        </div>


        {/* Search and section */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 22 }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a skill — try ai, prefix, root, silent e"
            aria-label="Search skills"
            style={{
              flex: "1 1 300px",
              minWidth: 0,
              fontSize: 15,
              fontWeight: 500,
              padding: "13px 16px",
              border: `3px solid ${RULE}`,
              borderRadius: 12,
              background: "#fff",
              color: INK,
              outline: "none",
            }}
          />
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            aria-label="Filter by section"
            style={{
              flex: "0 1 300px",
              fontSize: 15,
              fontWeight: 600,
              padding: "13px 14px",
              border: `3px solid ${RULE}`,
              borderRadius: 12,
              background: "#fff",
              color: INK,
            }}
          >
            <option value="all">All sections</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 18 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: MUTED, marginBottom: 8 }}>
              LEVEL
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {LEVELS.map((l) =>
                chip(l === "all" ? "All" : String(l), level === l, () => setLevel(l))
              )}
            </div>
          </div>
        </div>

        {/* Nothing matched */}
        {rows.length === 0 && (
          <div
            style={{
              marginTop: 40,
              background: "#fff",
              border: `3px dashed ${RULE}`,
              borderRadius: 16,
              padding: 44,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>Nothing matches those filters.</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: MUTED, marginTop: 6 }}>
              Clear the search box or switch back to All levels.
            </div>
          </div>
        )}

        {/* The skills */}
        {groups.map((group) => (
          <div key={group.name} style={{ marginTop: 36 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800 }}>{group.name}</h2>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: BRASS }}>
                LEVEL {group.level} · {group.items.length} SKILLS
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 14,
                marginTop: 14,
              }}
            >
              {group.items.map((item) => {
                const on = !!taught[item.id];
                return (
                  <div
                    key={item.id}
                    style={{
                      background: on ? "#F4F7F3" : "#FFFFFF",
                      border: `3px solid ${on ? "#C3D6BD" : RULE}`,
                      borderRadius: 14,
                      padding: "15px 17px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 11,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        aria-pressed={on}
                        title={on ? "Mark not taught" : "Mark taught"}
                        aria-label={`${item.skill} — ${on ? "mark not taught" : "mark taught"}`}
                        className="cursor-pointer transition-colors"
                        style={{
                          flex: "none",
                          marginTop: 2,
                          width: 26,
                          height: 26,
                          borderRadius: 8,
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 15,
                          fontWeight: 800,
                          lineHeight: 1,
                          border: `3px solid ${on ? GREEN : RULE}`,
                          background: on ? GREEN : "#FFFFFF",
                          color: "#FFFFFF",
                        }}
                      >
                        {on ? "✓" : ""}
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.25, textWrap: "pretty" }}>
                          {item.skill}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: on ? GREEN : "#9AA3AD",
                            marginTop: 4,
                          }}
                        >
                          {on ? "TAUGHT" : "NOT TAUGHT"}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: "auto" }}>
                      {shown(item.links).map((link) => {
                        const [bg, fg] = LINK_STYLE[link.label] ?? [BLUE, INK];

                        return (
                          <a
                            key={link.label}
                            href={`/reading/materials/${link.href}`}
                            target="_blank"
                            rel="noopener"
                            title={`${link.label} — ${item.skill}`}
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              padding: "6px 12px",
                              borderRadius: 999,
                              background: bg,
                              color: fg,
                              textDecoration: "none",
                            }}
                          >
                            {link.label}
                          </a>
                        );
                      })}
                      {shown(item.links).length === 0 && (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            padding: "6px 12px",
                            borderRadius: 999,
                            background: CREAM,
                            color: MUTED,
                            border: `2px solid ${RULE}`,
                          }}
                        >
                          No workbook yet
                        </span>
                      )}
                    </div>
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
            borderTop: `3px solid ${RULE}`,
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 24px",
            fontSize: 13,
            fontWeight: 500,
            color: MUTED,
          }}
        >
          <span>
            {SKILL_TOTAL} skills · Levels 1–4 · {SKILLS_ON_SHOW} with a workbook
          </span>
          <span>Taught marks save in this browser.</span>
          <span>Workbooks open in a new tab.</span>
        </div>
      </div>
    </div>
  );
}

export default function ReadingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="The Basic Reading road map"
          blurb={`All ${SKILL_TOTAL} skills in the scope and sequence, in teaching order, with ${SKILLS_ON_SHOW} workbooks and answer keys a click away. Free — an account is all it takes.`}
        >
          <ReadingFiler />
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
