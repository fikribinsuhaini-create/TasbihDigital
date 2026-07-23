import { useEffect, useState, useCallback, useRef } from 'react'
import { useTasbihStore } from '@/store/tasbihStore'
import { useSettingsStore } from '@/store/settingsStore'
import { ZikirSelector } from '@/components/ZikirSelector'

export function TasbihPage() {
  const {
    activeZikir, count, target, loaded,
    loadZikirs, increment, reset, setActiveZikir, setTarget,
  } = useTasbihStore()
  const { settings } = useSettingsStore()
  const [showSelector, setShowSelector] = useState(false)
  const [showTargetInput, setShowTargetInput] = useState(false)
  const [ripple, setRipple] = useState(false)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    loadZikirs()
  }, [loadZikirs])

  // Screen wake lock
  useEffect(() => {
    if (!settings.keep_screen_on) return
    let lock: WakeLockSentinel | null = null
    const acquire = async () => {
      try {
        lock = await navigator.wakeLock.request('screen')
        wakeLockRef.current = lock
      } catch { /* not supported or denied */ }
    }
    acquire()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') acquire()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      lock?.release()
    }
  }, [settings.keep_screen_on])

  const handleTap = useCallback(() => {
    increment()

    if (settings.vibration_enabled && navigator.vibrate) {
      navigator.vibrate(15)
    }

    setRipple(true)
    setTimeout(() => setRipple(false), 300)
  }, [increment, settings.vibration_enabled])

  const handleReset = useCallback(() => {
    reset()
  }, [reset])

  if (!loaded || !activeZikir) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const progress = target > 0 ? Math.min(count / target, 1) : 0
  const circumference = 2 * Math.PI * 54
  const dashoffset = circumference * (1 - progress)
  const isComplete = count >= target && target > 0

  return (
    <>
      <div className="flex flex-col items-center h-full px-5 pt-8 pb-4">
        {/* Header */}
        <button
          onClick={() => setShowSelector(true)}
          className="flex items-center gap-2 text-ink dark:text-ink-dark"
        >
          <span className="font-semibold text-base">{activeZikir.name}</span>
          <svg viewBox="0 0 12 12" className="w-3 h-3 text-ink-muted dark:text-ink-muted-dark">
            <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Arabic text */}
        <p className="font-arabic text-2xl text-ink dark:text-ink-dark mt-3" dir="rtl" lang="ar">
          {activeZikir.arabic_text}
        </p>
        <p className="text-xs italic text-ink-muted dark:text-ink-muted-dark mt-1">
          {activeZikir.meaning}
        </p>

        {/* Count ring */}
        <div className="relative mt-6">
          <svg width="140" height="140" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              className="stroke-ink-line dark:stroke-ink-line-dark"
              strokeWidth="3"
            />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              className={isComplete ? 'stroke-amber-300 dark:stroke-amber-light' : 'stroke-teal-400 dark:stroke-teal-light'}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              transform="rotate(-90 60 60)"
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-ink dark:text-ink-dark tabular-nums leading-none">
              {count}
            </span>
            <button
              onClick={() => setShowTargetInput(true)}
              className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1 tabular-nums"
            >
              of {target}
            </button>
          </div>
        </div>

        {/* Tap button */}
        <button
          onClick={handleTap}
          className={`relative mt-6 w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-sm tracking-wider uppercase transition-transform active:scale-95 ${
            isComplete
              ? 'bg-amber-300 dark:bg-amber-light shadow-[0_4px_16px_rgba(196,136,58,0.35)]'
              : 'bg-teal-400 dark:bg-teal-light shadow-[0_4px_16px_rgba(45,122,126,0.35)]'
          }`}
        >
          {ripple && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white pointer-events-none" />
          )}
          <span className="absolute -inset-2 rounded-full border border-current opacity-15 pointer-events-none" />
          TAP
        </button>

        {/* Reset */}
        <button onClick={handleReset} className="flex items-center gap-1.5 mt-5 text-xs font-medium text-ink-sub dark:text-ink-sub-dark">
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
            <path d="M2 8a6 6 0 1 1 1.76 4.24l-.7.7A7 7 0 1 0 1 8h1zm5-3v4h4V8H7V5z" />
          </svg>
          Reset
        </button>
      </div>

      {/* Zikir selector modal */}
      {showSelector && (
        <ZikirSelector
          onSelect={(z) => {
            setActiveZikir(z)
            setShowSelector(false)
          }}
          onClose={() => setShowSelector(false)}
        />
      )}

      {/* Target input modal */}
      {showTargetInput && (
        <TargetModal
          current={target}
          onSet={(t) => { setTarget(t); setShowTargetInput(false) }}
          onClose={() => setShowTargetInput(false)}
        />
      )}
    </>
  )
}

function TargetModal({ current, onSet, onClose }: { current: number; onSet: (t: number) => void; onClose: () => void }) {
  const [value, setValue] = useState(String(current))
  const presets = [33, 99, 100, 500, 1000]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-surface-card dark:bg-surface-card-dark rounded-t-2xl p-5 pb-8 safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-ink dark:text-ink-dark text-sm">Set Target</h3>

        <div className="flex gap-2 mt-3 flex-wrap">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => onSet(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium tabular-nums transition-colors ${
                p === current
                  ? 'bg-teal-400 dark:bg-teal-light text-white'
                  : 'bg-ink-line dark:bg-ink-line-dark text-ink-sub dark:text-ink-sub-dark'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-ink-line dark:bg-ink-line-dark text-ink dark:text-ink-dark rounded-lg px-3 py-2 text-sm tabular-nums outline-none focus:ring-2 focus:ring-teal-400"
            min={1}
          />
          <button
            onClick={() => {
              const n = parseInt(value)
              if (n > 0) onSet(n)
            }}
            className="bg-teal-400 dark:bg-teal-light text-white px-4 rounded-lg text-sm font-medium"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  )
}
