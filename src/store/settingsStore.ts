import { create } from 'zustand'
import type { AppSettings } from '@/types'
import { getSettings, setSetting } from '@/database/db'

interface SettingsState {
  settings: AppSettings
  loaded: boolean
  loadSettings: () => Promise<void>
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    dark_mode: false,
    vibration_enabled: true,
    sound_enabled: false,
    keep_screen_on: true,
  },
  loaded: false,

  loadSettings: async () => {
    if (get().loaded) return
    const settings = await getSettings()
    set({ settings, loaded: true })
  },

  updateSetting: async (key, value) => {
    await setSetting(key, value)
    set((state) => ({
      settings: { ...state.settings, [key]: value },
    }))
  },
}))
