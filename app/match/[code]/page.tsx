// @ts-nocheck
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { MatchDetailClient } from "./client";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);

  // TODO: Fetch actual standard and blueprint from DB
  // For now, use placeholder data
  const standard = {
    code: "RL.2.1",
    grade: "2",
    text: "Ask and answer such questions as who, what, where, when, why, and how to demonstrate understanding of key details in a text.",
  };

  const blueprint = {
    context: "Students explore how asking questions helps them understand stories better.",
    instructionalRoute: "Explicit modeling → Guided practice → Independent application",
    steps: [
      {
        step: 1,
        title: "Activate prior knowledge",
        moves: ["Ask students about books they like", "Discuss why they like them"],
      },
      {
        step: 2,
        title: "Define key details",
        moves: ["Show examples of questions that ask about key details", "Model asking questions"],
      },
      {
        step: 3,
        title: "Model questioning",
        moves: ["Read aloud from a grade-2 text", "Think aloud about questions"],
      },
      {
        step: 4,
        title: "Guided practice",
        moves: ["Read a short excerpt together", "Ask who/what/where questions"],
      },
      {
        step: 5,
        title: "Partner practice",
        moves: ["Pair students with a partner", "Each pair asks and answers questions"],
      },
      {
        step: 6,
        title: "Independent reading",
        moves: ["Students read independently", "Track questions on a graphic organizer"],
      },
      {
        step: 7,
        title: "Share and reflect",
        moves: ["Discuss questions with the group", "Reflect on what they learned"],
      },
      {
        step: 8,
        title: "Apply to new text",
        moves: ["Practice with a new story", "Use questions to show understanding"],
      },
    ],
    supports: [
      "Multi-sensory input",
      "Clear models",
      "Predictable routines",
      "Peer collaboration",
    ],
  };

  const unpack = {
    learningVerbs: ["Ask", "Answer", "Demonstrate", "Understand"],
    concepts: ["Key details", "Text comprehension", "Questioning strategies"],
    vocabulary: ["Key details", "Understanding", "Questions"],
    misconceptions: [
      "Students may think all questions are equally important",
      "Students may focus on minor details instead of key details",
    ],
    priorLearning:
      "Students should understand basic story elements (character, setting, events)",
    futureLearning: "RL.3.1: Ask and answer questions to demonstrate understanding of a text",
    masteryCriteria: [
      "Student asks at least 3 questions about a text",
      "Student answers questions accurately",
      "Questions focus on key details, not minor details",
    ],
    learningLadder: [
      "I can identify characters in a story",
      "I can ask simple questions about a story",
      "I can ask who, what, where, when, why, and how questions",
      "I can answer my questions using details from the text",
    ],
  };

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
          <MatchDetailClient
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
