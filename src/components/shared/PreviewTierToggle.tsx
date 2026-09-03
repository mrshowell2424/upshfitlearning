'use client'

import { useAuth } from '@/providers/AuthProvider'
import { PAYMENTS_ENABLED } from '@/lib/constants/access'

/**
 * Switches the whole site between the free and All-Access view without needing a
 * Stripe subscription. Renders only when NEXT_PUBLIC_PREVIEW_TOGGLE=true, so it
 * never appears for real visitors unless you deliberately turn it on.
 */
export default function PreviewTierToggle({ compact = false }: { compact?: boolean }) {
  const { previewEnabled, previewTier, setPreviewTier, subscription } = useAuth()

  // Nothing to preview while everything is free — the two sides of this
  // toggle currently show the same site, so it only invites confusion.
  if (!PAYMENTS_ENABLED) return null

  if (!previewEnabled) return null

  // Which side is showing right now — falls back to the real subscription
  const realTier = subscription?.tier === 'pro' || subscription?.tier === 'school' ? 'pro' : 'free'
  const active: 'free' | 'pro' = previewTier ?? realTier

  const option = (tier: 'free' | 'pro', label: string) => {
    const isActive = active === tier
    return (
      <button
        key={tier}
        type="button"
        onClick={() => setPreviewTier(tier)}
        aria-pressed={isActive}
        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
          isActive
            ? 'bg-charcoal text-white'
            : 'text-text-muted hover:text-charcoal'
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-dashed p-0.5"
      style={{ borderColor: 'var(--color-border-strong)' }}
      title="Preview only — switches what the site shows, not a real subscription"
    >
      {!compact && (
        <span className="pl-2 pr-1 text-[10px] font-bold uppercase tracking-[0.12em] text-text-faint">
          Preview
        </span>
      )}
      {option('free', 'Free')}
      {option('pro', 'All-Access')}
      {previewTier && (
        <button
          type="button"
          onClick={() => setPreviewTier(null)}
          className="px-2 text-[11px] font-semibold text-text-faint hover:text-charcoal"
          title="Stop previewing and use your real subscription"
        >
          ✕
        </button>
      )}
    </div>
  )
}
