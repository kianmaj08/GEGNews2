import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ArticleCard } from '@/components/ArticleCard'
import { getCategoryBySlug, getArticlesByCategorySlug } from '@/lib/api'
import type { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) return { title: 'Kategorie nicht gefunden' }
  
  return {
    title: category.name,
    description: category.description || `Alle Artikel in der Kategorie ${category.name}`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const [category, articles] = await Promise.all([
    getCategoryBySlug(slug),
    getArticlesByCategorySlug(slug)
  ])
  
  if (!category) {
    notFound()
  }

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <header className="mb-8">
            <div 
              className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: `${category.badge_color}20`, color: category.badge_color }}
            >
              Kategorie
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-muted-foreground">{category.description}</p>
            )}
          </header>
          
          {articles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Noch keine Artikel in dieser Kategorie.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  )
}
