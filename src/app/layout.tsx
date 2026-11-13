import type { Metadata } from "next";
import { Inter, Poppins, Source_Serif_4 } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
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

export const metadata: Metadata = {
  title: "Upshift Learning Hub",
  description: "Teacher resource hub with lesson planning and materials",
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
