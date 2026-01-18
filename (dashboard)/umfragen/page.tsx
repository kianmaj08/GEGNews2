"use client"

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { getTotalVotes } from '@/lib/helpers'
import type { Poll } from '@/lib/types'

export default function AdminUmfragenPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] })

  useEffect(() => {
    loadPolls()
  }, [])

  const loadPolls = async () => {
    const { data } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false })
    setPolls(data || [])
    setLoading(false)
  }

  const createPoll = async () => {
    if (!newPoll.question || newPoll.options.filter(o => o).length < 2) return
    
    const options = newPoll.options.filter(o => o)
    const votes: Record<string, number> = {}
    options.forEach(o => votes[o] = 0)
    
    await supabase.from('polls').insert({
      question: newPoll.question,
      options,
      votes,
      active: true
    })
    
    setNewPoll({ question: '', options: ['', ''] })
    setShowForm(false)
    loadPolls()
  }

  const deletePoll = async (id: string) => {
    if (!confirm('Umfrage wirklich löschen?')) return
    await supabase.from('polls').delete().eq('id', id)
    loadPolls()
  }

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('polls').update({ active: !active }).eq('id', id)
    loadPolls()
  }

  if (loading) return <div className="text-muted-foreground">Laden...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Umfragen</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Neue Umfrage
        </Button>
      </div>
      
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Neue Umfrage erstellen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Frage</Label>
              <Input
                value={newPoll.question}
                onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                placeholder="Wie lautet deine Frage?"
              />
            </div>
            <div>
              <Label>Antwortoptionen</Label>
              {newPoll.options.map((option, i) => (
                <Input
                  key={i}
                  value={option}
                  onChange={(e) => {
                    const options = [...newPoll.options]
                    options[i] = e.target.value
                    setNewPoll({ ...newPoll, options })
                  }}
                  placeholder={`Option ${i + 1}`}
                  className="mt-2"
                />
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })}
              >
                Option hinzufügen
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={createPoll}>Umfrage erstellen</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Abbrechen</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-4">
        {polls.map(poll => (
          <Card key={poll.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{poll.question}</h3>
                    <Badge variant={poll.active ? 'default' : 'secondary'}>
                      {poll.active ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {poll.options.map((option, i) => (
                      <span key={i} className="text-sm bg-muted px-2 py-1 rounded">
                        {option}: {poll.votes[option] || 0}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getTotalVotes(poll.votes)} Stimmen insgesamt
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleActive(poll.id, poll.active)}
                  >
                    {poll.active ? 'Deaktivieren' : 'Aktivieren'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deletePoll(poll.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {polls.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Noch keine Umfragen vorhanden
          </div>
        )}
      </div>
    </div>
  )
}
