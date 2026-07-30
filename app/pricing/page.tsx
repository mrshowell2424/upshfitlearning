// @ts-nocheck
"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const plans = [
  {
    name: "Free",
    price: "$0",
    billing: "Forever free",
    description: "Get started with Upshift",
    features: [
      "Browse 2,688+ resources",
      "View lesson blueprints",
      "Search 4 standards",
      "Understand standard unpacks",
    ],
    cta: "Get started",
    ctaHref: "/auth/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    billing: "/month or $79/year",
    description: "Everything you need to teach",
    features: [
      "Everything in Free, plus:",
      "🤖 AI lesson generation",
      "📊 4 output formats (slides, docs, worksheets, rubrics)",
      "📌 Save & organize lessons",
      "🎯 Access lesson planner",
      "⚡ Priority support",
    ],
    cta: "Start free trial",
    ctaHref: "/auth/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "School",
    price: "Custom",
    billing: "Contact us",
    description: "For schools & districts",
    features: [
      "Everything in Pro, plus:",
      "📈 Team collaboration",
      "👥 Multi-teacher licenses",
      "🔐 SSO & admin controls",
      "📱 Custom integrations",
      "🎓 Dedicated support",
    ],
    cta: "Contact sales",
    ctaHref: "mailto:sales@upshiftlearning.org",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-[48px] font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-[18px] text-text-muted max-w-2xl mx-auto">
            Start free. Upgrade anytime. No credit card required.
          </p>
        </div>

        {/* Plans grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-8 transition-all ${
                plan.highlighted
                  ? "border-coral bg-gradient-to-br from-coral/5 to-transparent ring-2 ring-coral/20 md:scale-105"
                  : "border-border bg-white hover:border-charcoal"
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4">
                  <span
                    className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-white"
                    style={{ backgroundColor: "var(--color-coral)" }}
                  >
                    Most popular
                  </span>
                </div>
              )}

              <h3 className="text-[24px] font-bold mb-2">{plan.name}</h3>
              <div className="mb-1">
                <span className="text-[36px] font-bold">{plan.price}</span>
                {plan.price !== "Custom" && (
                  <span className="text-text-muted ml-2">{plan.billing}</span>
                )}
              </div>
              {plan.price === "Custom" && (
                <p className="text-text-muted text-sm mb-4">{plan.billing}</p>
              )}

              <p className="text-text-muted text-sm mb-6">{plan.description}</p>

              <a
                href={plan.ctaHref}
                className={`block text-center py-3 rounded-lg font-semibold mb-8 transition-colors ${
                  plan.highlighted
                    ? "bg-coral text-white hover:bg-coral-press"
                    : "border border-border text-charcoal hover:bg-gray-050"
                }`}
              >
                {plan.cta}
              </a>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    {feature.includes("Everything") || feature.includes("plus") ? (
                      <span className="text-text-muted font-semibold">{feature}</span>
                    ) : (
                      <>
                        <span
                          className="text-lg flex-shrink-0"
                          style={{ color: "var(--color-coral)" }}
                        >
                          ✓
                        </span>
                        <span className="text-text-body">{feature}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[32px] font-bold text-center mb-8">FAQ</h2>

          <div className="space-y-6">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes! Cancel your Pro subscription anytime. No questions asked.",
              },
              {
                q: "Is there a free trial?",
                a: "Free accounts get full access to the library and lesson blueprints. Upgrade to Pro to unlock AI generation.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 7-day money-back guarantee on annual subscriptions.",
              },
              {
                q: "What about schools?",
                a: "Schools get volume pricing, SSO, team features, and dedicated support. Contact sales@upshiftlearning.org.",
              },
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
