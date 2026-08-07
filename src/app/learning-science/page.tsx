// @ts-nocheck
import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { withDb } from "@/lib/db";
import { lesson_blueprints } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { scienceLabel } from "@/lib/utils/standards";
import { STANDARD_TOTAL } from "@/lib/constants/totals";
import { PRINCIPLES } from "@/lib/constants/learning-science";

/**
 * What the learning science tags actually mean.
 *
 * Every blueprint step carries one, and until now they were labels a teacher
 * could read but not look up. Reached from the stat strip on the home page and
 * from the blueprint's own footer, rather than sitting in the nav — it answers
 * a question you only have once you have seen a tag.
 *
 * The counts are real: they come from the blueprints, so a principle claiming
 * to run through the library has to actually be in it.
 */
export const dynamic = "force-dynamic";

export const metadata = {
  title: "The learning science behind every lesson — Upshift Learning",
  description:
    "The principles every Upshift lesson blueprint is built on, what each one means, and what it looks like in a classroom.",
};

export default async function LearningSciencePage() {
  // Real counts, so a principle cannot claim more of the library than it has.
  let counts: Record<string, number> = {};
  let dataError = false;

  try {
    const rows = await withDb((tx) =>
      tx
        .select({
          tag: sql<string>`jsonb_array_elements(${lesson_blueprints.steps})->>'science_tag'`,
          n: sql<number>`count(*)::int`,
        })
        .from(lesson_blueprints)
        .groupBy(sql`1`)
    );
    counts = Object.fromEntries(rows.filter((r) => r.tag).map((r) => [r.tag, r.n]));
  } catch (error) {
    console.error("Could not count science tags:", error);
    dataError = true;
  }

  const totalSteps = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-5 md:px-8 py-14 md:py-20 border-b border-hairline bg-gradient-to-br from-gray-050 to-white">
          <div className="max-w-4xl mx-auto">
            <p
              className="text-[13px] font-bold uppercase tracking-[0.16em] mb-4"
              style={{ color: "var(--color-teal)" }}
            >
              Science of Learning First
            </p>
            <h1 className="text-[34px] md:text-[46px] font-bold text-charcoal leading-[1.08] mb-5">
              Every lesson is built on something that works
            </h1>
            <p className="text-[17px] md:text-[19px] text-text-body leading-relaxed max-w-3xl">
              Each step of every blueprint carries a tag naming the principle it
              leans on. They are not decoration — they are the reason the step is
              where it is, and in that order. Here is what each one means, what it
              looks like in a classroom, and the way each is most often got wrong.
            </p>
            {!dataError && totalSteps > 0 && (
              <p className="text-[15px] text-text-muted mt-6">
                Applied across {totalSteps.toLocaleString()} lesson steps in{" "}
                {STANDARD_TOTAL} standards.
              </p>
            )}
          </div>
        </section>

        {/* The principles */}
        <section className="px-5 md:px-8 py-12 md:py-16">
          <div className="max-w-4xl mx-auto space-y-6">
            {PRINCIPLES.map((principle) => {
              const used = counts[principle.tag] ?? 0;
              return (
                <article
                  key={principle.tag}
                  id={principle.tag}
                  className="rounded-2xl border border-hairline bg-white p-6 md:p-8 border-l-4 scroll-mt-24"
                  style={{ borderLeftColor: principle.color }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3 mb-1">
                    <h2
                      className="text-[22px] md:text-[26px] font-bold"
                      style={{ color: principle.color }}
                    >
                      {scienceLabel(principle.tag)}
                    </h2>
                    {used > 0 && (
                      <span className="text-[13px] text-text-faint">
                        {used.toLocaleString()} steps
                      </span>
                    )}
                  </div>

                  <p className="text-[15px] text-text-muted italic mb-5">
                    {principle.short}
                  </p>

                  <p className="text-[17px] font-semibold text-charcoal mb-4 leading-snug">
                    {principle.claim}
                  </p>

                  <p className="text-[16px] text-text-body leading-relaxed mb-5">
                    {principle.what}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-gray-050 border border-hairline p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-faint mb-2">
                        In a classroom
                      </p>
                      <p className="text-[15px] text-text-body leading-relaxed">
                        {principle.classroom}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-050 border border-hairline p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-faint mb-2">
                        Where it goes wrong
                      </p>
                      <p className="text-[15px] text-text-body leading-relaxed">
                        {principle.mistake}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Back into the product */}
        <section className="px-5 md:px-8 pb-16">
          <div className="max-w-4xl mx-auto rounded-2xl border border-hairline bg-gray-050 p-6 md:p-8 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-[17px] font-bold text-charcoal mb-1">
                See it in a real lesson
              </p>
              <p className="text-[15px] text-text-body">
                Every blueprint names the principle behind each step.
              </p>
            </div>
            <Link
              href="/match"
              className="inline-flex items-center justify-center rounded-xl bg-coral px-6 py-3 font-semibold text-white hover:bg-coral-press transition-colors"
            >
              Find your standard
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
