'use client'

// @ts-nocheck
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ResourceCard from "@/components/shared/ResourceCard";
import { RESOURCE_TOTAL } from "@/lib/constants/totals";

interface Resource {
  id: string;
  title: string;
  purpose: string;
  format: string;
  grade_band: string;
  skill: string;
  is_free: boolean;
  published_at: string | Date;
  thumbnail_url?: string;
}

function ResourcesContent() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [category, setCategory] = useState("all");
  
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // What is in the box, as against what has been searched for. Kept apart
  // because `search` triggers a fetch, and firing one per keystroke would
  // search the library thirteen times for "multiplication".
  const [searchInput, setSearchInput] = useState("");

  const [sort, setSort] = useState("newest");

  useEffect(() => {
    setPage(parseInt(searchParams.get('page') || "1"));
    setSearch(searchParams.get('search') || "");
    setSearchInput(searchParams.get('search') || "");
    setFilterType(searchParams.get('filter') || "all");
    setCategory(searchParams.get('category') || "all");
    setSort(searchParams.get('sort') || "newest");
  }, [searchParams]);

  // Settle for a moment before searching, so results arrive as you stop typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch((current) => {
        if (current === searchInput) return current;
        setPage(1);
        return searchInput;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const sampleResources: Resource[] = [
    { id: "1", title: "Text Evidence Anchor Chart", purpose: "Understand how to find and cite text evidence", format: "Anchor Chart", grade_band: "K-2", skill: "Reading Comprehension", is_free: true, published_at: "2024-01-15T00:00:00.000Z" },
    { id: "2", title: "RL.2.1 Lesson Plan Bundle", purpose: "Teach students to ask and answer questions about key details", format: "Lesson Plan", grade_band: "1-3", skill: "Literature", is_free: true, published_at: "2024-01-10T00:00:00.000Z" },
    { id: "3", title: "Inferencing Strategy Guide", purpose: "Help students make inferences from text", format: "Guide", grade_band: "3-5", skill: "Reading Comprehension", is_free: true, published_at: "2024-01-05T00:00:00.000Z" },
    { id: "4", title: "Math Word Problems Grade 3", purpose: "Practice solving multi-step word problems", format: "Worksheet", grade_band: "2-4", skill: "Math", is_free: true, published_at: "2024-01-08T00:00:00.000Z" },
    { id: "5", title: "Science Observation Journal", purpose: "Record and analyze scientific observations", format: "Template", grade_band: "3-6", skill: "Science", is_free: true, published_at: "2024-01-12T00:00:00.000Z" },
    { id: "6", title: "Social Studies Timeline Activity", purpose: "Create timelines of historical events", format: "Activity", grade_band: "4-8", skill: "Social Studies", is_free: false, published_at: "2024-01-20T00:00:00.000Z" },
    { id: "7", title: "Phonics Intervention Program", purpose: "Support struggling readers with phonetic instruction", format: "Program", grade_band: "K-2", skill: "Phonics", is_free: false, published_at: "2024-01-18T00:00:00.000Z" },
    { id: "8", title: "Multiplication Fact Fluency Games", purpose: "Build speed and accuracy with multiplication facts", format: "Game", grade_band: "2-4", skill: "Math", is_free: true, published_at: "2024-01-14T00:00:00.000Z" },
    { id: "9", title: "Fraction Concepts Visual Guide", purpose: "Understand fractions through visual models", format: "Video", grade_band: "3-5", skill: "Math", is_free: true, published_at: "2024-01-11T00:00:00.000Z" },
    { id: "10", title: "Earth Systems Unit Plan", purpose: "Comprehensive unit on earth systems and weather", format: "Unit Plan", grade_band: "5-8", skill: "Science", is_free: false, published_at: "2024-01-19T00:00:00.000Z" },
    { id: "11", title: "Advanced Grammar Mastery Course", purpose: "Complete grammar instruction and practice", format: "Course", grade_band: "6-8", skill: "Grammar", is_free: false, published_at: "2024-01-21T00:00:00.000Z" },
    { id: "12", title: "Writing Workshop Bundle", purpose: "Comprehensive writing instruction and examples", format: "Bundle", grade_band: "4-6", skill: "Writing", is_free: false, published_at: "2024-01-22T00:00:00.000Z" },
    { id: "13", title: "Literacy Assessment Tools", purpose: "Complete assessment suite for literacy", format: "Assessment", grade_band: "3-5", skill: "Reading", is_free: false, published_at: "2024-01-23T00:00:00.000Z" },
  ];

  const [items, setItems] = useState<Resource[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ value: string; count: number }[]>([]);
  const [accessCounts, setAccessCounts] = useState({ free: 0, paid: 0 });
  
  const pageSize = 30;

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const url = new URL('/api/resources', typeof window !== 'undefined' ? window.location.origin : 'https://hub.upshiftlearning.com');
        url.searchParams.set('page', page.toString());
        if (search) {
          url.searchParams.set('search', search);
        }
        // Filtering happens server-side against the whole sheet — filtering the
        // 30-item page client-side would only ever search the current page.
        if (category !== 'all') {
          url.searchParams.set('category', category);
        }
        if (filterType !== 'all') {
          url.searchParams.set('access', filterType);
        }
        // Ordering is the API's job too, for the same reason: it has the whole
        // library, and this page only ever holds thirty rows of it.
        url.searchParams.set('sort', sort);
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setItems(data.items || []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 0);
        setCategories(data.categories || []);
        setAccessCounts(data.accessCounts || { free: 0, paid: 0 });
      } catch (error) {
        console.error('Error fetching resources:', error);
        // Fall back to sample data so the page still renders something
        setItems(sampleResources);
        setTotal(sampleResources.length);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [page, search, category, filterType, sort]);

  // The API already applied the access and category filters across the whole
  // library, so `items` is the current page of results as-is.
  const filteredItems = items;

  

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 flex">
        {/* Sidebar with filters */}
        <aside className="w-80 px-5 md:px-8 py-8 border-r border-border bg-white">
          <div className="space-y-8">
            {/* Access filter */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-charcoal mb-3">Access</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterType === 'free'}
                    onChange={() => {
                      setFilterType(filterType === 'free' ? 'all' : 'free');
                      setPage(1);
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-charcoal">Free</span>
                  <span className="text-xs text-text-muted ml-auto">{accessCounts.free}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterType === 'paid'}
                    onChange={() => {
                      setFilterType(filterType === 'paid' ? 'all' : 'paid');
                      setPage(1);
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-charcoal">All-Access</span>
                  <span className="text-xs text-text-muted ml-auto">{accessCounts.paid}</span>
                </label>
              </div>
            </div>

            {/* Category filter — five buckets covering the whole library */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-charcoal mb-3">Category</h3>
              <div className="space-y-1">
                {categories.map((c) => (
                  <label
                    key={c.value}
                    className="flex items-center gap-2 cursor-pointer min-h-[36px] rounded-md px-1 -mx-1 hover:bg-gray-050"
                  >
                    <input
                      type="checkbox"
                      checked={category === c.value}
                      onChange={() => {
                        setCategory(category === c.value ? 'all' : c.value);
                        setPage(1);
                      }}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-charcoal">{c.value}</span>
                    <span className="text-xs text-text-muted ml-auto">{c.count}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-5 md:px-8 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-[34px] font-bold mb-2">Resource library</h1>
                <p className="text-text-muted">
                  {search || filterType !== 'all' || category !== 'all'
                    ? `${total.toLocaleString()} matching • ${RESOURCE_TOTAL.toLocaleString()} in the library`
                    : `${total.toLocaleString()} in the library`}
                </p>
              </div>
              {/* Only offered when there is something to clear — the button was
                  previously always shown and wired to nothing at all. */}
              {(search || filterType !== 'all' || category !== 'all') && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    setSearch('');
                    setFilterType('all');
                    setCategory('all');
                    setPage(1);
                  }}
                  className="shrink-0 text-sm font-semibold text-charcoal border border-border px-3 py-1.5 rounded-lg hover:bg-gray-050"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Searches the whole library server-side, not the page on screen */}
            <div className="relative mt-5">
              <span
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint"
              >
                ⌕
              </span>
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, skill or purpose — try “fractions” or “phonics”"
                aria-label="Search the resource library"
                className="w-full min-h-[48px] pl-10 pr-4 rounded-xl border border-border-strong bg-white text-[15px] text-charcoal placeholder:text-text-faint focus:outline-none focus:border-charcoal transition-colors"
              />
            </div>
          </div>

          {/*
            Buttons rather than links. As links each one navigated to a URL it
            rebuilt from the filters alone, so choosing a sort order silently
            discarded whatever had been typed into search — and reloaded the
            whole page to do it. These behave like the sidebar checkboxes.
          */}
          <div className="flex gap-2 mb-6" role="group" aria-label="Sort resources">
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'oldest', label: 'Oldest first' },
              { value: 'a-z', label: 'A–Z' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSort(option.value);
                  setPage(1);
                }}
                aria-pressed={sort === option.value}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  sort === option.value
                    ? 'bg-charcoal text-white'
                    : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-16 border-2 border-dashed border-hairline rounded-[16px]">
              <p className="text-text-muted mb-4">Loading resources...</p>
              <p className="text-sm text-text-muted">Fetching your resources from the library...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {filteredItems.map((item) => (
                  <ResourceCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    purpose={item.purpose || ""}
                    format={item.format || "Link"}
                    grade_band={item.grade_band || "3-8"}
                    skill={item.skill || "General"}
                    youtube_id=""
                    published_at={typeof item.published_at === 'string' ? item.published_at : item.published_at?.toISOString()}
                    is_free={item.is_free}
                    thumbnail_url={item.thumbnail_url}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-8">
                {page > 1 && (
                  <a
                    href={`/resources?page=${page - 1}`}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    Previous
                  </a>
                )}
                <span className="px-4 py-2 text-sm text-text-muted">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <a
                    href={`/resources?page=${page + 1}`}
                    className="px-4 py-2 rounded-lg bg-coral text-white hover:bg-coral-press"
                  >
                    Show 30 more
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-hairline rounded-[16px]">
              <p className="text-text-muted mb-4">No resources found</p>
              <p className="text-sm text-text-muted">Try adjusting your search or filters</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div className="flex flex-col min-h-screen"><div className="flex-1 px-5 md:px-8 py-8"><div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div></div></div>}>
      <ResourcesContent />
    </Suspense>
  );
}
