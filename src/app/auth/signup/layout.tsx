import type { Metadata } from "next";

/**
 * A 'use client' page cannot export metadata, so the title and description
 * for /auth/signup live here instead. Next merges a layout's metadata into the
 * page beneath it, and this layout renders its children untouched -- it
 * exists only so the page has a name of its own in a tab, a bookmark and a
 * pasted link.
 */
export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a free Upshift Learning account.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
