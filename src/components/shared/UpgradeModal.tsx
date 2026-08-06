// @ts-nocheck
"use client";

import { useState } from "react";

export function UpgradeModal({ isOpen, onClose, feature }: { isOpen: boolean; onClose: () => void; feature: string }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // For now, redirect to pricing page
      // In production, this would create a Stripe checkout session
      window.location.href = "/pricing";
    } catch (error) {
      console.error("Upgrade error:", error);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4">
        <h2 className="text-[24px] font-bold mb-2">Upgrade to Pro</h2>
        <p className="text-text-muted mb-6">
          {feature} is available with Upshift Pro. Upgrade now to access all premium features.
        </p>

        <div className="bg-gray-050 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="text-coral font-bold">✓</span>
              <span className="text-sm">AI-powered lesson generation</span>
            </div>
            <div className="flex gap-2">
              <span className="text-coral font-bold">✓</span>
              <span className="text-sm">Save and organize lessons</span>
            </div>
            <div className="flex gap-2">
              <span className="text-coral font-bold">✓</span>
              <span className="text-sm">Priority support</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-coral text-white font-semibold hover:bg-coral-press transition-colors disabled:bg-gray-400"
          >
            {loading ? "Redirecting..." : "Upgrade to Pro"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg border border-border text-charcoal font-semibold hover:bg-gray-050 transition-colors"
          >
            Maybe later
          </button>
        </div>

        <p className="text-xs text-text-faint text-center mt-4">
          $9/month or $79/year. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
