// @ts-nocheck
import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { RESOURCE_TOTAL, STANDARD_TOTAL } from "@/lib/constants/totals";

/**
 * Who is behind this.
 *
 * Added after a tester asked for context on the creators — a fair question
 * for a site asking teachers to trust its lesson design. Every claim here is
 * Stephanie's own copy; nothing is embellished, and the credentials are
 * pulled out as a strip rather than buried mid-paragraph so a visitor
 * skimming for credibility finds it in one pass.
 */
export const metadata = {
  title: "About — Upshift Learning",
  description:
    "Stephanie Howell is an Intervention Specialist, instructional coach, educational consultant and international speaker, and the person behind Upshift Learning.",
};

const CREDENTIALS = [
  { label: "ISTE 20 to Watch", detail: "Recognized for work in educational technology" },
  { label: "Google Innovator", detail: "Google for Education Certified Innovator" },
  { label: "ISTE Distinguished District", detail: "Member of a recognized district team" },
  { label: "Co-founder, Gold EDU", detail: "Professional learning for educators" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-5 md:px-8 py-14 md:py-20 border-b border-hairline bg-gradient-to-br from-gray-050 to-white">
          <div className="max-w-4xl mx-auto">
            <p
              className="text-[13px] font-bold uppercase tracking-[0.16em] mb-4"
              style={{ color: "var(--color-teal)" }}
            >
              The person behind Upshift
            </p>
            <h1 className="text-[34px] md:text-[46px] font-bold text-charcoal leading-[1.08] mb-5">
              Stephanie Howell
            </h1>
            <p className="text-[17px] md:text-[19px] text-text-body leading-relaxed max-w-3xl">
              Intervention Specialist at Lancaster City Schools, instructional coach,
              educational consultant and international speaker.
            </p>
            <p className="text-[19px] md:text-[21px] text-charcoal font-semibold leading-snug max-w-3xl mt-6">
              The best learning starts with curiosity, strong relationships, and the
              courage to try something new.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="px-5 md:px-8 py-12 md:py-16">
          <div className="max-w-3xl mx-auto space-y-6 text-[17px] text-text-body leading-relaxed">
            <p>
              Stephanie loves helping educators turn big ideas into practical strategies
              that make a real difference for students. Whether she is working one-to-one
              with a learner, coaching teachers, or speaking to hundreds of educators, she
              has a knack for making complex topics feel approachable, useful, and even fun.
            </p>
            <p>
              Over the past decade she has served as a teacher, instructional coach,
              technology coordinator, district leader and education strategist. She is the
              co-founder of Gold EDU and co-author of the best-selling book{" "}
              <em>Control the Chaos: Creating Order in the Classroom and Teaching
              Executive Functioning Skills</em>.
            </p>
            <p>
              What drives her most is not the latest technology or the newest trend. It is
              helping people feel confident enough to take the next step — finding creative
              ways to solve problems, designing learning experiences that include every
              student, and reminding educators that meaningful change does not have to be
              overwhelming.
            </p>
            <p>
              When she is not creating resources or speaking at conferences, you will
              probably find her exploring the latest strategies, brainstorming her next
              project, spending time with her family, or chatting with other educators
              about ideas that can make tomorrow&apos;s classrooms just a little bit better.
            </p>
          </div>
        </section>

        {/* Credentials */}
        <section className="px-5 md:px-8 pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-faint mb-5">
              Recognition
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CREDENTIALS.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-hairline bg-white p-5 border-l-4"
                  style={{ borderLeftColor: "var(--color-teal)" }}
                >
                  <p className="font-bold text-charcoal mb-1">{c.label}</p>
                  <p className="text-[14px] text-text-muted leading-snug">{c.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pull quote */}
        <section className="px-5 md:px-8 pb-12 md:pb-16">
          <div className="max-w-3xl mx-auto rounded-2xl bg-charcoal text-white p-8 md:p-10">
            <p className="text-[20px] md:text-[24px] font-semibold leading-snug mb-4">
              &ldquo;Everyone has something valuable to contribute, and some of the best
              conversations begin with a simple question: what if we tried it this way?&rdquo;
            </p>
            <p className="text-[14px] text-gray-300">Stephanie Howell</p>
          </div>
        </section>

        {/* Why this site exists */}
        <section className="px-5 md:px-8 pb-16">
          <div className="max-w-4xl mx-auto rounded-2xl border border-hairline bg-gray-050 p-6 md:p-8 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-[17px] font-bold text-charcoal mb-1">
                That is what this is for
              </p>
              <p className="text-[15px] text-text-body max-w-xl">
                {STANDARD_TOTAL} standards unpacked with a lesson blueprint each, and{" "}
                {RESOURCE_TOTAL.toLocaleString()} resources matched to them. Free with an
                account.
              </p>
            </div>
            <Link
              href="/match"
              className="inline-flex items-center justify-center rounded-xl bg-coral px-6 py-3 font-semibold text-white hover:bg-coral-press transition-colors"
            >
              Find your standard
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
