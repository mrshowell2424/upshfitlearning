"use client";

import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Resources", href: "/resources" },
  { label: "Standard match", href: "/match" },
  { label: "My planner", href: "/" },
  { label: "Videos", href: "/" },
  { label: "Teacher's Lounge", href: "/" },
  { label: "Plans", href: "/" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveNav = () => {
    if (pathname === "/") return "Home";
    if (pathname.startsWith("/resources")) return "Resources";
    if (pathname.startsWith("/match")) return "Standard match";
    return null;
  };

  const activeNav = getActiveNav();

  return (
    <header className="sticky top-0 z-50 h-[72px] bg-white/95 backdrop-blur-[10px] border-b border-hairline flex items-center px-8 gap-9">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer flex-shrink-0"
        onClick={() => router.push("/")}
      >
        <img
          src="/brand/chevron-coral-512.png"
          alt="Upshift"
          className="w-[30px] h-[30px]"
        />
        <div className="flex flex-col">
          <div className="text-[15px] font-bold leading-tight tracking-[0.14em]">
            UPSHIFT
          </div>
          <div className="text-[8.5px] font-medium text-text-faint leading-tight tracking-[0.28em] mt-[3px]">
            LEARNING HUB
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex items-center h-full gap-0">
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
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Auth buttons - shown when not logged in */}
        <a
          href="/auth/login"
          className="px-4 py-1 text-sm font-semibold text-charcoal hover:text-text-muted transition-colors"
        >
          Sign in
        </a>
        <a
          href="/auth/signup"
          className="px-4 py-1.5 text-sm font-semibold text-white rounded-lg transition-colors"
          style={{
            backgroundColor: "var(--color-coral)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-coral-press)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-coral)")}
        >
          Get started
        </a>

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
    </header>
  );
}
