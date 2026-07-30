// @ts-nocheck
import { db } from "@/lib/db";
import { standards } from "@/lib/db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return Response.json({ results: [] });
  }

  try {
    const query = q.toLowerCase();

    // Search in code, name, plain_reading, and skills
    const results = await db
      .select()
      .from(standards)
      .where(
        or(
          ilike(standards.code, `%${query}%`),
          ilike(standards.name, `%${query}%`),
          ilike(standards.plain_reading, `%${query}%`),
          sql`${standards.skills}::text ILIKE '%' || ${query} || '%'`
        )
      )
      .limit(10);

    return Response.json({
      results: results.map((r) => ({
        code: r.code,
        name: r.name,
        text: r.plain_reading,
        skills: r.skills,
      })),
    });
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}
