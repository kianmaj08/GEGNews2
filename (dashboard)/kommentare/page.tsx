"use client"

import { useState, useEffect } from 'react'
import { Check, X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { formatRelativeTime } from '@/lib/helpers'
import type { Comment } from '@/lib/types'

export default function AdminKommentarePage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
    setComments(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('comments').update({ status }).eq('id', id)
    loadComments()
  }

  const deleteComment = async (id: string) => {
    if (!confirm('Kommentar wirklich löschen?')) return
    await supabase.from('comments').delete().eq('id', id)
    loadComments()
  }

  const pendingComments = comments.filter(c => c.status === 'pending')
  const approvedComments = comments.filter(c => c.status === 'approved')
  const rejectedComments = comments.filter(c => c.status === 'rejected')

  if (loading) return <div className="text-muted-foreground">Laden...</div>

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Kommentare</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Ausstehend
              <Badge>{pendingComments.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingComments.length === 0 ? (
              <p className="text-muted-foreground text-sm">Keine ausstehenden Kommentare</p>
            ) : (
              <div className="space-y-4">
                {pendingComments.map(comment => (
                  <div key={comment.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{comment.name || 'Anonym'}</span>
                          <span className="text-xs text-muted-foreground">{formatRelativeTime(comment.created_at)}</span>
                        </div>
                        <p className="text-sm">{comment.message}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="text-green-500" onClick={() => updateStatus(comment.id, 'approved')}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => updateStatus(comment.id, 'rejected')}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteComment(comment.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Freigegeben
              <Badge variant="secondary">{approvedComments.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {approvedComments.length === 0 ? (
              <p className="text-muted-foreground text-sm">Keine freigegebenen Kommentare</p>
            ) : (
              <div className="space-y-2">
                {approvedComments.slice(0, 10).map(comment => (
                  <div key={comment.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                    <div>
                      <span className="font-medium text-sm">{comment.name || 'Anonym'}</span>
                      <span className="text-xs text-muted-foreground ml-2">{comment.message.substring(0, 50)}...</span>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => deleteComment(comment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
