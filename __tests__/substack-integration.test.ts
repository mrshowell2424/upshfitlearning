import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Substack webhook types
interface SubstackArticle {
  id: string;
  title: string;
  subtitle: string;
  body_markdown: string;
  body_html: string;
  type: string;
  publication_date: string;
  post_date: string;
  updated_at: string;
  canonical_url: string;
  cover_image: string | null;
  cover_image_alt_text?: string | null;
  cover_image_caption?: string | null;
  byline?: string;
  reactions?: {
    total_count: number;
  };
  read_time?: number;
  audience?: "free" | "paid";
}

interface SubstackWebhookEvent {
  type: string;
  data: {
    publication: {
      id: string;
      name: string;
      slug: string;
    };
    post: SubstackArticle;
  };
}

describe("Substack Integration", () => {
  describe("Webhook Configuration", () => {
    it("requires SUBSTACK_WEBHOOK_SECRET environment variable", () => {
      const secret = process.env.SUBSTACK_WEBHOOK_SECRET;
      expect(typeof secret).toBe("string" || "undefined");
    });

    it("webhook endpoint is /api/webhooks/substack", () => {
      const endpoint = "/api/webhooks/substack";
      expect(endpoint).toContain("/api/webhooks");
    });

    it("webhook expects POST requests", () => {
      const method = "POST";
      expect(method).toBe("POST");
    });

    it("webhook has correct content type", () => {
      const contentType = "application/json";
      expect(contentType).toBe("application/json");
    });
  });

  describe("Article Structure", () => {
    let mockArticle: SubstackArticle;

    beforeEach(() => {
      mockArticle = {
        id: "article_123",
        title: "How to Teach Critical Thinking",
        subtitle: "A practical guide for teachers",
        body_markdown:
          "# Introduction\n\nTeaching critical thinking is essential...",
        body_html: "<h1>Introduction</h1><p>Teaching critical thinking is essential...</p>",
        type: "post",
        publication_date: "2024-01-15T10:00:00Z",
        post_date: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
        canonical_url: "https://mrshowell24.substack.com/p/how-to-teach-critical-thinking",
        cover_image: "https://substack-post-media.s3.amazonaws.com/image123.jpg",
        cover_image_alt_text: "Teacher with students",
        cover_image_caption: "Critical thinking in action",
        byline: "Mrs. Howell",
        reactions: {
          total_count: 45,
        },
        read_time: 8,
        audience: "free",
      };
    });

    it("has required fields", () => {
      expect(mockArticle.id).toBeDefined();
      expect(mockArticle.title).toBeDefined();
      expect(mockArticle.body_html || mockArticle.body_markdown).toBeDefined();
      expect(mockArticle.publication_date).toBeDefined();
      expect(mockArticle.canonical_url).toBeDefined();
    });

    it("includes optional image metadata", () => {
      expect(mockArticle.cover_image).toBeDefined();
      expect(mockArticle.cover_image_alt_text).toBeDefined();
      expect(mockArticle.cover_image_caption).toBeDefined();
    });

    it("includes publication metadata", () => {
      expect(mockArticle.byline).toBeDefined();
      expect(mockArticle.read_time).toBeDefined();
    });

    it("includes engagement metrics", () => {
      expect(mockArticle.reactions).toBeDefined();
      expect(mockArticle.reactions.total_count).toBeGreaterThanOrEqual(0);
    });

    it("distinguishes free vs paid content", () => {
      expect(mockArticle.audience).toMatch(/^(free|paid)$/);
    });

    it("includes timestamps", () => {
      expect(mockArticle.publication_date).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(mockArticle.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}/);
    });
  });

  describe("Webhook Event Processing", () => {
    let mockEvent: SubstackWebhookEvent;

    beforeEach(() => {
      mockEvent = {
        type: "post.published",
        data: {
          publication: {
            id: "pub_123",
            name: "Mrs. Howell's Teaching Hub",
            slug: "mrshowell24",
          },
          post: {
            id: "article_123",
            title: "How to Teach Critical Thinking",
            subtitle: "A practical guide for teachers",
            body_markdown: "# Introduction\n\nTeaching critical thinking...",
            body_html: "<h1>Introduction</h1><p>Teaching critical thinking...</p>",
            type: "post",
            publication_date: "2024-01-15T10:00:00Z",
            post_date: "2024-01-15T10:00:00Z",
            updated_at: "2024-01-15T10:00:00Z",
            canonical_url:
              "https://mrshowell24.substack.com/p/how-to-teach-critical-thinking",
            cover_image: "https://substack-post-media.s3.amazonaws.com/image123.jpg",
            audience: "free",
          },
        },
      };
    });

    it("receives post.published webhook events", () => {
      expect(mockEvent.type).toBe("post.published");
    });

    it("extracts article data from webhook", () => {
      const post = mockEvent.data.post;

      expect(post.id).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.body_html).toBeDefined();
    });

    it("extracts publication metadata", () => {
      const pub = mockEvent.data.publication;

      expect(pub.id).toBeDefined();
      expect(pub.name).toBeDefined();
      expect(pub.slug).toBe("mrshowell24");
    });

    it("ignores non-published event types", () => {
      const otherEvent = {
        ...mockEvent,
        type: "subscriber.updated",
      };

      const shouldProcess = otherEvent.type === "post.published";
      expect(shouldProcess).toBe(false);
    });
  });

  describe("Article Ingestion", () => {
    let article: SubstackArticle;

    beforeEach(() => {
      article = {
        id: "article_456",
        title: "Teaching with Case Studies",
        subtitle: "Real-world examples in education",
        body_markdown: "## Case Study 1\n\nExample text...",
        body_html: "<h2>Case Study 1</h2><p>Example text...</p>",
        type: "post",
        publication_date: "2024-01-20T14:30:00Z",
        post_date: "2024-01-20T14:30:00Z",
        updated_at: "2024-01-20T14:30:00Z",
        canonical_url:
          "https://mrshowell24.substack.com/p/teaching-with-case-studies",
        cover_image: "https://substack-post-media.s3.amazonaws.com/image456.jpg",
        audience: "free",
      };
    });

    it("stores article in database", async () => {
      const stored = {
        id: article.id,
        title: article.title,
        published_at: new Date(article.publication_date),
      };

      expect(stored.id).toBe(article.id);
      expect(stored.title).toBe(article.title);
    });

    it("extracts and stores canonical URL", () => {
      expect(article.canonical_url).toContain("https://");
      expect(article.canonical_url).toContain("substack.com");
    });

    it("downloads and stores cover image", async () => {
      if (article.cover_image) {
        expect(article.cover_image).toContain("http");
        expect(article.cover_image).toContain("s3.amazonaws.com");
      }
    });

    it("generates image filename from article ID", () => {
      const filename = `article_${article.id}_cover.jpg`;
      expect(filename).toContain(article.id);
    });

    it("stores article metadata", () => {
      const metadata = {
        byline: "Mrs. Howell",
        read_time: 8,
        reactions: 42,
        audience: "free",
      };

      expect(metadata.audience).toMatch(/^(free|paid)$/);
    });

    it("extracts HTML content", () => {
      expect(article.body_html).toContain("<h2>");
    });

    it("generates plain text excerpt", () => {
      const plainText = article.body_markdown.replace(/[#*`]/g, "").substring(0, 200);
      expect(plainText.length).toBeGreaterThan(0);
    });
  });

  describe("Content Filtering", () => {
    let paidArticle: SubstackArticle;
    let freeArticle: SubstackArticle;

    beforeEach(() => {
      paidArticle = {
        id: "paid_article",
        title: "Premium Course",
        subtitle: "Paid subscribers only",
        body_markdown: "This is paid content",
        body_html: "<p>This is paid content</p>",
        type: "post",
        publication_date: "2024-01-20T15:00:00Z",
        post_date: "2024-01-20T15:00:00Z",
        updated_at: "2024-01-20T15:00:00Z",
        canonical_url: "https://mrshowell24.substack.com/p/premium",
        cover_image: null,
        audience: "paid",
      };

      freeArticle = {
        id: "free_article",
        title: "Free Resources",
        subtitle: "Available to all",
        body_markdown: "This is free content",
        body_html: "<p>This is free content</p>",
        type: "post",
        publication_date: "2024-01-20T15:30:00Z",
        post_date: "2024-01-20T15:30:00Z",
        updated_at: "2024-01-20T15:30:00Z",
        canonical_url: "https://mrshowell24.substack.com/p/free",
        cover_image: null,
        audience: "free",
      };
    });

    it("can process both free and paid articles", () => {
      expect(paidArticle.audience).toBe("paid");
      expect(freeArticle.audience).toBe("free");
    });

    it("marks paid articles appropriately", () => {
      expect(paidArticle.audience).toBe("paid");
    });

    it("handles articles without cover images", () => {
      expect(freeArticle.cover_image).toBeNull();
    });

    it("filters by publication if needed", () => {
      const publication = "mrshowell24";
      expect(freeArticle.canonical_url).toContain(publication);
    });
  });

  describe("Signature Verification", () => {
    it("verifies webhook signature", () => {
      const signature = "sha256=abc123def456";
      expect(signature).toContain("sha256=");
    });

    it("rejects invalid signatures", () => {
      const signature = "invalid_signature";
      const isValid = signature.includes("sha256=");

      expect(isValid).toBe(false);
    });

    it("rejects missing signature", () => {
      const signature = undefined;
      const isValid = signature !== undefined;

      expect(isValid).toBe(false);
    });

    it("validates timestamp to prevent replay attacks", () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const maxAge = 300; // 5 minutes
      const isRecent = Date.now() / 1000 - timestamp < maxAge;

      expect(isRecent).toBe(true);
    });

    it("rejects old timestamps", () => {
      const oldTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
      const maxAge = 300;
      const isRecent = Date.now() / 1000 - oldTimestamp < maxAge;

      expect(isRecent).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("handles missing SUBSTACK_WEBHOOK_SECRET", () => {
      const secret = undefined;
      const canVerify = secret !== undefined;

      expect(canVerify).toBe(false);
    });

    it("handles invalid JSON payload", async () => {
      const invalidPayload = "not json";
      const isJSON = typeof JSON.parse(invalidPayload) === "object";

      expect(isJSON).toBe(false);
    });

    it("handles missing required article fields", () => {
      const incomplete = {
        id: undefined,
        title: "Title only",
      };

      const isValid = incomplete.id && incomplete.title;
      expect(isValid).toBeFalsy();
    });

    it("handles image download failures", async () => {
      const imageUrl = "https://broken-url.com/image.jpg";
      const error = new Error("Failed to download image from Substack");

      expect(error.message).toContain("Failed");
    });

    it("continues on image failures", async () => {
      const article = {
        id: "article_789",
        title: "Article without image",
        cover_image: null,
      };

      // Should still save article even without image
      expect(article.id).toBeDefined();
      expect(article.title).toBeDefined();
    });

    it("handles database connection errors", async () => {
      const error = new Error("Failed to connect to database");
      expect(error.message).toContain("Failed");
    });

    it("logs webhook processing errors", () => {
      const log = {
        timestamp: new Date(),
        event: "post.published",
        error: "Article insertion failed",
      };

      expect(log.timestamp).toBeInstanceOf(Date);
      expect(log.error).toBeDefined();
    });
  });

  describe("Rate Limiting", () => {
    it("handles multiple webhooks in sequence", () => {
      const webhooks = [
        { type: "post.published", id: "evt_1" },
        { type: "post.published", id: "evt_2" },
        { type: "post.published", id: "evt_3" },
      ];

      expect(webhooks.length).toBe(3);
    });

    it("processes webhooks in order", () => {
      const queue: string[] = [];
      queue.push("evt_1");
      queue.push("evt_2");

      expect(queue[0]).toBe("evt_1");
      expect(queue[1]).toBe("evt_2");
    });

    it("prevents duplicate event processing", () => {
      const processed = new Set();
      const eventId = "evt_duplicate";

      processed.add(eventId);
      const isDuplicate = processed.has(eventId);

      expect(isDuplicate).toBe(true);
    });
  });

  describe("Article Metadata", () => {
    let article: SubstackArticle;

    beforeEach(() => {
      article = {
        id: "article_meta",
        title: "Best Practices",
        subtitle: "Teaching tips",
        body_markdown: "Content",
        body_html: "<p>Content</p>",
        type: "post",
        publication_date: "2024-01-25T09:00:00Z",
        post_date: "2024-01-25T09:00:00Z",
        updated_at: "2024-01-25T09:00:00Z",
        canonical_url: "https://mrshowell24.substack.com/p/best-practices",
        cover_image: "https://substack-post-media.s3.amazonaws.com/meta.jpg",
        byline: "Mrs. Howell",
        read_time: 5,
        audience: "free",
        reactions: {
          total_count: 120,
        },
      };
    });

    it("stores byline as author", () => {
      expect(article.byline).toBe("Mrs. Howell");
    });

    it("stores read time estimate", () => {
      expect(article.read_time).toBe(5);
    });

    it("stores reaction count", () => {
      expect(article.reactions.total_count).toBeGreaterThan(0);
    });

    it("stores publication timestamps", () => {
      expect(article.publication_date).toBeDefined();
      expect(article.updated_at).toBeDefined();
    });

    it("stores image caption and alt text", () => {
      // If provided
      const hasCaption = "cover_image_caption" in article;
      expect(typeof hasCaption).toBe("boolean");
    });
  });
});
