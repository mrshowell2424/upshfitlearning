"use client";

import { useAuth } from "@/providers/AuthProvider";

// One shared shape for the buttons so they read as a set
const BUTTON_BASE =
  "flex w-full items-center justify-center gap-2 rounded-lg py-2 font-semibold transition-colors text-center";

/** Where the resources are shared from, and the walkthrough for joining. */
const GOLD_GROUP_URL = "https://bit.ly/GoldHello";
const GOLD_HELP_VIDEO = "https://www.youtube.com/watch?v=ADkUZD7skQE";

/**
 * Answers the "request access" screen before a teacher meets it.
 *
 * The linked file is shared with the Gold EDU Google group, so anyone outside
 * it lands on Google's request-access page — and Google's own wording gives no
 * hint that joining a group is what unlocks it. A teacher who requests access
 * then waits for a reply that only tells them the same thing.
 *
 * It sits under the button rather than above it because it is a contingency,
 * not a precondition: most teachers are already in the group and should not be
 * made to read an instruction that does not apply to them.
 */
function AccessNote() {
  return (
    <div className="mt-3 rounded-lg border border-border bg-gray-050 p-3 text-xs leading-relaxed text-text-muted">
      <p>
        <span className="font-semibold text-charcoal">
          Asked to request access?
        </span>{" "}
        This resource is shared through the Gold EDU Google group. Join once and
        the material opens for you — there is no need to send a request.
      </p>
      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        <a
          href={GOLD_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-coral hover:underline"
        >
          Join the group
        </a>
        <a
          href={GOLD_HELP_VIDEO}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-charcoal hover:underline"
        >
          Watch how
        </a>
      </p>
    </div>
  );
}

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
          Free with an account
        </p>
        <a
          href="/auth/signup"
          className={`${BUTTON_BASE} bg-charcoal text-white hover:bg-charcoal/90`}
        >
          Create a free account
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
          Open Resource
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

      {/* Below both, so the buttons keep reading as a set. Only where there
          is a linked file to be locked out of. */}
      {docUrl && <AccessNote />}
    </>
  );
}
