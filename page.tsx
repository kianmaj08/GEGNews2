import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, TrendingUp } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BreakingNewsTicker } from '@/components/BreakingNewsTicker'
import { ArticleCard } from '@/components/ArticleCard'
import { PollWidget } from '@/components/PollWidget'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  getArticles, 
  getFeaturedArticle, 
  getBreakingNews,
  getPolls
} from '@/lib/api'
import { formatRelativeTime, getArticleTypeLabel } from '@/lib/helpers'

export const revalidate = 60

export default async function HomePage() {
  const [
    breakingNews,
    featuredArticle,
    latestArticles,
    polls
  ] = await Promise.all([
    getBreakingNews(),
    getFeaturedArticle(),
    getArticles({ status: 'published', limit: 9 }),
    getPolls()
  ])

  const gridArticles = latestArticles.filter(a => a.id !== featuredArticle?.id).slice(0, 6)
  const sideArticles = latestArticles.filter(a => a.id !== featuredArticle?.id).slice(0, 4)
  const activePoll = polls[0]

  return (
    <>
      <BreakingNewsTicker news={breakingNews} />
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          
          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            {featuredArticle && (
              <div className="lg:col-span-2">
                <Link href={`/artikel/${featuredArticle.slug}`} className="group block">
                  <article className="relative overflow-hidden bg-card border border-border h-full min-h-[400px]">
                    {featuredArticle.hero_image_url && (
                      <Image
                        src={featuredArticle.hero_image_url}
                        alt={featuredArticle.hero_image_alt || featuredArticle.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {featuredArticle.category && (
                          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            {featuredArticle.category.name}
                          </Badge>
                        )}
                        {featuredArticle.type !== 'standard' && (
                          <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                            {getArticleTypeLabel(featuredArticle.type)}
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 group-hover:underline decoration-2 underline-offset-4">
                        {featuredArticle.title}
                      </h2>
                      {featuredArticle.subtitle && (
                        <p className="text-white/80 mb-3 line-clamp-2">{featuredArticle.subtitle}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        {featuredArticle.author && <span>{featuredArticle.author.name}</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {featuredArticle.reading_time} Min.
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-red-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wide">Aktuell</h2>
              </div>
              <div className="bg-card border border-border divide-y divide-border">
                {sideArticles.map((article, index) => (
                  <Link key={article.id} href={`/artikel/${article.slug}`} className="group block p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex gap-3">
                      <span className="text-2xl font-serif font-bold text-muted-foreground/50">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        {article.category && (
                          <span className="text-xs text-muted-foreground">{article.category.name}</span>
                        )}
                        <h3 className="font-serif font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {formatRelativeTime(article.published_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold">Neueste Artikel</h2>
              <Link href="/archiv" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                Alle Artikel <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <section className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-6">
                <h2 className="text-xl font-serif font-bold mb-3">Werde Teil der Redaktion</h2>
                <p className="text-muted-foreground mb-5">
                  Du schreibst gerne oder hast tolle Ideen für Artikel? Dann melde dich bei uns und werde Teil des GEGNews-Teams!
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/mitmachen">
                    <Button>Jetzt bewerben</Button>
                  </Link>
                  <Link href="/thema-vorschlagen">
                    <Button variant="outline">Thema vorschlagen</Button>
                  </Link>
                </div>
              </section>
            </div>
            
            {activePoll && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">Aktuelle Umfrage</h3>
                <PollWidget poll={activePoll} />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
