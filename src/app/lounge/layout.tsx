import type { Metadata } from "next";
import { TITLE_TEMPLATE } from "@/lib/constants/metadata";

/**
 * A 'use client' page cannot export metadata, so the title and description
 * for /lounge live here instead. Next merges a layout's metadata into the
 * page beneath it, and this layout renders its children untouched -- it
 * exists only so the page has a name of its own in a tab, a bookmark and a
 * pasted link.
 */
export const metadata: Metadata = {
  title: {
    default: "The Teacher's Lounge",
    template: TITLE_TEMPLATE,
  },
  description:
    "Short reads for the ten minutes you actually get. Straight from the newsletter, no lesson prep required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
