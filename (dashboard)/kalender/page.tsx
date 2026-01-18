import { getArticles } from '@/lib/api'
import { formatDate } from '@/lib/helpers'
import { Badge } from '@/components/ui/badge'
import { ARTICLE_STATUS } from '@/lib/constants'

export default async function AdminKalenderPage() {
  const articles = await getArticles({ limit: 100 })
  
  const scheduled = articles.filter(a => a.status === 'scheduled')
  const published = articles.filter(a => a.status === 'published').slice(0, 20)

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Redaktionskalender</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Geplante Veröffentlichungen</h2>
          <div className="bg-card border border-border rounded-lg">
            {scheduled.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Keine geplanten Artikel
              </div>
            ) : (
              <div className="divide-y divide-border">
                {scheduled.map(article => (
                  <div key={article.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{article.title}</h3>
                      <Badge className="bg-blue-500 text-white">Geplant</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {article.scheduled_at ? formatDate(article.scheduled_at) : 'Datum nicht festgelegt'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Kürzlich veröffentlicht</h2>
          <div className="bg-card border border-border rounded-lg">
            {published.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Keine veröffentlichten Artikel
              </div>
            ) : (
              <div className="divide-y divide-border">
                {published.map(article => (
                  <div key={article.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{article.title}</h3>
                      <Badge className="bg-green-500 text-white">Online</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(article.published_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
