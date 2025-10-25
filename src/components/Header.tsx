'use client'

import Link from 'next/link'
import { Search, Heart, MessageSquare, User, Plus, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/store'
import { useState } from 'react'

export default function Header() {
  const { searchQuery, setSearchQuery, favourites, user } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search will be handled by the home page
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">Swappio</div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/favourites">
                <Heart className="h-5 w-5" />
                {favourites.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                    {favourites.length}
                  </span>
                )}
              </Link>
            </Button>
            
            <Button variant="ghost" size="icon" asChild>
              <Link href="/chat">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>

            {user ? (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Login</Link>
              </Button>
            )}

            <Button asChild className="ml-2">
              <Link href="/post-ad">
                <Plus className="h-4 w-4 mr-2" />
                Post Ad
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/favourites">
                <Heart className="h-5 w-5 mr-2" />
                Favourites
                {favourites.length > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs">
                    {favourites.length}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/chat">
                <MessageSquare className="h-5 w-5 mr-2" />
                Chat
              </Link>
            </Button>
            {user ? (
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard">
                  <User className="h-5 w-5 mr-2" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/auth/signin">Login</Link>
              </Button>
            )}
            <Button className="w-full" asChild>
              <Link href="/post-ad">
                <Plus className="h-4 w-4 mr-2" />
                Post Ad
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
