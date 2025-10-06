"use client"

import { Button } from "@/components/ui/button"
import { UserNav } from "@/app/(veterinary)/veterinary/components/user-nav"
import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface VeterinaryHeaderProps {
  onMenuClick: () => void
}

export function VeterinaryHeader({ onMenuClick }: VeterinaryHeaderProps) {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">
              Veterinary Dashboard
            </h1>
          </div>
          
          <div className="lg:hidden">
            <h1 className="text-lg font-semibold text-gray-900">
              Dashboard
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="hidden md:block">
            {showSearch ? (
              <Input
                placeholder="Search patients..."
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
              </Button>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          <UserNav />
        </div>
      </div>
    </header>
  )
}