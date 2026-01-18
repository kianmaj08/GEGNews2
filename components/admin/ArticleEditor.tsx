"use client"

import { useState } from 'react'
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
import { supabase } from '@/lib/supabase'
import { generateSlug, calculateReadingTime, generateExcerpt } from '@/lib/helpers'
import { ARTICLE_TYPES } from '@/lib/constants'
import type { Article, Category, User, ArticleType, ArticleStatus } from '@/lib/types'

interface ArticleEditorProps {
  article: Article
  categories: Category[]
  users: User[]
}

export function ArticleEditor({ article: initialArticle, categories, users }: ArticleEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [article, setArticle] = useState(initialArticle)

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
  }

  const handleSave = async (status?: ArticleStatus) => {
    setSaving(true)
    
    const readingTime = calculateReadingTime(article.content)
    const updateData: Partial<Article> = {
      title: article.title,
      subtitle: article.subtitle,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      type: article.type,
      category_id: article.category_id || null,
      author_id: article.author_id,
        is_featured: article.is_featured,
        is_recommended: article.is_recommended,
      hero_image_url: article.hero_image_url,
      hero_image_alt: article.hero_image_alt,
      hero_image_credits: article.hero_image_credits,
      comments_enabled: article.comments_enabled,
      meta_title: article.meta_title,
      meta_description: article.meta_description,
      reading_time: readingTime,
      updated_at: new Date().toISOString()
    }
    
    if (status) {
      updateData.status = status
      if (status === 'published' && !article.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }
    
    const { error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', article.id)
    
    setSaving(false)
    
    if (error) {
      alert('Fehler beim Speichern: ' + error.message)
      return
    }
    
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('Artikel wirklich löschen?')) return
    
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', article.id)
    
    if (error) {
      alert('Fehler beim Löschen: ' + error.message)
      return
    }
    
    router.push('/admin/artikel')
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
          <h1 className="text-2xl font-serif font-bold">Artikel bearbeiten</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href={`/artikel/${article.slug}`} target="_blank">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Vorschau
            </Button>
          </Link>
          <Button variant="outline" onClick={() => handleSave()} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
          {article.status !== 'published' && (
            <Button onClick={() => handleSave('published')} disabled={saving}>
              Veröffentlichen
            </Button>
          )}
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
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
                  value={article.subtitle || ''}
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
                  value={article.excerpt || ''}
                  onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                  placeholder="Kurzer Vorschautext für Artikellisten..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Inhalt</Label>
                <Textarea
                  value={article.content || ''}
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
                  value={article.hero_image_url || ''}
                  onChange={(e) => setArticle({ ...article, hero_image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Alt-Text</Label>
                  <Input
                    value={article.hero_image_alt || ''}
                    onChange={(e) => setArticle({ ...article, hero_image_alt: e.target.value })}
                    placeholder="Bildbeschreibung..."
                  />
                </div>
                <div>
                  <Label>Credits / Quelle</Label>
                  <Input
                    value={article.hero_image_credits || ''}
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
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Einstellungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select 
                  value={article.status}
                  onValueChange={(value) => setArticle({ ...article, status: value as ArticleStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Entwurf</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="scheduled">Geplant</SelectItem>
                    <SelectItem value="published">Veröffentlicht</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
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
                    onValueChange={(value) => setArticle({ ...article, category_id: value === 'none' ? null : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Keine Kategorie</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              
              <div>
                <Label>Autor</Label>
                <Select 
                  value={article.author_id || ''}
                  onValueChange={(value) => setArticle({ ...article, author_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              <CardTitle>Info</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>Erstellt: {new Date(article.created_at).toLocaleDateString('de-DE')}</p>
              <p>Aktualisiert: {new Date(article.updated_at).toLocaleDateString('de-DE')}</p>
              {article.published_at && (
                <p>Veröffentlicht: {new Date(article.published_at).toLocaleDateString('de-DE')}</p>
              )}
                <p>Aufrufe: {article.view_count}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
