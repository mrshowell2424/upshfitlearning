import Link from "next/link";
import { ORG } from "@/lib/constants/org";

/**
 * A tester asked who was behind the site and found nowhere to look, so the
 * footer now carries the answer as well as the copyright line.
 */
/**
 * Every section of the site, including the ones the header has no room for.
 * The header drops Design Thinking under PBL and leaves out Learning science
 * entirely, so this is the only complete list a visitor can see — which is
 * why a new section belongs here as well as in the nav.
 */
const links = [
  { label: "About", href: "/about" },
  { label: "Mission & Vision", href: "/mission" },
  { label: "What We Offer", href: "/services" },
  { label: "Standard match", href: "/match" },
  { label: "Science of Reading", href: "/science-of-reading" },
  { label: "Fluency", href: "/fluency" },
  { label: "Teach a Word", href: "/vocabulary" },
  { label: "Knowledge Threads", href: "/science-of-reading/threads" },
  { label: "Sentence Lab", href: "/sentence-lab" },
  { label: "Math", href: "/math" },
  { label: "Maths spiral review", href: "/math/review" },
  { label: "Maths reasoning cases", href: "/math/cases" },
  { label: "PBL", href: "/pbl" },
  { label: "Design Thinking", href: "/design-thinking" },
  { label: "Behavior Strategies", href: "/behavior" },
  { label: "The EF Year", href: "/behavior/year" },
  { label: "Resources", href: "/resources" },
  { label: "Courses", href: "/courses" },
  { label: "Teacher's Lounge", href: "/lounge" },
  { label: "Learning science", href: "/learning-science" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-050 border-t border-hairline py-10 px-5 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-5">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-charcoal hover:text-coral-ink transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-sm font-semibold text-charcoal hover:text-coral-ink transition-colors"
          >
            Contact
          </Link>
        </nav>
        {/* The nonprofit details a donor, a district finance office or a grant
            reviewer looks for. They used to live only on a second website. */}
        <p className="text-sm text-text-muted text-center max-w-2xl">
          {ORG.name} is a registered 501(c)(3) nonprofit organization incorporated in the State of
          Ohio. EIN {ORG.ein} &middot; Ohio Charter Number {ORG.charter}.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <a
            href={`mailto:${ORG.email}`}
            className="text-sm text-text-muted hover:text-coral-ink transition-colors"
          >
            {ORG.email}
          </a>
          <a
            href={ORG.phoneHref}
            className="text-sm text-text-muted hover:text-coral-ink transition-colors"
          >
            {ORG.phone}
          </a>
          <Link href="/privacy" className="text-sm text-text-muted hover:text-coral-ink transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-text-muted hover:text-coral-ink transition-colors">
            Terms of Use
          </Link>
        </nav>
        <p className="text-sm text-text-muted text-center">
          &copy; {new Date().getFullYear()} Upshift Learning. Built by Stephanie Howell.
        </p>
      </div>
    </footer>
  );
}
