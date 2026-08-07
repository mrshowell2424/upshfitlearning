// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { UpgradeModal } from "@/components/shared/UpgradeModal";
import { scienceLabel, standardHref } from "@/lib/utils/standards";

// The lesson blueprint is the free taste; the other three are All-Access.
const tabs = [
  { id: "blueprint", label: "Lesson blueprint", premium: false },
  { id: "unpack", label: "Unpack the standard", premium: true },
  { id: "resources", label: "Resources to remix", premium: true },
  { id: "generate", label: "Make it for my learners", premium: true },
];

/**
 * Section-label colours. Each kind of information keeps the same hue everywhere
 * it appears, so a teacher learns the page once — coral is what students do,
 * violet is the standard's own machinery, teal is learning science.
 */
const LABEL = {
  violet: "#7C3AED",
  indigo: "#4338CA",
  teal: "#0E9384",
  coral: "var(--color-coral)",
  crimson: "#B4245C",
  blue: "var(--color-link-blue)",
  rust: "#B4482C",
  amber: "#B76E00",
};

// The route every blueprint runs, named so the eight steps below read as a shape.
const ROUTE_PHASES = [
  { name: "Retrieve", caption: "Activate prior knowledge", color: "var(--color-pink)" },
  { name: "Learn", caption: "Model & think aloud", color: "var(--color-amber)" },
  { name: "Practice", caption: "Guided & collaborative", color: "var(--color-teal)" },
  { name: "Apply", caption: "Independent practice", color: "var(--color-blue)" },
  { name: "Reflect", caption: "Metacognition & reflection", color: "var(--color-lavender)" },
];

