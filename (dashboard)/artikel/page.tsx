import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getArticles, getCategories } from '@/lib/api'
import { ARTICLE_STATUS, ARTICLE_TYPES } from '@/lib/constants'
import { formatDate } from '@/lib/helpers'

export default async function AdminArtikelPage() {
  const [articles, categories] = await Promise.all([
    getArticles({ limit: 50 }),
    getCategories()
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Artikel</h1>
        <Link href="/admin/artikel/neu">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Neuer Artikel
          </Button>
        </Link>
      </div>
      
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Artikel suchen..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <div className="divide-y divide-border">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/admin/artikel/${article.id}`}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">{article.title}</h3>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${ARTICLE_STATUS[article.status as keyof typeof ARTICLE_STATUS]?.color} text-white`}
                  >
                    {ARTICLE_STATUS[article.status as keyof typeof ARTICLE_STATUS]?.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{article.author?.name || 'Unbekannt'}</span>
                  <span>{article.category?.name}</span>
                  <span>{ARTICLE_TYPES[article.type as keyof typeof ARTICLE_TYPES]?.label}</span>
                  <span>{formatDate(article.created_at)}</span>
                </div>
              </div>
              
                <div className="flex items-center gap-2">
                  {article.is_featured && (
                    <Badge variant="outline" className="text-xs">Featured</Badge>
                  )}
                  {article.is_recommended && (
                    <Badge variant="outline" className="text-xs">Empfohlen</Badge>
                  )}
                </div>
            </Link>
          ))}
        </div>
        
        {articles.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            Noch keine Artikel vorhanden.
          </div>
        )}
      </div>
    </div>
  )
}
