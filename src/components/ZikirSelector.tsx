import { useState } from 'react'
import { useTasbihStore } from '@/store/tasbihStore'
import type { Zikir } from '@/types'
import { addZikir, deleteZikir, updateZikir } from '@/database/db'

interface ZikirSelectorProps {
  onSelect: (zikir: Zikir) => void
  onClose: () => void
}

export function ZikirSelector({ onSelect, onClose }: ZikirSelectorProps) {
  const { zikirs, loadZikirs } = useTasbihStore()
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editingZikir, setEditingZikir] = useState<Zikir | null>(null)

  const filtered = zikirs.filter((z) =>
    z.name.toLowerCase().includes(search.toLowerCase()) ||
    z.arabic_text.includes(search)
  )

  const handleAdd = async (data: { name: string; arabic_text: string; meaning: string; default_target: number }) => {
    await addZikir({ ...data, is_custom: true })
    await loadZikirs()
    setShowAdd(false)
  }

  const handleEdit = async (data: { name: string; arabic_text: string; meaning: string; default_target: number }) => {
    if (!editingZikir) return
    await updateZikir({ ...editingZikir, ...data })
    await loadZikirs()
    setEditingZikir(null)
  }

  const handleDelete = async (id: string) => {
    await deleteZikir(id)
    await loadZikirs()
  }

  if (showAdd || editingZikir) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => { setShowAdd(false); setEditingZikir(null) }}>
        <div
          className="w-full max-w-sm bg-surface-card dark:bg-surface-card-dark rounded-t-2xl p-5 pb-8 safe-bottom"
          onClick={(e) => e.stopPropagation()}
        >
          <ZikirForm
            initial={editingZikir ?? undefined}
            onSubmit={editingZikir ? handleEdit : handleAdd}
            onCancel={() => { setShowAdd(false); setEditingZikir(null) }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-surface-card dark:bg-surface-card-dark rounded-t-2xl p-5 pb-6 safe-bottom max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-ink dark:text-ink-dark text-sm">Choose Zikir</h3>
          <button
            onClick={() => setShowAdd(true)}
            className="text-teal-400 dark:text-teal-light text-lg font-bold leading-none"
          >
            +
          </button>
        </div>

        <div className="flex items-center gap-2 bg-surface dark:bg-surface-dark rounded-lg px-3 py-2 mb-3">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-ink-muted dark:text-ink-muted-dark flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="6.5" cy="6.5" r="5" />
            <path d="M10 10l4.5 4.5" />
          </svg>
          <input
            type="text"
            placeholder="Search zikir..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-ink dark:text-ink-dark placeholder:text-ink-muted dark:placeholder:text-ink-muted-dark outline-none flex-1"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.map((z) => (
            <div
              key={z.id}
              className="flex items-center justify-between bg-surface dark:bg-surface-dark rounded-lg p-3 group"
            >
              <button onClick={() => onSelect(z)} className="text-left flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink dark:text-ink-dark truncate">{z.name}</p>
                <p className="font-arabic text-sm text-ink-sub dark:text-ink-sub-dark mt-0.5" dir="rtl" lang="ar">{z.arabic_text}</p>
                <p className="text-[10px] text-ink-muted dark:text-ink-muted-dark mt-0.5">Target: {z.default_target}</p>
              </button>
              {z.is_custom && (
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingZikir(z) }}
                    className="text-ink-muted dark:text-ink-muted-dark text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(z.id) }}
                    className="text-red-400 text-xs"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ZikirForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Zikir
  onSubmit: (data: { name: string; arabic_text: string; meaning: string; default_target: number }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [arabic, setArabic] = useState(initial?.arabic_text ?? '')
  const [meaning, setMeaning] = useState(initial?.meaning ?? '')
  const [target, setTarget] = useState(String(initial?.default_target ?? 33))

  const handleSubmit = () => {
    if (!name.trim()) return
    onSubmit({
      name: name.trim(),
      arabic_text: arabic.trim(),
      meaning: meaning.trim(),
      default_target: parseInt(target) || 33,
    })
  }

  return (
    <div>
      <h3 className="font-semibold text-ink dark:text-ink-dark text-sm mb-3">
        {initial ? 'Edit Zikir' : 'Add Custom Zikir'}
      </h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400"
        />
        <input
          type="text"
          placeholder="Arabic text"
          value={arabic}
          onChange={(e) => setArabic(e.target.value)}
          dir="rtl"
          className="w-full bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark rounded-lg px-3 py-2 text-sm font-arabic outline-none focus:ring-2 focus:ring-teal-400"
        />
        <input
          type="text"
          placeholder="Meaning"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          className="w-full bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400"
        />
        <input
          type="number"
          placeholder="Target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark rounded-lg px-3 py-2 text-sm tabular-nums outline-none focus:ring-2 focus:ring-teal-400"
          min={1}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 bg-ink-line dark:bg-ink-line-dark text-ink-sub dark:text-ink-sub-dark rounded-lg py-2 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-teal-400 dark:bg-teal-light text-white rounded-lg py-2 text-sm font-medium"
        >
          {initial ? 'Update' : 'Add'}
        </button>
      </div>
    </div>
  )
}
