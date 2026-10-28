import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import { GROUPS, RESOURCE_COUNT, DRIVE_FOLDER } from "./resources";

/**
 * The reference shelf behind the Basic Reading programme.
 *
 * Kept off /reading on purpose: that page is the scope and sequence, and these
 * are the assessments and printables a teacher reaches for around it. The 58
 * OG concept packs are not repeated here either — they live with the skills
 * they cover, and this page points across to them instead.
 *
 * Everything here opens in Google Drive rather than being served from our own
 * store, so these are plain outbound links and the sign-in gate is about
 * keeping the shelf with the rest of the programme, not about protecting the
 * files — Drive does that itself.
 */
export const metadata = {
  title: "Science of Reading — Upshift Learning",
  description:
    "The assessments, notebooks and practice material behind the Basic Reading programme: PAST, PASI, the complete level notebooks, decodable passages and more.",
};

/** The canvas's own palette, matching the Basic Reading road map. */
const CREAM = "#FAF7F2";
const INK = "#24303D";
const MUTED = "#6B7480";
const RULE = "#E4DED4";
const BRASS = "#B08A2E";
const TEAL = "#2F7A8C";
const GOLD = "#D8A846";

function Shelf() {
  return (
    <div style={{ background: CREAM, color: INK, minHeight: "100vh", padding: "36px 20px 80px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Masthead */}
        <div style={{ borderBottom: `3px solid ${RULE}`, paddingBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: BRASS }}>
            BASIC READING · REFERENCE
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: 38, fontWeight: 800, lineHeight: 1.1 }}>
            Science of Reading
          </h1>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 16,
              fontWeight: 500,
              color: MUTED,
              maxWidth: "64ch",
              lineHeight: 1.55,
            }}
          >
            The assessments, notebooks and practice material the programme runs on. Everything
            here opens in Google Drive.{" "}
            <a
              href={DRIVE_FOLDER}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: TEAL, fontWeight: 700, textDecoration: "none" }}
            >
              Browse the whole folder
            </a>
            , or take a file at a time below.
          </p>
          <p style={{ margin: "12px 0 0", fontSize: 14, fontWeight: 500, color: MUTED }}>
            Looking for the lessons themselves?{" "}
            <Link href="/reading" style={{ color: TEAL, fontWeight: 700, textDecoration: "none" }}>
              The Basic Reading road map
            </Link>{" "}
            has the 202 skills, their workbooks and the 58 OG concept packs.
          </p>
        </div>

        {GROUPS.map((group) => (
          <div key={group.name} style={{ marginTop: 40 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800 }}>{group.name}</h2>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: BRASS }}>
                {group.items.length} {group.items.length === 1 ? "FILE" : "FILES"}
              </span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: MUTED, margin: "6px 0 0", maxWidth: "70ch" }}>
              {group.blurb}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 12,
                marginTop: 14,
              }}
            >
              {group.items.map((item) => (
                <a
                  key={item.href + item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    background: "#FFFFFF",
                    border: `3px solid ${RULE}`,
                    borderLeft: `8px solid ${TEAL}`,
                    borderRadius: 14,
                    padding: "14px 16px",
                    textDecoration: "none",
                    color: INK,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.25, textWrap: "pretty" }}>
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        padding: "2px 7px",
                        borderRadius: 999,
                        background: CREAM,
                        border: `2px solid ${RULE}`,
                        color: MUTED,
                      }}
                    >
                      {item.kind}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: MUTED, marginTop: 6, lineHeight: 1.45 }}>
                    {item.detail}
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Drive meets a stranger with a request-access screen and no hint as
            to what would fix it, the same trap the resource library's slides
            set. Say it once, here, rather than on every card. */}
        <div
          style={{
            marginTop: 36,
            padding: "14px 18px",
            background: "#FFFFFF",
            border: `3px solid ${RULE}`,
            borderLeft: `8px solid ${GOLD}`,
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            color: MUTED,
            lineHeight: 1.5,
          }}
        >
          <strong style={{ fontWeight: 700, color: INK }}>Asked to request access?</strong> These
          files are shared from Google Drive. Sign in with the Google account your school uses,
          and if it still will not open, ask to have the folder shared with that address.
        </div>

        <div
          style={{
            marginTop: 40,
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
          <span>{RESOURCE_COUNT} files across {GROUPS.length} groups</span>
          <span>Everything opens in Google Drive, in a new tab.</span>
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
          blurb="The assessments, notebooks and practice material behind the Basic Reading programme. Free — an account is all it takes."
        >
          <Shelf />
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
