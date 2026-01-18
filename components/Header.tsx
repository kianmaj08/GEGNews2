"use client"

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, Search, Sun, Moon, MoreVertical, Settings, Mail, Users, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORIES } from '@/lib/constants'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-background'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 border-b border-border">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                  <img
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/9e46b249-1330-4fe0-8f04-c39641bde8e2/images-removebg-preview-1768706879702.png?width=8000&height=8000&resize=contain"
                    alt="Logo"
                    className="h-10 w-10 object-contain"
                  />
                <span className="text-2xl font-serif font-bold tracking-tight">GEGNews</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Demo</span>
              </Link>
            </div>

          <nav className="hidden lg:flex items-center gap-1">
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat.slug}
                href={`/kategorie/${cat.slug}`}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link href="/suche">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Search className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleDarkMode}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <div className="relative" ref={moreMenuRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
              
              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                  <Link 
                    href="/einstellungen"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMoreMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Einstellungen
                  </Link>
                  <Link 
                    href="/kontakt"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMoreMenuOpen(false)}
                  >
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Kontakt
                  </Link>
                  <Link 
                    href="/redaktion"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMoreMenuOpen(false)}
                  >
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Mitglieder
                  </Link>
                  <div className="border-t border-border my-1" />
                  <Link 
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMoreMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Admin
                  </Link>
                </div>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat.slug}
                href={`/kategorie/${cat.slug}`}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <Link 
                href="/archiv"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors block"
                onClick={() => setIsMenuOpen(false)}
              >
                Archiv
              </Link>
              <Link 
                href="/top-10"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors block"
                onClick={() => setIsMenuOpen(false)}
              >
                Top 10
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
