"use client"

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import type { BreakingNews } from '@/lib/types'

interface BreakingNewsTickerProps {
  news: BreakingNews | null
}

export function BreakingNewsTicker({ news }: BreakingNewsTickerProps) {
  if (!news) return null
  
  return (
    <div className="text-white" style={{ backgroundColor: '#103345' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-8 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-accent-foreground/20">
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Eilmeldung</span>
            </div>
          <div className="flex-1 overflow-hidden ml-4">
            <div className="breaking-news-ticker whitespace-nowrap">
              {news.link ? (
                <Link href={news.link} className="text-sm hover:underline">
                  {news.text}
                </Link>
              ) : (
                <span className="text-sm">{news.text}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
