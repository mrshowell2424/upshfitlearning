// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { standards, standard_unpacks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getResourcesForStandard } from "@/lib/utils/resources";
import { dokFromVerbs } from "@/lib/utils/unpack";
import { entitlementFromRequest } from "@/lib/auth/entitlement";

/**
 * The All-Access half of a standard: the full unpack and the matching
 * resources. Served only to a caller who can prove entitlement with a bearer
 * token, so the content never reaches an unentitled browser at all.
 *
 * The page itself renders the free half — the lesson blueprint — and asks for
 * this once the session has resolved.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  const decodedCode = decodeURIComponent(code);

  const { allAccess } = await entitlementFromRequest(request);

  if (!allAccess) {
    // Deliberately no content in the body — the whole point is that an
    // unentitled caller receives nothing to inspect.
    return NextResponse.json({ error: "All-Access required" }, { status: 403 });
  }

  try {
    // Both reads share one connection — each costs a TLS handshake otherwise,
    // and this route was spending seconds connecting rather than querying.
    const { unpackRow, standardRow } = await withDb(async (tx) => {
      const [unpackRow] = await tx
        .select()
        .from(standard_unpacks)
        .where(eq(standard_unpacks.standard_code, decodedCode))
        .limit(1);

      const [standardRow] = await tx
        .select()
        .from(standards)
        .where(eq(standards.code, decodedCode))
        .limit(1);

      return { unpackRow, standardRow };
    });

    const unpack = unpackRow
      ? {
          verbs: unpackRow.verbs ?? [],
          concepts: unpackRow.concepts ?? [],
          vocabulary: unpackRow.vocabulary ?? [],
          priorSkills: unpackRow.prior_skills ?? [],
          priorStandards: unpackRow.prior_standards ?? [],
          futureStandards: unpackRow.future_standards ?? [],
          challenges: unpackRow.challenges ?? [],
          masteryStatement: unpackRow.mastery_statement,
          ladder: unpackRow.ladder ?? [],
          dok: dokFromVerbs(unpackRow.verbs),
        }
      : null;

    const resources = await getResourcesForStandard([
      ...(standardRow?.skills ?? []),
      ...(standardRow?.match_keys ?? []),
    ]);

    return NextResponse.json({ unpack, resources });
  } catch (error) {
    console.error("Premium standard payload failed:", error);
    return NextResponse.json({ error: "Could not load this standard" }, { status: 500 });
  }
}
