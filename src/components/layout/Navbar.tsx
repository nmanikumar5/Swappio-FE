"use client";

import Link from "next/link";
import { Search, Plus, User, Heart, MessageSquare, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-xl font-bold">S</span>
            </div>
            <span className="text-xl font-bold">Swappio</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 max-w-2xl mx-8 md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link href="/post-ad">
              <Button className="hidden sm:flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Post Ad</span>
              </Button>
            </Link>

            <Link href="/favorites">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/chat">
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="pb-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
