import type { Metadata } from "next";
import { TITLE_TEMPLATE } from "@/lib/constants/metadata";

/**
 * A 'use client' page cannot export metadata, so the title and description
 * for /match live here instead. Next merges a layout's metadata into the
 * page beneath it, and this layout renders its children untouched -- it
 * exists only so the page has a name of its own in a tab, a bookmark and a
 * pasted link.
 */
export const metadata: Metadata = {
  title: {
    default: "What are you teaching?",
    template: TITLE_TEMPLATE,
  },
  description:
    "Enter a standard code or describe what you are teaching, and open the lesson blueprint for any K-12 standard.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
