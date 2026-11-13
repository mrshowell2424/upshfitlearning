import Link from "next/link";

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
  { label: "Standard match", href: "/match" },
  { label: "Science of Reading", href: "/science-of-reading" },
  { label: "Fluency", href: "/fluency" },
  { label: "Teach a Word", href: "/vocabulary" },
  { label: "Math", href: "/math" },
  { label: "PBL", href: "/pbl" },
  { label: "Design Thinking", href: "/design-thinking" },
  { label: "Behavior Strategies", href: "/behavior" },
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
              className="text-sm font-semibold text-charcoal hover:text-coral transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="mailto:hello@upshiftlearning.org"
            className="text-sm font-semibold text-charcoal hover:text-coral transition-colors"
          >
            Contact
          </a>
        </nav>
        <p className="text-sm text-text-muted text-center">
          &copy; {new Date().getFullYear()} Upshift Learning. Built by Stephanie Howell.
        </p>
      </div>
    </footer>
  );
}
