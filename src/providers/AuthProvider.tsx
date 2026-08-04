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

interface AuthContextType {
  user: User | null
  subscription: Subscription | null
  isPremium: boolean
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        isPremium: subscription ? isPremium(subscription.tier) : false,
        isLoading,
        signOut,
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
