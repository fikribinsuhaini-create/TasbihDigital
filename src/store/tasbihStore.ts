import { create } from 'zustand'
import type { Zikir } from '@/types'
import { getAllZikirs, seedDefaultZikirs, incrementDailyRecord } from '@/database/db'

interface TasbihState {
  zikirs: Zikir[]
  activeZikir: Zikir | null
  count: number
  target: number
  loaded: boolean

  loadZikirs: () => Promise<void>
  setActiveZikir: (zikir: Zikir) => void
  setTarget: (target: number) => void
  increment: () => void
  reset: () => void
}

function getTodayDate(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const useTasbihStore = create<TasbihState>((set, get) => ({
  zikirs: [],
  activeZikir: null,
  count: 0,
  target: 33,
  loaded: false,

  loadZikirs: async () => {
    if (get().loaded) return
    await seedDefaultZikirs()
    const zikirs = await getAllZikirs()
    const first = zikirs[0]
    set({
      zikirs,
      activeZikir: first ?? null,
      target: first?.default_target ?? 33,
      loaded: true,
    })
  },

  setActiveZikir: (zikir) => {
    set({ activeZikir: zikir, count: 0, target: zikir.default_target })
  },

  setTarget: (target) => set({ target }),

  increment: () => {
    const { activeZikir, target } = get()
    set((s) => ({ count: s.count + 1 }))
    if (activeZikir) {
      incrementDailyRecord(activeZikir.id, target, getTodayDate())
    }
  },

  reset: () => set({ count: 0 }),
}))
