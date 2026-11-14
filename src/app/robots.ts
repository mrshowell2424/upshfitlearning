import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils/site-origin";

/**
 * The pages excluded here are the same ones the sitemap leaves out and that
 * carry `robots: { index: false }` in their own metadata -- said twice on
 * purpose, because a crawler that never fetches the page never reads the tag.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/planner", "/success"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
