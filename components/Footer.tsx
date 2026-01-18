'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CATEGORIES, SUPPORT_EMAIL } from '@/lib/constants'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'

function NewsletterWidget() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-green-500 text-sm">
        <CheckCircle className="h-4 w-4" />
        <span>Erfolgreich angemeldet!</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        placeholder="E-Mail-Adresse"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading' || !email}
        className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  )
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-serif font-bold tracking-tight">GEGNews</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Die Schülerzeitung des GEG. Von Schülern, für Schüler.
            </p>
            
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Newsletter</span>
              </div>
              <NewsletterWidget />
              <Link 
                href="/newsletter" 
                className="text-xs text-muted-foreground hover:text-foreground mt-2 inline-block"
              >
                Mehr erfahren →
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-sans font-semibold text-sm mb-3">Kategorien</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link 
                    href={`/kategorie/${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-sans font-semibold text-sm mb-3">Mehr</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/archiv" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Archiv
                </Link>
              </li>
              <li>
                <Link href="/top-10" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Top 10 des Monats
                </Link>
              </li>
              <li>
                <Link href="/redaktion" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Redaktion
                </Link>
              </li>
              <li>
                <Link href="/mitmachen" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Mitmachen
                </Link>
              </li>
              <li>
                <Link href="/thema-vorschlagen" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Thema vorschlagen
                </Link>
              </li>
              <li>
                <Link href="/leserbrief" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Leserbrief schreiben
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-sans font-semibold text-sm mb-3">Kontakt</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/kontakt" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <a 
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                <Link href="/impressum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GEGNews. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Demo Version</span>
            <span className="text-xs text-muted-foreground">Support: {SUPPORT_EMAIL}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
