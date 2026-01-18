"use client"

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Bell, BellOff } from 'lucide-react'

export default function EinstellungenPage() {
  const [isDark, setIsDark] = useState(false)
  const [notifications, setNotifications] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-serif font-bold mb-6">Einstellungen</h1>
          
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Dunkles Design aktivieren</p>
                </div>
              </div>
              <Button variant={isDark ? "default" : "outline"} size="sm" onClick={toggleDarkMode}>
                {isDark ? 'An' : 'Aus'}
              </Button>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notifications ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                <div>
                  <p className="font-medium">Benachrichtigungen</p>
                  <p className="text-sm text-muted-foreground">Push-Nachrichten erhalten</p>
                </div>
              </div>
              <Button variant={notifications ? "default" : "outline"} size="sm" onClick={() => setNotifications(!notifications)}>
                {notifications ? 'An' : 'Aus'}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
