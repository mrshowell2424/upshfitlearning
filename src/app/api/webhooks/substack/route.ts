// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";

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
          published_at: new Date(publication_date),
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
