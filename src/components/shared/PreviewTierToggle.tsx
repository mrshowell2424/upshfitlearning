'use client'

import { useAuth } from '@/providers/AuthProvider'
import { PAYMENTS_ENABLED } from '@/lib/constants/access'

/**
 * Previews what a visitor sees, without signing out to find out.
 *
 * It used to switch between free and All-Access, which stopped meaning
 * anything the moment everything became free — both sides showed the same
 * site. The difference that does exist now is the sign-in gate: Resources and
 * Standard match are blurred until there is an account, and checking that
 * otherwise means a private window every time.
 *
 * Signed out blurs those pages exactly as a stranger sees them. Signed in is
 * the normal view. Neither changes any real session, and it renders only when
 * NEXT_PUBLIC_PREVIEW_TOGGLE=true, so it never appears for real visitors.
 */
export default function PreviewTierToggle({ compact = false }: { compact?: boolean }) {
  const { previewEnabled, previewTier, setPreviewTier, subscription, user } = useAuth()

  if (!previewEnabled) return null

  // Which side is showing right now. While payments are off, an account is
  // the whole distinction, so the fallback is whether anyone is signed in
  // rather than what they have bought.
  const realTier = PAYMENTS_ENABLED
    ? (subscription?.tier === 'pro' || subscription?.tier === 'school' ? 'pro' : 'free')
    : (user ? 'pro' : 'free')
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
      title={PAYMENTS_ENABLED
        ? 'Preview only — switches what the site shows, not a real subscription'
        : 'Preview only — shows the site as a signed-out visitor sees it'}
    >
      {!compact && (
        <span className="pl-2 pr-1 text-[10px] font-bold uppercase tracking-[0.12em] text-text-faint">
          Preview
        </span>
      )}
      {PAYMENTS_ENABLED ? (
        <>
          {option('free', 'Free')}
          {option('pro', 'All-Access')}
        </>
      ) : (
        <>
          {option('free', 'Signed out')}
          {option('pro', 'Signed in')}
        </>
      )}
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
