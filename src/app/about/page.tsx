import Link from "next/link";
import Image from "next/image";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { RESOURCE_TOTAL, STANDARD_TOTAL } from "@/lib/constants/totals";
import OrgDetails from "@/components/shared/OrgDetails";
import { BELIEFS, DIFFERENCE, ORG, TEAM, TESTIMONIALS } from "@/lib/constants/org";

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
  title: "About",
  description:
    "Stephanie Howell is an Intervention Specialist, instructional coach, educational consultant and international speaker, and the person behind Upshift Learning.",
};

/**
 * Her book. The title is Amazon's own, not a paraphrase — the story copy used
 * to carry a tidied-up version of the subtitle that does not appear on the
 * cover or the listing.
 *
 * The Amazon link is the plain /dp/<ASIN> form rather than the search URL it
 * arrived as: that one carried a session id, a search-term trail and a
 * referrer tag, none of which belong in a page served to other people.
 */
const BOOK = {
  title: "Control the Chaos",
  subtitle:
    "What it takes to create order in the classroom and teach executive functioning skills",
  authors: "Stephanie Howell and Tara Ruckman",
  href: "https://www.amazon.com/dp/B0B92V9L2Y",
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

      <main id="main" tabIndex={-1} className="flex-1">
        {/* Hero */}
        <section className="px-5 md:px-8 py-14 md:py-20 border-b border-hairline bg-gradient-to-br from-gray-050 to-white">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] gap-10 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <p
                className="text-[13px] font-bold uppercase tracking-[0.16em] mb-4"
                style={{ color: "var(--color-teal-ink)" }}
              >
                The person behind Upshift
              </p>
              <h1 className="text-[34px] md:text-[46px] font-bold text-charcoal leading-[1.08] mb-4">
                Stephanie Howell
              </h1>
              <p className="text-[17px] md:text-[19px] text-text-body leading-relaxed">
                Intervention Specialist at Lancaster City Schools, instructional coach,
                educational consultant and international speaker.
              </p>
              <p className="text-[19px] md:text-[21px] text-charcoal font-semibold leading-snug mt-6">
                The best learning starts with curiosity, strong relationships, and the
                courage to try something new.
              </p>
            </div>

            {/*
              The cut-out sits on the brand palette rather than the gradient it
              arrived on, so the backdrop echoing the four-chevron mark reads as
              deliberate instead of coincidental. Priority, because it is the
              largest thing above the fold on this page.
            */}
            <div className="order-1 md:order-2 justify-self-center">
              <div
                className="relative w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden"
                style={{
                  background:
                    "linear-gradient(150deg, rgba(228,102,75,0.22) 0%, rgba(196,80,124,0.20) 35%, rgba(122,94,192,0.20) 68%, rgba(79,157,181,0.22) 100%)",
                }}
              >
                <Image
                  src="/brand/stephanie-howell.png"
                  alt="Stephanie Howell"
                  fill
                  priority
                  sizes="(max-width: 768px) 240px, 300px"
                  className="object-cover object-top scale-[1.08]"
                />
              </div>
            </div>
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
              <em>Control the Chaos</em>.
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

        {/* The book */}
        <section className="px-5 md:px-8 pb-12 md:pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-faint mb-5">
              The book
            </h2>
            <div className="rounded-2xl border border-hairline bg-white p-6 md:p-8 border-l-4"
                 style={{ borderLeftColor: "var(--color-coral)" }}>
              <p className="text-[24px] md:text-[28px] font-bold text-charcoal leading-tight">
                {BOOK.title}
              </p>
              <p className="text-[17px] text-text-body leading-snug mt-2">{BOOK.subtitle}</p>
              <p className="text-[14px] text-text-muted mt-3">By {BOOK.authors}</p>
              <p className="text-[15px] text-text-body leading-relaxed mt-5 max-w-[58ch]">
                The executive functioning work behind a lot of what is on this site —
                routines, structures and the habits that let a classroom run without
                being run at.
              </p>
              <a
                href={BOOK.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-charcoal px-6 py-3 font-semibold text-white hover:bg-charcoal/90 transition-colors mt-6"
              >
                Find it on Amazon
              </a>
            </div>
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

        {/* The organisation, carried over from upshiftlearning.org.
            The page above this line is one person; everything below it is
            the nonprofit she runs, and it used to live on a separate
            website — so a teacher who found the hub never learned there
            was an organisation behind it. */}
        <section className="px-5 md:px-8 py-12 md:py-16 border-t border-hairline bg-gray-050">
          <div className="max-w-4xl mx-auto">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-3 text-teal-ink">
              Who We Are
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-4 leading-snug max-w-3xl">
              We&rsquo;re a team of educators, coaches, and change-makers committed to transforming
              how people learn, grow, and lead.
            </h2>
            <p className="text-base text-text-body leading-relaxed max-w-2xl mb-8">
              Our team brings together experience in education, instructional design, leadership
              coaching, and organizational development.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {TEAM.map((t) => (
                <div key={t.name} className="bg-white border border-hairline rounded-2xl p-6">
                  <div
                    aria-hidden="true"
                    className="w-10 h-10 rounded-full bg-gray-050 border border-hairline flex items-center justify-center font-bold text-charcoal mb-3"
                  >
                    {t.initial}
                  </div>
                  <h3 className="text-lg font-bold text-charcoal">{t.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-faint mb-2">
                    {t.role}
                  </p>
                  <p className="text-sm text-text-body leading-relaxed">{t.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 md:px-8 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-3 text-coral-ink">
              What We Stand For
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-8">
              Built on beliefs that drive real change.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {BELIEFS.map((b) => (
                <div key={b.name} className="border border-hairline rounded-2xl p-6">
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

        <section className="px-5 md:px-8 pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto rounded-2xl border border-hairline p-6 md:p-8">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-3 text-lavender-ink">
              The Upshift Difference
            </p>
            <h2 className="text-2xl font-bold text-charcoal mb-3">
              We don&rsquo;t do one-size-fits-all.
            </h2>
            <p className="text-base text-text-body leading-relaxed max-w-2xl mb-6">
              Every plan, workshop, and resource we build starts with your learners in mind —
              because real impact only happens when learning feels personal.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {DIFFERENCE.map((d) => (
                <li key={d} className="flex gap-3 text-[15px] text-text-body">
                  <span aria-hidden="true" className="text-teal-ink font-bold">
                    ✓
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-5 md:px-8 pb-12 md:pb-16">
          <div className="max-w-5xl mx-auto">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-3 text-teal-ink">
              What People Are Saying
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-8">
              Real words from real people.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.who}
                  className="bg-white border border-hairline rounded-2xl p-6 flex flex-col gap-4"
                >
                  <blockquote className="text-[15.5px] text-charcoal leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-auto">
                    <p className="text-sm font-bold text-charcoal">{t.who}</p>
                    <p className="text-xs text-text-muted">{t.where}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-6 text-sm text-text-muted max-w-2xl">
              Attributed by role rather than by name, which is how they were given to {ORG.name}.
            </p>
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
              className="inline-flex items-center justify-center rounded-xl bg-coral-ink px-6 py-3 font-semibold text-white hover:bg-coral-ink-press transition-colors"
            >
              Find your standard
            </Link>
          </div>
        </section>

        <OrgDetails />
      </main>

      <Footer />
    </div>
  );
}
