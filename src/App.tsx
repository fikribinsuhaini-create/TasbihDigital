import { useState, useEffect } from 'react'
import { BottomNav } from './components/BottomNav'
import { HomePage } from './pages/HomePage'
import { TasbihPage } from './pages/TasbihPage'
import { CalendarPage } from './pages/CalendarPage'
import { SettingsPage } from './pages/SettingsPage'
import { useSettingsStore } from './store/settingsStore'
import type { NavTab } from './types'

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home')
  const { settings, loadSettings } = useSettingsStore()

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.dark_mode)
  }, [settings.dark_mode])

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />
      case 'tasbih':
        return <TasbihPage />
      case 'calendar':
        return <CalendarPage />
      case 'settings':
        return <SettingsPage />
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface dark:bg-surface-dark">
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {renderPage()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
