import Link from "next/link";
import { ogCard, twitterCard } from "@/lib/constants/metadata";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SignInGate } from "@/components/shared/SignInGate";
import { CopyButton } from "@/app/science-of-reading/resources/copy-button";
import WRITING from "@/../scripts/reading-writing-passages.json";
import AICOACH from "@/../scripts/reading-ai-writing-coach.json";
import { FRAME, WRITING_TASK } from "./frame";
import { patternInfo, BASIC_ORDER } from "./writing-data";

/**
 * Opinion writing, decodable.
 *
 * Sixty-two prompts with their own passages have been sitting in
 * scripts/reading-writing-passages.json, reachable only through the
 * database-served pack pages. Nothing on the site said "here is writing,
 * matched to the pattern you are teaching this week", so unless a teacher
 * was already inside an OG pack they never met any of it.
 *
 * The pairing is the point and it is unusual: a child at the FLOSS rule can
 * read the passage, which means they can argue from it. Most opinion writing
 * asks a struggling reader to build an argument on a text they are still
 * decoding, and then marks the argument.
 *
 * The frame is the EB frame, word for word as the AI coach states it, so the
 * page and the coach are using the same eight phrases.
 */

const SETS = WRITING as Record<string, { prompt: string; passage: string }>;

/** Basic patterns first, in teaching order, then the OG levels in order. */
const KEYS = Object.keys(SETS).sort((a, b) => {
  const ai = BASIC_ORDER.indexOf(a);
  const bi = BASIC_ORDER.indexOf(b);
  if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  return a.localeCompare(b);
});

const BRAND = {
  coral: "#FF6A5B",
  pink: "#FF7DAE",
  lavender: "#B87DFF",
  teal: "#00B4A6",
  ink: "#111111",
  mid: "#444444",
  line: "#E9E9E9",
  panel: "#F2F2F2",
  paper: "#F7F6F4",
  white: "#FFFFFF",
  coralDark: "#C0432F",
  lavenderDark: "#6B2FB5",
  tealDark: "#00756C",
  blueDark: "#2F6FD0",
};
const GRADIENT = `linear-gradient(135deg, ${BRAND.coral}, ${BRAND.pink}, ${BRAND.lavender}, ${BRAND.teal})`;

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const label: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: BRAND.mid,
};

const reading: React.CSSProperties = {
  fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
  fontSize: 18,
  lineHeight: 1.65,
};

const PART_COLOR: Record<string, string> = {
  Intro: BRAND.tealDark,
  Body: BRAND.lavenderDark,
  Ending: BRAND.blueDark,
};

function pill(on: boolean, color: string): React.CSSProperties {
  return {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: 12.5,
    fontWeight: 800,
    padding: "7px 13px",
    minHeight: 38,
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    textDecoration: "none",
    border: `1.5px solid ${on ? color : BRAND.line}`,
    background: on ? color : BRAND.white,
    color: on ? BRAND.white : BRAND.ink,
    whiteSpace: "nowrap",
  };
}

