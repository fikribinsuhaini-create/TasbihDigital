import { useSettingsStore } from '@/store/settingsStore'
import type { AppSettings } from '@/types'

export function SettingsPage() {
  const { settings, updateSetting } = useSettingsStore()

  const toggles: { key: keyof AppSettings; label: string; desc: string }[] = [
    { key: 'dark_mode', label: 'Dark Mode', desc: 'Easier on the eyes at night' },
    { key: 'vibration_enabled', label: 'Vibration', desc: 'Haptic feedback on each tap' },
    { key: 'sound_enabled', label: 'Tap Sound', desc: 'Subtle click on each count' },
    { key: 'keep_screen_on', label: 'Keep Screen On', desc: 'Prevent screen lock while counting' },
  ]

  return (
    <div className="flex flex-col h-full px-5 pt-8 pb-4">
      <h1 className="font-display text-xl text-ink dark:text-ink-dark">Settings</h1>

      <div className="mt-6">
        {toggles.map((t) => (
          <div key={t.key} className="flex items-center justify-between py-4 border-b border-ink-line dark:border-ink-line-dark">
            <div>
              <p className="text-sm font-medium text-ink dark:text-ink-dark">{t.label}</p>
              <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark mt-0.5">{t.desc}</p>
            </div>
            <button
              onClick={() => updateSetting(t.key, !settings[t.key])}
              className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                settings[t.key]
                  ? 'bg-teal-400 dark:bg-teal-light'
                  : 'bg-ink-line dark:bg-ink-line-dark'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  settings[t.key] ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8 pb-4 text-center">
        <p className="text-sm font-semibold text-ink dark:text-ink-dark">Tasbih Tracker</p>
        <p className="text-[10px] text-ink-muted dark:text-ink-muted-dark mt-1">Version 1.0.0</p>
        <p className="text-[10px] text-ink-muted dark:text-ink-muted-dark mt-0.5">Your data stays on this device</p>
      </div>
    </div>
  )
}
