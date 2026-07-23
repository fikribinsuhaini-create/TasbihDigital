import { useState, useEffect, useMemo } from 'react'
import { getAllRecords, getAllZikirs } from '@/database/db'
import type { ZikirRecord, Zikir } from '@/types'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function formatDate(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(formatDate(today.getFullYear(), today.getMonth(), today.getDate()))
  const [records, setRecords] = useState<ZikirRecord[]>([])
  const [zikirs, setZikirs] = useState<Zikir[]>([])

  useEffect(() => {
    getAllRecords().then(setRecords)
    getAllZikirs().then(setZikirs)
  }, [])

  const zikirMap = useMemo(() => {
    const m = new Map<string, Zikir>()
    zikirs.forEach((z) => m.set(z.id, z))
    return m
  }, [zikirs])

  const recordsByDate = useMemo(() => {
    const m = new Map<string, ZikirRecord[]>()
    records.forEach((r) => {
      const list = m.get(r.date) ?? []
      list.push(r)
      m.set(r.date, list)
    })
    return m
  }, [records])

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const selectedRecords = recordsByDate.get(selectedDate) ?? []
  const selectedTotal = selectedRecords.reduce((sum, r) => sum + r.count, 0)

  const goBack = () => {
    if (month === 0) { setYear(year - 1); setMonth(11) }
    else setMonth(month - 1)
  }

  const goForward = () => {
    if (month === 11) { setYear(year + 1); setMonth(0) }
    else setMonth(month + 1)
  }

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate())

  return (
    <div className="flex flex-col h-full px-5 pt-8 pb-4">
      <h1 className="font-display text-xl text-ink dark:text-ink-dark">Calendar</h1>

      {/* Month nav */}
      <div className="flex items-center justify-between mt-4">
        <button onClick={goBack} className="text-ink-muted dark:text-ink-muted-dark text-lg px-2">&lsaquo;</button>
        <span className="font-semibold text-sm text-ink dark:text-ink-dark">
          {MONTHS[month]} {year}
        </span>
        <button onClick={goForward} className="text-ink-muted dark:text-ink-muted-dark text-lg px-2">&rsaquo;</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mt-3">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = formatDate(year, month, day)
          const hasData = recordsByDate.has(dateStr)
          const isSelected = dateStr === selectedDate
          const isToday = dateStr === todayStr

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(dateStr)}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs relative transition-colors ${
                isSelected
                  ? 'bg-teal-400 dark:bg-teal-light text-white font-semibold'
                  : isToday
                    ? 'border-[1.5px] border-teal-400 dark:border-teal-light font-semibold text-ink dark:text-ink-dark'
                    : 'text-ink-sub dark:text-ink-sub-dark'
              }`}
            >
              <span className="tabular-nums">{day}</span>
              {hasData && (
                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${
                  isSelected ? 'bg-white' : 'bg-teal-400 dark:bg-teal-light'
                }`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected date detail */}
      <div className="mt-4 bg-surface-card dark:bg-surface-card-dark border border-ink-line dark:border-ink-line-dark rounded-xl p-4 flex-1 overflow-y-auto">
        <p className="text-xs font-semibold text-ink dark:text-ink-dark">
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        {selectedRecords.length === 0 ? (
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-3 italic">No zikir recorded</p>
        ) : (
          <>
            <div className="mt-3 space-y-0">
              {selectedRecords.map((r) => {
                const z = zikirMap.get(r.zikir_id)
                return (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-ink-line dark:border-ink-line-dark last:border-0">
                    <span className="text-xs text-ink-sub dark:text-ink-sub-dark">{z?.name ?? 'Unknown'}</span>
                    <span className="text-xs font-bold text-teal-400 dark:text-teal-light tabular-nums">{r.count.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-ink-line dark:border-ink-line-dark">
              <span className="text-xs font-bold text-ink dark:text-ink-dark">Total</span>
              <span className="text-xs font-bold text-teal-400 dark:text-teal-light tabular-nums">{selectedTotal.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
