// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const tabs = [
  { id: "blueprint", label: "Lesson blueprint" },
  { id: "unpack", label: "Unpack the standard" },
  { id: "resources", label: "Resources to remix" },
  { id: "generate", label: "Make it for my learners" },
];

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
          <button
            onClick={() => window.history.back()}
            className="text-link-blue hover:underline text-sm font-semibold"
          >
            ← Back to search
          </button>
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
          <MatchTabs
            tabs={tabs}
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

function MatchTabs({ tabs, blueprint, unpack, resources }) {
  const [activeTab, setActiveTab] = useState("blueprint");

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? "text-charcoal border-charcoal"
                : "text-text-muted border-transparent hover:text-charcoal"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "blueprint" && <BlueprintTab blueprint={blueprint} />}
        {activeTab === "unpack" && <UnpackTab unpack={unpack} />}
        {activeTab === "resources" && <ResourcesTab resources={resources} />}
        {activeTab === "generate" && <GenerateTab />}
      </div>
    </div>
  );
}

function BlueprintTab({ blueprint }) {
  return (
    <div>
      {/* Context row */}
      <div className="bg-gray-050 rounded-lg p-6 mb-8 border border-hairline">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-text-faint mb-2">
          Context
        </p>
        <p className="text-[17px] text-text-body">{blueprint.context}</p>
      </div>

      {/* Instructional route */}
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-text-faint mb-3">
          Instructional route
        </p>
        <p className="text-[16px] text-text-body">{blueprint.instructionalRoute}</p>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-text-faint mb-4">
          8-step lesson path
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {blueprint.steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-gray-050 rounded-lg p-4 border border-hairline hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-sm flex items-center justify-center bg-charcoal text-white text-sm font-bold mb-3">
                {step.step}
              </div>
              <p className="font-semibold text-sm mb-2">{step.title}</p>
              <ul className="text-xs text-text-muted space-y-1">
                {step.moves.map((move, i) => (
                  <li key={i}>• {move}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Support row */}
      <div className="bg-gray-050 rounded-lg p-6 border border-hairline">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-text-faint mb-3">
          Evidence-based frameworks
        </p>
        <div className="flex flex-wrap gap-2">
          {blueprint.supports.map((support, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-white border border-border rounded-full text-sm font-medium"
            >
              {support}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function UnpackTab({ unpack }) {
  return (
    <div className="space-y-6">
      <Section title="Learning verbs" items={unpack.learningVerbs} />
      <Section title="Concepts" items={unpack.concepts} />
      <Section title="Vocabulary" items={unpack.vocabulary} />
      <Section title="Misconceptions" items={unpack.misconceptions} />

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-text-faint mb-2">
          Prior learning
        </p>
        <p className="text-[17px] text-text-body">{unpack.priorLearning}</p>
      </div>

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-text-faint mb-2">
          Future learning
        </p>
        <p className="text-[17px] text-text-body">{unpack.futureLearning}</p>
      </div>

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-text-faint mb-3">
          Mastery criteria
        </p>
        <ul className="space-y-2">
          {unpack.masteryCriteria.map((criteria, idx) => (
            <li key={idx} className="flex gap-2 text-[17px] text-text-body">
              <span className="font-bold">✓</span> {criteria}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-text-faint mb-3">
          Learning ladder
        </p>
        <div className="space-y-2">
          {unpack.learningLadder.map((rung, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="w-6 h-6 rounded-sm flex items-center justify-center bg-charcoal text-white text-xs font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <p className="text-text-body">{rung}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-text-faint mb-3">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-charcoal"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ResourcesTab({ resources }) {
  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="border border-border rounded-lg p-6 hover:bg-gray-050 transition-colors"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="text-[17px] font-bold mb-1">{resource.title}</h4>
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase px-2 py-1 bg-gray-100 text-text-faint rounded">
                  {resource.purpose}
                </span>
                <span className="text-xs font-bold uppercase px-2 py-1 bg-teal-50 text-teal-700 rounded">
                  {resource.skill}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold uppercase px-2 py-1 bg-blue-50 text-blue-700 rounded">
              {resource.format}
            </span>
          </div>
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-faint mb-2">
              Teaching moves
            </p>
            <ul className="space-y-1">
              {resource.teaching_moves.map((move, idx) => (
                <li key={idx} className="text-sm text-text-body">
                  • {move}
                </li>
              ))}
            </ul>
          </div>
          <button className="text-coral font-semibold text-sm hover:text-coral-press">
            Add to lesson →
          </button>
        </div>
      ))}
    </div>
  );
}

function GenerateTab() {
  const [selectedFormat, setSelectedFormat] = useState("presentation");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Control panel */}
      <div className="lg:sticky lg:top-24 h-fit">
        <div className="border border-border rounded-lg p-6 bg-white">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-text-faint mb-4">
            Output format
          </p>
          <div className="space-y-2">
            {[
              { id: "presentation", label: "Google Slides presentation" },
              { id: "document", label: "Google Doc lesson plan" },
              { id: "worksheet", label: "Student worksheet" },
              { id: "assessment", label: "Assessment rubric" },
            ].map((format) => (
              <label key={format.id} className="flex gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value={format.id}
                  checked={selectedFormat === format.id}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-4 h-4 mt-0.5"
                />
                <span className="text-sm font-medium">{format.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-hairline">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-text-faint mb-4">
              Student needs
            </p>
            <div className="space-y-2">
              {[
                { id: "ef", label: "Executive function support" },
                { id: "visual", label: "Visual supports" },
                { id: "language", label: "Language learners" },
                { id: "ext", label: "Extension activities" },
              ].map((option) => (
                <label key={option.id} className="flex gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 mt-0.5" />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            className="w-full mt-6 py-3 rounded-lg bg-coral text-white font-semibold hover:bg-coral-press transition-colors"
            onClick={() => alert("Generate: " + selectedFormat)}
          >
            Generate for my learners
          </button>
        </div>
      </div>

      {/* Output preview */}
      <div>
        <div className="bg-gray-050 rounded-lg p-8 aspect-square flex items-center justify-center border-2 border-dashed border-hairline">
          <div className="text-center">
            <p className="text-text-muted mb-2">Generated content will appear here</p>
            <p className="text-xs text-text-faint">
              Select options and click "Generate for my learners"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
