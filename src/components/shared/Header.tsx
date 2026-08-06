"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Resources", href: "/resources" },
  { label: "Standard match", href: "/match" },
  { label: "My planner", href: "/planner" },
  { label: "Videos", href: "/videos" },
  { label: "Teacher's Lounge", href: "/lounge" },
  { label: "Plans", href: "/pricing" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Never leave the panel hanging open over the new page
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const getActiveNav = () => {
    if (pathname === "/") return "Home";
    if (pathname.startsWith("/resources")) return "Resources";
    if (pathname.startsWith("/match")) return "Standard match";
    if (pathname.startsWith("/planner")) return "My planner";
    if (pathname.startsWith("/videos")) return "Videos";
    if (pathname.startsWith("/lounge")) return "Teacher's Lounge";
    if (pathname.startsWith("/pricing")) return "Plans";
    return null;
  };

  const activeNav = getActiveNav();

  return (
    <header className="sticky top-0 z-50 h-[72px] bg-white/95 backdrop-blur-[10px] border-b border-hairline flex items-center px-5 lg:px-8 gap-4 lg:gap-9">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer flex-shrink-0"
        onClick={() => router.push("/")}
      >
        {/* Four chevrons pointing up, evenly stacked on a shared centre line */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Upshift Learning"
        >
          <g
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10L16 5L25 10" stroke="#FF6A5B" />
            <path d="M7 16L16 11L25 16" stroke="#E559A8" />
            <path d="M7 22L16 17L25 22" stroke="#B695D8" />
            <path d="M7 28L16 23L25 28" stroke="#6BA7D9" />
          </g>
        </svg>
        <div className="flex flex-col gap-0.5">
          <div className="text-[16px] font-bold leading-tight text-charcoal">
            UPSHIFT
          </div>
          <div className="text-[13px] font-normal text-charcoal leading-tight">
            Learning
          </div>
        </div>
      </div>

      {/* Nav — desktop only; the phone gets the panel below */}
      <nav className="hidden lg:flex flex-1 items-center h-full gap-0">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className="h-full px-[15px] text-[11.5px] font-semibold uppercase tracking-[0.1em] relative transition-colors"
            style={{
              color: activeNav === item.label ? "#111111" : "#6A6A6A",
            }}
          >
            {item.label}
            {activeNav === item.label && (
              <div
                className="absolute bottom-0 left-[11px] right-[11px] h-[3px] bg-coral rounded-t-[3px]"
                style={{ backgroundColor: "var(--color-coral)" }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Right */}
      <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0 ml-auto lg:ml-0">
        {/* Auth buttons - shown when not logged in */}
        <a
          href="/auth/signin"
          className="hidden sm:inline-flex items-center min-h-[44px] px-4 text-sm font-semibold text-charcoal hover:text-text-muted transition-colors"
        >
          Sign in
        </a>
        <a
          href="/auth/signup"
          className="inline-flex items-center min-h-[44px] px-4 text-sm font-semibold text-white rounded-lg transition-colors"
          style={{
            backgroundColor: "var(--color-coral)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-coral-press)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-coral)")}
        >
          Get started
        </a>

        {/* Menu toggle — phone and tablet only */}
        <button
          type="button"
          onClick={() => setMenuOpen(open => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-lg text-charcoal hover:bg-gray-050 transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>

        {/* Tier pill & Avatar - shown when logged in (TODO: add conditional) */}
        {/* <div className="flex items-center gap-2 px-3 py-1 border border-border-strong rounded-full text-[12px] font-semibold">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--color-pink)" }}
          />
          FREE PLAN
        </div>

        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
          style={{ backgroundColor: "var(--color-lavender)" }}
        >
          SH
        </div> */}
      </div>

      {/* Mobile nav panel */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-hairline shadow-lg max-h-[calc(100vh-72px)] overflow-y-auto"
        >
          <nav className="flex flex-col py-2">
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="flex items-center min-h-[52px] px-5 text-left text-[15px] font-semibold border-l-[3px] transition-colors hover:bg-gray-050"
                style={{
                  color: activeNav === item.label ? "#111111" : "#6A6A6A",
                  borderLeftColor:
                    activeNav === item.label ? "var(--color-coral)" : "transparent",
                }}
              >
                {item.label}
              </button>
            ))}

            <a
              href="/auth/signin"
              className="sm:hidden flex items-center min-h-[52px] px-5 text-[15px] font-semibold text-charcoal border-t border-hairline mt-2 hover:bg-gray-050 transition-colors"
            >
              Sign in
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
