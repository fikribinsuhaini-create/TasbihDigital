import { useEffect } from 'react'
import { useTasbihStore } from '@/store/tasbihStore'
import type { NavTab } from '@/types'

interface HomePageProps {
  onNavigate: (tab: NavTab) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { activeZikir, loadZikirs, loaded } = useTasbihStore()

  useEffect(() => {
    loadZikirs()
  }, [loadZikirs])

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full px-5 pt-12 pb-4">
      <h1 className="font-display text-2xl text-ink dark:text-ink-dark">
        Assalamualaikum
      </h1>
      <p className="text-ink-sub dark:text-ink-sub-dark text-sm mt-1">
        Begin your zikir for today
      </p>

      <div className="mt-8 flex-1 flex flex-col gap-4">
        {activeZikir && (
          <button
            onClick={() => onNavigate('tasbih')}
            className="bg-surface-card dark:bg-surface-card-dark border border-ink-line dark:border-ink-line-dark rounded-xl p-5 text-left transition-transform active:scale-[0.98]"
          >
            <p className="text-xs font-semibold text-teal-400 dark:text-teal-light uppercase tracking-wider">
              Continue
            </p>
            <p className="font-display text-xl text-ink dark:text-ink-dark mt-2">
              {activeZikir.name}
            </p>
            <p className="font-arabic text-lg text-ink-sub dark:text-ink-sub-dark mt-1" dir="rtl" lang="ar">
              {activeZikir.arabic_text}
            </p>
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark italic mt-1">
              {activeZikir.meaning}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-ink-line dark:bg-ink-line-dark rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 dark:bg-teal-light rounded-full" style={{ width: '0%' }} />
              </div>
              <span className="text-xs text-ink-muted dark:text-ink-muted-dark tabular-nums">
                0 / {activeZikir.default_target}
              </span>
            </div>
          </button>
        )}

        <button
          onClick={() => onNavigate('tasbih')}
          className="bg-teal-400 dark:bg-teal-light text-white rounded-xl p-4 font-semibold text-sm transition-transform active:scale-[0.98]"
        >
          Start Counting
        </button>
      </div>
    </div>
  )
}
