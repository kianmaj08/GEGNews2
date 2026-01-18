import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ArticleCard } from '@/components/ArticleCard'
import { Badge } from '@/components/ui/badge'
import { getUserBySlug, getArticlesByAuthorSlug } from '@/lib/api'
import { AUTHOR_POSITIONS, AUTHOR_STUFEN, AUTHOR_BADGES } from '@/lib/constants'
import type { AuthorBadge } from '@/lib/types'
import { FileText, Clock, Code, Share2, Layout, ArrowLeft } from 'lucide-react'

export const revalidate = 60

const BADGE_ICONS = {
  it: Code,
  social_media: Share2,
  layout: Layout,
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const author = await getUserBySlug(slug)
  
  if (!author) return { title: 'Autor nicht gefunden' }
  
  return {
    title: `${author.name} - GEGNews`,
    description: author.bio || `Artikel von ${author.name} bei GEGNews`,
  }
}

export default async function AutorPage({ params }: Props) {
  const { slug } = await params
  const [author, articles] = await Promise.all([
    getUserBySlug(slug),
    getArticlesByAuthorSlug(slug)
  ])

  if (!author) {
    notFound()
  }

  const totalReadingTime = articles.reduce((sum, a) => sum + (a.reading_time || 0), 0)

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <Link 
            href="/redaktion" 
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Zur Redaktion
          </Link>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {author.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={author.name}
                  width={120}
                  height={120}
                  className="rounded-full ring-4 ring-primary/10"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-4 ring-primary/10">
                  <span className="text-4xl font-serif font-bold text-primary/60">
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-3xl font-serif font-bold">{author.name}</h1>
                  {author.stufe && (
                    <Badge variant="outline" className="text-sm">
                      {AUTHOR_STUFEN[author.stufe]?.label || author.stufe}
                    </Badge>
                  )}
                </div>
                
                {author.position && (
                  <p className="text-lg text-primary font-medium mb-2">
                    {AUTHOR_POSITIONS[author.position]?.label}
                  </p>
                )}

                {author.badges && author.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {author.badges.map((badge: AuthorBadge) => {
                      const BadgeIcon = BADGE_ICONS[badge]
                      const config = AUTHOR_BADGES[badge]
                      return (
                        <Badge key={badge} className={`${config.color} text-white`}>
                          <BadgeIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      )
                    })}
                  </div>
                )}

                {author.bio && (
                  <p className="text-muted-foreground mb-4">{author.bio}</p>
                )}

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{articles.length}</p>
                      <p className="text-muted-foreground text-xs">Artikel</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{totalReadingTime} Min.</p>
                      <p className="text-muted-foreground text-xs">Lesezeit gesamt</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-serif font-bold mb-6">
              Artikel von {author.name}
            </h2>
            
            {articles.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Noch keine veröffentlichten Artikel
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
