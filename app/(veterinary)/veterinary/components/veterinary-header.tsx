"use client"

import { Button } from "@/components/ui/button"
import { UserNav } from "./user-nav"
import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

interface VeterinaryHeaderProps {
  onMenuClick?: () => void
}

export function VeterinaryHeader({ onMenuClick }: VeterinaryHeaderProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Page title */}
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground truncate">
            Veterinary Dashboard
          </h1>
        </div>

        {/* Search and actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="hidden md:flex items-center space-x-2">
            {showSearch ? (
              <Input
                placeholder="Search patients, appointments..."
                className="w-64"
                onBlur={() => setShowSearch(false)}
                autoFocus
              />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>

          {/* Mobile search */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User menu */}
          <UserNav />
        </div>
      </div>
    </header>
  )
} 