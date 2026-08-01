'use client'

// @ts-nocheck
import { useState, useEffect } from 'react'
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
}

function ResourcesContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setPage(parseInt(params.get('page') || "1"));
      setSearch(params.get('search') || "");
    }
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 flex">
        {/* Main content */}
        <main className="flex-1 px-8 py-8">
          <div className="mb-6">
            <h1 className="text-[34px] font-bold mb-2">Resource library</h1>
            <p className="text-text-muted">
              {total} of {total} resources
            </p>
          </div>

          {/* Sort controls */}
          <div className="flex gap-2 mb-6">
            {["newest", "oldest", "a-z"].map((sort) => (
              <a
                key={sort}
                href={`/resources?sort=${sort}`}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                  sortParam === sort
                    ? "bg-charcoal text-white"
                    : "bg-gray-100 text-charcoal hover:bg-gray-200"
                }`}
              >
                {sort === "newest" ? "Newest" : sort === "oldest" ? "Oldest" : "A–Z"}
              </a>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-16 border-2 border-dashed border-hairline rounded-[16px]">
              <p className="text-text-muted mb-4">Loading resources...</p>
              <p className="text-sm text-text-muted">Fetching your resources from the library...</p>
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {items.map((item) => (
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
  return <ResourcesContent />;
}
