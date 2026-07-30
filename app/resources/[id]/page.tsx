// @ts-nocheck
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { db } from "@/lib/db";
import { resources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { id } = await params;

  const items = await db
    .select()
    .from(resources)
    .where(eq(resources.id, id))
    .limit(1);

  const resource = items[0];

  if (!resource) {
    notFound();
  }

  const coverUrl = `https://i.ytimg.com/vi/${resource.youtube_id}/maxresdefault.jpg`;
  const docUrl = resource.link_url;

  const date = resource.published_at
    ? new Date(resource.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-8 py-8 max-w-6xl mx-auto w-full">
        {/* Back link */}
        <a href="/resources" className="text-link-blue hover:underline text-sm font-semibold mb-6 inline-block">
          ← Back to library
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="lg:col-span-2">
            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.16em] px-2 py-1 bg-gray-100 text-text-faint rounded-md">
                {resource.purpose}
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.16em] px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                {resource.grade_band}
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.16em] px-2 py-1 bg-teal-50 text-teal-700 rounded-md">
                {resource.skill}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[40px] font-bold mb-4 text-charcoal">{resource.title}</h1>

            {/* Summary */}
            <p className="text-[17px] text-text-body leading-relaxed mb-6">
              {resource.summary}
            </p>

            {/* Video player */}
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8 group">
              <div className="relative w-full h-full cursor-pointer bg-black">
                <img
                  src={coverUrl}
                  alt={resource.title}
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center hover:bg-coral-press transition-colors">
                    <svg
                      className="w-8 h-8 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-20" />
              </div>
            </div>

            {/* Teaching moves */}
            <div>
              <h2 className="text-[26px] font-bold mb-4">Teaching moves</h2>
              <div className="space-y-3">
                {["Move 1", "Move 2", "Move 3"].map((move, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div
                      className="w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: "var(--color-charcoal)" }}
                    >
                      {idx + 1}
                    </div>
                    <p className="text-text-body">{move} description here</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column (sticky) */}
          <div className="lg:sticky lg:top-24 h-fit">
            {/* Action card */}
            <div className="border border-border rounded-[14px] p-6 mb-6 bg-white">
              {!resource.is_free ? (
                <div className="text-center">
                  <p className="text-text-muted text-sm mb-3">This resource requires an upgrade</p>
                  <button className="w-full bg-charcoal text-white py-2 rounded-lg font-semibold hover:bg-charcoal/90">
                    Upgrade to All-Access
                  </button>
                </div>
              ) : (
                <>
                  {docUrl && (
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-coral text-white py-2 rounded-lg font-semibold hover:bg-coral-press transition-colors text-center mb-3"
                    >
                      Open resource
                    </a>
                  )}
                  <button className="w-full border border-border py-2 rounded-lg font-semibold hover:bg-gray-050 transition-colors">
                    Save to planner
                  </button>
                </>
              )}
            </div>

            {/* At a glance */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-3">At a glance</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Purpose</span>
                  <span className="font-semibold">{resource.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Grades</span>
                  <span className="font-semibold">{resource.grade_band}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Skill</span>
                  <span className="font-semibold">{resource.skill}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Format</span>
                  <span className="font-semibold">{resource.format}</span>
                </div>
                {date && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Added</span>
                    <span className="font-semibold">{date}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pairs well with */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-3">Pairs well with</h3>
              <p className="text-xs text-text-muted">More resources with the same skill coming soon</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
