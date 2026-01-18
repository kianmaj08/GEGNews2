import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ArticleCard } from '@/components/ArticleCard'
import { getTopArticles } from '@/lib/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top 10 des Monats',
  description: 'Die meistgelesenen Artikel der GEGNews',
}

export default async function TopTenPage() {
  const topArticles = await getTopArticles(10)

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="h-8 w-8 text-amber-500" />
            <h1 className="text-3xl font-serif font-bold">Top 10 des Monats</h1>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Die meistgelesenen Artikel unserer Leser
          </p>
          
          {topArticles.length > 0 ? (
            <div className="space-y-4">
              {topArticles.map((article, index) => (
                <Link 
                  key={article.id} 
                  href={`/artikel/${article.slug}`}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full shrink-0 font-bold text-lg
                    ${index === 0 ? 'bg-amber-500 text-white' : 
                      index === 1 ? 'bg-gray-400 text-white' : 
                      index === 2 ? 'bg-amber-700 text-white' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold text-lg group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {article.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {article.view_count.toLocaleString('de-DE')} Aufrufe
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Noch keine Artikel vorhanden.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  )
}
