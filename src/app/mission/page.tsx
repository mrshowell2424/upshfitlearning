import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { BELIEFS } from "@/lib/constants/org";

/**
 * Why Upshift Learning exists.
 *
 * Carried over from upshiftlearning.org, which was a second site saying who
 * the organisation is while this one held everything it makes. A teacher who
 * found one had no way to know about the other.
 *
 * The words are the organisation's own. Nothing here is a rewrite.
 */
export const metadata = {
  title: "Mission & Vision",
  description:
    "Better learning starts with stronger educators. Upshift Learning works alongside teachers, school leaders, and workforce teams to transform how people learn, grow, and lead.",
};

export default function MissionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="px-5 md:px-8 py-14 md:py-20 border-b border-hairline bg-gradient-to-br from-gray-050 to-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-4 text-teal-ink">
              Mission &amp; Vision
            </p>
            <h1 className="text-[34px] md:text-5xl font-bold text-charcoal leading-[1.1] mb-5">
              The beliefs and purpose that drive everything we do.
            </h1>
          </div>
        </section>

        <section className="px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-4xl mx-auto grid gap-10 md:gap-14">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-3 text-coral-ink">
                Our Mission
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-3 leading-snug">
                Better learning starts with stronger educators.
              </h2>
              <p className="text-lg text-text-body leading-relaxed max-w-2xl">
                Upshift Learning works alongside teachers, school leaders, and workforce teams to
                transform how people learn, grow, and lead.
              </p>
            </div>

            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-3 text-lavender-ink">
                Our Vision
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-3 leading-snug">
                A world where every learner has access to bold, transformative education.
              </h2>
              <p className="text-lg text-text-body leading-relaxed max-w-2xl">
                We believe that when educators are equipped, inspired, and supported, entire
                communities rise with them.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 md:px-8 py-14 md:py-20 bg-gray-050 border-y border-hairline">
          <div className="max-w-5xl mx-auto">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-3 text-teal-ink">
              What We Stand For
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-8">
              Built on beliefs that drive real change.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {BELIEFS.map((b) => (
                <div key={b.name} className="bg-white border border-hairline rounded-2xl p-6">
                  <div className="text-3xl mb-3" aria-hidden="true">
                    {b.icon}
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">{b.name}</h3>
                  <p className="text-sm text-text-body leading-relaxed">{b.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">
              Not Sure Where to Start?
            </h2>
            <p className="text-lg text-text-muted mb-7">That&rsquo;s what we&rsquo;re here for.</p>
            <p className="text-base text-text-body mb-8 max-w-xl mx-auto">
              Ready to shift? Let&rsquo;s connect and figure out the best path forward — together.
            </p>
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
