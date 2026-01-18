export const CATEGORIES = [
  { id: '00000000-0000-0000-0000-000000000002', name: 'Schulleben', slug: 'schulleben', color: '#3b82f6' },
  { id: '00000000-0000-0000-0000-000000000003', name: 'Events', slug: 'events', color: '#f59e0b' },
  { id: '00000000-0000-0000-0000-000000000004', name: 'Meinung', slug: 'meinung', color: '#10b981' },
] as const

export const ARTICLE_TYPES = {
  standard: { label: 'Standard-Artikel', icon: 'FileText' },
  kurzmeldung: { label: 'Kurzmeldung', icon: 'Zap' },
  interview: { label: 'Interview', icon: 'MessageSquare' },
  meinung: { label: 'Meinungsbeitrag', icon: 'MessageCircle' },
  reportage: { label: 'Reportage', icon: 'BookOpen' },
  fotostrecke: { label: 'Fotostrecke', icon: 'Image' },
  umfrage: { label: 'Umfrage-Artikel', icon: 'BarChart2' },
  event: { label: 'Event-Post', icon: 'Calendar' },
} as const

export const ARTICLE_STATUS = {
  draft: { label: 'Entwurf', color: 'bg-gray-500' },
  review: { label: 'In Review', color: 'bg-yellow-500' },
  scheduled: { label: 'Geplant', color: 'bg-blue-500' },
  published: { label: 'Veröffentlicht', color: 'bg-green-500' },
} as const

export const USER_ROLES = {
  admin: { label: 'Admin', description: 'Vollzugriff auf alle Funktionen' },
  editor: { label: 'Editor', description: 'Erstellen, bearbeiten, planen, veröffentlichen' },
  author: { label: 'Autor', description: 'Erstellen, bearbeiten, Review erforderlich' },
} as const

export const USER_STATUS = {
  pending: { label: 'Ausstehend', color: 'bg-yellow-500' },
  approved: { label: 'Freigegeben', color: 'bg-green-500' },
} as const

export const AUTHOR_POSITIONS = {
  chefredakteur: { label: 'Chefredakteur', color: 'bg-purple-600', order: 1 },
  stellv_chefredakteur: { label: 'Stellv. Chefredakteur', color: 'bg-purple-500', order: 2 },
  ressortleiter: { label: 'Ressortleiter', color: 'bg-blue-600', order: 3 },
  redakteur: { label: 'Redakteur', color: 'bg-blue-500', order: 4 },
  fotograf: { label: 'Fotograf', color: 'bg-emerald-500', order: 5 },
  gastautor: { label: 'Gastautor', color: 'bg-gray-500', order: 6 },
} as const

export const AUTHOR_STUFEN = {
  '5': { label: 'Klasse 5', shortLabel: '5' },
  '6': { label: 'Klasse 6', shortLabel: '6' },
  '7': { label: 'Klasse 7', shortLabel: '7' },
  '8': { label: 'Klasse 8', shortLabel: '8' },
  '9': { label: 'Klasse 9', shortLabel: '9' },
  '10': { label: 'Klasse 10', shortLabel: '10' },
  'EF': { label: 'EF', shortLabel: 'EF' },
  'Q1': { label: 'Q1', shortLabel: 'Q1' },
  'Q2': { label: 'Q2', shortLabel: 'Q2' },
  'lehrer': { label: 'Lehrer', shortLabel: 'L' },
} as const

export const AUTHOR_BADGES = {
  it: { label: 'IT', color: 'bg-cyan-500', icon: 'Code' },
  social_media: { label: 'Social Media', color: 'bg-pink-500', icon: 'Share2' },
  layout: { label: 'Layout', color: 'bg-orange-500', icon: 'Layout' },
} as const

export const SCHOOL_LIFE_TILES = [
  { title: 'Events', icon: 'Calendar', href: '/kategorie/events', color: '#f59e0b' },
  { title: 'AGs', icon: 'Users', href: '/kategorie/schule-politik?tag=ag', color: '#3b82f6' },
  { title: 'Sport', icon: 'Trophy', href: '/kategorie/sport', color: '#ef4444' },
] as const

export const SUPPORT_EMAIL = 'oberstufesite@gmail.com'
