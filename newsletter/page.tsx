'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, CheckCircle, AlertCircle, Bell, Newspaper, Sparkles } from 'lucide-react'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Ein Fehler ist aufgetreten.')
      } else {
        setStatus('success')
        setMessage('Du bist jetzt für den Newsletter angemeldet!')
        setEmail('')
      }
    } catch {
      setStatus('error')
      setMessage('Netzwerkfehler. Bitte versuche es erneut.')
    }
  }

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              GEGNews Newsletter
            </h1>
            <p className="text-lg text-muted-foreground">
              Bleib auf dem Laufenden! Erhalte Benachrichtigungen über neue Artikel direkt in dein Postfach.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-8">
            {status === 'success' ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Erfolgreich angemeldet!</h2>
                <p className="text-muted-foreground">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Deine E-Mail-Adresse
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="deine.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'loading'}
                    className="h-12"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {message}
                  </div>
                )}

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={status === 'loading' || !email}
                >
                  {status === 'loading' ? (
                    'Wird angemeldet...'
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Newsletter abonnieren
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Du kannst dich jederzeit wieder abmelden. Wir respektieren deine Privatsphäre.
                </p>
              </form>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <Newspaper className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-sm mb-1">Neue Artikel</h3>
              <p className="text-xs text-muted-foreground">
                Erfahre sofort von neuen Beiträgen
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-sm mb-1">Exklusive Inhalte</h3>
              <p className="text-xs text-muted-foreground">
                Hintergrund-Infos nur für Abonnenten
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <Bell className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-sm mb-1">Event-Erinnerungen</h3>
              <p className="text-xs text-muted-foreground">
                Verpasse keine Schulevents
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
