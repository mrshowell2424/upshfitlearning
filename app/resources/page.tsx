// @ts-nocheck
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ResourceCard from "@/app/components/ResourceCard";
import { getResources, type Resource } from "@/lib/resources";

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
  const search = params.search || "";

  let items: Resource[] = [];
  let total = 0;
  let totalPages = 0;
  const pageSize = 30;

  try {
    const allResources = await getResources();

    let filtered = allResources;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = allResources.filter(
        r =>
          r.title.toLowerCase().includes(searchLower) ||
          r.purpose.toLowerCase().includes(searchLower) ||
          r.skill.toLowerCase().includes(searchLower)
      );
    }

    total = filtered.length;
    totalPages = Math.ceil(total / pageSize);
    const offset = (page - 1) * pageSize;
    items = filtered.slice(offset, offset + pageSize);
  } catch (error) {
    console.error('Error fetching resources:', error);
    total = 0;
    totalPages = 0;
    items = [];
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
              <p className="text-text-muted mb-4">Loading resources...</p>
              <p className="text-sm text-text-muted">Our library of {total} curated resources is being prepared. Check back soon!</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
