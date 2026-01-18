import { supabase } from './supabase'
import type { Article, Category, Tag, User, Poll, BreakingNews, Comment, NewsletterSubscriber } from './types'

export async function getArticles(options?: {
  status?: string
  category?: string
  type?: string
  featured?: boolean
  recommended?: boolean
  limit?: number
  offset?: number
  orderBy?: string
  order?: 'asc' | 'desc'
}): Promise<Article[]> {
  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:users!articles_author_id_fkey(*)
    `)
  
  if (options?.status) query = query.eq('status', options.status)
  if (options?.category) query = query.eq('category_id', options.category)
  if (options?.type) query = query.eq('type', options.type)
  if (options?.featured !== undefined) query = query.eq('is_featured', options.featured)
  if (options?.recommended !== undefined) query = query.eq('is_recommended', options.recommended)
  if (options?.limit) query = query.limit(options.limit)
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  
  const orderBy = options?.orderBy || 'published_at'
  const order = options?.order || 'desc'
  query = query.order(orderBy, { ascending: order === 'asc', nullsFirst: false })
  
  const { data, error } = await query
  if (error) {
    console.error('getArticles error:', error)
    return []
  }
  return data || []
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:users!articles_author_id_fkey(*)
    `)
    .eq('slug', slug)
    .single()
  
  if (error) return null
  return data
}

export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:users!articles_author_id_fkey(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) return null
  return data
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:users!articles_author_id_fkey(*)
    `)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) return null
  return data
}

export async function getRecommendedArticles(limit: number = 4): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:users!articles_author_id_fkey(*)
    `)
    .eq('status', 'published')
    .eq('is_recommended', true)
    .order('published_at', { ascending: false })
    .limit(limit)
  
  if (error) return []
  return data || []
}

export async function getKurzmeldungen(limit: number = 5): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:users!articles_author_id_fkey(*)
    `)
    .eq('status', 'published')
    .eq('type', 'kurzmeldung')
    .order('published_at', { ascending: false })
    .limit(limit)
  
  if (error) return []
  return data || []
}

export async function getTopArticles(limit: number = 10): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:users!articles_author_id_fkey(*)
    `)
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(limit)
  
  if (error) return []
  return data || []
}

export async function getRelatedArticles(articleId: string, categoryId: string, limit: number = 3): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:users!articles_author_id_fkey(*)
    `)
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', articleId)
    .order('published_at', { ascending: false })
    .limit(limit)
  
  if (error) return []
  return data || []
}

export async function searchArticles(query: string): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:users!articles_author_id_fkey(*)
    `)
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(20)
  
  if (error) return []
  return data || []
}

export async function incrementViewCount(articleId: string): Promise<void> {
  try {
    await supabase.rpc('increment_views', { article_id: articleId })
  } catch {
    // Ignore errors
  }
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) return []
  return data || []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) return null
  return data
}

export async function getTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')
  
  if (error) return []
  return data || []
}

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name')
  
  if (error) return []
  return data || []
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data
}

export async function getUserBySlug(slug: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) return null
  return data
}

export async function getArticlesByAuthorSlug(slug: string): Promise<Article[]> {
  const author = await getUserBySlug(slug)
  if (!author) return []
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:users!articles_author_id_fkey(*)
    `)
    .eq('status', 'published')
    .eq('author_id', author.id)
    .order('published_at', { ascending: false })
  
  if (error) return []
  return data || []
}

export async function getBreakingNews(): Promise<BreakingNews | null> {
  const { data, error } = await supabase
    .from('breaking_news')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) return null
  return data
}

export async function getPolls(articleId?: string): Promise<Poll[]> {
  let query = supabase
    .from('polls')
    .select('*')
    .eq('active', true)
  
  if (articleId) {
    query = query.eq('article_id', articleId)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function getPollById(id: string): Promise<Poll | null> {
  const { data, error } = await supabase
    .from('polls')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data
}

export async function votePoll(pollId: string, option: string): Promise<boolean> {
  const poll = await getPollById(pollId)
  if (!poll) return false
  
  const newVotes = { ...poll.votes }
  newVotes[option] = (newVotes[option] || 0) + 1
  
  const { error } = await supabase
    .from('polls')
    .update({ votes: newVotes })
    .eq('id', pollId)
  
  return !error
}

export async function getCommentsByArticle(articleId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', articleId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  
  if (error) return []
  return data || []
}

export async function createComment(articleId: string, name: string, email: string, message: string): Promise<boolean> {
  const { error } = await supabase
    .from('comments')
    .insert({ article_id: articleId, name, email, message, status: 'pending' })
  
  return !error
}

export async function submitIdeaSuggestion(data: { name: string; class_name?: string; topic: string; message?: string }): Promise<boolean> {
  const { error } = await supabase
    .from('idea_suggestions')
    .insert(data)
  
  return !error
}

export async function submitLetterToEditor(data: { name: string; email?: string; message: string }): Promise<boolean> {
  const { error } = await supabase
    .from('letters_to_editor')
    .insert(data)
  
  return !error
}

export async function submitJoinRequest(data: { name: string; class_name?: string; interest: string; message?: string }): Promise<boolean> {
  const { error } = await supabase
    .from('join_requests')
    .insert(data)
  
  return !error
}

export async function submitContactMessage(data: { name: string; email: string; subject?: string; message: string }): Promise<boolean> {
  const { error } = await supabase
    .from('contact_messages')
    .insert(data)
  
  return !error
}

export async function getArticlesByMonth(year: number, month: number): Promise<Article[]> {
  const startDate = new Date(year, month - 1, 1).toISOString()
  const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:users!articles_author_id_fkey(*)
    `)
    .eq('status', 'published')
    .gte('published_at', startDate)
    .lte('published_at', endDate)
    .order('published_at', { ascending: false })
  
  if (error) return []
  return data || []
}

export async function getArticlesByCategorySlug(slug: string, limit?: number): Promise<Article[]> {
  const category = await getCategoryBySlug(slug)
  if (!category) return []
  
  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:users!articles_author_id_fkey(*)
    `)
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })
  
  if (limit) query = query.limit(limit)
  
  const { data, error } = await query
  if (error) return []
  return data || []
}

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email, confirmed: true })
  
  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Diese E-Mail ist bereits angemeldet.' }
    }
    return { success: false, error: 'Ein Fehler ist aufgetreten.' }
  }
  return { success: true }
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) return []
  return data || []
}

export async function deleteNewsletterSubscriber(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .delete()
    .eq('id', id)
  
  return !error
}

export async function updateUser(id: string, data: Partial<User>): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', id)
  
  return !error
}
