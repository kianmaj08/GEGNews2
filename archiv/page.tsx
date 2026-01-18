import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ArticleCard } from '@/components/ArticleCard'
import { getArticles } from '@/lib/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Archiv',
  description: 'Alle Artikel der GEGNews im Überblick',
}

export default async function ArchivePage() {
  const articles = await getArticles({ status: 'published', limit: 50 })
  
  const articlesByMonth: Record<string, typeof articles> = {}
  articles.forEach(article => {
    if (!article.published_at) return
    const date = new Date(article.published_at)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!articlesByMonth[key]) articlesByMonth[key] = []
    articlesByMonth[key].push(article)
  })
  
  const sortedMonths = Object.keys(articlesByMonth).sort().reverse()

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-serif font-bold mb-8">Archiv</h1>
          
          {sortedMonths.map(month => {
            const [year, m] = month.split('-')
            const monthName = new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
            
            return (
              <section key={month} className="mb-12">
                <h2 className="text-xl font-serif font-bold mb-6 pb-2 border-b border-border">
                  {monthName}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articlesByMonth[month].map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )
          })}
          
          {sortedMonths.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Noch keine Artikel im Archiv.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  )
}
