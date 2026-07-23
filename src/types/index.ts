export interface Zikir {
  id: string
  name: string
  arabic_text: string
  meaning: string
  default_target: number
  is_custom: boolean
  created_at: number
}

export interface ZikirRecord {
  id: string
  zikir_id: string
  count: number
  target: number
  date: string // YYYY-MM-DD
  completed: boolean
  created_at: number
}

export interface AppSettings {
  dark_mode: boolean
  vibration_enabled: boolean
  sound_enabled: boolean
  keep_screen_on: boolean
}

export type NavTab = 'home' | 'tasbih' | 'calendar' | 'settings'
