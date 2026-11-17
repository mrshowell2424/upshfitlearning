import { ORG, ORG_DETAILS } from "@/lib/constants/org";

/**
 * The nonprofit registration, as a table anybody can check.
 *
 * Shown on both About and Contact, from one source, because a donor who
 * finds two EINs on one site stops reading. This is the section a grant
 * reviewer or a district finance office is looking for, so it is published
 * rather than left to a PDF somebody has to ask for.
 */
export default function OrgDetails() {
  return (
    <section className="px-5 md:px-8 py-14 md:py-20 bg-gray-050 border-t border-hairline">
      <div className="max-w-4xl mx-auto">
        <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-3 text-teal-ink">
          Organization Details
        </p>
        <h2 className="text-2xl font-bold text-charcoal mb-3">Official nonprofit information.</h2>
        <p className="text-base text-text-body mb-8 max-w-2xl">
          {ORG.name} is fully registered and transparent. All official details are listed below for
          donors, partners, and verification.
        </p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-hairline border border-hairline rounded-2xl overflow-hidden">
          {ORG_DETAILS.map((d) => (
            <div key={d.label} className="bg-white p-5">
              <dt className="text-xs font-bold uppercase tracking-wider text-text-faint mb-1">
                {d.label}
              </dt>
              <dd className="text-base font-semibold text-charcoal">{d.value}</dd>
            </div>
          ))}
          <div className="bg-white p-5">
            <dt className="text-xs font-bold uppercase tracking-wider text-text-faint mb-1">
              Phone
            </dt>
            <dd className="text-base font-semibold text-charcoal">
              <a href={ORG.phoneHref} className="hover:text-coral-ink transition-colors">
                {ORG.phone}
              </a>
            </dd>
          </div>
          <div className="bg-white p-5">
            <dt className="text-xs font-bold uppercase tracking-wider text-text-faint mb-1">
              Email
            </dt>
            <dd className="text-base font-semibold text-charcoal break-words">
              <a href={`mailto:${ORG.email}`} className="hover:text-coral-ink transition-colors">
                {ORG.email}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
