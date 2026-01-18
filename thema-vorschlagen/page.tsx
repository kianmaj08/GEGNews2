"use client"

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { submitIdeaSuggestion } from '@/lib/api'

export default function ThemaVorschlagenPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    class_name: '',
    topic: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.topic) return
    
    setIsSubmitting(true)
    const success = await submitIdeaSuggestion(formData)
    
    if (success) {
      setSubmitted(true)
    }
    setIsSubmitting(false)
  }

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-serif font-bold mb-4">Thema vorschlagen</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Du hast eine Idee für einen Artikel? Teile sie mit uns!
          </p>
          
          <div className="bg-card border border-border rounded-lg p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💡</div>
                <h2 className="text-xl font-semibold mb-2">Danke für deine Idee!</h2>
                <p className="text-muted-foreground">
                  Wir schauen uns deinen Vorschlag an und melden uns, wenn wir ihn umsetzen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label className="text-sm font-medium mb-1 block">Klasse/Stufe</label>
                  <Input
                    value={formData.class_name}
                    onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                    placeholder="z.B. Q1, 10a"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Thema *</label>
                  <Input
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="Worüber sollen wir berichten?"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Details</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Beschreibe deine Idee genauer..."
                    rows={4}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Wird gesendet...' : 'Vorschlag einreichen'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
