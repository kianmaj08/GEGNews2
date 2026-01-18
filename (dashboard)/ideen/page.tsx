"use client"

import { useState, useEffect } from 'react'
import { Check, X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { formatRelativeTime } from '@/lib/helpers'
import type { IdeaSuggestion } from '@/lib/types'

export default function AdminIdeenPage() {
  const [ideas, setIdeas] = useState<IdeaSuggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadIdeas()
  }, [])

  const loadIdeas = async () => {
    const { data } = await supabase
      .from('idea_suggestions')
      .select('*')
      .order('created_at', { ascending: false })
    setIdeas(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('idea_suggestions').update({ status }).eq('id', id)
    loadIdeas()
  }

  const deleteIdea = async (id: string) => {
    if (!confirm('Idee wirklich löschen?')) return
    await supabase.from('idea_suggestions').delete().eq('id', id)
    loadIdeas()
  }

  const pendingIdeas = ideas.filter(i => i.status === 'pending')
  const reviewedIdeas = ideas.filter(i => i.status !== 'pending')

  if (loading) return <div className="text-muted-foreground">Laden...</div>

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Themenideen</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Neue Vorschläge
              <Badge>{pendingIdeas.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingIdeas.length === 0 ? (
              <p className="text-muted-foreground text-sm">Keine neuen Themenvorschläge</p>
            ) : (
              <div className="space-y-4">
                {pendingIdeas.map(idea => (
                  <div key={idea.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{idea.topic}</h3>
                        <div className="text-xs text-muted-foreground mb-2">
                          von {idea.name} {idea.class_name && `(${idea.class_name})`} • {formatRelativeTime(idea.created_at)}
                        </div>
                        {idea.message && <p className="text-sm text-muted-foreground">{idea.message}</p>}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="text-green-500" onClick={() => updateStatus(idea.id, 'accepted')}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => updateStatus(idea.id, 'rejected')}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteIdea(idea.id)}>
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
            <CardTitle>Archiv</CardTitle>
          </CardHeader>
          <CardContent>
            {reviewedIdeas.length === 0 ? (
              <p className="text-muted-foreground text-sm">Keine archivierten Ideen</p>
            ) : (
              <div className="space-y-2">
                {reviewedIdeas.map(idea => (
                  <div key={idea.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant={idea.status === 'accepted' ? 'default' : 'secondary'}>
                        {idea.status === 'accepted' ? 'Angenommen' : 'Abgelehnt'}
                      </Badge>
                      <span className="text-sm">{idea.topic}</span>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => deleteIdea(idea.id)}>
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
