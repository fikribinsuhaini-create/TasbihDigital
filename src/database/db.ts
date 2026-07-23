import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Zikir, ZikirRecord, AppSettings } from '@/types'

interface TasbihDB extends DBSchema {
  zikirs: {
    key: string
    value: Zikir
    indexes: { 'by-created': number }
  }
  records: {
    key: string
    value: ZikirRecord
    indexes: { 'by-date': string; 'by-zikir': string }
  }
  settings: {
    key: string
    value: { key: string; value: unknown }
  }
}

const DB_NAME = 'tasbih-tracker'
const DB_VERSION = 1

const DEFAULT_ZIKIRS: Omit<Zikir, 'id' | 'created_at'>[] = [
  { name: 'SubhanAllah', arabic_text: 'سبحان الله', meaning: 'Glory be to God', default_target: 33, is_custom: false },
  { name: 'Alhamdulillah', arabic_text: 'الحمد لله', meaning: 'Praise be to God', default_target: 33, is_custom: false },
  { name: 'Allahu Akbar', arabic_text: 'الله أكبر', meaning: 'God is the Greatest', default_target: 33, is_custom: false },
  { name: 'Astaghfirullah', arabic_text: 'أستغفر الله', meaning: 'I seek forgiveness from God', default_target: 100, is_custom: false },
  { name: 'Selawat', arabic_text: 'اللهم صل على محمد', meaning: 'O God, send blessings upon Muhammad', default_target: 100, is_custom: false },
]

let dbInstance: IDBPDatabase<TasbihDB> | null = null

export async function getDB(): Promise<IDBPDatabase<TasbihDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<TasbihDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const zikirStore = db.createObjectStore('zikirs', { keyPath: 'id' })
      zikirStore.createIndex('by-created', 'created_at')

      const recordStore = db.createObjectStore('records', { keyPath: 'id' })
      recordStore.createIndex('by-date', 'date')
      recordStore.createIndex('by-zikir', 'zikir_id')

      db.createObjectStore('settings', { keyPath: 'key' })
    },
  })

  return dbInstance
}

export async function seedDefaultZikirs(): Promise<void> {
  const db = await getDB()
  const existing = await db.count('zikirs')
  if (existing > 0) return

  const tx = db.transaction('zikirs', 'readwrite')
  const now = Date.now()
  for (let i = 0; i < DEFAULT_ZIKIRS.length; i++) {
    const z = DEFAULT_ZIKIRS[i]!
    await tx.store.add({
      id: `default-${i}`,
      ...z,
      created_at: now + i,
    })
  }
  await tx.done
}

// --- Zikir operations ---

export async function getAllZikirs(): Promise<Zikir[]> {
  const db = await getDB()
  return db.getAllFromIndex('zikirs', 'by-created')
}

export async function getZikir(id: string): Promise<Zikir | undefined> {
  const db = await getDB()
  return db.get('zikirs', id)
}

export async function addZikir(zikir: Omit<Zikir, 'id' | 'created_at'>): Promise<Zikir> {
  const db = await getDB()
  const entry: Zikir = {
    ...zikir,
    id: `custom-${Date.now()}`,
    created_at: Date.now(),
  }
  await db.add('zikirs', entry)
  return entry
}

export async function updateZikir(zikir: Zikir): Promise<void> {
  const db = await getDB()
  await db.put('zikirs', zikir)
}

export async function deleteZikir(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('zikirs', id)
}

// --- Record operations ---

export async function addRecord(record: Omit<ZikirRecord, 'id' | 'created_at'>): Promise<ZikirRecord> {
  const db = await getDB()
  const entry: ZikirRecord = {
    ...record,
    id: `rec-${Date.now()}`,
    created_at: Date.now(),
  }
  await db.add('records', entry)
  return entry
}

export async function incrementDailyRecord(zikirId: string, target: number, date: string): Promise<void> {
  const db = await getDB()
  const all = await db.getAllFromIndex('records', 'by-date', date)
  const existing = all.find((r) => r.zikir_id === zikirId)

  if (existing) {
    existing.count += 1
    existing.completed = existing.count >= target
    await db.put('records', existing)
  } else {
    await db.add('records', {
      id: `rec-${Date.now()}`,
      zikir_id: zikirId,
      count: 1,
      target,
      date,
      completed: 1 >= target,
      created_at: Date.now(),
    })
  }
}

export async function getRecordsByDate(date: string): Promise<ZikirRecord[]> {
  const db = await getDB()
  return db.getAllFromIndex('records', 'by-date', date)
}

export async function getAllRecords(): Promise<ZikirRecord[]> {
  const db = await getDB()
  return db.getAll('records')
}

// --- Settings operations ---

const DEFAULT_SETTINGS: AppSettings = {
  dark_mode: false,
  vibration_enabled: true,
  sound_enabled: false,
  keep_screen_on: true,
}

export async function getSettings(): Promise<AppSettings> {
  const db = await getDB()
  const result = { ...DEFAULT_SETTINGS }
  const keys = Object.keys(DEFAULT_SETTINGS) as (keyof AppSettings)[]
  for (const key of keys) {
    const row = await db.get('settings', key)
    if (row !== undefined) {
      (result as Record<string, unknown>)[key] = row.value
    }
  }
  return result
}

export async function setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
  const db = await getDB()
  await db.put('settings', { key, value })
}
