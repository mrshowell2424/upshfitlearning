// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const exampleSearches = [
  "RL.2.1",
  "determine main idea",
  "RI.4.2",
  "context clues",
];

export default function MatchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    // First, try direct code match
    if (searchTerm.match(/^[A-Z]{1,2}\.\d\.\d+$/i)) {
      router.push(`/match/${encodeURIComponent(searchTerm.toUpperCase())}`);
      return;
    }

    // Otherwise, search by description/skills
    setSearching(true);
    try {
      const response = await fetch(
        `/api/search-standards?q=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setResults(data.results || []);

      // If exactly one result, go directly to it
      if (data.results && data.results.length === 1) {
        router.push(`/match/${data.results[0].code}`);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center px-8 py-16">
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
          <h1 className="text-[54px] font-bold text-center mb-4 leading-[1.04]">
            What are you teaching?
          </h1>

          {/* Subheading */}
          <p className="text-center text-[18px] text-text-muted mb-8">
            Enter a standard code or describe what you're teaching
          </p>

          {/* Search bar */}
          <div className="flex gap-2 mb-6">
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
              className="px-6 py-3 rounded-[10px] font-semibold text-white transition-colors"
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
                    className="px-4 py-2 rounded-full text-sm font-medium border border-border-strong hover:bg-gray-050 transition-colors"
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
                {results.map((result) => (
                  <button
                    key={result.code}
                    onClick={() => router.push(`/match/${result.code}`)}
                    className="w-full text-left border border-border rounded-lg p-4 hover:bg-gray-050 transition-colors"
                  >
                    <div className="font-bold text-charcoal mb-1">{result.code}</div>
                    <p className="text-sm text-text-body">{result.name}</p>
                    {result.skills && result.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-gray-100 text-text-faint px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-1 mt-16 border border-hairline rounded-[14px] overflow-hidden">
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
