'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, CheckCircle, Home, Newspaper, KeyRound } from 'lucide-react'

export default function EinladungPage() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isValidInvite, setIsValidInvite] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkInvitation()
  }, [])

  async function checkInvitation() {
    setChecking(true)
    
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      setError('Ungültiger oder abgelaufener Einladungslink. Bitte fordere eine neue Einladung an.')
      setChecking(false)
      return
    }

    const user = session.user
    setUserEmail(user.email || null)

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, status')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      if (existingProfile.status === 'approved') {
        router.push('/admin')
      } else {
        router.push('/admin/login?error=pending')
      }
      return
    }

    setIsValidInvite(true)
    setChecking(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== passwordConfirm) {
      setError('Die Passwörter stimmen nicht überein')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen haben')
      setLoading(false)
      return
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      setError('Sitzung abgelaufen. Bitte verwende den Einladungslink erneut.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
      data: { name }
    })

    if (updateError) {
      setError('Fehler beim Setzen des Passworts: ' + updateError.message)
      setLoading(false)
      return
    }

    const invitedRole = user.user_metadata?.invited_role || 'author'

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        name,
        role: invitedRole,
        status: 'pending'
      })

    if (profileError) {
      setError('Fehler beim Erstellen des Profils: ' + profileError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Überprüfe Einladung...</p>
        </div>
      </div>
    )
  }

  if (!isValidInvite) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
              Ungültige Einladung
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || 'Dieser Einladungslink ist ungültig oder abgelaufen.'}
            </p>
            <Button 
              onClick={() => router.push('/admin/login')}
              className="w-full"
            >
              Zur Anmeldung
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
              Account erstellt!
            </h1>
            <p className="text-muted-foreground mb-6">
              Dein Account wurde erstellt und wartet auf Freigabe durch einen Administrator. 
              Du wirst benachrichtigt, sobald dein Account freigeschaltet wurde.
            </p>
            <Button 
              onClick={() => router.push('/admin/login')}
              className="w-full"
            >
              Zur Anmeldung
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <Newspaper className="h-6 w-6 text-primary-foreground" />
              </div>
            </Link>
            <h1 className="text-2xl font-serif font-bold text-foreground">Willkommen bei GEGNews!</h1>
            <p className="text-muted-foreground mt-2">
              Du wurdest eingeladen. Vervollständige dein Profil.
            </p>
            {userEmail && (
              <p className="text-sm text-primary mt-2 font-medium">
                {userEmail}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Dein Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dein vollständiger Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort wählen</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Mindestens 6 Zeichen</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">Passwort bestätigen</Label>
              <Input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>Hinweis:</strong> Nach der Registrierung muss dein Account noch von einem Administrator freigeschaltet werden.
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Account erstellen...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4 mr-2" />
                  Account erstellen
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            Zurück zur Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
