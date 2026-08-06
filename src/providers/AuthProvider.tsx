'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, getSubscription, isPremium } from '@/lib/auth'

interface Subscription {
  id: string
  user_id: string
  tier: 'free' | 'pro' | 'school'
  status: 'active' | 'cancelled' | 'expired'
  created_at: string
  current_period_end?: string
}

/** What the preview toggle is currently forcing, if anything. */
export type PreviewTier = 'free' | 'pro' | null

/**
 * The preview toggle lets you see the site as a free teacher or an All-Access
 * one without a Stripe subscription. It only changes what the UI shows, so it is
 * kept behind an env flag rather than shipped on by default — once real
 * server-side gating exists, an always-on client switch would be a hole.
 */
const PREVIEW_ENABLED = process.env.NEXT_PUBLIC_PREVIEW_TOGGLE === 'true'
const PREVIEW_STORAGE_KEY = 'upshift:preview-tier'

interface AuthContextType {
  user: User | null
  subscription: Subscription | null
  isPremium: boolean
  isLoading: boolean
  signOut: () => Promise<void>
  /** True when the preview toggle is available in this environment. */
  previewEnabled: boolean
  /** null means "use the real subscription". */
  previewTier: PreviewTier
  setPreviewTier: (tier: PreviewTier) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewTier, setPreviewTierState] = useState<PreviewTier>(null)

  // Restore the choice so it survives navigation and reloads
  useEffect(() => {
    if (!PREVIEW_ENABLED) return
    const stored = window.localStorage.getItem(PREVIEW_STORAGE_KEY)
    if (stored === 'free' || stored === 'pro') setPreviewTierState(stored)
  }, [])

  const setPreviewTier = (tier: PreviewTier) => {
    setPreviewTierState(tier)
    if (tier) window.localStorage.setItem(PREVIEW_STORAGE_KEY, tier)
    else window.localStorage.removeItem(PREVIEW_STORAGE_KEY)
  }

  useEffect(() => {
    const loadAuth = async () => {
      try {
        // Get current user
        if (supabase?.auth?.getUser) {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          setUser(user)

          // If user exists, fetch their subscription
          if (user) {
            const sub = await getSubscription(user.id)
            setSubscription(sub as Subscription)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuth()

    // Listen for auth changes
    let subscription: any = null
    try {
      if (supabase?.auth?.onAuthStateChange) {
        const {
          data: { subscription: sub },
        } = supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
          setUser(session?.user || null)

          if (session?.user) {
            const sub = await getSubscription(session.user.id)
            setSubscription(sub as Subscription)
          } else {
            setSubscription(null)
          }
        })
        subscription = sub
      }
    } catch (error) {
      console.error('Auth state change listener error:', error)
    }

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSubscription(null)
  }

  const realIsPremium = subscription ? isPremium(subscription.tier) : false
  const effectiveIsPremium =
    PREVIEW_ENABLED && previewTier ? previewTier === 'pro' : realIsPremium

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        isPremium: effectiveIsPremium,
        isLoading,
        signOut,
        previewEnabled: PREVIEW_ENABLED,
        previewTier,
        setPreviewTier,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
