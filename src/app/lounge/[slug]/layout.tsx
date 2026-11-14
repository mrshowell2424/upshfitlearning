import type { Metadata } from "next";
import { articles } from "./articles";

/**
 * The article page is a client component and cannot export metadata, so each
 * piece gets its title here. Without it every lounge article inherited the
 * section's own title from the layout above, and six different newsletter
 * reads all previewed as the same link.
 *
 * The description is the article's opening sentence rather than a summary
 * written separately, so it cannot drift from what the piece actually says.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug as keyof typeof articles];
  if (!article) return { title: "Article not found" };

  const opening = article.content.trim().split("\n")[0].trim();

  return {
    title: article.title,
    description: opening.length > 300 ? `${opening.slice(0, 297).trimEnd()}…` : opening,
    openGraph: { type: "article" },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
