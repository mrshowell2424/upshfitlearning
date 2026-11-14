import type { Metadata } from "next";

/**
 * A 'use client' page cannot export metadata, so the title and description
 * for /og-packs live here instead. Next merges a layout's metadata into the
 * page beneath it, and this layout renders its children untouched -- it
 * exists only so the page has a name of its own in a tab, a bookmark and a
 * pasted link.
 */
export const metadata: Metadata = {
  title: "OG concept packs",
  description:
    "Fifty-eight Orton-Gillingham concept packs. Each takes one concept across a whole family of skills - a roadmap, activities, a decodable, reading lists and an answer key.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
