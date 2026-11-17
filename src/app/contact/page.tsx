import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import OrgDetails from "@/components/shared/OrgDetails";
import { ORG } from "@/lib/constants/org";

/**
 * How to reach Upshift Learning.
 *
 * The old site ran its form through Formspree. That endpoint is not carried
 * over, because a form that silently posts nowhere is worse than no form:
 * the visitor gets a success message and nobody ever sees the message.
 *
 * So the page gives the two ways to reach a person and no third thing that
 * looks like one. The address and the number are the whole of it, written
 * large enough to use; the mail link pre-fills a subject so a message sent
 * from here is identifiable.
 */
export const metadata = {
  title: "Contact",
  description:
    "Reach Upshift Learning by email or phone, or support the mission. A registered 501(c)(3) nonprofit incorporated in Ohio.",
};


export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="px-5 md:px-8 py-14 md:py-20 border-b border-hairline bg-gradient-to-br from-gray-050 to-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-4 text-teal-ink">
              Contact
            </p>
            <h1 className="text-[34px] md:text-5xl font-bold text-charcoal leading-[1.1] mb-5">
              Let&rsquo;s Start a Conversation
            </h1>
            <p className="text-lg text-text-body max-w-2xl">
              Whether you have a question, a project in mind, or just want to say hello — we&rsquo;d
              love to hear from you.
            </p>
          </div>
        </section>

        <section className="px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-hairline rounded-2xl p-7">
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-3 text-coral-ink">
                Get in Touch
              </p>
              <h2 className="text-xl font-bold text-charcoal mb-5">Reach us directly.</h2>
              <dl className="flex flex-col gap-4">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-text-faint mb-1">
                    Email
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${ORG.email}?subject=Hello%20from%20upshiftlearning.org`}
                      className="text-lg font-semibold text-coral-ink hover:text-coral-ink-press transition-colors break-words"
                    >
                      {ORG.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-text-faint mb-1">
                    Phone
                  </dt>
                  <dd>
                    <a
                      href={ORG.phoneHref}
                      className="text-lg font-semibold text-charcoal hover:text-coral-ink transition-colors"
                    >
                      {ORG.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border border-hairline rounded-2xl p-7">
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-3 text-lavender-ink">
                Support the Mission
              </p>
              <h2 className="text-xl font-bold text-charcoal mb-3">Fuel bold learning.</h2>
              <p className="text-base text-text-body leading-relaxed">
                Your contribution helps us bring high-quality learning to more people — in
                classrooms and beyond. Every gift makes a shift possible.
              </p>
              <p className="mt-5 text-sm text-text-muted">
                {ORG.name} is a registered 501(c)(3) nonprofit organization incorporated in the
                State of Ohio. EIN {ORG.ein}.
              </p>
            </div>
          </div>
        </section>

        <OrgDetails />
      </main>
      <Footer />
    </div>
  );
}
