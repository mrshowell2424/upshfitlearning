import type { Metadata } from "next";
import { TITLE_TEMPLATE } from "@/lib/constants/metadata";

/**
 * A 'use client' page cannot export metadata, so the title and description
 * for /resources live here instead. Next merges a layout's metadata into the
 * page beneath it, and this layout renders its children untouched -- it
 * exists only so the page has a name of its own in a tab, a bookmark and a
 * pasted link.
 */
export const metadata: Metadata = {
  title: {
    default: "Resource library",
    template: TITLE_TEMPLATE,
  },
  description:
    "2,787 teacher resources - videos, lesson plans, anchor charts and more - searchable and filtered by access and category.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
