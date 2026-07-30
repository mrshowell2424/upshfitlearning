import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ResourceCard from "@/app/components/ResourceCard";
import { db } from "@/lib/db";
import { resources } from "@/lib/db/schema";
import { eq, ilike, sql, inArray } from "drizzle-orm";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    skill?: string;
    purpose?: string;
    grade?: string;
    access?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const pageSize = 30;
  const offset = (page - 1) * pageSize;

  let query = db.select().from(resources);

  // Apply filters
  const filters = [];

  if (params.search) {
    filters.push(
      ilike(resources.title, `%${params.search}%`)
    );
  }

  if (params.skill) {
    filters.push(eq(resources.skill, params.skill));
  }

  if (params.purpose) {
    filters.push(eq(resources.purpose, params.purpose));
  }

  if (params.grade) {
    filters.push(eq(resources.grade_band, params.grade));
  }

  if (params.access === "free") {
    filters.push(eq(resources.is_free, true));
  } else if (params.access === "paid") {
    filters.push(eq(resources.is_free, false));
  }

  // Build query with filters
  if (filters.length > 0) {
    for (const filter of filters) {
      query = query.where(filter);
    }
  }

  // Apply sorting
  let sortedQuery = query;
  if (params.sort === "oldest") {
    sortedQuery = query.orderBy(resources.published_at);
  } else if (params.sort === "a-z") {
    sortedQuery = query.orderBy(resources.title);
  } else {
    // Default: newest first
    sortedQuery = query.orderBy(sql`${resources.published_at} DESC NULLS LAST`);
  }

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(resources)
    .where(filters.length > 0 ? filters[0] : sql`1=1`);

  const total = countResult[0]?.count || 0;

  // Get paginated results
  const items = await sortedQuery.limit(pageSize).offset(offset);

  // Get filter options
  const purposeOptions = await db
    .selectDistinct({ purpose: resources.purpose })
    .from(resources)
    .where(resources.purpose.isNotNull())
    .orderBy(resources.purpose);

  const skillOptions = await db
    .selectDistinct({ skill: resources.skill })
    .from(resources)
    .where(resources.skill.isNotNull())
    .orderBy(resources.skill);

  const gradeOptions = await db
    .selectDistinct({ grade: resources.grade_band })
    .from(resources)
    .orderBy(resources.grade_band);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-72 border-r border-hairline px-6 py-8 bg-gray-050 overflow-y-auto sticky top-72 h-[calc(100vh-72px)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.1em]">
              Filters
            </h2>
            {Object.keys(params).length > 0 && (
              <a
                href="/resources"
                className="text-xs text-link-blue hover:underline"
              >
                Clear
              </a>
            )}
          </div>

          {/* Purpose filter */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-text-faint mb-2">
              Purpose
            </h3>
            <div className="space-y-2">
              {purposeOptions.map((option) => (
                <label key={option.purpose} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.purpose === option.purpose}
                    className="w-4 h-4 rounded-sm"
                  />
                  <span>{option.purpose}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skill filter */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-text-faint mb-2">
              Skill
            </h3>
            <div className="space-y-2">
              {skillOptions.slice(0, 10).map((option) => (
                <label key={option.skill} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.skill === option.skill}
                    className="w-4 h-4 rounded-sm"
                  />
                  <span>{option.skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Grade filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-text-faint mb-2">
              Grade Band
            </h3>
            <div className="space-y-2">
              {gradeOptions.map((option) => (
                <label key={option.grade} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.grade === option.grade}
                    className="w-4 h-4 rounded-sm"
                  />
                  <span>{option.grade}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

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
                  params.sort === sort || (sort === "newest" && !params.sort)
                    ? "bg-charcoal text-white"
                    : "bg-gray-100 text-charcoal hover:bg-gray-200"
                }`}
              >
                {sort === "newest" ? "Newest" : sort === "oldest" ? "Oldest" : "A–Z"}
              </a>
            ))}
          </div>

          {/* Grid */}
          {items.length > 0 ? (
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
                    youtube_id={item.youtube_id || ""}
                    published_at={item.published_at}
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
              <a href="/resources" className="text-coral font-semibold hover:text-coral-press">
                Clear filters
              </a>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
