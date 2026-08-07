'use client'

import { useMatchTab } from './tab-context'
import { DOK_DESCRIPTIONS, type DokLevel } from '@/lib/utils/unpack'

/**
 * The banner names whatever the teacher is currently looking at. On the lesson
 * blueprint that's the lesson; on the other tabs it's the standard itself, since
 * those views are about the standard rather than one lesson built from it.
 */
export function LessonBanner({ blueprint, standard, unpack }: { blueprint?: any; standard?: any; unpack?: any }) {
  const { activeTab } = useMatchTab()
  const dok = unpack?.dok as DokLevel | undefined

  const standardLine = [standard?.code, standard?.name].filter(Boolean).join(' — ')

  const views: Record<string, { heading?: string; sub?: string; badge?: string }> = {
    blueprint: {
      heading: blueprint?.title,
      sub: [standard?.gradeLabel && `${standard.gradeLabel} lesson`, 'Science of Learning First']
        .filter(Boolean)
        .join(' · '),
      badge: blueprint?.badge,
    },
    unpack: { heading: standardLine, sub: 'Deconstructed' },
    resources: { heading: 'Resources to remix', sub: standardLine },
    generate: { heading: 'Make it for my learners', sub: standardLine },
  }

  const view = views[activeTab] ?? views.blueprint
  if (!view.heading) return null

  return (
    <div
      className="rounded-2xl overflow-hidden mb-6 px-6 md:px-8 py-6 md:py-7 flex flex-wrap items-start justify-between gap-4"
      style={{ backgroundColor: 'var(--color-navy)' }}
    >
      <div>
        <h1 className="text-[24px] md:text-[30px] font-bold uppercase text-white leading-tight">
          {view.heading}
        </h1>
        {view.sub && (
          <p
            className="text-[16px] md:text-[17px] font-semibold mt-1"
            style={{ color: 'var(--color-teal)' }}
          >
            {view.sub}
          </p>
        )}
      </div>
      {activeTab === 'unpack' && dok ? (
        <div
          className="flex-shrink-0 rounded-xl px-4 py-2"
          style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
          title={DOK_DESCRIPTIONS[dok].blurb}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
            Depth of Knowledge
          </p>
          <p className="text-[15px] font-bold text-white leading-tight">
            DOK {dok} · {DOK_DESCRIPTIONS[dok].name}
          </p>
        </div>
      ) : view.badge ? (
        <span
          className="inline-block px-5 py-2 rounded-full text-[13px] font-bold uppercase tracking-[0.08em] text-white flex-shrink-0"
          style={{ backgroundColor: 'var(--color-teal)' }}
        >
          {view.badge}
        </span>
      ) : null}
    </div>
  )
}
