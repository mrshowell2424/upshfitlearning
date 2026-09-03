"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Blurs a section until the visitor has an account.
 *
 * A teacher who lands here should be able to see that there is something
 * substantial behind the gate — the shape of the library, the number of
 * results — without being able to read it. That is why this blurs real
 * content rather than replacing it with a marketing panel: an empty promise
 * converts worse than a blurred page that visibly holds what was promised.
 *
 * This is a prompt, not a lock. The content is still in the DOM behind the
 * blur, so anyone who opens developer tools can read it. That is the right
 * trade here because nothing behind this gate costs money — an account is
 * free, and the gate exists to make signing up the obvious next step rather
 * than to protect anything. Paid content is withheld server-side instead, in
 * lib/auth/entitlement.ts, and is never serialised into a response at all.
 *
 * Nothing renders over the content while the session is still loading, so a
 * signed-in teacher never sees the gate flash on their way in.
 */
export function SignInGate({
  children,
  title,
  blurb,
}: {
  children: React.ReactNode;
  title: string;
  blurb: string;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading || user) return <>{children}</>;

  return (
    <div className="relative">
      {/* Inert as well as unreadable — a blurred control that still responds
          to clicks is worse than no control at all. */}
      <div
        aria-hidden="true"
        className="blur-[6px] select-none pointer-events-none opacity-70"
      >
        {children}
      </div>

      <div className="absolute inset-0 flex items-start justify-center pt-16 md:pt-24 px-5">
        <div className="w-full max-w-md rounded-2xl border border-hairline bg-white/95 backdrop-blur-sm shadow-xl p-7 text-center">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3"
            style={{ color: "var(--color-teal)" }}
          >
            Free with an account
          </p>
          <h2 className="text-[22px] md:text-[26px] font-bold text-charcoal mb-3 leading-snug">
            {title}
          </h2>
          <p className="text-[15px] text-text-body leading-relaxed mb-6">
            {blurb}
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/auth/signup"
              className="px-6 py-3 rounded-xl font-semibold text-white bg-coral hover:bg-coral-press transition-colors"
            >
              Create a free account
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm font-semibold text-charcoal hover:text-coral transition-colors py-2"
            >
              Already have one? Sign in
            </Link>
          </div>
          <p className="text-[12px] text-text-faint mt-4">
            No card, no trial period, no expiry.
          </p>
        </div>
      </div>
    </div>
  );
}
