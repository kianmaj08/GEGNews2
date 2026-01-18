import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { getUsers } from '@/lib/api'
import { AUTHOR_POSITIONS, AUTHOR_STUFEN, AUTHOR_BADGES } from '@/lib/constants'
import type { User, AuthorBadge } from '@/lib/types'
import type { Metadata } from 'next'
import { Code, Share2, Layout, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Redaktion',
  description: 'Das Team hinter GEGNews',
}

const BADGE_ICONS = {
  it: Code,
  social_media: Share2,
  layout: Layout,
}

function UserCard({ user, size = 'normal' }: { user: User; size?: 'large' | 'normal' | 'small' }) {
  const positionLabel = user.position ? AUTHOR_POSITIONS[user.position]?.label : null
  const stufeLabel = user.stufe ? AUTHOR_STUFEN[user.stufe]?.shortLabel : null
  const slug = user.slug || user.name.toLowerCase().replace(/\s+/g, '-')

  if (size === 'large') {
    return (
      <Link href={`/autor/${slug}`} className="group block">
        <div className="flex items-start gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.name}
              width={80}
              height={80}
              className="rounded-full ring-2 ring-primary/10"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10">
              <span className="text-2xl font-serif font-bold text-primary/60">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{user.name}</h3>
              {stufeLabel && (
                <Badge variant="outline" className="text-xs">{stufeLabel}</Badge>
              )}
            </div>
            {positionLabel && (
              <p className="text-primary font-medium text-sm mt-0.5">{positionLabel}</p>
            )}
            {user.badges && user.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {user.badges.map((badge: AuthorBadge) => {
                  const BadgeIcon = BADGE_ICONS[badge]
                  const config = AUTHOR_BADGES[badge]
                  return (
                    <Badge key={badge} className={`${config.color} text-white text-xs`}>
                      <BadgeIcon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  )
                })}
              </div>
            )}
            {user.bio && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{user.bio}</p>
            )}
            <span className="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1 group-hover:text-primary transition-colors">
              Profil ansehen <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    )
  }

  if (size === 'small') {
    return (
      <Link href={`/autor/${slug}`} className="group block">
        <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{user.name}</h3>
              {stufeLabel && (
                <span className="text-xs text-muted-foreground">({stufeLabel})</span>
              )}
            </div>
            {positionLabel && (
              <p className="text-xs text-muted-foreground">{positionLabel}</p>
            )}
          </div>
          {user.badges && user.badges.length > 0 && (
            <div className="flex gap-1">
              {user.badges.slice(0, 2).map((badge: AuthorBadge) => {
                const BadgeIcon = BADGE_ICONS[badge]
                const config = AUTHOR_BADGES[badge]
                return (
                  <span key={badge} className={`${config.color} text-white p-1 rounded`}>
                    <BadgeIcon className="h-3 w-3" />
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/autor/${slug}`} className="group block">
      <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={user.name}
            width={56}
            height={56}
            className="rounded-full"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg font-medium text-muted-foreground">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold group-hover:text-primary transition-colors">{user.name}</h3>
            {stufeLabel && (
              <Badge variant="outline" className="text-xs">{stufeLabel}</Badge>
            )}
          </div>
          {positionLabel && (
            <p className="text-primary text-sm">{positionLabel}</p>
          )}
          {user.badges && user.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {user.badges.map((badge: AuthorBadge) => {
                const BadgeIcon = BADGE_ICONS[badge]
                const config = AUTHOR_BADGES[badge]
                return (
                  <Badge key={badge} className={`${config.color} text-white text-xs`}>
                    <BadgeIcon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                )
              })}
            </div>
          )}
          {user.bio && (
            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{user.bio}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default async function RedaktionPage() {
  const users = await getUsers()
  
  const sortByPosition = (a: User, b: User) => {
    const orderA = a.position ? AUTHOR_POSITIONS[a.position]?.order || 99 : 99
    const orderB = b.position ? AUTHOR_POSITIONS[b.position]?.order || 99 : 99
    return orderA - orderB
  }

  const chefredaktion = users.filter(u => 
    u.position === 'chefredakteur' || u.position === 'stellv_chefredakteur'
  ).sort(sortByPosition)

  const ressortleiter = users.filter(u => u.position === 'ressortleiter').sort(sortByPosition)
  
  const redakteure = users.filter(u => 
    u.position === 'redakteur' || u.position === 'fotograf' || 
    (!u.position && u.status === 'approved')
  ).sort(sortByPosition)

  const gastautoren = users.filter(u => u.position === 'gastautor')

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-serif font-bold mb-4">Die Redaktion</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Das Team hinter GEGNews - Schüler, die für Schüler berichten.
          </p>
          
          {chefredaktion.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-serif font-bold mb-6 pb-2 border-b border-border">
                Chefredaktion
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {chefredaktion.map(user => (
                  <UserCard key={user.id} user={user} size="large" />
                ))}
              </div>
            </section>
          )}
          
          {ressortleiter.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-serif font-bold mb-6 pb-2 border-b border-border">
                Ressortleiter
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {ressortleiter.map(user => (
                  <UserCard key={user.id} user={user} size="normal" />
                ))}
              </div>
            </section>
          )}
          
          {redakteure.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-serif font-bold mb-6 pb-2 border-b border-border">
                Redaktion & Fotografen
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {redakteure.map(user => (
                  <UserCard key={user.id} user={user} size="small" />
                ))}
              </div>
            </section>
          )}

          {gastautoren.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-serif font-bold mb-6 pb-2 border-b border-border">
                Gastautoren
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {gastautoren.map(user => (
                  <UserCard key={user.id} user={user} size="small" />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  )
}
