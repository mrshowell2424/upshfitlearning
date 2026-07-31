'use client'

import { useAuth } from '@/app/providers/AuthProvider'

export function useSubscription() {
  const { user, subscription, isPremium, isLoading, signOut } = useAuth()

  const canAccessPremiumFeatures = isPremium
  const canGenerateLessons = isPremium
  const canSaveResources = isPremium
  const canAccessPlanner = isPremium

  const resourceLimit = {
    free: 200,
    pro: null, // unlimited
    school: null, // unlimited
  }

  const currentLimit = subscription
    ? resourceLimit[subscription.tier as keyof typeof resourceLimit]
    : resourceLimit.free

  return {
    user,
    subscription,
    isPremium,
    isLoading,
    canAccessPremiumFeatures,
    canGenerateLessons,
    canSaveResources,
    canAccessPlanner,
    currentLimit,
    signOut,
  }
}
