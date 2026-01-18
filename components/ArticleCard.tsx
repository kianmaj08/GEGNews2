import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Article } from '@/lib/types'
import { formatRelativeTime, getArticleTypeLabel } from '@/lib/helpers'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'large' | 'compact' | 'horizontal'
  showImage?: boolean
  showExcerpt?: boolean
}

export function ArticleCard({ article, variant = 'default', showImage = true, showExcerpt = true }: ArticleCardProps) {
  const categoryColor = article.category?.badge_color || '#6366f1'
  
  if (variant === 'large') {
    return (
      <Link href={`/artikel/${article.slug}`} className="group block">
        <article className="relative overflow-hidden bg-card">
          {showImage && article.hero_image_url && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={article.hero_image_url}
                alt={article.hero_image_alt || article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-3">
                  {article.category && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                      style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                    >
                      {article.category.name}
                    </Badge>
                  )}
                  {article.type !== 'standard' && (
                    <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white">
                      {getArticleTypeLabel(article.type)}
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 line-clamp-2 group-hover:underline decoration-2 underline-offset-4">
                  {article.title}
                </h2>
                {article.subtitle && (
                  <p className="text-white/80 text-sm md:text-base mb-3 line-clamp-2">{article.subtitle}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-white/70">
                  {article.author && <span>{article.author.name}</span>}
                  <span>{formatRelativeTime(article.published_at)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.reading_time} Min.
                  </span>
                </div>
              </div>
            </div>
          )}
        </article>
      </Link>
    )
  }
  
  if (variant === 'horizontal') {
    return (
      <Link href={`/artikel/${article.slug}`} className="group block">
        <article className="flex gap-4 p-3 hover:bg-muted/50 transition-colors">
          {showImage && article.hero_image_url && (
            <div className="relative w-24 h-24 shrink-0 overflow-hidden">
              <Image
                src={article.hero_image_url}
                alt={article.hero_image_alt || article.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {article.category && (
                <Badge 
                  variant="secondary" 
                  className="text-[10px] px-1.5 py-0"
                  style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
                >
                  {article.category.name}
                </Badge>
              )}
            </div>
            <h3 className="font-serif font-semibold text-sm line-clamp-2 group-hover:text-accent transition-colors">
              {article.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {formatRelativeTime(article.published_at)}
            </p>
          </div>
        </article>
      </Link>
    )
  }
  
  if (variant === 'compact') {
    return (
      <Link href={`/artikel/${article.slug}`} className="group block">
        <article className="py-3 border-b border-border last:border-0">
          <div className="flex items-center gap-2 mb-1">
            {article.category && (
              <Badge 
                variant="secondary" 
                className="text-[10px] px-1.5 py-0"
                style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
              >
                {article.category.name}
              </Badge>
            )}
            <span className="text-[10px] text-muted-foreground">{formatRelativeTime(article.published_at)}</span>
          </div>
          <h3 className="font-serif font-semibold text-sm group-hover:text-accent transition-colors">
            {article.title}
          </h3>
        </article>
      </Link>
    )
  }
  
  return (
    <Link href={`/artikel/${article.slug}`} className="group block">
      <article className="bg-card overflow-hidden border border-border hover:shadow-md transition-shadow">
        {showImage && article.hero_image_url && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={article.hero_image_url}
              alt={article.hero_image_alt || article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {article.category && (
              <Badge 
                variant="secondary" 
                className="text-[10px] px-1.5 py-0"
                style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
              >
                {article.category.name}
              </Badge>
            )}
            {article.type !== 'standard' && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {getArticleTypeLabel(article.type)}
              </Badge>
            )}
          </div>
          <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {article.title}
          </h3>
          {showExcerpt && article.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {article.author && <span>{article.author.name}</span>}
            <span>{formatRelativeTime(article.published_at)}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
