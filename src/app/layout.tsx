import type { Metadata } from "next";
import { Inter, Poppins, Source_Serif_4 } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
import { siteUrl } from "@/lib/utils/site-origin";
import { TITLE_TEMPLATE } from "@/lib/constants/metadata";
import "./globals.css";

// Three faces, each with one job. Poppins is the brand's display face and
// stays on headings and the wordmark. Inter runs the interface: tabs, pills,
// labels, buttons. Source Serif carries the lines a child actually reads --
// passages, questions, tasks -- because a reading page should not be set in
// the same face as its own navigation, and a serif marks where the reading
// starts without a single extra pixel of chrome.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/**
 * Every page but eleven used to inherit this block unchanged, which meant a
 * teacher with the fluency tool, the sentence lab and three standards open
 * saw five tabs all reading "Upshift Learning Hub", every bookmark saved
 * under the same name, and -- the part that actually costs something -- a
 * link pasted into a staff email or a teacher group previewed as the site in
 * general rather than the thing being shared. Sharing a link is how this
 * site travels, so the link has to say what it opens.
 *
 * `template` appends the brand to whatever a page sets, so pages name only
 * themselves and nothing has to remember the suffix. `default` is the home
 * page's own title and the fallback for anything that somehow sets none.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Upshift Learning · Describe what you're teaching, get the lesson",
    template: TITLE_TEMPLATE,
  },
  description:
    "Lesson blueprints for every K-12 standard, plus reading, fluency, vocabulary and behavior tools built on what the research actually says.",
  openGraph: {
    type: "website",
    siteName: "Upshift Learning",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
