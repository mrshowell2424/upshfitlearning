"use client";

import { useState } from "react";

/**
 * Copies a prompt that is already built on the server.
 *
 * The whole text travels in the prop, so the click has nothing to fetch and
 * nothing to assemble. That is the point of the prompt: a teacher presses
 * this, pastes once, and the student has the story in front of them.
 */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          // Clipboard refused (an insecure origin, or permission denied).
          // The prompt is printed further down the page, so there is still a
          // way to get it; saying nothing would be the unhelpful part.
          setDone(false);
          alert("Copying was blocked. The full prompt is at the bottom of this page.");
        }
      }}
      // This is the primary action on the page -- the reason the prompt exists
      // -- and it used to look identical to the three buttons beside it. Filled
      // against their outlines, it reads as the one to press.
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 13,
        fontWeight: 700,
        borderRadius: 100,
        padding: "9px 20px",
        cursor: "pointer",
        border: "1.5px solid #111111",
        background: "#111111",
        color: "#FFFFFF",
      }}
    >
      {done ? "✓ Copied" : "\u{1F4CB} " + label}
    </button>
  );
}
