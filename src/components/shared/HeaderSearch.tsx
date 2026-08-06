"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isStandardCode, standardHref } from "@/lib/utils/standards";

/**
 * Search without leaving the page. A standard code always jumps straight to that
 * standard; plain language goes wherever suits the context — the standard matcher
 * when you're already looking at standards, otherwise the resource library.
 */
export default function HeaderSearch({
  variant = "bar",
  searches = "resources",
  placeholder,
}: {
  variant?: "bar" | "panel";
  searches?: "resources" | "standards";
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (isStandardCode(trimmed)) {
      router.push(standardHref(trimmed));
    } else if (searches === "standards") {
      router.push(`/match?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/resources?search=${encodeURIComponent(trimmed)}`);
    }
    setQuery("");
  };

  const isPanel = variant === "panel";

  return (
    <form
      onSubmit={submit}
      role="search"
      className={
        isPanel
          ? "flex items-center gap-2 w-full rounded-lg border border-border-strong bg-white px-3"
          : "flex items-center gap-2 w-full max-w-[22rem] rounded-full border border-border-strong bg-white px-3 focus-within:border-charcoal transition-colors"
      }
    >
      <svg
        className="w-4 h-4 flex-shrink-0 text-text-faint"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder ?? "Search resources or RL.2.1"}
        aria-label={placeholder ?? "Search resources or a standard"}
        className={`flex-1 min-w-0 bg-transparent outline-none placeholder:text-text-faint ${
          isPanel ? "py-3 text-base" : "py-2 text-[13px]"
        }`}
      />

      {query.trim() && (
        <button
          type="submit"
          className="flex-shrink-0 text-[12px] font-bold uppercase tracking-[0.06em] text-coral hover:text-coral-press transition-colors"
        >
          Go
        </button>
      )}
    </form>
  );
}
