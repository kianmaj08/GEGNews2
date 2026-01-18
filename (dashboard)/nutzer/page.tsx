'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { USER_ROLES, USER_STATUS, AUTHOR_POSITIONS, AUTHOR_STUFEN, AUTHOR_BADGES } from '@/lib/constants'
import type { User, UserRole, UserStatus, AuthorPosition, AuthorStufe, AuthorBadge } from '@/lib/types'
import { Check, X, Loader2, Clock, UserCheck, Mail, UserPlus, AlertCircle, CheckCircle, Pencil, Code, Share2, Layout } from 'lucide-react'

const BADGE_ICONS = {
  it: Code,
  social_media: Share2,
  layout: Layout,
}

export default function AdminNutzerPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<UserRole>('author')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  
  const [editOpen, setEditOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('role', ['admin', 'editor', 'author'])
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setUsers(data as User[])
    }
    setLoading(false)
  }

  async function updateUserStatus(userId: string, status: UserStatus) {
    setActionLoading(userId)
    
    const { error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', userId)
    
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, status } : u))
    }
    
    setActionLoading(null)
  }

  async function updateUserRole(userId: string, role: UserRole) {
    setActionLoading(userId)
    
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
    
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
    }
    
    setActionLoading(null)
  }

  async function handleEditSave() {
    if (!editUser) return
    setEditLoading(true)
    
    const slug = editUser.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    const { error } = await supabase
      .from('users')
      .update({
        name: editUser.name,
        bio: editUser.bio,
        position: editUser.position,
        stufe: editUser.stufe,
        badges: editUser.badges || [],
        slug: slug,
      })
      .eq('id', editUser.id)
    
    if (!error) {
      setUsers(users.map(u => u.id === editUser.id ? { ...editUser, slug } : u))
      setEditOpen(false)
      setEditUser(null)
    }
    
    setEditLoading(false)
  }

  function toggleBadge(badge: AuthorBadge) {
    if (!editUser) return
    const badges = editUser.badges || []
    const newBadges = badges.includes(badge)
      ? badges.filter(b => b !== badge)
      : [...badges, badge]
    setEditUser({ ...editUser, badges: newBadges })
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteLoading(true)
    setInviteError(null)
    setInviteSuccess(false)

    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      })

      const data = await res.json()

      if (!res.ok) {
        setInviteError(data.error || 'Fehler beim Senden der Einladung')
      } else {
        setInviteSuccess(true)
        setInviteEmail('')
        setInviteRole('author')
        setTimeout(() => {
          setInviteOpen(false)
          setInviteSuccess(false)
        }, 2000)
      }
    } catch {
      setInviteError('Netzwerkfehler beim Senden der Einladung')
    } finally {
      setInviteLoading(false)
    }
  }

  const pendingUsers = users.filter(u => u.status === 'pending')
  const approvedUsers = users.filter(u => u.status === 'approved')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Nutzer</h1>
        
        <Dialog open={inviteOpen} onOpenChange={(open) => {
          setInviteOpen(open)
          if (!open) {
            setInviteEmail('')
            setInviteRole('author')
            setInviteError(null)
            setInviteSuccess(false)
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Nutzer einladen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Nutzer einladen</DialogTitle>
              <DialogDescription>
                Sende eine Einladung per E-Mail. Die eingeladene Person kann dann einen Account erstellen, der noch von dir freigeschaltet werden muss.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleInvite} className="space-y-4">
              {inviteError && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {inviteError}
                </div>
              )}
              
              {inviteSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  Einladung wurde gesendet!
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="invite-email">E-Mail-Adresse</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="neue.person@schule.de"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  disabled={inviteLoading || inviteSuccess}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-role">Rolle</Label>
                <select
                  id="invite-role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full border border-border rounded-md px-3 py-2 bg-background text-sm"
                  disabled={inviteLoading || inviteSuccess}
                >
                  <option value="author">Autor</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Die Rolle kann später noch geändert werden.
                </p>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={inviteLoading || inviteSuccess || !inviteEmail}>
                  {inviteLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sende Einladung...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Einladung senden
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {pendingUsers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-semibold">Ausstehende Freigaben</h2>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
              {pendingUsers.length}
            </Badge>
          </div>
          
          <div className="bg-card border border-amber-500/20 rounded-lg">
            <div className="divide-y divide-border">
              {pendingUsers.map(user => (
                <div key={user.id} className="flex items-center gap-4 p-4">
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-medium text-muted-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Registriert am {new Date(user.created_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                      className="text-sm border border-border rounded-md px-2 py-1 bg-background"
                      disabled={actionLoading === user.id}
                    >
                      <option value="author">Autor</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                      onClick={() => updateUserStatus(user.id, 'approved')}
                      disabled={actionLoading === user.id}
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Freigeben
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-semibold">Aktive Nutzer</h2>
          <Badge variant="secondary" className="bg-green-500/10 text-green-600">
            {approvedUsers.length}
          </Badge>
        </div>
        
        <div className="bg-card border border-border rounded-lg">
          <div className="divide-y divide-border">
            {approvedUsers.length === 0 ? (
              <p className="p-4 text-muted-foreground text-center">Keine aktiven Nutzer</p>
            ) : (
              approvedUsers.map(user => (
                <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-medium text-muted-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{user.name}</h3>
                      {user.stufe && (
                        <Badge variant="outline" className="text-xs">
                          {AUTHOR_STUFEN[user.stufe]?.shortLabel || user.stufe}
                        </Badge>
                      )}
                      {user.badges?.map(badge => {
                        const BadgeIcon = BADGE_ICONS[badge]
                        const badgeConfig = AUTHOR_BADGES[badge]
                        return (
                          <Badge key={badge} className={`${badgeConfig.color} text-white text-xs`}>
                            <BadgeIcon className="h-3 w-3 mr-1" />
                            {badgeConfig.label}
                          </Badge>
                        )
                      })}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.position && (
                      <p className="text-xs text-primary mt-0.5">
                        {AUTHOR_POSITIONS[user.position]?.label}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                      className="text-sm border border-border rounded-md px-2 py-1 bg-background"
                      disabled={actionLoading === user.id}
                    >
                      <option value="author">Autor</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {USER_ROLES[user.role].label}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditUser(user)
                        setEditOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={(open) => {
        setEditOpen(open)
        if (!open) setEditUser(null)
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nutzer bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeite die Redaktionsinformationen für {editUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          {editUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bio">Bio</Label>
                <textarea
                  id="edit-bio"
                  value={editUser.bio || ''}
                  onChange={(e) => setEditUser({ ...editUser, bio: e.target.value })}
                  className="w-full border border-border rounded-md px-3 py-2 bg-background text-sm min-h-[80px]"
                  placeholder="Kurze Beschreibung..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <select
                    id="edit-position"
                    value={editUser.position || ''}
                    onChange={(e) => setEditUser({ ...editUser, position: (e.target.value || null) as AuthorPosition | null })}
                    className="w-full border border-border rounded-md px-3 py-2 bg-background text-sm"
                  >
                    <option value="">Keine Position</option>
                    {Object.entries(AUTHOR_POSITIONS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-stufe">Stufe</Label>
                  <select
                    id="edit-stufe"
                    value={editUser.stufe || ''}
                    onChange={(e) => setEditUser({ ...editUser, stufe: (e.target.value || null) as AuthorStufe | null })}
                    className="w-full border border-border rounded-md px-3 py-2 bg-background text-sm"
                  >
                    <option value="">Keine Stufe</option>
                    {Object.entries(AUTHOR_STUFEN).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Zusatz-Badges</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(AUTHOR_BADGES).map(([key, val]) => {
                    const BadgeIcon = BADGE_ICONS[key as AuthorBadge]
                    const isActive = editUser.badges?.includes(key as AuthorBadge)
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleBadge(key as AuthorBadge)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          isActive 
                            ? `${val.color} text-white` 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        <BadgeIcon className="h-4 w-4" />
                        {val.label}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Klicke auf ein Badge um es zu aktivieren/deaktivieren
                </p>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleEditSave} disabled={editLoading}>
                  {editLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Speichern...
                    </>
                  ) : (
                    'Speichern'
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
