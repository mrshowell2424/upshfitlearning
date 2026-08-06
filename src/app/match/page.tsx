// @ts-nocheck
"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { isStandardCode, standardHref, standardTheme } from "@/lib/utils/standards";

const exampleSearches = [
  "RL.2.1",
  "determine main idea",
  "RI.4.2",
  "context clues",
];

function MatchPageContent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useCallback(
    async (searchTerm: string) => {
      const trimmed = searchTerm.trim();
      if (!trimmed) return;

      // Anything shaped like a code goes straight to the standard detail page
      if (isStandardCode(trimmed)) {
        router.push(standardHref(trimmed));
        return;
      }

      // Otherwise, search by description/skills
      setSearching(true);
      try {
        const response = await fetch(
          `/api/search-standards?q=${encodeURIComponent(trimmed)}`
        );
        const data = await response.json();
        setResults(data.results || []);

        // If exactly one result, go directly to it
        if (data.results && data.results.length === 1) {
          router.push(standardHref(data.results[0].code));
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setSearching(false);
      }
    },
    [router]
  );

  // Honor ?q= so links into this page (e.g. from the home page) actually search
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams, handleSearch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center px-5 md:px-8 py-16">
        <div className="w-full max-w-2xl">
          {/* Eyebrow */}
          <div className="text-center mb-6">
            <p
              className="text-[15px] font-bold uppercase tracking-[0.14em] mb-6"
              style={{ color: "var(--color-teal)" }}
            >
              STANDARD MATCHER
            </p>
          </div>

          {/* Heading */}
          <h1 className="text-[34px] sm:text-[44px] md:text-[54px] font-bold text-center mb-4 leading-[1.06] md:leading-[1.04]">
            What are you teaching?
          </h1>

          {/* Subheading */}
          <p className="text-center text-base md:text-[18px] text-text-muted mb-8">
            Enter a standard code or describe what you're teaching
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(query);
              }}
              placeholder="RL.2.1 — or 'text evidence with 2nd graders'"
              className="flex-1 px-5 py-3 rounded-[14px] border border-border-strong focus:outline-none focus:border-charcoal"
              style={{ backgroundColor: "white" }}
            />
            <button
              onClick={() => handleSearch(query)}
              className="px-6 min-h-[48px] rounded-[10px] font-semibold text-white transition-colors flex-shrink-0"
              style={{
                backgroundColor: "var(--color-coral)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-coral-press)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-coral)")
              }
            >
              Match my standard
            </button>
          </div>

          {/* Example chips */}
          {results.length === 0 && (
            <div className="text-center">
              <p className="text-sm text-text-muted mb-3">Try:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {exampleSearches.map((example) => (
                  <button
                    key={example}
                    onClick={() => handleSearch(example)}
                    className="inline-flex items-center min-h-[44px] px-4 rounded-full text-sm font-medium border border-border-strong hover:bg-gray-050 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search results */}
          {results.length > 0 && (
            <div className="mt-8">
              <p className="text-sm text-text-muted mb-4">
                Found {results.length} standard{results.length !== 1 ? "s" : ""}:
              </p>
              <div className="space-y-3">
                {results.map((result) => {
                  const theme = standardTheme(result.code);
                  return (
                    <button
                      key={result.code}
                      onClick={() => router.push(standardHref(result.code))}
                      className="w-full text-left border border-border rounded-lg p-4 pl-5 border-l-4 hover:shadow-md transition-shadow"
                      style={{
                        borderLeftColor: theme.accent,
                        backgroundColor: theme.tint,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-charcoal">{result.code}</span>
                        <span
                          className="text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: theme.chip, color: theme.accent }}
                        >
                          {theme.label}
                        </span>
                      </div>
                      <p className="text-sm text-text-body">{result.name}</p>
                      {result.skills && result.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs px-2 py-1 rounded text-charcoal"
                              style={{ backgroundColor: theme.chip }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 mt-10 md:mt-16 border border-hairline rounded-[14px] overflow-hidden">
            <div className="bg-gray-050 p-4 text-center border-r border-hairline">
              <p
                className="text-[30px] font-bold"
                style={{ color: "var(--color-coral)" }}
              >
                2,688
              </p>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-text-faint">
                Resources
              </p>
            </div>
            <div className="bg-gray-050 p-4 text-center border-r border-hairline">
              <p
                className="text-[30px] font-bold"
                style={{ color: "var(--color-lavender)" }}
              >
                93
              </p>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-text-faint">
                Video Courses
              </p>
            </div>
            <div className="bg-gray-050 p-4 text-center border-r border-hairline">
              <p
                className="text-[30px] font-bold"
                style={{ color: "var(--color-teal)" }}
              >
                K–8
              </p>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-text-faint">
                Grade Range
              </p>
            </div>
            <div className="bg-gray-050 p-4 text-center">
              <p
                className="text-[30px] font-bold"
                style={{ color: "var(--color-pink)" }}
              >
                12
              </p>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-text-faint">
                Learning Principles
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function MatchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen">
          <div className="flex-1 px-5 md:px-8 py-16">
            <div className="max-w-2xl mx-auto h-64 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      }
    >
      <MatchPageContent />
    </Suspense>
  );
}
