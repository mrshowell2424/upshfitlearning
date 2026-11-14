import type { Metadata } from "next";

/**
 * A 'use client' page cannot export metadata, so the title and description
 * for /design-thinking live here instead. Next merges a layout's metadata into the
 * page beneath it, and this layout renders its children untouched -- it
 * exists only so the page has a name of its own in a tab, a bookmark and a
 * pasted link.
 */
export const metadata: Metadata = {
  title: "Design Thinking",
  description:
    "A design challenge for every week of the year, K to 12, with teacher slides, a student workbook and an answer key for all 36 weeks.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
