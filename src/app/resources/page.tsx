'use client'

// @ts-nocheck
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ResourceCard from "@/components/shared/ResourceCard";

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
    { id: "11", title: "Advanced Grammar Mastery Course", purpose: "Complete grammar instruction and practice", format: "Course", grade_band: "6-8", skill: "Grammar", is_free: false, published_at: "2024-01-21T00:00:00.000Z" },
    { id: "12", title: "Writing Workshop Bundle", purpose: "Comprehensive writing instruction and examples", format: "Bundle", grade_band: "4-6", skill: "Writing", is_free: false, published_at: "2024-01-22T00:00:00.000Z" },
    { id: "13", title: "Literacy Assessment Tools", purpose: "Complete assessment suite for literacy", format: "Assessment", grade_band: "3-5", skill: "Reading", is_free: false, published_at: "2024-01-23T00:00:00.000Z" },
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
        const allItems = [...(data.items || []), ...sampleResources.filter(s => !s.is_free)];
        setItems(allItems.length > 0 ? allItems : sampleResources);
        setTotal(allItems.length > 0 ? allItems.length : sampleResources.length);
        setTotalPages(Math.ceil((allItems.length > 0 ? allItems.length : sampleResources.length) / 30));
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
  const uniqueGradeBands = Array.from(new Set(items.map(item => item.grade_band).filter(Boolean))).sort();

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

  // Helper function to get count for filter
  const getFilterCount = (type: string, value: string) => {
    let count = items.length;
    if (type === 'access') {
      if (value === 'free') count = items.filter(i => i.is_free).length;
      else if (value === 'all-access') count = items.filter(i => !i.is_free).length;
    } else if (type === 'purpose' && value !== 'all') {
      count = items.filter(i => i.purpose === value).length;
    } else if (type === 'grade' && value !== 'all') {
      count = items.filter(i => i.grade_band === value).length;
    }
    return count;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 flex">
        {/* Sidebar with filters */}
        <aside className="w-80 px-8 py-8 border-r border-border bg-white">
          <div className="space-y-8">
            {/* Access filter */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-charcoal mb-3">Access</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterType === 'free'}
                    onChange={() => setFilterType(filterType === 'free' ? 'all' : 'free')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-charcoal">Free</span>
                  <span className="text-xs text-text-muted ml-auto">{getFilterCount('access', 'free')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterType === 'paid'}
                    onChange={() => setFilterType(filterType === 'paid' ? 'all' : 'paid')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-charcoal">All-Access</span>
                  <span className="text-xs text-text-muted ml-auto">{getFilterCount('access', 'all-access')}</span>
                </label>
              </div>
            </div>

            {/* Grade Levels filter */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-charcoal mb-3">Grade levels</h3>
              <div className="space-y-2">
                {uniqueGradeBands.map((grade) => (
                  <label key={grade} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm text-charcoal">{grade}</span>
                    <span className="text-xs text-text-muted ml-auto">{getFilterCount('grade', grade)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Purpose filter */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-charcoal mb-3">Purpose</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {uniquePurposes.slice(0, 5).map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={purpose === p}
                      onChange={() => setPurpose(purpose === p ? 'all' : p)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-charcoal">{p}</span>
                    <span className="text-xs text-text-muted ml-auto">{getFilterCount('purpose', p)}</span>
                  </label>
                ))}
                {uniquePurposes.length > 5 && (
                  <button className="text-coral font-semibold text-sm hover:text-coral-press">
                    Show all {uniquePurposes.length}
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-[34px] font-bold mb-2">Resource library</h1>
              <p className="text-text-muted">
                {filteredItems.length} of {total} matching • {total} in the library
              </p>
            </div>
            <button className="text-sm font-semibold text-charcoal border border-border px-3 py-1 rounded-lg hover:bg-gray-050">
              Clear filters
            </button>
          </div>

          {/* Sort controls */}
          <div className="flex gap-2 mb-6">
            <a
              href={`/resources?sort=newest${filterType !== 'all' ? `&filter=${filterType}` : ''}${purpose !== 'all' ? `&purpose=${purpose}` : ''}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                sortParam === 'newest'
                  ? 'bg-charcoal text-white'
                  : 'bg-gray-100 text-charcoal hover:bg-gray-200'
              }`}
            >
              Newest
            </a>
            <a
              href={`/resources?sort=oldest${filterType !== 'all' ? `&filter=${filterType}` : ''}${purpose !== 'all' ? `&purpose=${purpose}` : ''}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                sortParam === 'oldest'
                  ? 'bg-charcoal text-white'
                  : 'bg-gray-100 text-charcoal hover:bg-gray-200'
              }`}
            >
              Oldest first
            </a>
            <a
              href={`/resources?sort=a-z${filterType !== 'all' ? `&filter=${filterType}` : ''}${purpose !== 'all' ? `&purpose=${purpose}` : ''}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                sortParam === 'a-z'
                  ? 'bg-charcoal text-white'
                  : 'bg-gray-100 text-charcoal hover:bg-gray-200'
              }`}
            >
              A–Z
            </a>
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
