// @ts-nocheck
import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { MatchDetailClient } from "./client";
import { db } from "@/lib/db";
import { standards, standard_unpacks, lesson_blueprints } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getResourcesForStandard } from "@/lib/utils/resources";
import HeaderSearch from "@/components/shared/HeaderSearch";
import { MatchTabProvider } from "./tab-context";
import { LessonBanner } from "./banner";
import { dokFromVerbs } from "@/lib/utils/unpack";
import { gradeSubjectLabel, scienceLabel, standardHref } from "@/lib/utils/standards";

interface PageProps {
  params: Promise<{ code: string }>;
}

// Quick jumps, so a teacher can hop standards without going back to search.
const QUICK_STANDARDS = [
  { code: "RL.2.1", label: "RL.2.1" },
  { code: "RI.4.2", label: "RI.4.2 main idea" },
  { code: "L.5.4", label: "vocabulary in context" },
];

export default async function MatchDetailPage({ params }: PageProps) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);

  // Whether a read actually failed, as opposed to finding nothing. Without
  // this the page says "not written up yet" for both, which is how a database
  // that had never connected in production went unnoticed — the empty state
  // and the outage were the same sentence.
  let dataError = false;

  let standardRow = null;
  try {
    // Fetch actual standard from DB
    const standardRows = await db
      .select()
      .from(standards)
      .where(eq(standards.code, decodedCode))
      .limit(1);

    standardRow = standardRows[0] ?? null;
  } catch (error) {
    console.error("Database error fetching standard:", error);
    dataError = true;
  }

  // Grade lives in a different position per subject — RL.2.1, 2.NBT.B.5,
  // K.PS2.A — so take the first segment that is a grade rather than index 1.
  const gradeOf = (code: string) =>
    code.split(".").find((part) => /^(K|\d{1,2})$/i.test(part)) ?? null;

  const grade = gradeOf(decodedCode);

  // Fetch blueprint from DB
  let blueprintRow;
  try {
    const blueprintRows = await db
      .select()
      .from(lesson_blueprints)
      .where(eq(lesson_blueprints.standard_code, decodedCode))
      .limit(1);

    blueprintRow = blueprintRows[0];
  } catch (error) {
    console.error("Database error fetching blueprint:", error);
    blueprintRow = null;
    dataError = true;
  }

  const blueprint = blueprintRow
    ? {
        title: blueprintRow.title,
        badge: blueprintRow.badge,
        routeName: blueprintRow.route_name,
        routeLine: blueprintRow.route_line,
        successCriteria: blueprintRow.success_criteria ?? [],
        steps:
          blueprintRow.steps?.map((s) => ({
            title: s.name,
            minutes: s.minutes,
            body: s.body,
            scienceTag: s.science_tag,
          })) ?? [],
        efSupports: blueprintRow.ef_supports ?? [],
        tech: blueprintRow.tech,
        techPurpose: blueprintRow.tech_purpose,
        aiPrompts: blueprintRow.ai_prompts ?? [],
        assessment: blueprintRow.assessment ?? [],
        whyItWorks: blueprintRow.why_it_works ?? [],
      }
    : null;

  // Fetch unpack from DB
  let unpackRow;
  try {
    const unpackRows = await db
      .select()
      .from(standard_unpacks)
      .where(eq(standard_unpacks.standard_code, decodedCode))
      .limit(1);

    unpackRow = unpackRows[0];
  } catch (error) {
    console.error("Database error fetching unpack:", error);
    unpackRow = null;
    dataError = true;
  }

  const unpack = unpackRow
    ? {
        verbs: unpackRow.verbs ?? [],
        concepts: unpackRow.concepts ?? [],
        vocabulary: unpackRow.vocabulary ?? [],
        priorSkills: unpackRow.prior_skills ?? [],
        priorStandards: unpackRow.prior_standards ?? [],
        futureStandards: unpackRow.future_standards ?? [],
        challenges: unpackRow.challenges ?? [],
        masteryStatement: unpackRow.mastery_statement,
        ladder: unpackRow.ladder ?? [],
        dok: dokFromVerbs(unpackRow.verbs),
      }
    : null;

  // Prefer the standard's own tags; otherwise name the principles the lesson
  // actually leans on, so the panel is never empty when a blueprint exists.
  const scienceTags = standardRow?.science_tags?.length
    ? standardRow.science_tags
    : [...new Set((blueprintRow?.steps ?? []).map((s) => s.science_tag).filter(Boolean))]
        .slice(0, 4)
        .map(scienceLabel);

  const standard = {
    code: decodedCode,
    grade,
    gradeLabel: gradeSubjectLabel(decodedCode, grade),
    name: standardRow?.name ?? null,
    text: standardRow?.plain_reading ?? null,
    learningTarget: standardRow?.learning_target ?? null,
    scienceTags,
  };

  // Her own videos, scored against this standard's skills and match keys.
  // Only the count travels to the browser; the resources themselves are
  // All-Access and are served from the premium route instead.
  const matchingResources = await getResourcesForStandard([
    ...(standardRow?.skills ?? []),
    ...(standardRow?.match_keys ?? []),
  ])

  /**
   * What a teacher without All-Access is told about the locked half: how much
   * is behind it, never any of it. Enough to show the tabs hold something
   * substantial, which is what the blurred preview used to convey before the
   * content stopped being sent at all.
   */
  const premiumSummary = {
    hasUnpack: Boolean(unpack),
    verbs: unpack?.verbs?.length ?? 0,
    concepts: unpack?.concepts?.length ?? 0,
    vocabulary: unpack?.vocabulary?.length ?? 0,
    ladder: unpack?.ladder?.length ?? 0,
    challenges: unpack?.challenges?.length ?? 0,
    priorStandards: unpack?.priorStandards?.length ?? 0,
    futureStandards: unpack?.futureStandards?.length ?? 0,
    resources: matchingResources?.length ?? 0,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-5 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back link on the left; search with the quick picks tucked beneath it */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
            <Link href="/match" className="text-link-blue hover:underline text-sm font-semibold shrink-0 pt-1">
              ← Back to search
            </Link>

            <div className="flex flex-col gap-2 w-full sm:w-[26rem] shrink-0">
              <HeaderSearch
                searches="standards"
                placeholder="Search another standard"
              />

              {/* Quick switch between standards */}
              <div className="flex flex-wrap gap-1.5">
            {QUICK_STANDARDS.map((quick) => {
              const isCurrent = quick.code.toUpperCase() === decodedCode.toUpperCase();
              return (
                <Link
                  key={quick.code}
                  href={standardHref(quick.code)}
                  className={`inline-flex items-center min-h-[30px] px-2.5 rounded-full text-[12px] font-medium border transition-colors ${
                    isCurrent
                      ? "border-2 font-semibold"
                      : "border-border-strong hover:bg-gray-050"
                  }`}
                  style={isCurrent ? { borderColor: "var(--color-amber)" } : undefined}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {quick.label}
                </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <MatchTabProvider>
          {/* Only the DOK level, not the unpack it was derived from */}
          <LessonBanner blueprint={blueprint} standard={standard} unpack={{ dok: unpack?.dok }} />

          {/* The standard itself — code, plain reading, target and the science */}
          <div className="rounded-2xl border border-hairline bg-white overflow-hidden mb-7">
            <div className="p-7 bg-gray-050">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="inline-block px-3 py-1.5 rounded-md bg-charcoal text-white text-[15px] font-bold">
                  {standard.code}
                </span>
                {/* A teacher on RL.2.1 is usually teaching second grade, not
                    that one standard — so the grade is a way through to the
                    rest of it rather than a label. */}
                {grade && (
                  <Link
                    href={`/match/grade/${grade.toUpperCase()}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border-strong text-[13px] font-semibold text-charcoal hover:bg-gray-050 transition-colors"
                  >
                    {grade.toUpperCase() === "K" ? "Kindergarten" : `Grade ${grade}`}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
                {standard.name && (
                  <h2 className="text-[20px] md:text-[24px] font-bold text-charcoal leading-tight">
                    {standard.name}
                  </h2>
                )}
              </div>
              {standard.text ? (
                <p className="text-[17px] text-text-body leading-relaxed max-w-3xl">
                  {standard.text}
                </p>
              ) : dataError ? (
                <p className="text-[17px] italic" style={{ color: "var(--color-coral)" }}>
                  We could not load this standard just now. This is a problem at
                  our end, not a gap in the library — please try again shortly.
                </p>
              ) : (
                <p className="text-[17px] text-text-muted italic">
                  We don&apos;t have this standard written up yet.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline border-t border-hairline">
              <div className="p-7">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3"
                  style={{ color: "#7C3AED" }}
                >
                  Learning target
                </p>
                <p className="text-[17px] text-text-body leading-snug">
                  {standard.learningTarget || "Learning target coming soon."}
                </p>
              </div>

              <div className="p-7">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3"
                  style={{ color: "#0E9384" }}
                >
                  Learning science at work
                </p>
                {standard.scienceTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {standard.scienceTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-lg text-[15px] font-semibold"
                        style={{
                          backgroundColor: "rgba(0, 180, 166, 0.10)",
                          color: "#0E9384",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[15px] text-text-muted">
                    Tagged once this standard is built out.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tabs — always rendered so every section is reachable, each with its
              own empty state when that standard has not been authored yet. */}
          {/*
            The unpack and the matching resources are All-Access, so they are
            deliberately not passed here — anything handed to a client component
            is serialised into the HTML and readable by anyone, entitled or not.
            The client asks /api/match/[code]/premium for them once it has a
            session to prove entitlement with. Only the summary travels freely.
          */}
          <MatchDetailClient
            standard={standard}
            standard_code={decodedCode}
            blueprint={blueprint}
            premiumSummary={premiumSummary}
          />
          </MatchTabProvider>
        </div>
      </main>

      <Footer />
    </div>
  );
}