export const metadata = {
  title: "Opinion writing",
  description:
    "Sixty-two opinion prompts, each with a passage written at the phonics pattern you are teaching — so a child argues from a text they can actually read, in the eight-part EB frame.",
  openGraph: ogCard("/og/writing.png"),
  twitter: twitterCard("/og/writing.png"),
};

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;

  const asked = one(sp.p);
  const key = asked && SETS[asked] ? asked : KEYS[0];
  const set = SETS[key];
  const info = patternInfo(key);

  // The passage is stored with blank-line paragraph breaks.
  const paras = set.passage.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const title = `${info.name} — ${set.prompt}`;

  const coachPrompt = AICOACH.lines
    .join("\n")
    .replace(/\{GRADES\}/g, info.grades || "2nd–3rd")
    .replace(/\{SKILL\}/g, info.name)
    .replace("{TITLE}", title)
    .replace("{PASSAGE}", paras.join("\n\n"))
    .replace("{QUESTION}", set.prompt)
    .replace("{WRITING}", WRITING_TASK);

  // Group the pickers the way a teacher thinks about them.
  const groups: { name: string; keys: string[] }[] = [];
  for (const k of KEYS) {
    const g = patternInfo(k).group;
    const last = groups.find((x) => x.name === g);
    if (last) last.keys.push(k);
    else groups.push({ name: g, keys: [k] });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignInGate
          title="Opinion writing"
          blurb="Sixty-two opinion prompts, each with a passage written at the phonics pattern you are teaching — so a child argues from a text they can read. Free — an account is all it takes."
        >
          <div style={{ height: 4, background: GRADIENT }} />

          <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 5% 80px" }}>
            <p style={{ ...label, margin: "0 0 6px", color: BRAND.coralDark }}>
              Writing · decodable
            </p>
            <h1
              style={{
                fontFamily: "Poppins, Inter, sans-serif",
                fontSize: 40,
                fontWeight: 900,
                letterSpacing: "-1px",
                margin: "0 0 6px",
                lineHeight: 1.1,
              }}
            >
              Opinion writing
            </h1>
            <p style={{ ...reading, color: BRAND.mid, maxWidth: "62ch", margin: "0 0 10px" }}>
              Most opinion writing asks a struggling reader to build an argument on a text they are
              still decoding, and then marks the argument. These {KEYS.length} sets pair a question
              worth arguing with a passage written at the pattern you are teaching — so the reading
              is not the obstacle, and what you are looking at is the thinking.
            </p>
            <p style={{ fontSize: 13, color: BRAND.mid, margin: "0 0 24px" }}>
              <Link
                href="/science-of-reading"
                style={{ color: BRAND.tealDark, fontWeight: 700, textDecoration: "none" }}
              >
                ← Science of Reading
              </Link>
            </p>

            {/* Sixty-two pills across six groups is taller than the whole
                viewport, which pushed the prompt, the passage and the frame
                -- the entire page -- below the fold. The set a teacher asked
                for comes first now, and the picker folds away under a label
                that says how much is behind it. */}
            <details className="disclosure" style={{ margin: "0 0 20px" }}>
              <summary
                style={{
                  cursor: "pointer",
                  listStyle: "none",
                  ...label,
                  fontSize: 12,
                  color: BRAND.ink,
                }}
              >
                Choose a pattern · {KEYS.length} sets, Basic Reading and OG levels 1–5
              </summary>
              <div style={{ paddingTop: 14 }}>
                {groups.map((g) => (
                  <div key={g.name} style={{ margin: "0 0 12px" }}>
                    <p style={{ ...label, margin: "0 0 7px" }}>{g.name}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {g.keys.map((k) => {
                        const i = patternInfo(k);
                        return (
                          <Link
                            key={k}
                            href={`/writing?p=${k}`}
                            style={pill(k === key, BRAND.coralDark)}
                            title={i.name}
                          >
                            {i.name.length > 30 ? `${i.name.slice(0, 29)}…` : i.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </details>

            {/* The set. */}
            <div
              style={{
                border: `1px solid ${BRAND.line}`,
                borderTop: `3px solid ${BRAND.coralDark}`,
                borderRadius: "3px 3px 16px 16px",
                padding: "22px 24px",
              }}
            >
              <p style={{ ...label, margin: "0 0 4px", color: BRAND.coralDark }}>
                {info.group}
                {info.grades ? ` · ${info.grades}` : ""} · {info.name}
                {info.sub.length ? ` · ${info.sub.join(", ")}` : ""}
              </p>

              <h2
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontSize: 27,
                  fontWeight: 700,
                  lineHeight: 1.25,
                  margin: "0 0 16px",
                  textWrap: "balance",
                }}
              >
                {set.prompt}
              </h2>

              <p style={{ ...label, margin: "0 0 8px" }}>The passage they argue from</p>
              <div
                style={{
                  background: BRAND.paper,
                  borderRadius: 14,
                  padding: "16px 18px",
                }}
              >
                {paras.map((p, i) => (
                  <p key={i} style={{ ...reading, margin: i ? "12px 0 0" : 0 }}>
                    {p}
                  </p>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0 0" }}>
                <CopyButton text={coachPrompt} label="Copy the coach prompt" />
                <Link href={`/writing/print?p=${key}`} style={pill(false, BRAND.ink)}>
                  Print the frame →
                </Link>
              </div>
              <p style={{ fontSize: 12.5, color: BRAND.mid, margin: "10px 0 0", lineHeight: 1.5 }}>
                The prompt carries the passage, the question and the frame into a student-safe AI
                space. It is a coach, not a ghostwriter — it is told never to write a sentence the
                child could hand in, and never to ask for a name or a school.
              </p>
            </div>

            {/* The frame. */}
            <p style={{ ...label, margin: "30px 0 10px" }}>The frame · eight parts</p>
            {(["Intro", "Body", "Ending"] as const).map((part) => {
              const steps = FRAME.filter((f) => f.part === part);
              return (
                <div key={part} style={{ margin: "0 0 14px" }}>
                  <p style={{ ...label, margin: "0 0 7px", color: PART_COLOR[part] }}>
                    {part} paragraph
                  </p>
                  {steps.map((f) => (
                    <div
                      key={f.n}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "26px 1fr",
                        gap: 12,
                        margin: "0 0 10px",
                        alignItems: "start",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 999,
                          background: PART_COLOR[part],
                          color: BRAND.white,
                          fontFamily: "Inter, sans-serif",
                          fontSize: 12,
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {f.n}
                      </span>
                      <div>
                        <p style={{ fontSize: 14.5, fontWeight: 800, margin: "2px 0 2px" }}>
                          {f.name}
                          <span
                            style={{
                              fontFamily: 'var(--font-serif), Georgia, serif',
                              fontWeight: 600,
                              color: BRAND.mid,
                            }}
                          >
                            {" "}
                            {f.starter}
                          </span>
                        </p>
                        <p style={{ fontSize: 13, lineHeight: 1.5, color: BRAND.mid, margin: 0 }}>
                          {f.does}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}

            <p style={{ fontSize: 13, lineHeight: 1.6, color: BRAND.mid, margin: "20px 0 0" }}>
              A second grader writes the intro, one body paragraph and the ending. A third or
              fourth grader writes a second body paragraph first, with a different reason and a
              different piece of evidence. More than one claim is defensible on every one of these
              passages — the child picks the one they can best argue, which is why the prompt never
              suggests a claim.
            </p>
          </div>
        </SignInGate>
      </main>
      <Footer />
    </div>
  );
}
