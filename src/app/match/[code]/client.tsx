// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { UpgradeModal } from "@/components/shared/UpgradeModal";

// The lesson blueprint is the free taste; the other three are All-Access.
const tabs = [
  { id: "blueprint", label: "Lesson blueprint", premium: false },
  { id: "unpack", label: "Unpack the standard", premium: true },
  { id: "resources", label: "Resources to remix", premium: true },
  { id: "generate", label: "Make it for my learners", premium: true },
];

export function MatchDetailClient({ standard_code, blueprint, unpack, resources, userTier = "free" }) {
  const [activeTab, setActiveTab] = useState("blueprint");
  const { isPremium, isLoading } = useAuth();

  // Trust the live session over the server-rendered default
  const hasAllAccess = isPremium || userTier === "pro" || userTier === "school";

  const current = tabs.find((t) => t.id === activeTab);
  // Don't flash a paywall while the session is still resolving
  const locked = !isLoading && !hasAllAccess && !!current?.premium;

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "text-charcoal border-charcoal"
                : "text-text-muted border-transparent hover:text-charcoal"
            }`}
          >
            {tab.label}
            {!isLoading && !hasAllAccess && tab.premium && (
              <LockIcon className="w-3 h-3 opacity-60" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <LockedOverlay locked={locked} feature={current?.label ?? ""}>
        {activeTab === "blueprint" && <BlueprintTab blueprint={blueprint} />}
        {activeTab === "unpack" && <UnpackTab unpack={unpack} />}
        {activeTab === "resources" && <ResourcesTab resources={resources} standard_code={standard_code} />}
        {activeTab === "generate" && (
          <GenerateTab standard_code={standard_code} blueprint={blueprint} unpack={unpack} userTier={userTier} />
        )}
      </LockedOverlay>
    </div>
  );
}

function LockIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}

/**
 * Renders the real content behind a blur with an All-Access card on top. The
 * content stays in the DOM (blurred) so free users can see there is something
 * substantial there, which is the point of the teaser.
 */
function LockedOverlay({ locked, feature, children }) {
  if (!locked) return <div>{children}</div>;

  return (
    <div className="relative">
      <div
        className="blur-[6px] select-none pointer-events-none opacity-60 max-h-[520px] overflow-hidden"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Fade so the blurred content dissolves rather than being cut off */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />

      <div className="absolute inset-0 flex items-start justify-center pt-16">
        <div className="bg-white border border-border rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-4">
            <LockIcon className="w-5 h-5 text-coral" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral mb-2">
            All Access
          </p>
          <h3 className="text-[22px] font-bold text-charcoal mb-3">
            {feature} is part of All Access
          </h3>
          <p className="text-[15px] text-text-muted mb-6">
            The lesson blueprint is free. Unlock the deconstruction, remixable
            resources and the generator to build the whole lesson for your
            learners.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-[10px] font-semibold text-white bg-coral hover:bg-coral-press transition-colors"
            >
              Get All Access
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-semibold text-charcoal hover:text-coral transition-colors"
            >
              Create a free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotAuthoredYet({ what }) {
  return (
    <div className="border border-dashed border-border rounded-2xl p-10 text-center">
      <p className="text-[17px] font-semibold text-charcoal mb-2">
        No {what} for this standard yet
      </p>
      <p className="text-[15px] text-text-muted mb-6 max-w-md mx-auto">
        We build these by hand, standard by standard. This one is still on the
        list.
      </p>
      <Link
        href="/match"
        className="text-coral font-semibold hover:text-coral-press transition-colors"
      >
        Try another standard →
      </Link>
    </div>
  );
}

function BlueprintTab({ blueprint }) {
  if (!blueprint) return <NotAuthoredYet what="lesson blueprint" />;

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
  if (!unpack) return <NotAuthoredYet what="deconstruction" />;

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

function ResourcesTab({ resources, standard_code }) {
  if (!resources || resources.length === 0) {
    return <NotAuthoredYet what="matched resources" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-[24px] font-bold mb-2">{resources.length} resources fit this standard</h3>
        <p className="text-sm text-text-muted">Each card shows the move to make in class, not just the file.</p>
      </div>

      <div className="space-y-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex gap-6 p-6">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-40 h-32 bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="mb-3">
                  <h4 className="text-[18px] font-bold mb-2">{resource.title}</h4>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase px-2 py-1 bg-gray-100 text-text-faint rounded">
                      {resource.purpose}
                    </span>
                    <span className="text-xs font-bold uppercase px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      {resource.grade}
                    </span>
                    <span className="text-xs font-bold uppercase px-2 py-1 bg-red-50 text-red-700 rounded">
                      Strong fit
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-faint mb-2">
                    Use it for {standard_code} like this
                  </p>
                  <ul className="space-y-2">
                    {(resource.teaching_moves || []).map((move, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="w-5 h-5 rounded-sm bg-charcoal text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-text-body">{move}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-charcoal text-white rounded-lg font-semibold text-sm hover:bg-charcoal/90 transition-colors">
                    Open resource
                  </button>
                </div>
              </div>

              {/* All-Access badge */}
              {!resource.is_free && (
                <div className="flex-shrink-0">
                  <span className="inline-block px-3 py-1 bg-charcoal text-white text-xs font-bold uppercase rounded">
                    ALL-ACCESS
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenerateTab({ standard_code, blueprint, unpack, userTier = "free" }) {
  const [selectedFormat, setSelectedFormat] = useState("presentation");
  const [studentNeeds, setStudentNeeds] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const isFree = userTier === "free";

  const toggleNeed = (id: string) => {
    setStudentNeeds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (isFree) {
      setShowUpgrade(true);
      return;
    }

    setGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          standard_code,
          format: selectedFormat,
          student_needs: studentNeeds,
          blueprint,
          unpack,
        }),
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const data = await response.json();
      setGenerated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} feature="Lesson generation" />
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
                  disabled={generating}
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
                  <input
                    type="checkbox"
                    checked={studentNeeds.includes(option.id)}
                    onChange={() => toggleNeed(option.id)}
                    className="w-4 h-4 mt-0.5"
                    disabled={generating}
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              generating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-coral hover:bg-coral-press"
            }`}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? "Generating..." : "Generate for my learners"}
          </button>
        </div>
      </div>

      {/* Output preview */}
      <div>
        {!generated ? (
          <div className="bg-gray-050 rounded-lg p-8 aspect-square flex items-center justify-center border-2 border-dashed border-hairline">
            <div className="text-center">
              <p className="text-text-muted mb-2">Generated content will appear here</p>
              <p className="text-xs text-text-faint">
                Select options and click "Generate for my learners"
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 border border-border max-h-96 overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">{generated.content?.title}</h3>

            {selectedFormat === "presentation" && generated.content?.slides && (
              <div className="space-y-4">
                {generated.content.slides.slice(0, 3).map((slide: any) => (
                  <div key={slide.number} className="border-l-4 border-coral pl-4 py-2">
                    <p className="font-semibold">{slide.title}</p>
                    {slide.bullets && (
                      <ul className="text-sm text-text-muted mt-1 space-y-1">
                        {slide.bullets.slice(0, 2).map((b: string, i: number) => (
                          <li key={i}>• {b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                <p className="text-xs text-text-faint mt-4">
                  ... {generated.content.slides.length} slides total
                </p>
              </div>
            )}

            {selectedFormat === "document" && generated.content?.sections && (
              <div className="space-y-3">
                {generated.content.sections.slice(0, 3).map((section: any) => (
                  <div key={section.heading}>
                    <p className="font-semibold text-sm">{section.heading}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {section.content?.substring(0, 100) || section.bullets?.[0]}
                    </p>
                  </div>
                ))}
                <p className="text-xs text-text-faint mt-4">
                  ... Full lesson plan with {generated.content.sections.length} sections
                </p>
              </div>
            )}

            {selectedFormat === "worksheet" && (
              <div>
                <p className="text-sm mb-3">{generated.content?.instructions}</p>
                {generated.content?.sections?.slice(0, 2).map((section: any) => (
                  <div key={section.heading} className="mb-3">
                    <p className="font-semibold text-sm">{section.heading}</p>
                    <p className="text-xs text-text-muted mt-1">{section.content?.substring(0, 80)}</p>
                  </div>
                ))}
                <p className="text-xs text-text-faint mt-4">Ready to print or export</p>
              </div>
            )}

            {selectedFormat === "assessment" && (
              <div className="space-y-3">
                <p className="text-sm mb-3">{generated.content?.description}</p>
                {generated.content?.criteria?.slice(0, 2).map((criterion: any) => (
                  <div key={criterion.skill}>
                    <p className="font-semibold text-sm">{criterion.skill}</p>
                    <p className="text-xs text-text-muted">
                      {criterion.proficiency_levels?.length} proficiency levels
                    </p>
                  </div>
                ))}
                <p className="text-xs text-text-faint mt-4">Rubric ready to download</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
