'use client'

import Link from 'next/link'
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  Lightbulb, 
  Mail, 
  Calendar,
  Settings,
  BarChart2,
  Home
} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/artikel', label: 'Artikel', icon: FileText },
    { href: '/admin/kalender', label: 'Kalender', icon: Calendar },
    { href: '/admin/medien', label: 'Medien', icon: Image },
    { href: '/admin/kategorien', label: 'Kategorien', icon: FolderOpen },
    { href: '/admin/umfragen', label: 'Umfragen', icon: BarChart2 },
    { href: '/admin/kommentare', label: 'Kommentare', icon: MessageSquare },
    { href: '/admin/ideen', label: 'Themenideen', icon: Lightbulb },
    { href: '/admin/leserbriefe', label: 'Leserbriefe', icon: Mail },
    { href: '/admin/nutzer', label: 'Nutzer', icon: Users },
    { href: '/admin/einstellungen', label: 'Einstellungen', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border overflow-y-auto">
          <div className="p-4 border-b border-border">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-serif font-bold">GEGNews</span>
              <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded">Admin</span>
            </Link>
          </div>
          
          <nav className="p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          
<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card space-y-3">
              <div className="flex items-center gap-3">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
                <span className="text-sm text-muted-foreground">Mein Konto</span>
              </div>
              <Link 
                href="/" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                Zur Website
              </Link>
            </div>
        </aside>
        
        <main className="ml-64 flex-1 min-h-screen">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
