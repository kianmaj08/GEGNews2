export type ArticleType = 
  | 'standard' 
  | 'kurzmeldung' 
  | 'interview' 
  | 'meinung' 
  | 'reportage' 
  | 'fotostrecke' 
  | 'umfrage' 
  | 'event'

export type ArticleStatus = 'draft' | 'review' | 'scheduled' | 'published'

export type UserRole = 'admin' | 'editor' | 'author'

export type UserStatus = 'pending' | 'approved'

export type AuthorPosition = 
  | 'chefredakteur' 
  | 'stellv_chefredakteur' 
  | 'ressortleiter' 
  | 'redakteur' 
  | 'fotograf'
  | 'gastautor'

export type AuthorStufe = 
  | '5' | '6' | '7' | '8' | '9' | '10' 
  | 'EF' | 'Q1' | 'Q2' 
  | 'lehrer'

export type AuthorBadge = 'it' | 'social_media' | 'layout'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  badge_color: string
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar_url: string | null
  bio: string | null
  slug: string | null
  position: AuthorPosition | null
  stufe: AuthorStufe | null
  badges: AuthorBadge[]
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  confirmed: boolean
  created_at: string
}

export interface GalleryImage {
  url: string
  alt: string
  credits: string
}

export interface EventData {
  date: string
  time: string
  location: string
  address?: string
}

export interface PollData {
  question: string
  options: string[]
  votes: Record<string, number>
}

export interface Article {
  id: string
  title: string
  subtitle: string | null
  slug: string
  excerpt: string | null
  content: string | null
  type: ArticleType
  category_id: string | null
  author_id: string | null
  status: ArticleStatus
  is_featured: boolean
  is_recommended: boolean
  published_at: string | null
  scheduled_at: string | null
  created_at: string
  updated_at: string
  reading_time: number
  hero_image_url: string | null
  hero_image_alt: string | null
  hero_image_credits: string | null
  gallery_images: GalleryImage[]
  poll_data: PollData | null
  event_data: EventData | null
  comments_enabled: boolean
  view_count: number
  meta_title: string | null
  meta_description: string | null
  og_image: string | null
  category?: Category
  author?: User
  tags?: Tag[]
}

export interface Comment {
  id: string
  article_id: string
  name: string | null
  email: string | null
  message: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface IdeaSuggestion {
  id: string
  name: string
  class_name: string | null
  topic: string
  message: string | null
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  created_at: string
}

export interface LetterToEditor {
  id: string
  name: string
  email: string | null
  message: string
  status: 'pending' | 'approved' | 'rejected' | 'published'
  created_at: string
}

export interface JoinRequest {
  id: string
  name: string
  class_name: string | null
  interest: string
  message: string | null
  status: 'pending' | 'contacted' | 'accepted' | 'rejected'
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  status: 'unread' | 'read' | 'replied'
  created_at: string
}

export interface Poll {
  id: string
  question: string
  options: string[]
  votes: Record<string, number>
  active: boolean
  article_id: string | null
  created_at: string
  ends_at: string | null
}

export interface BreakingNews {
  id: string
  text: string
  link: string | null
  active: boolean
  created_at: string
}

export interface Media {
  id: string
  url: string
  alt_text: string | null
  credits: string | null
  filename: string | null
  file_size: number | null
  mime_type: string | null
  created_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  details: Record<string, unknown> | null
  created_at: string
  user?: User
}
