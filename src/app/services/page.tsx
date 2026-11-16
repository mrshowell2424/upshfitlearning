import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { SERVICES } from "@/lib/constants/org";

/**
 * What Upshift Learning offers, beyond what a teacher can download here.
 *
 * The seven services as upshiftlearning.org stated them, word for word. The
 * teaching hub on this site is what the organisation makes; this is what it
 * does with people.
 */
export const metadata = {
  title: "What We Offer",
  description:
    "Workshops, coaching, consulting, online courses, speaking, custom resources, and AI integration support for teachers, school leaders, and corporate teams.",
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="px-5 md:px-8 py-14 md:py-20 border-b border-hairline bg-gradient-to-br from-gray-050 to-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-4 text-teal-ink">
              What We Offer
            </p>
            <h1 className="text-[34px] md:text-5xl font-bold text-charcoal leading-[1.1] mb-5">
              Whether you&rsquo;re a teacher, a school leader, or a corporate team — we&rsquo;ve got
              you.
            </h1>
            <p className="text-lg text-text-muted max-w-2xl">We can&rsquo;t wait to build with you.</p>
          </div>
        </section>

        <section className="px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div
                key={s.name}
                className="bg-white border border-hairline rounded-2xl p-6 flex flex-col gap-3 hover:border-charcoal transition-colors"
              >
                <div className="text-3xl" aria-hidden="true">
                  {s.icon}
                </div>
                <h2 className="text-xl font-bold text-charcoal">{s.name}</h2>
                <p className="text-sm text-text-body leading-relaxed">{s.blurb}</p>
                <ul className="mt-1 flex flex-col gap-1.5">
                  {s.points.map((p) => (
                    <li key={p} className="text-sm text-text-muted flex gap-2">
                      <span aria-hidden="true" className="text-teal-ink font-bold">
                        ✓
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 md:px-8 py-14 md:py-20 bg-gray-050 border-t border-hairline">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">
              Not Sure Where to Start?
            </h2>
            <p className="text-lg text-text-muted mb-7">That&rsquo;s what we&rsquo;re here for.</p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-xl bg-coral-ink hover:bg-coral-ink-press text-white font-semibold transition-colors"
            >
              Let&rsquo;s Connect
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
