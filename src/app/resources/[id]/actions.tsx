"use client";

import { useAuth } from "@/providers/AuthProvider";

// One shared shape for the buttons so they read as a set
const BUTTON_BASE =
  "flex w-full items-center justify-center gap-2 rounded-lg py-2 font-semibold transition-colors text-center";

export function ResourceActions({
  docUrl,
  youtubeUrl,
  isFree = true,
}: {
  docUrl?: string | null;
  youtubeUrl?: string | null;
  isFree?: boolean;
}) {
  const { isPremium } = useAuth();

  // A paid resource is only locked for teachers without All-Access. This used to
  // key off the resource alone, so a subscriber was blocked from what they had
  // paid for.
  if (!isFree && !isPremium) {
    return (
      <div className="text-center">
        <p className="text-text-muted text-sm mb-3">
          This resource is part of All-Access
        </p>
        <a
          href="/pricing"
          className={`${BUTTON_BASE} bg-charcoal text-white hover:bg-charcoal/90`}
        >
          See plans
        </a>
      </div>
    );
  }

  return (
    <>
      {docUrl && (
        <a
          href={docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${BUTTON_BASE} bg-coral text-white hover:bg-coral-press mb-3`}
        >
          Open Google Slides
        </a>
      )}

      {youtubeUrl && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${BUTTON_BASE} border border-border text-charcoal hover:bg-gray-050`}
        >
          <svg className="w-4 h-4 text-coral" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
          </svg>
          Watch on YouTube
        </a>
      )}
    </>
  );
}
