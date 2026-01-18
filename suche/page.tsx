"use client"

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ArticleCard } from '@/components/ArticleCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { searchArticles } from '@/lib/api'
import type { Article } from '@/lib/types'

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Article[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setIsSearching(true)
    router.push(`/suche?q=${encodeURIComponent(query)}`)
    
    const articles = await searchArticles(query)
    setResults(articles)
    setHasSearched(true)
    setIsSearching(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-serif font-bold mb-8">Suche</h1>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Artikel suchen..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isSearching}>
          {isSearching ? 'Suche...' : 'Suchen'}
        </Button>
      </form>
      
      {hasSearched && (
        <div>
          <p className="text-sm text-muted-foreground mb-6">
            {results.length} Ergebnis{results.length !== 1 ? 'se' : ''} für &quot;{query}&quot;
          </p>
          
          {results.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Keine Artikel gefunden.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Versuche andere Suchbegriffe oder schau dir unsere Kategorien an.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <>
      <Header />
      
      <main className="flex-1">
        <Suspense fallback={
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-3xl font-serif font-bold mb-8">Suche</h1>
            <div className="text-muted-foreground">Laden...</div>
          </div>
        }>
          <SearchContent />
        </Suspense>
      </main>
      
      <Footer />
    </>
  )
}
