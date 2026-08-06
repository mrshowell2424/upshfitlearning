// @ts-nocheck
import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { MatchDetailClient } from "./client";
import { db } from "@/lib/db";
import { standards, standard_unpacks, lesson_blueprints } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getResourcesForStandard } from "@/lib/utils/resources";
import { gradeSubjectLabel, scienceLabel, standardHref } from "@/lib/utils/standards";

interface PageProps {
  params: Promise<{ code: string }>;
}

// Quick jumps, so a teacher can hop standards without going back to search.
const QUICK_STANDARDS = [
  { code: "RL.2.1", label: "RL.2.1" },
  { code: "RI.4.2", label: "RI.4.2 main idea" },
  { code: "L.5.4", label: "vocabulary in context" },
  { code: "RL.6.3", label: "story elements, 6th grade" },
];

export default async function MatchDetailPage({ params }: PageProps) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);

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

  // Her own videos, scored against this standard's skills and match keys
  const matchingResources = await getResourcesForStandard([
    ...(standardRow?.skills ?? []),
    ...(standardRow?.match_keys ?? []),
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-5 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <div className="mb-5">
            <Link href="/match" className="text-link-blue hover:underline text-sm font-semibold">
              ← Back to search
            </Link>
          </div>

          {/* Quick switch between standards */}
          <div className="flex flex-wrap gap-2 mb-6">
            {QUICK_STANDARDS.map((quick) => {
              const isCurrent = quick.code.toUpperCase() === decodedCode.toUpperCase();
              return (
                <Link
                  key={quick.code}
                  href={standardHref(quick.code)}
                  className={`inline-flex items-center min-h-[44px] px-4 rounded-full text-sm font-medium border transition-colors ${
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

          {/* The standard itself — code, plain reading, target and the science */}
          <div className="rounded-2xl border border-hairline bg-white overflow-hidden mb-7">
            <div className="p-7 bg-gray-050">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="inline-block px-3 py-1.5 rounded-md bg-charcoal text-white text-[15px] font-bold">
                  {standard.code}
                </span>
                {standard.name && (
                  <h1 className="text-[20px] md:text-[24px] font-bold text-charcoal leading-tight">
                    {standard.name}
                  </h1>
                )}
              </div>
              {standard.text ? (
                <p className="text-[17px] text-text-body leading-relaxed max-w-3xl">
                  {standard.text}
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
          <MatchDetailClient
            standard={standard}
            standard_code={decodedCode}
            blueprint={blueprint}
            unpack={unpack}
            resources={matchingResources}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