export function MatchDetailClient({
  standard,
  standard_code,
  blueprint,
  unpack,
  resources,
  userTier = "free",
}) {
  const [activeTab, setActiveTab] = useState("blueprint");
  const { isPremium, isLoading } = useAuth();

  // Trust the live session over the server-rendered default
  const hasAllAccess = isPremium || userTier === "pro" || userTier === "school";

  const current = tabs.find((t) => t.id === activeTab);
  // Don't flash a paywall while the session is still resolving
  const locked = !isLoading && !hasAllAccess && !!current?.premium;

  return (
    <div>
      {/* Tab navigation — pills, so the four views read as equal choices */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 min-h-[48px] px-6 rounded-full font-semibold text-[15px] border transition-colors ${
                isActive
                  ? "bg-charcoal text-white border-charcoal"
                  : "bg-white text-charcoal border-border-strong hover:bg-gray-050"
              }`}
            >
              {tab.label}
              {!isLoading && !hasAllAccess && tab.premium && (
                <LockIcon className="w-3 h-3 opacity-60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <LockedOverlay locked={locked} feature={current?.label ?? ""}>
        {activeTab === "blueprint" && (
          <BlueprintTab
            blueprint={blueprint}
            standard={standard}
            onOpenTab={setActiveTab}
          />
        )}
        {activeTab === "unpack" && (
          <UnpackTab unpack={unpack} standard={standard} onOpenTab={setActiveTab} />
        )}
        {activeTab === "resources" && (
          <ResourcesTab resources={resources} standard_code={standard_code} />
        )}
        {activeTab === "generate" && (
          <GenerateTab standard_code={standard_code} blueprint={blueprint} unpack={unpack} />
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

/** Small wide-tracked caps label that opens every panel on this page. */
function SectionLabel({ children, color, className = "" }) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.14em] ${className}`}
      style={{ color }}
    >
      {children}
    </p>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-hairline bg-white p-6 ${className}`}>
      {children}
    </div>
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

/**
 * A step's directions arrive as one run-on paragraph. Split it into the separate
 * moves a teacher makes, so they can be followed one at a time mid-lesson.
 * Splits only where a sentence ends and the next clearly begins, which keeps
 * "(2-3 minutes)." and "who, what, where, when, why, how" intact.
 */
function directionsFrom(body?: string): string[] {
  if (!body) return [];
  return body
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** A checked list item — used for success criteria and assessment evidence. */
function CheckItem({ children, color }) {
  return (
    <li className="flex gap-2 text-[15px] text-text-body leading-snug">
      <span className="flex-shrink-0 mt-[3px]" style={{ color }} aria-hidden="true">
        ☑
      </span>
      <span>{children}</span>
    </li>
  );
}

function BlueprintTab({ blueprint, standard, onOpenTab }) {
  if (!blueprint) return <NotAuthoredYet what="lesson blueprint" />;

  const steps = blueprint.steps ?? [];

  return (
    <div>
      <div className="rounded-2xl border border-hairline overflow-hidden bg-white">

        <div className="p-5 md:p-6 space-y-5">
          {/* What it teaches, what success looks like, and why */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <SectionLabel color={LABEL.violet} className="mb-3">
                Standard
              </SectionLabel>
              <p className="text-[16px] font-bold text-charcoal mb-1">{standard.code}</p>
              <p className="text-[15px] text-text-body leading-snug">{standard.name}</p>
            </Card>

            <Card>
              <SectionLabel color={LABEL.coral} className="mb-3">
                Learning target
              </SectionLabel>
              <p className="text-[15px] text-text-body leading-snug">
                {standard.learningTarget || "Learning target coming soon."}
              </p>
            </Card>

            <Card>
              <SectionLabel color={LABEL.teal} className="mb-3">
                Success criteria
              </SectionLabel>
              <ul className="space-y-2">
                {(blueprint.successCriteria ?? []).map((criteria, idx) => (
                  <CheckItem key={idx} color="var(--color-teal)">
                    {criteria}
                  </CheckItem>
                ))}
              </ul>
            </Card>

            <Card>
              <SectionLabel color={LABEL.indigo} className="mb-3">
                Learning science
              </SectionLabel>
              <ul className="space-y-1.5">
                {(standard.scienceTags ?? []).map((tag) => (
                  <li key={tag} className="text-[15px] text-text-body leading-snug">
                    · {tag}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* The route, named and drawn */}
          <Card>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,260px)_1fr] gap-6 items-center">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-charcoal mb-1">
                  Instructional route
                </p>
                {blueprint.routeName && (
                  <p className="text-[16px] font-bold mb-1" style={{ color: LABEL.teal }}>
                    {blueprint.routeName}
                  </p>
                )}
                <p className="text-[14px] text-text-muted leading-snug">
                  {blueprint.routeLine}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {ROUTE_PHASES.map((phase) => (
                  <div key={phase.name} className="text-center">
                    <span
                      className="block w-12 h-12 rounded-full mx-auto mb-3"
                      style={{ backgroundColor: phase.color }}
                      aria-hidden="true"
                    />
                    <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-charcoal">
                      {phase.name}
                    </p>
                    <p className="text-[12px] text-text-muted leading-snug mt-1">
                      {phase.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* The lesson itself, step by step */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {steps.map((step, idx) => (
              <Card key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[12px] font-bold"
                    style={{ backgroundColor: LABEL.violet }}
                  >
                    {idx + 1}
                  </span>
                  <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-charcoal">
                    {step.title}
                  </p>
                </div>
                {step.minutes ? (
                  <p className="text-[13px] text-text-muted mb-2">{step.minutes} minutes</p>
                ) : null}
                <ol className="text-[15px] text-text-body leading-snug flex flex-col gap-1.5">
                  {directionsFrom(step.body).map((direction, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-semibold text-text-faint flex-shrink-0 tabular-nums">
                        {i + 1}.
                      </span>
                      <span>{direction}</span>
                    </li>
                  ))}
                </ol>
                {step.scienceTag && (
                  <p
                    className="text-[14px] font-semibold mt-3"
                    style={{ color: LABEL.teal }}
                  >
                    ({scienceLabel(step.scienceTag)})
                  </p>
                )}
              </Card>
            ))}
          </div>

          {/* The supporting decisions around the lesson */}
          <hr className="border-0 border-t-2 mt-10 mb-7" style={{ borderColor: "#D9D6D2" }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <SectionLabel color={LABEL.blue} className="mb-3">
                Technology
              </SectionLabel>
              <p className="text-[15px] text-text-body leading-snug">
                {blueprint.tech || "No tech required."}
              </p>
              {blueprint.techPurpose && (
                <p className="text-[14px] mt-3" style={{ color: LABEL.coral }}>
                  Purpose: {blueprint.techPurpose}
                </p>
              )}
            </Card>

            <Card>
              <SectionLabel color={LABEL.teal} className="mb-3">
                AI extension
              </SectionLabel>
              <ul className="space-y-2">
                {(blueprint.aiPrompts ?? []).map((prompt, idx) => (
                  <li key={idx} className="text-[15px] text-text-body leading-snug">
                    · {prompt}
                  </li>
                ))}
              </ul>
              <p
                className="text-[14px] font-bold mt-3 leading-snug"
                style={{ color: LABEL.coral }}
              >
                AI = thinking partner, not an answer machine.
              </p>
            </Card>
          </div>

          <hr className="border-0 border-t-2 mt-10 mb-7" style={{ borderColor: "#D9D6D2" }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <SectionLabel color={LABEL.coral} className="mb-3">
                Assessment
              </SectionLabel>
              <ul className="space-y-2">
                {(blueprint.assessment ?? []).map((item, idx) => (
                  <CheckItem key={idx} color="var(--color-coral)">
                    {item}
                  </CheckItem>
                ))}
              </ul>
            </Card>

            <Card>
              <SectionLabel color={LABEL.rust} className="mb-3">
                Why this lesson works
              </SectionLabel>
              <ul className="space-y-1.5">
                {(blueprint.whyItWorks ?? []).map((reason, idx) => (
                  <li key={idx} className="text-[15px] text-text-body leading-snug">
                    · {reason}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Executive function supports */}
          {blueprint.efSupports?.length > 0 && (
            <Card>
              <SectionLabel color={LABEL.violet} className="mb-3">
                Executive function supports
              </SectionLabel>
              <div className="flex flex-wrap gap-2">
                {blueprint.efSupports.map((support, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[15px] text-charcoal"
                    style={{
                      backgroundColor: "rgba(0, 180, 166, 0.08)",
                      border: "1px solid rgba(0, 180, 166, 0.28)",
                    }}
                  >
                    <span style={{ color: "var(--color-teal)" }} aria-hidden="true">
                      ☑
                    </span>
                    {support}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* The thesis of the whole product */}
          <div className="rounded-2xl bg-gray-050 border border-hairline p-6 flex flex-wrap items-center justify-between gap-5">
            <p className="text-[16px] text-text-body max-w-xl leading-snug">
              <strong className="text-charcoal">The big idea:</strong>{" "}
              we don&apos;t just teach the standard.{" "}
              <span className="lg:whitespace-nowrap">
                We design the learning so students can actually learn.
              </span>
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: "Standard", color: "var(--color-navy)" },
                { label: "Learning science", color: "var(--color-teal)" },
                { label: "Meaningful learning", color: LABEL.violet },
              ].map((chip, idx) => (
                <div key={chip.label} className="flex items-center gap-3">
                  {idx > 0 && <span className="text-text-faint" aria-hidden="true">→</span>}
                  <span
                    className="inline-block px-4 py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-[0.08em] text-white"
                    style={{ backgroundColor: chip.color }}
                  >
                    {chip.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Where a teacher goes next */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={() => onOpenTab("resources")}
          className="inline-flex items-center min-h-[52px] px-6 rounded-xl font-semibold text-[15px] bg-charcoal text-white hover:bg-charcoal/90 transition-colors"
        >
          Pull resources to remix
        </button>
        <button
          onClick={() => onOpenTab("generate")}
          className="inline-flex items-center min-h-[52px] px-6 rounded-xl font-semibold text-[15px] border border-border-strong text-charcoal hover:bg-gray-050 transition-colors"
        >
          Make a student version with AI
        </button>
      </div>
    </div>
  );
}

/**
 * Vocabulary is authored either as a plain term or as a term with a kid-friendly
 * definition. Accept both, and treat an em-dashed string as term + definition.
 */
function vocabEntry(item) {
  if (item && typeof item === "object") {
    return {
      term: item.term ?? item.word ?? "",
      definition: item.definition ?? item.gloss ?? null,
    };
  }

  const [term, ...rest] = String(item).split(/\s+[—–-]\s+/);
  return { term, definition: rest.join(" — ") || null };
}

function UnpackTab({ unpack, standard, onOpenTab }) {
  if (!unpack) return <NotAuthoredYet what="deconstruction" />;

  const ladder = unpack.ladder ?? [];
  const vocabulary = (unpack.vocabulary ?? []).map(vocabEntry);
  const challenges = unpack.challenges ?? [];
  const priorStandards = unpack.priorStandards ?? [];
  const futureStandards = unpack.futureStandards ?? [];

  return (
    <div className="space-y-5">
      {/* What the standard actually asks for */}
      <div className="rounded-2xl border border-hairline overflow-hidden bg-white">
        <div className="px-8 py-7" style={{ backgroundColor: "var(--color-navy)" }}>
          <SectionLabel color="var(--color-teal)" className="mb-2">
            Deconstructed
          </SectionLabel>
          <h2 className="text-[22px] md:text-[26px] font-bold text-white leading-tight">
            {standard.code} — {standard.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline">
          <div className="p-6">
            <SectionLabel color={LABEL.crimson} className="mb-4">
              What students do (the verbs)
            </SectionLabel>
            <div className="space-y-3">
              {(unpack.verbs ?? []).map((verb, idx) => (
                <div key={idx} className="flex flex-wrap items-baseline gap-3">
                  <span
                    className="px-3 py-1.5 rounded-lg text-[15px] font-bold"
                    style={{
                      backgroundColor: "rgba(255, 106, 91, 0.12)",
                      color: LABEL.crimson,
                    }}
                  >
                    {verb.word}
                  </span>
                  {verb.gloss && (
                    <span className="text-[15px] text-text-body">{verb.gloss}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <SectionLabel color={LABEL.violet} className="mb-4">
              What they do it to (the concepts)
            </SectionLabel>
            <div className="flex flex-wrap gap-2">
              {(unpack.concepts ?? []).map((concept, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg text-[15px] font-bold"
                  style={{
                    backgroundColor: "rgba(184, 125, 255, 0.14)",
                    color: LABEL.violet,
                  }}
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The climb */}
      {ladder.length > 0 && (
        <Card>
          <SectionLabel color={LABEL.teal} className="mb-1">
            The skill ladder
          </SectionLabel>
          <p className="text-[15px] text-text-muted mb-5">
            Nobody jumps straight to the standard. This is the climb.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {ladder.map((rung, idx) => (
              <div key={idx} className="rounded-xl border border-hairline p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[12px] font-bold"
                    style={{ backgroundColor: "var(--color-teal)" }}
                  >
                    {idx + 1}
                  </span>
                  <p className="text-[15px] font-bold text-charcoal">{rung.name}</p>
                </div>
                {rung.descriptor && (
                  <p className="text-[15px] text-text-body leading-snug mb-4">
                    {rung.descriptor}
                  </p>
                )}
                {/* Fill grows with the rung, so the climb is visible at a glance */}
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${((idx + 1) / ladder.length) * 100}%`,
                      backgroundColor: "var(--color-teal)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* The words that gate the standard */}
      {vocabulary.length > 0 && (
        <Card>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
            <SectionLabel color={LABEL.amber}>Vocabulary students need</SectionLabel>
            <p className="text-[14px] text-text-faint">
              Kid-friendly definitions — front-load these before the lesson
            </p>
          </div>
          <p className="text-[15px] text-text-muted mb-5">
            Students can&apos;t master a standard whose words they don&apos;t own.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {vocabulary.map((entry, idx) => (
              <div
                key={idx}
                className="rounded-xl p-5"
                style={{ backgroundColor: "rgba(255, 177, 63, 0.09)" }}
              >
                <p className="text-[16px] font-bold text-charcoal mb-1">{entry.term}</p>
                {entry.definition && (
                  <p className="text-[15px] text-text-body leading-snug">
                    {entry.definition}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* What goes wrong, and the move that fixes it */}
      {challenges.length > 0 && (
        <Card>
          <SectionLabel color={LABEL.crimson} className="mb-1">
            Common misconceptions &amp; challenges
          </SectionLabel>
          <p className="text-[15px] text-text-muted mb-5">
            What you&apos;ll see in the room, and the move that fixes it.
          </p>
          <div className="space-y-3">
            {challenges.map((challenge, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden"
              >
                <div
                  className="p-5 flex gap-3"
                  style={{ backgroundColor: "rgba(255, 125, 174, 0.08)" }}
                >
                  <span
                    className="flex-shrink-0 font-bold"
                    style={{ color: LABEL.crimson }}
                    aria-hidden="true"
                  >
                    ✕
                  </span>
                  <div>
                    <SectionLabel color={LABEL.crimson} className="mb-1">
                      You&apos;ll see
                    </SectionLabel>
                    <p className="text-[16px] text-text-body leading-snug">
                      {challenge.problem}
                    </p>
                  </div>
                </div>
                <div
                  className="p-5 flex gap-3"
                  style={{ backgroundColor: "rgba(0, 180, 166, 0.07)" }}
                >
                  <span
                    className="flex-shrink-0 font-bold"
                    style={{ color: LABEL.teal }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <div>
                    <SectionLabel color={LABEL.teal} className="mb-1">
                      Try this
                    </SectionLabel>
                    <p className="text-[16px] text-text-body leading-snug">
                      {challenge.fix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Where this sits in the sequence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <SectionLabel color={LABEL.violet} className="mb-1">
            Prior knowledge
          </SectionLabel>
          <p className="text-[15px] text-text-muted mb-4">Where this skill came from</p>

          <div className="space-y-3">
            {priorStandards.map((prior) => (
              <div key={prior.code} className="flex flex-wrap items-baseline gap-3">
                <Link
                  href={standardHref(prior.code)}
                  className="px-2.5 py-1 rounded-md text-[13px] font-bold hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: "rgba(184, 125, 255, 0.16)",
                    color: LABEL.violet,
                  }}
                >
                  {prior.code}
                </Link>
                <span className="text-[16px] text-text-body leading-snug">
                  {prior.text}
                </span>
              </div>
            ))}
          </div>

          {unpack.priorSkills?.length > 0 && (
            <div className="mt-5">
              <SectionLabel color="var(--color-text-faint)" className="mb-2">
                They also need to be able to
              </SectionLabel>
              <ul className="space-y-1.5">
                {unpack.priorSkills.map((skill, idx) => (
                  <li key={idx} className="flex gap-2 text-[16px] text-text-body">
                    <span style={{ color: LABEL.violet }} aria-hidden="true">
                      →
                    </span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card>
          <SectionLabel color={LABEL.indigo} className="mb-1">
            Future learning
          </SectionLabel>
          <p className="text-[15px] text-text-muted mb-4">What this is building toward</p>

          <div className="space-y-3">
            {futureStandards.map((future) => (
              <div key={future.code} className="flex flex-wrap items-baseline gap-3">
                <Link
                  href={standardHref(future.code)}
                  className="px-2.5 py-1 rounded-md text-[13px] font-bold hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: "rgba(67, 56, 202, 0.12)",
                    color: LABEL.indigo,
                  }}
                >
                  {future.code}
                </Link>
                <span className="text-[16px] text-text-body leading-snug">
                  {future.text}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-hairline">
            <p className="text-[15px] text-text-muted leading-snug">
              If students leave this year shaky here, that&apos;s what shows up two
              grades later.
            </p>
          </div>
        </Card>
      </div>

      {/* The finish line */}
      {unpack.masteryStatement && (
        <div className="rounded-2xl border-2 border-charcoal bg-white p-7 flex flex-wrap items-center justify-between gap-5">
          <div className="max-w-xl">
            <SectionLabel color="var(--color-text-faint)" className="mb-2">
              You&apos;ve got it when…
            </SectionLabel>
            <p className="text-[20px] font-bold text-charcoal leading-snug">
              {unpack.masteryStatement}
            </p>
          </div>
          <button
            onClick={() => onOpenTab("resources")}
            className="inline-flex items-center min-h-[52px] px-6 rounded-xl font-semibold text-[15px] text-white bg-coral hover:bg-coral-press transition-colors flex-shrink-0"
          >
            Find resources for this →
          </button>
        </div>
      )}
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
              {/* Thumbnail — the resource's own video still */}
              <a
                href={`/resources/${resource.id}`}
                className="flex-shrink-0 w-40 h-32 bg-gray-100 rounded-lg overflow-hidden block"
              >
                {resource.thumbnail_url ? (
                  <img
                    src={resource.thumbnail_url}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
              </a>

              {/* Content */}
              <div className="flex-1">
                <div className="mb-3">
                  <h4 className="text-[18px] font-bold mb-2">{resource.title}</h4>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase px-2 py-1 bg-gray-100 text-text-faint rounded">
                      {resource.purpose}
                    </span>
                    <span className="text-xs font-bold uppercase px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      {resource.grade_band}
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

                <div className="flex gap-3 flex-wrap">
                  <a
                    href={`/resources/${resource.id}`}
                    className="inline-flex items-center min-h-[40px] px-4 bg-charcoal text-white rounded-lg font-semibold text-sm hover:bg-charcoal/90 transition-colors"
                  >
                    Open resource
                  </a>
                  {resource.youtube_url && (
                    <a
                      href={resource.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center min-h-[40px] px-4 border border-border rounded-lg font-semibold text-sm hover:bg-gray-050 transition-colors"
                    >
                      Watch
                    </a>
                  )}
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

function GenerateTab({ standard_code, blueprint, unpack }) {
  const [selectedFormat, setSelectedFormat] = useState("presentation");
  const [studentNeeds, setStudentNeeds] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { isPremium } = useAuth();
  const isFree = !isPremium;

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
        // Surface the server's reason instead of a bare "Generation failed"
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.error || `Generation failed (${response.status})`);
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
