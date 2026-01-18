"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createComment } from '@/lib/api'
import { formatRelativeTime } from '@/lib/helpers'
import type { Comment } from '@/lib/types'

interface CommentSectionProps {
  articleId: string
  comments: Comment[]
}

export function CommentSection({ articleId, comments: initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !message) return
    
    setIsSubmitting(true)
    const success = await createComment(articleId, name, email, message)
    
    if (success) {
      setSubmitted(true)
      setName('')
      setEmail('')
      setMessage('')
    }
    setIsSubmitting(false)
  }
  
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-xl font-serif font-bold mb-6">Kommentare ({comments.length})</h3>
      
      {comments.length > 0 && (
        <div className="space-y-6 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{comment.name || 'Anonym'}</span>
                <span className="text-xs text-muted-foreground">{formatRelativeTime(comment.created_at)}</span>
              </div>
              <p className="text-sm text-foreground/90">{comment.message}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-semibold mb-4">Kommentar schreiben</h4>
        
        {submitted ? (
          <div className="text-center py-4">
            <p className="text-green-600 font-medium mb-2">Danke für deinen Kommentar!</p>
            <p className="text-sm text-muted-foreground">Er wird nach Prüfung durch die Redaktion veröffentlicht.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="Dein Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="E-Mail (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <Textarea
              placeholder="Dein Kommentar *"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Kommentare werden vor der Veröffentlichung von der Redaktion geprüft.
            </p>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Wird gesendet...' : 'Kommentar absenden'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
