"use client"

import { Button } from "@/components/ui/button"
import { UserNav } from "@/app/(veterinary)/veterinary/components/user-nav"
import { Bell, Search, Menu, Stethoscope, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface VeterinaryHeaderProps {
  onMenuClick: () => void
}

export function VeterinaryHeader({ onMenuClick }: VeterinaryHeaderProps) {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-white hover:bg-blue-500"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden lg:flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Veterinary
              </h1>
              <p className="text-xs text-blue-100">Professional Animal Care</p>
            </div>
          </div>
          
          <div className="lg:hidden flex items-center space-x-2">
            <Heart className="h-5 w-5 text-white" />
            <h1 className="text-lg font-semibold text-white">
              VetCare
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="hidden md:block">
            {showSearch ? (
              <Input
                placeholder="Search patients, cases..."
                className="w-64 bg-white/10 border-white/20 text-white placeholder:text-blue-100"
                onBlur={() => setShowSearch(false)}
                autoFocus
              />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="text-white hover:bg-blue-500"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-blue-500">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-blue-500">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border border-white"></span>
          </Button>

          <UserNav />
        </div>
      </div>
    </header>
  )
}