import Link from 'next/link'
import { FileText, Clock, CheckCircle, AlertCircle, Plus, Zap, BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getArticles } from '@/lib/api'
import { createClient } from '@/lib/supabase/server'

async function getStats() {
  const supabase = await createClient()
  const [
    { count: published },
    { count: drafts },
    { count: scheduled },
    { count: pending }
  ] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'pending')
  ])
  
  return {
    published: published || 0,
    drafts: drafts || 0,
    scheduled: scheduled || 0,
    pendingComments: pending || 0
  }
}

export default async function AdminDashboard() {
  const [stats, recentArticles] = await Promise.all([
    getStats(),
    getArticles({ limit: 5 })
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Willkommen im GEGNews CMS</p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/admin/artikel/neu">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Neuer Artikel
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Veröffentlicht</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground">Artikel online</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Entwürfe</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
            <p className="text-xs text-muted-foreground">In Bearbeitung</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Geplant</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Zur Veröffentlichung</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ausstehend</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingComments}</div>
            <p className="text-xs text-muted-foreground">Kommentare zu prüfen</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Link 
          href="/admin/artikel/neu?type=standard"
          className="p-4 bg-card border border-border rounded-lg hover:border-accent transition-colors flex items-center gap-4"
        >
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold">Neuer Artikel</h3>
            <p className="text-sm text-muted-foreground">Standard-Artikel erstellen</p>
          </div>
        </Link>
        
        <Link 
          href="/admin/artikel/neu?type=kurzmeldung"
          className="p-4 bg-card border border-border rounded-lg hover:border-accent transition-colors flex items-center gap-4"
        >
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold">Kurzmeldung</h3>
            <p className="text-sm text-muted-foreground">Schnelle News veröffentlichen</p>
          </div>
        </Link>
        
        <Link 
          href="/admin/umfragen/neu"
          className="p-4 bg-card border border-border rounded-lg hover:border-accent transition-colors flex items-center gap-4"
        >
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <BarChart2 className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-semibold">Neue Umfrage</h3>
            <p className="text-sm text-muted-foreground">Abstimmung erstellen</p>
          </div>
        </Link>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Letzte Artikel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <Link 
                  key={article.id}
                  href={`/admin/artikel/${article.id}`}
                  className="flex items-center justify-between py-2 hover:bg-muted/50 -mx-2 px-2 rounded transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-sm">{article.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {article.author?.name} • {article.status}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/kommentare" className="block">
              <Button variant="outline" className="w-full justify-start">
                Kommentare moderieren
              </Button>
            </Link>
            <Link href="/admin/ideen" className="block">
              <Button variant="outline" className="w-full justify-start">
                Themenideen ansehen
              </Button>
            </Link>
            <Link href="/admin/leserbriefe" className="block">
              <Button variant="outline" className="w-full justify-start">
                Leserbriefe prüfen
              </Button>
            </Link>
            <Link href="/admin/kalender" className="block">
              <Button variant="outline" className="w-full justify-start">
                Redaktionskalender
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
