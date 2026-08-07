'use client'

import { createContext, useContext, useState } from 'react'

export type MatchTab = 'blueprint' | 'unpack' | 'resources' | 'generate'

interface MatchTabValue {
  activeTab: MatchTab
  setActiveTab: (tab: MatchTab) => void
}

const MatchTabContext = createContext<MatchTabValue | undefined>(undefined)

/**
 * Holds which tab is showing. The banner sits above the standard card and the
 * tabs sit below it, so the two can't share local state — this lifts it just
 * high enough for the banner to follow along without moving the markup around.
 */
export function MatchTabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<MatchTab>('blueprint')

  return (
    <MatchTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </MatchTabContext.Provider>
  )
}

export function useMatchTab(): MatchTabValue {
  const context = useContext(MatchTabContext)
  if (!context) {
    throw new Error('useMatchTab must be used within MatchTabProvider')
  }
  return context
}
