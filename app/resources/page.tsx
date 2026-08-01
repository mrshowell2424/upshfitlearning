'use client'

// @ts-nocheck
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ResourceCard from "@/app/components/ResourceCard";

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
  const [purpose, setPurpose] = useState("all");
  const [purposeDropdownOpen, setPurposeDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  useEffect(() => {
    setPage(parseInt(searchParams.get('page') || "1"));
    setSearch(searchParams.get('search') || "");
    setFilterType(searchParams.get('filter') || "all");
    setPurpose(searchParams.get('purpose') || "all");
  }, [searchParams]);

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
  ];

  const [items, setItems] = useState<Resource[]>(sampleResources);
  const [total, setTotal] = useState(sampleResources.length);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 30;

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const url = new URL('/api/resources', typeof window !== 'undefined' ? window.location.origin : 'https://hub.upshiftlearning.com');
        url.searchParams.set('page', page.toString());
        if (search) {
          url.searchParams.set('search', search);
        }
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setItems(data.items || sampleResources);
        setTotal(data.total || sampleResources.length);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('Error fetching resources:', error);
        // Keep sample data visible even if fetch fails
      }
    };

    fetchResources();
  }, [page, search]);

  const sortParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('sort') || 'newest' : 'newest';

  // Get unique purposes for filter
  const uniquePurposes = Array.from(new Set(items.map(item => item.purpose).filter(Boolean))).sort();

  // Filter items based on filter type and purpose
  let filteredItems = items;
  if (filterType === 'free') {
    filteredItems = items.filter(item => item.is_free);
  } else if (filterType === 'paid') {
    filteredItems = items.filter(item => !item.is_free);
  }

  if (purpose !== 'all') {
    filteredItems = filteredItems.filter(item => item.purpose === purpose);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 flex">
        {/* Main content */}
        <main className="flex-1 px-8 py-8">
          <div className="mb-6">
            <h1 className="text-[34px] font-bold mb-2">Resource library</h1>
            <p className="text-text-muted">
              {filteredItems.length} of {total} resources
            </p>
          </div>

          {/* Sort and Filter controls */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="px-3 py-1 rounded-full text-sm font-semibold bg-charcoal text-white border border-border cursor-pointer hover:bg-charcoal/90 flex items-center gap-2"
              >
                {sortParam === "newest" ? "Newest" : sortParam === "oldest" ? "Oldest" : sortParam === "a-z" ? "A–Z" : "Popular"}
                <svg className={`w-4 h-4 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {sortDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-border rounded-lg shadow-lg z-10 min-w-max">
                  <a
                    href={`/resources?sort=newest${filterType !== 'all' ? `&filter=${filterType}` : ''}${purpose !== 'all' ? `&purpose=${purpose}` : ''}`}
                    onClick={() => setSortDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 ${sortParam === 'newest' ? 'bg-gray-50 font-semibold' : ''}`}
                  >
                    Newest
                  </a>
                  <a
                    href={`/resources?sort=oldest${filterType !== 'all' ? `&filter=${filterType}` : ''}${purpose !== 'all' ? `&purpose=${purpose}` : ''}`}
                    onClick={() => setSortDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 ${sortParam === 'oldest' ? 'bg-gray-50 font-semibold' : ''}`}
                  >
                    Oldest
                  </a>
                  <a
                    href={`/resources?sort=a-z${filterType !== 'all' ? `&filter=${filterType}` : ''}${purpose !== 'all' ? `&purpose=${purpose}` : ''}`}
                    onClick={() => setSortDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 ${sortParam === 'a-z' ? 'bg-gray-50 font-semibold' : ''}`}
                  >
                    A–Z
                  </a>
                  <a
                    href={`/resources?sort=popular${filterType !== 'all' ? `&filter=${filterType}` : ''}${purpose !== 'all' ? `&purpose=${purpose}` : ''}`}
                    onClick={() => setSortDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 ${sortParam === 'popular' ? 'bg-gray-50 font-semibold' : ''}`}
                  >
                    Popular
                  </a>
                </div>
              )}
            </div>

            {/* Free/Paid filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-charcoal border border-border cursor-pointer hover:bg-gray-200 flex items-center gap-2"
              >
                {filterType === "all" ? "All resources" : filterType === "free" ? "Free" : "Paid"}
                <svg className={`w-4 h-4 transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {filterDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-border rounded-lg shadow-lg z-10 min-w-max">
                  <a
                    href={`/resources?filter=all${purpose !== 'all' ? `&purpose=${purpose}` : ''}`}
                    onClick={() => setFilterDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 ${filterType === 'all' ? 'bg-gray-50 font-semibold' : ''}`}
                  >
                    All resources
                  </a>
                  <a
                    href={`/resources?filter=free${purpose !== 'all' ? `&purpose=${purpose}` : ''}`}
                    onClick={() => setFilterDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 ${filterType === 'free' ? 'bg-gray-50 font-semibold' : ''}`}
                  >
                    Free
                  </a>
                  <a
                    href={`/resources?filter=paid${purpose !== 'all' ? `&purpose=${purpose}` : ''}`}
                    onClick={() => setFilterDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 ${filterType === 'paid' ? 'bg-gray-50 font-semibold' : ''}`}
                  >
                    Paid
                  </a>
                </div>
              )}
            </div>

            {/* Purpose filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setPurposeDropdownOpen(!purposeDropdownOpen)}
                className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-charcoal border border-border cursor-pointer hover:bg-gray-200 flex items-center gap-2"
              >
                {purpose === "all" ? "All purposes" : purpose}
                <svg className={`w-4 h-4 transition-transform ${purposeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {purposeDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-border rounded-lg shadow-lg z-10 min-w-max">
                  <a
                    href={`/resources?purpose=all${filterType !== 'all' ? `&filter=${filterType}` : ''}`}
                    onClick={() => setPurposeDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 ${purpose === 'all' ? 'bg-gray-50 font-semibold' : ''}`}
                  >
                    All purposes
                  </a>
                  {uniquePurposes.map((p) => (
                    <a
                      key={p}
                      href={`/resources?purpose=${p}${filterType !== 'all' ? `&filter=${filterType}` : ''}`}
                      onClick={() => setPurposeDropdownOpen(false)}
                      className={`block px-4 py-2 text-sm hover:bg-gray-100 ${purpose === p ? 'bg-gray-50 font-semibold' : ''}`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </div>
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
    <Suspense fallback={<div className="flex flex-col min-h-screen"><div className="flex-1 px-8 py-8"><div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div></div></div>}>
      <ResourcesContent />
    </Suspense>
  );
}
