// @ts-nocheck
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { MatchDetailClient } from "./client";
import { db } from "@/lib/db";
import { standards, standard_unpacks, lesson_blueprints } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);

  let standardRow;
  try {
    // Fetch actual standard from DB
    const standardRows = await db
      .select()
      .from(standards)
      .where(eq(standards.code, decodedCode))
      .limit(1);

    standardRow = standardRows[0];
  } catch (error) {
    console.error("Database error fetching standard:", error);
    notFound();
  }

  if (!standardRow) {
    notFound();
  }

  const standard = {
    code: standardRow.code,
    grade: standardRow.code.split(".")[1],
    text: standardRow.plain_reading,
  };

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
        context:
          blueprintRow.steps && blueprintRow.steps.length > 0
            ? blueprintRow.steps[0].body
            : "Context loading...",
        instructionalRoute: blueprintRow.route_line || "Instructional route",
        steps:
          blueprintRow.steps?.map((s, idx) => ({
            step: idx + 1,
            title: s.name,
            moves: (s.body || "").split("\n").filter((l) => l.trim().length > 0),
          })) || [],
        supports: blueprintRow.ef_supports || [],
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
        learningVerbs: unpackRow.verbs?.map((v) => v.word) || [],
        concepts: unpackRow.concepts || [],
        vocabulary: unpackRow.vocabulary || [],
        misconceptions:
          unpackRow.challenges?.map((c) => c.problem) || [],
        priorLearning:
          unpackRow.prior_skills?.join(", ") ||
          "Prior learning information loading...",
        futureLearning:
          unpackRow.future_standards?.[0]?.text ||
          "Future learning information loading...",
        masteryCriteria: [unpackRow.mastery_statement || "Mastery criteria loading..."],
        learningLadder:
          unpackRow.ladder?.map((l) => l.name) || [],
      }
    : null;

  const matchingResources = [
    {
      id: 1,
      title: "Question Stems for Reading Comprehension",
      purpose: "Strategy practice",
      skill: "Textual Evidence",
      format: "Slides",
      grade: "2-3",
      teaching_moves: [
        "Display stems for students to see",
        "Have students use stems to ask questions",
      ],
    },
    {
      id: 2,
      title: "Story Comprehension with Who, What, Where, When, Why",
      purpose: "Guided practice",
      skill: "Comprehension",
      format: "Video",
      grade: "2",
      teaching_moves: [
        "Show the video modeling question asking",
        "Pause and have students ask questions",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-8 py-8">
        {/* Back link */}
        <div className="max-w-4xl mx-auto mb-6">
          <a href="/match" className="text-link-blue hover:underline text-sm font-semibold">
            ← Back to search
          </a>
        </div>

        {/* Header with standard info */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-[48px] font-bold">{standard.code}</h1>
            <span className="text-sm font-bold uppercase px-3 py-1 bg-gray-100 rounded-md">
              Grade {standard.grade}
            </span>
          </div>
          <p className="text-[18px] text-text-body">{standard.text}</p>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto">
          {blueprint && unpack ? (
            <MatchDetailClient
              standard_code={decodedCode}
              blueprint={blueprint}
              unpack={unpack}
              resources={matchingResources}
              userTier="free"
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-text-muted">Loading standard details...</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
