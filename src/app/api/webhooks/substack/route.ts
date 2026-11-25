import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";

/**
 * The day out of whatever Substack sent, or null.
 *
 * published_at is a date column: drizzle reads and writes it as a
 * YYYY-MM-DD string, so a Date is not a value it takes. Anything that is
 * not a date is stored as nothing rather than as "Invalid Date".
 */
const dayOf = (v: unknown): string | null => {
  const day = String(v ?? "").slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null;
};

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const signature = request.headers.get("x-substack-signature");
    const webhookSecret = process.env.SUBSTACK_WEBHOOK_SECRET;

    if (!webhookSecret || !signature) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.text();
    // In production, verify the signature
    // const verified = verifySignature(body, signature, webhookSecret);
    // if (!verified) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

    const event = JSON.parse(body);

    // Handle new publication event
    if (event.type === "publication.created") {
      const { title, slug, publication_date, cover_image } = event.data;

      await db
        .insert(articles)
        .values({
          title,
          slug,
          category: "Article",
          // A date column, which drizzle reads and writes as YYYY-MM-DD.
          // Substack sends an ISO timestamp, so take the day off the front
          // rather than handing over a Date the column cannot take.
          published_at: dayOf(publication_date),
          cover_image: cover_image || null,
          is_featured: false,
        })
        .onConflictDoNothing();

      console.log(`📝 Synced article: ${title}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
