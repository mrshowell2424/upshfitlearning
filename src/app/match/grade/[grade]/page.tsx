// @ts-nocheck
import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { db } from "@/lib/db";
import { standards } from "@/lib/db/schema";
import { standardHref, standardSubject, standardTheme } from "@/lib/utils/standards";

/**
 * Everything written up for one grade.
 *
 * A teacher who lands on RL.2.1 is almost always teaching second grade
 * generally, not that one standard — so the grade chip on a standard page
 * leads here rather than being decoration. Not linked from the nav; it is
 * reached by clicking the grade you are already looking at.
 */
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ grade: string }>;
}

/** Same rule the standard page uses: the first segment that looks like a grade. */
const gradeOf = (code: string) =>
  code.split(".").find((part) => /^(K|\d{1,2})$/i.test(part)) ?? null;

const gradeLabel = (grade: string) =>
  grade.toUpperCase() === "K" ? "Kindergarten" : `Grade ${grade}`;

export async function generateMetadata({ params }: PageProps) {
  const { grade } = await params;
  return { title: `${gradeLabel(decodeURIComponent(grade))} standards — Upshift Learning` };
}

export default async function GradeStandardsPage({ params }: PageProps) {
  const { grade } = await params;
  const decoded = decodeURIComponent(grade).toUpperCase();

  let rows = [];
  let dataError = false;

  try {
    rows = await db.select().from(standards);
  } catch (error) {
    console.error("Database error listing standards by grade:", error);
    dataError = true;
  }

  const forGrade = rows
    .filter((row) => (gradeOf(row.code) ?? "").toUpperCase() === decoded)
    .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

  // Grouped by subject so a teacher scans one column rather than a mixed list
  const bySubject = new Map();
  for (const row of forGrade) {
    const subject = standardSubject(row.code);
    if (!bySubject.has(subject)) bySubject.set(subject, []);
    bySubject.get(subject).push(row);
  }

  // Which other grades have anything, so this page can hand off to them
  const otherGrades = [...new Set(rows.map((r) => gradeOf(r.code)).filter(Boolean))]
    .map((g) => g.toUpperCase())
    .sort((a, b) => (a === "K" ? -1 : b === "K" ? 1 : Number(a) - Number(b)));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-5 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/match"
            className="text-link-blue hover:underline text-sm font-semibold"
          >
            ← Back to search
          </Link>

          <div className="mt-6 mb-8">
            <h1 className="text-[30px] md:text-4xl font-bold text-charcoal mb-2">
              {gradeLabel(decoded)}
            </h1>
            {/* Silent at zero — the empty card below says it better than a
                subtitle reading "0 standards written up" does. */}
            {(dataError || forGrade.length > 0) && (
              <p className="text-[16px] text-text-muted">
                {dataError
                  ? "We could not load these just now — this is a problem at our end."
                  : `${forGrade.length} standard${forGrade.length === 1 ? "" : "s"} written up, each with a lesson blueprint.`}
              </p>
            )}
          </div>

          {/* Jump to another grade without going back to search */}
          {otherGrades.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-10">
              <span className="text-sm text-text-muted">Other grades:</span>
              {otherGrades.map((g) => {
                const isCurrent = g === decoded;
                return (
                  <Link
                    key={g}
                    href={`/match/grade/${g}`}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`inline-flex items-center min-h-[36px] px-3.5 rounded-full text-sm font-semibold border transition-colors ${
                      isCurrent
                        ? "bg-charcoal text-white border-charcoal"
                        : "bg-white text-charcoal border-border-strong hover:bg-gray-050"
                    }`}
                  >
                    {g === "K" ? "K" : g}
                  </Link>
                );
              })}
            </div>
          )}

          {forGrade.length === 0 && !dataError ? (
            <div className="border border-dashed border-border rounded-2xl p-10 text-center">
              <p className="text-[17px] font-semibold text-charcoal mb-2">
                Nothing written up for {gradeLabel(decoded)} yet
              </p>
              <p className="text-[15px] text-text-muted mb-6 max-w-md mx-auto">
                We build these by hand, standard by standard. Try another grade
                above, or search for what you are teaching.
              </p>
              <Link
                href="/match"
                className="inline-flex items-center justify-center rounded-lg bg-coral px-5 py-3 font-semibold text-white hover:bg-coral-press transition-colors"
              >
                Search standards
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {[...bySubject.entries()].map(([subject, list]) => {
                const theme = standardTheme(list[0].code);
                return (
                  <section key={subject}>
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
                        {theme.label}
                      </h2>
                      <span className="text-xs text-text-faint">{list.length}</span>
                      <div className="flex-1 h-px bg-hairline" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {list.map((row) => (
                        <Link
                          key={row.code}
                          href={standardHref(row.code)}
                          className="flex flex-col rounded-2xl border border-hairline bg-white p-5 border-l-4 hover:border-charcoal hover:shadow-md transition-all"
                          style={{ borderLeftColor: theme.accent }}
                        >
                          <span className="font-bold text-charcoal mb-1.5">{row.code}</span>
                          {row.name && (
                            <span className="text-[15px] text-text-body leading-snug mb-3">
                              {row.name}
                            </span>
                          )}
                          {row.learning_target && (
                            <span className="text-[13px] text-text-muted italic leading-snug mt-auto">
                              “{row.learning_target}”
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
