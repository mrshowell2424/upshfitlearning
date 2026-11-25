import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { getResourceById, getRelatedOwnVideos } from "@/lib/utils/resources";
import { notFound } from "next/navigation";
import { ResourceActions } from "./actions";
import { VideoPlayer } from "./thumbnail";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Resources are the other thing people send each other a direct link to, and
 * the sheet already holds a title, a purpose and a grade band -- everything a
 * preview needs. getResources() is cached in memory, so this costs nothing
 * the page was not already paying.
 *
 * try/catch for the same reason as the standards page: if the sheet is
 * unreachable the resource page should fail on its own terms, in
 * notFound(), not in the metadata that runs before it.
 */
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const resource = await getResourceById(id);
    if (!resource) return { title: "Resource not found" };

    const facts = [resource.format, resource.grade_band, resource.skill]
      .filter(Boolean)
      .join(" · ");

    return {
      title: resource.title,
      description: resource.purpose || facts || undefined,
    };
  } catch {
    return {};
  }
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { id } = await params;

  // The public library is keyed by Google Sheet row, which is also what the
  // resource cards link to — so resolve against the sheet, not the uuid table.
  const resource = await getResourceById(id);
  if (!resource) notFound();

  const related = await getRelatedOwnVideos(resource, 3);

  const docUrl = resource.resource_url;

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

      <main id="main" tabIndex={-1} className="flex-1 px-5 md:px-8 py-8 max-w-6xl mx-auto w-full">
        {/* Back link */}
        <Link href="/resources" className="text-link-blue hover:underline text-sm font-semibold mb-6 inline-block">
          ← Back to library
        </Link>

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
            <h1 className="text-[28px] md:text-[40px] font-bold mb-4 text-charcoal">{resource.title}</h1>

            {/* Summary */}
            <p className="text-base md:text-[17px] text-text-body leading-relaxed mb-6 whitespace-pre-line">
              {resource.summary}
            </p>

            {/* Video player — plays in place rather than sending them to YouTube */}
            {resource.youtube_id && (
              <VideoPlayer youtubeId={resource.youtube_id} title={resource.title} />
            )}

            {/*
              Teaching moves and "Why this works" used to be rendered here.
              Neither has ever appeared: the sheet these resources come from
              has no column for either, so resource.teaching_moves and
              resource.why_this_works were always undefined and both blocks
              were always hidden. They were only compiling because the file
              carried a type suppression. If the sheet grows those columns,
              parse them in lib/utils/resources.ts and this can come back
              with something behind it.
            */}
          </div>

          {/* Right column (sticky) */}
          <div className="lg:sticky lg:top-24 h-fit">
            {/* Action card */}
            <div className="border border-border rounded-[14px] p-6 mb-6 bg-white">
              <ResourceActions
                docUrl={docUrl}
                youtubeUrl={resource.youtube_url}
                isFree={resource.is_free}
              />
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
                {/*
                  Prep time has no column in the sheet either, so that row is
                  gone. Access does -- "Free or Paid" -- but it is read into
                  is_free rather than kept as text, so this says what the
                  sheet says through the field that actually holds it.
                */}
                <div className="flex justify-between">
                  <span className="text-text-muted">Access</span>
                  <span className="font-semibold">{resource.is_free ? "Free" : "Paid"}</span>
                </div>
              </div>
            </div>

            {/* Pairs well with — Upshift's own videos only */}
            {related.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-3">Pairs well with</h3>
                {/* Compact rows — a suggestion rail, not competing with the resource itself */}
                <div className="flex flex-col divide-y divide-hairline border-y border-hairline">
                  {related.map((item) => (
                    <a
                      key={item.id}
                      href={`/resources/${item.id}`}
                      className="flex items-center gap-3 py-2.5 group"
                    >
                      <div className="w-[72px] h-[42px] flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {item.thumbnail_url && (
                          <img
                            src={item.thumbnail_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-charcoal leading-snug line-clamp-2 group-hover:text-coral-ink transition-colors">
                          {item.title}
                        </p>
                        {item.purpose && (
                          <p className="text-[11px] text-text-muted truncate">{item.purpose}</p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
