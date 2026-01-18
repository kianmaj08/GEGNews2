"use client"

import { useState, useEffect } from 'react'
import { Check, X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { formatRelativeTime } from '@/lib/helpers'
import type { LetterToEditor } from '@/lib/types'

export default function AdminLeserbriefePage() {
  const [letters, setLetters] = useState<LetterToEditor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLetters()
  }, [])

  const loadLetters = async () => {
    const { data } = await supabase
      .from('letters_to_editor')
      .select('*')
      .order('created_at', { ascending: false })
    setLetters(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('letters_to_editor').update({ status }).eq('id', id)
    loadLetters()
  }

  const deleteLetter = async (id: string) => {
    if (!confirm('Leserbrief wirklich löschen?')) return
    await supabase.from('letters_to_editor').delete().eq('id', id)
    loadLetters()
  }

  const pendingLetters = letters.filter(l => l.status === 'pending')
  const processedLetters = letters.filter(l => l.status !== 'pending')

  if (loading) return <div className="text-muted-foreground">Laden...</div>

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Leserbriefe</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Neue Leserbriefe
              <Badge>{pendingLetters.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingLetters.length === 0 ? (
              <p className="text-muted-foreground text-sm">Keine neuen Leserbriefe</p>
            ) : (
              <div className="space-y-4">
                {pendingLetters.map(letter => (
                  <div key={letter.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{letter.name}</span>
                          <span className="text-xs text-muted-foreground">{formatRelativeTime(letter.created_at)}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{letter.message}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="text-green-500" onClick={() => updateStatus(letter.id, 'approved')}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => updateStatus(letter.id, 'rejected')}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteLetter(letter.id)}>
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
            <CardTitle>Bearbeitet</CardTitle>
          </CardHeader>
          <CardContent>
            {processedLetters.length === 0 ? (
              <p className="text-muted-foreground text-sm">Keine bearbeiteten Leserbriefe</p>
            ) : (
              <div className="space-y-2">
                {processedLetters.map(letter => (
                  <div key={letter.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant={letter.status === 'approved' ? 'default' : 'secondary'}>
                        {letter.status === 'approved' ? 'Freigegeben' : 'Abgelehnt'}
                      </Badge>
                      <span className="text-sm">{letter.name}: {letter.message.substring(0, 40)}...</span>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => deleteLetter(letter.id)}>
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
