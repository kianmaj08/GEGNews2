"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Trash2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { generateSlug, calculateReadingTime, generateExcerpt } from '@/lib/helpers'
import { CATEGORIES, ARTICLE_TYPES } from '@/lib/constants'
import type { ArticleType, ArticleStatus } from '@/lib/types'

export default function NewArticlePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [users, setUsers] = useState<{ id: string; name: string }[]>([])
  const [checklist, setChecklist] = useState({
    hasImage: false,
    hasCategory: false,
    hasTeaser: false,
    hasTags: false
  })
  
  const [article, setArticle] = useState({
    title: '',
    subtitle: '',
    slug: '',
    excerpt: '',
    content: '',
    type: 'standard' as ArticleType,
    category_id: '',
    author_id: '',
    status: 'draft' as ArticleStatus,
    is_featured: false,
    is_recommended: false,
    hero_image_url: '',
    hero_image_alt: '',
    hero_image_credits: '',
    comments_enabled: true,
    meta_title: '',
    meta_description: '',
  })

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('users')
        .select('id, name')
        .order('name')
      if (data && data.length > 0) {
        setUsers(data)
        setArticle(prev => ({ ...prev, author_id: data[0].id }))
      }
    }
    fetchUsers()
  }, [])

  const handleTitleChange = (title: string) => {
    setArticle({
      ...article,
      title,
      slug: generateSlug(title)
    })
  }

  const generateTeaser = () => {
    const excerpt = generateExcerpt(article.content)
    setArticle({ ...article, excerpt })
    setChecklist({ ...checklist, hasTeaser: true })
  }

    const handleSave = async (status: ArticleStatus) => {
      setSaving(true)
      
      const readingTime = calculateReadingTime(article.content)
      
      const { data, error } = await supabase
        .from('articles')
        .insert({
          ...article,
          category_id: article.category_id || null,
          author_id: article.author_id || null,
          subtitle: article.subtitle || null,
          excerpt: article.excerpt || null,
          content: article.content || null,
          hero_image_url: article.hero_image_url || null,
          hero_image_alt: article.hero_image_alt || null,
          hero_image_credits: article.hero_image_credits || null,
          meta_title: article.meta_title || null,
          meta_description: article.meta_description || null,
          status,
          reading_time: readingTime,
          published_at: status === 'published' ? new Date().toISOString() : null
        })
        .select()
        .single()
    
    setSaving(false)
    
    if (error) {
      alert('Fehler beim Speichern: ' + error.message)
      return
    }
    
    router.push('/admin/artikel')
  }

  const updateChecklist = () => {
    setChecklist({
      hasImage: !!article.hero_image_url,
      hasCategory: !!article.category_id,
      hasTeaser: !!article.excerpt,
      hasTags: false
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/artikel">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-serif font-bold">Neuer Artikel</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            Entwurf speichern
          </Button>
          <Button onClick={() => handleSave('published')} disabled={saving}>
            Veröffentlichen
          </Button>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inhalt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titel *</Label>
                <Input
                  value={article.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Artikeltitel eingeben..."
                  className="text-lg"
                />
              </div>
              
              <div>
                <Label>Untertitel</Label>
                <Input
                  value={article.subtitle}
                  onChange={(e) => setArticle({ ...article, subtitle: e.target.value })}
                  placeholder="Optionaler Untertitel..."
                />
              </div>
              
              <div>
                <Label>URL-Slug</Label>
                <Input
                  value={article.slug}
                  onChange={(e) => setArticle({ ...article, slug: e.target.value })}
                  placeholder="url-slug"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Teaser / Vorschautext</Label>
                  <Button variant="ghost" size="sm" onClick={generateTeaser}>
                    Auto-generieren
                  </Button>
                </div>
                <Textarea
                  value={article.excerpt}
                  onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                  placeholder="Kurzer Vorschautext für Artikellisten..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Inhalt</Label>
                <Textarea
                  value={article.content}
                  onChange={(e) => setArticle({ ...article, content: e.target.value })}
                  placeholder="Artikelinhalt (Markdown unterstützt)..."
                  rows={20}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lesezeit: {calculateReadingTime(article.content)} Min.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Titelbild</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Bild-URL</Label>
                <Input
                  value={article.hero_image_url}
                  onChange={(e) => {
                    setArticle({ ...article, hero_image_url: e.target.value })
                    updateChecklist()
                  }}
                  placeholder="https://..."
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Alt-Text</Label>
                  <Input
                    value={article.hero_image_alt}
                    onChange={(e) => setArticle({ ...article, hero_image_alt: e.target.value })}
                    placeholder="Bildbeschreibung..."
                  />
                </div>
                <div>
                  <Label>Credits / Quelle</Label>
                  <Input
                    value={article.hero_image_credits}
                    onChange={(e) => setArticle({ ...article, hero_image_credits: e.target.value })}
                    placeholder="Foto: Name"
                  />
                </div>
              </div>
              
              {article.hero_image_url && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={article.hero_image_url} 
                    alt="Vorschau"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Meta-Titel</Label>
                <Input
                  value={article.meta_title}
                  onChange={(e) => setArticle({ ...article, meta_title: e.target.value })}
                  placeholder={article.title || 'Titel für Suchmaschinen...'}
                />
              </div>
              
              <div>
                <Label>Meta-Beschreibung</Label>
                <Textarea
                  value={article.meta_description}
                  onChange={(e) => setArticle({ ...article, meta_description: e.target.value })}
                  placeholder={article.excerpt || 'Beschreibung für Suchmaschinen...'}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Einstellungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Artikeltyp</Label>
                <Select 
                  value={article.type}
                  onValueChange={(value) => setArticle({ ...article, type: value as ArticleType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ARTICLE_TYPES).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
                <div>
                  <Label>Kategorie</Label>
                  <Select 
                    value={article.category_id || 'none'}
                    onValueChange={(value) => {
                      setArticle({ ...article, category_id: value === 'none' ? '' : value })
                      updateChecklist()
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Keine Kategorie</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              
<div>
                  <Label>Autor</Label>
                  <Select 
                    value={article.author_id || 'none'}
                    onValueChange={(value) => setArticle({ ...article, author_id: value === 'none' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Autor wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Kein Autor</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Optionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Thema der Woche</Label>
                  <Switch
                    id="featured"
                    checked={article.is_featured}
                    onCheckedChange={(checked) => setArticle({ ...article, is_featured: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="recommended">Redaktions-Empfehlung</Label>
                  <Switch
                    id="recommended"
                    checked={article.is_recommended}
                    onCheckedChange={(checked) => setArticle({ ...article, is_recommended: checked })}
                  />
                </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="comments">Kommentare erlaubt</Label>
                <Switch
                  id="comments"
                  checked={article.comments_enabled}
                  onCheckedChange={(checked) => setArticle({ ...article, comments_enabled: checked })}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Checkliste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${article.hero_image_url ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className={article.hero_image_url ? '' : 'text-muted-foreground'}>Titelbild vorhanden</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${article.category_id ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className={article.category_id ? '' : 'text-muted-foreground'}>Kategorie gesetzt</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${article.excerpt ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className={article.excerpt ? '' : 'text-muted-foreground'}>Teaser vorhanden</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${article.title ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className={article.title ? '' : 'text-muted-foreground'}>Titel vorhanden</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
