"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth";

// One shared shape for all three buttons so they read as a set
const BUTTON_BASE =
  "flex w-full items-center justify-center gap-2 rounded-lg py-2 font-semibold transition-colors text-center";

export function ResourceActions({
  docUrl,
  youtubeUrl,
  youtubeId,
}: {
  docUrl?: string | null;
  youtubeUrl?: string | null;
  youtubeId?: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "saving" | "saved" | "already" | "signin" | "error"
  >("idle");

  const saveToPlanner = async () => {
    if (!youtubeId) return;
    setStatus("saving");

    try {
      // supabase is a stub when the Supabase env vars are absent
      if (!supabase?.auth?.getSession) {
        setStatus("signin");
        router.push(`/auth/signin?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setStatus("signin");
        router.push(`/auth/signin?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      const response = await fetch("/api/planner/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ youtube_id: youtubeId }),
      });

      if (response.status === 401) {
        setStatus("signin");
        router.push(`/auth/signin?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      if (!response.ok) throw new Error(`Save failed: ${response.status}`);

      const data = await response.json();
      setStatus(data.alreadySaved ? "already" : "saved");
    } catch (error) {
      console.error("Error saving to planner:", error);
      setStatus("error");
    }
  };

  const saveLabel = {
    idle: "Save to planner",
    saving: "Saving…",
    saved: "Saved to planner ✓",
    already: "Already in your planner",
    signin: "Sign in to save",
    error: "Couldn't save — try again",
  }[status];

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
          className={`${BUTTON_BASE} border border-border text-charcoal hover:bg-gray-050 mb-3`}
        >
          <svg className="w-4 h-4 text-coral" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
          </svg>
          Watch on YouTube
        </a>
      )}

      <button
        onClick={saveToPlanner}
        disabled={status === "saving" || status === "saved" || !youtubeId}
        className={`${BUTTON_BASE} border border-border text-charcoal hover:bg-gray-050 disabled:opacity-70 disabled:hover:bg-transparent`}
      >
        {saveLabel}
      </button>
    </>
  );
}
