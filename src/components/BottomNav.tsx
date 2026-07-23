import type { ReactNode } from 'react'
import type { NavTab } from '@/types'

const tabs: { id: NavTab; label: string; icon: (active: boolean) => ReactNode }[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        {active
          ? <path d="M12 3l9 7.5h-3V19H6V10.5H3L12 3z" />
          : <path d="M12 3l9 7.5h-3V19H6V10.5H3L12 3z" />}
      </svg>
    ),
  },
  {
    id: 'tasbih',
    label: 'Tasbih',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="9" strokeWidth={active ? 2.2 : 1.8} />
        <circle cx="12" cy="12" r="3.5" fill={active ? 'currentColor' : 'none'} />
      </svg>
    ),
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
        {active && <rect x="7" y="13" width="4" height="4" rx="0.5" fill="currentColor" stroke="none" />}
      </svg>
    ),
  },
{
    id: 'settings',
    label: 'Settings',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
  },
]

interface BottomNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="flex items-end justify-around bg-nav dark:bg-nav-dark border-t border-ink-line dark:border-ink-line-dark px-1 pt-1.5 pb-2 safe-bottom">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-0.5 min-w-[48px] py-1 transition-colors ${
              isActive
                ? 'text-teal-400 dark:text-teal-light'
                : 'text-ink-muted dark:text-ink-muted-dark'
            }`}
          >
            {tab.icon(isActive)}
            <span className="text-[10px] font-medium leading-none">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
