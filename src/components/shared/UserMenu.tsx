'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'

/**
 * Pull a first name out of whatever the provider gave us. Google sends
 * `name`/`full_name`, the email form sets `full_name`, and if neither is there we
 * fall back to the part of the address before the @.
 */
export function firstNameFrom(user: {
  email?: string | null
  user_metadata?: Record<string, unknown> | null
} | null): string {
  if (!user) return ''

  const meta = user.user_metadata ?? {}
  const candidate =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    (typeof meta.given_name === 'string' && meta.given_name) ||
    ''

  const fromName = candidate.trim().split(/\s+/)[0]
  if (fromName) return fromName

  const local = user.email?.split('@')[0] ?? ''
  if (!local) return 'Account'

  // "stephanie.howell" or "stephanie_howell" → "Stephanie"
  const first = local.split(/[._-]+/)[0]
  return first.charAt(0).toUpperCase() + first.slice(1)
}

export default function UserMenu() {
  const { user, subscription, isPremium, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on an outside click or Escape
  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!user) return null

  const firstName = firstNameFrom(user)
  const initial = firstName.charAt(0).toUpperCase() || '?'
  const planLabel = isPremium
    ? subscription?.tier === 'school'
      ? 'School plan'
      : 'All-Access'
    : 'Free plan'

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 min-h-[44px] pl-1 pr-2 rounded-full hover:bg-gray-050 transition-colors"
      >
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: 'var(--color-lavender)' }}
        >
          {initial}
        </span>
        <span className="text-sm font-semibold text-charcoal max-w-[9rem] truncate">
          {firstName}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] w-60 rounded-xl border border-border bg-white shadow-lg overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-hairline">
            <p className="text-sm font-semibold text-charcoal truncate">{firstName}</p>
            {user.email && (
              <p className="text-xs text-text-muted truncate">{user.email}</p>
            )}
            <span
              className="inline-flex items-center gap-1.5 mt-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]"
              style={{
                backgroundColor: isPremium ? 'rgba(0,180,166,0.14)' : 'var(--color-gray-100)',
                color: isPremium ? 'var(--color-teal)' : 'var(--color-text-faint)',
              }}
            >
              {planLabel}
            </span>
          </div>

          {!isPremium && (
            <a
              href="/pricing"
              className="block px-4 py-3 text-sm font-semibold text-coral hover:bg-gray-050 transition-colors"
            >
              Get All-Access
            </a>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              signOut()
            }}
            className="w-full text-left px-4 py-3 text-sm font-semibold text-charcoal hover:bg-gray-050 transition-colors border-t border-hairline"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
