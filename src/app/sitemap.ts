import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { standards } from "@/lib/db/schema";
import { siteUrl } from "@/lib/utils/site-origin";
import { standardGrade, standardHref } from "@/lib/utils/standards";

/**
 * There was no sitemap, so the only pages a search engine could find were
 * the ones linked from the home page and whatever it reached from there.
 * The standards are the deep content -- several hundred pages, each the
 * answer to a question a teacher types into a search bar almost verbatim
 * ("RL.4.6 lesson") -- and they are reachable only through a search box,
 * which a crawler cannot type into. Those pages were effectively invisible.
 *
 * Rebuilt daily rather than per request: a few hundred rows is cheap but
 * not free, and a sitemap a day old is a sitemap.
 *
 * Deliberately left out: /planner and the auth pages (personal or
 * transactional, and marked noindex to match), /success (reachable only
 * after checkout), and /api.
 */
export const revalidate = 86400;

const STATIC_ROUTES: [path: string, priority: number][] = [
  ["/", 1.0],
  ["/science-of-reading", 0.9],
  ["/match", 0.9],
  ["/resources", 0.9],
  ["/behavior", 0.8],
  ["/behavior/year", 0.8],
  ["/sentence-lab", 0.8],
  ["/morphology", 0.8],
  ["/writing", 0.8],
  ["/fluency", 0.8],
  ["/fluency/play", 0.8],
  ["/vocabulary", 0.8],
  ["/science-of-reading/threads", 0.8],
  ["/science-of-reading/resources", 0.8],
  ["/og-packs", 0.8],
  ["/reading", 0.8],
  ["/design-thinking", 0.7],
  ["/math", 0.7],
  ["/pbl", 0.7],
  ["/courses", 0.7],
  ["/learning-science", 0.7],
  ["/lounge", 0.6],
  ["/pricing", 0.6],
  ["/about", 0.5],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map(([path, priority]) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority,
  }));

  // A sitemap is a nicety; the site is not. If the database is unreachable
  // the static routes still ship rather than the route throwing a 500.
  try {
    const rows = await db.select({ code: standards.code }).from(standards);

    const grades = new Set<string>();
    for (const { code } of rows) {
      entries.push({
        url: `${base}${standardHref(code)}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
      const grade = standardGrade(code);
      if (grade) grades.add(grade);
    }

    for (const grade of grades) {
      entries.push({
        url: `${base}/match/grade/${encodeURIComponent(grade)}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  } catch (error) {
    console.warn("sitemap: standards unreachable, shipping static routes only", error);
  }

  return entries;
}
