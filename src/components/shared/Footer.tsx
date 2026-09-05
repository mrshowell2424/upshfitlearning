import Link from "next/link";

/**
 * A tester asked who was behind the site and found nowhere to look, so the
 * footer now carries the answer as well as the copyright line.
 */
const links = [
  { label: "About", href: "/about" },
  { label: "Standard match", href: "/match" },
  { label: "Basic Reading", href: "/reading" },
  { label: "Resources", href: "/resources" },
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
