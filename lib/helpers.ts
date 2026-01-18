export function formatDate(dateString: string | null, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', options || {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export function formatDateTime(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Gerade eben'
  if (diffInSeconds < 3600) return `vor ${Math.floor(diffInSeconds / 60)} Min.`
  if (diffInSeconds < 86400) return `vor ${Math.floor(diffInSeconds / 3600)} Std.`
  if (diffInSeconds < 604800) return `vor ${Math.floor(diffInSeconds / 86400)} Tagen`
  
  return formatDate(dateString)
}

export function calculateReadingTime(content: string | null): number {
  if (!content) return 1
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function generateExcerpt(content: string | null, maxLength: number = 160): string {
  if (!content) return ''
  const plainText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/>\s/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  return truncateText(plainText, maxLength)
}

export function getCategoryColor(categorySlug: string): string {
  const colors: Record<string, string> = {
    'schule-politik': '#3b82f6',
    'events': '#f59e0b',
    'lehrer-interview': '#10b981',
    'kultur': '#8b5cf6',
    'wissen': '#ec4899',
    'sport': '#ef4444',
  }
  return colors[categorySlug] || '#6366f1'
}

export function getArticleTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    standard: 'Artikel',
    kurzmeldung: 'Kurzmeldung',
    interview: 'Interview',
    meinung: 'Meinung',
    reportage: 'Reportage',
    fotostrecke: 'Fotostrecke',
    umfrage: 'Umfrage',
    event: 'Event',
  }
  return labels[type] || 'Artikel'
}

export function getPollPercentage(votes: Record<string, number>, option: string): number {
  const total = Object.values(votes).reduce((sum, count) => sum + count, 0)
  if (total === 0) return 0
  return Math.round((votes[option] / total) * 100)
}

export function getTotalVotes(votes: Record<string, number>): number {
  return Object.values(votes).reduce((sum, count) => sum + count, 0)
}
