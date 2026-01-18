"use client"

import { useState } from 'react'
import { Mail, MapPin } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { submitContactMessage } from '@/lib/api'
import { SUPPORT_EMAIL } from '@/lib/constants'

export default function KontaktPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    
    setIsSubmitting(true)
    const success = await submitContactMessage(formData)
    
    if (success) {
      setSubmitted(true)
    }
    setIsSubmitting(false)
  }

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-serif font-bold mb-4">Kontakt</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Fragen, Feedback oder Anregungen? Wir freuen uns von dir zu hören!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📬</div>
                    <h2 className="text-xl font-semibold mb-2">Nachricht gesendet!</h2>
                    <p className="text-muted-foreground">
                      Vielen Dank! Wir melden uns so schnell wie möglich bei dir.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Name *</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Dein Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">E-Mail *</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="deine@email.de"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Betreff</label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Worum geht es?"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nachricht *</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Deine Nachricht an uns..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold">E-Mail</h3>
                </div>
                <a 
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold">Redaktion</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  GEGNews Redaktion<br />
                  Musterstraße 1<br />
                  12345 Musterstadt
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
