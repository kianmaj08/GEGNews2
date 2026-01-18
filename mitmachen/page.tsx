"use client"

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { submitJoinRequest } from '@/lib/api'

export default function MitmachenPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    class_name: '',
    interest: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.interest) return
    
    setIsSubmitting(true)
    const success = await submitJoinRequest(formData)
    
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
          <h1 className="text-3xl font-serif font-bold mb-4">Mitmachen</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Du möchtest Teil der GEGNews-Redaktion werden? Großartig! Fülle das Formular aus und wir melden uns bei dir.
          </p>
          
          <div className="bg-card border border-border rounded-lg p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-xl font-semibold mb-2">Bewerbung eingegangen!</h2>
                <p className="text-muted-foreground">
                  Vielen Dank für dein Interesse! Wir melden uns in Kürze bei dir.
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
                  <label className="text-sm font-medium mb-1 block">Interesse *</label>
                  <Select 
                    value={formData.interest}
                    onValueChange={(value) => setFormData({ ...formData, interest: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Was möchtest du machen?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="autor">Autor/in - Artikel schreiben</SelectItem>
                      <SelectItem value="fotograf">Fotograf/in - Bilder machen</SelectItem>
                      <SelectItem value="layout">Layout/Design</SelectItem>
                      <SelectItem value="socialmedia">Social Media</SelectItem>
                      <SelectItem value="sonstiges">Sonstiges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Nachricht</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Erzähl uns etwas über dich und warum du mitmachen möchtest..."
                    rows={4}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Wird gesendet...' : 'Bewerbung absenden'}
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
