import { POLICY_EFFECTIVE, paragraphs, type Policy } from "@/lib/constants/policies";

/**
 * One renderer for both policies.
 *
 * Measure matters more here than anywhere else on the site: these are the
 * pages people read when they are deciding whether to trust an organisation
 * with something, and a legal page set across a full-width column is a legal
 * page nobody finishes.
 */
export default function PolicyPage({ policy }: { policy: Policy }) {
  return (
    <>
      <section className="px-5 md:px-8 py-12 md:py-16 border-b border-hairline bg-gradient-to-br from-gray-050 to-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-[32px] md:text-4xl font-bold text-charcoal leading-[1.15] mb-4">
            {policy.title}
          </h1>
          {paragraphs(policy.intro).map((line) => (
            <p key={line} className="text-lg text-text-body leading-relaxed mb-2">
              {line}
            </p>
          ))}
          <p className="mt-4 text-sm font-semibold text-text-muted">
            Effective Date: {POLICY_EFFECTIVE}
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          {policy.sections.map((s) => (
            <section key={s.n} aria-labelledby={`sec-${s.n}`}>
              <h2
                id={`sec-${s.n}`}
                className="text-xl md:text-2xl font-bold text-charcoal mb-3 leading-snug"
              >
                {s.n}. {s.heading}
              </h2>
              <div className="flex flex-col gap-3">
                {paragraphs(s.body).map((p, i) => (
                  <p key={i} className="text-[15.5px] text-text-body leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
