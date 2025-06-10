"use client"

import { logoutUser } from "@/lib/actions/auth"
import { getCurrentUser } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import { Bell, Menu, X, User, LogOut, Settings, Home, Calendar, MilkIcon as Cow } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderUser {
  _id: string
  name: string
  email: string
  role: string
}

export default function FarmerHeader() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<HeaderUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [notificationCount] = useState(3) // This would come from your notification system

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

 

  if (loading) {
    return (
      <header className="bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse"></div>
              <div className="w-32 h-6 bg-white/20 rounded animate-pulse"></div>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg text-white sticky top-0 z-50 border-b border-emerald-500/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/farmer/dashboard" className="flex items-center space-x-3 group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 group-hover:bg-white/20 transition-all duration-200">
              <Cow className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Farmer</h1>
              <span className="text-xs text-emerald-100 font-medium hidden sm:block">
                {user?.name ? `Welcome, ${user.name.split(" ")[0]}` : "Welcome, Farmer"}
              </span>
            </div>
          </Link>


          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-white hover:bg-white/10 hover:text-white p-2 h-auto"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-amber-500 hover:bg-amber-500 text-xs flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
            </Button>

            {/* Profile Dropdown - Desktop */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-white hover:bg-white/10 hover:text-white p-2 h-auto"
                  >
                    <Avatar className="h-8 w-8 border-2 border-emerald-200">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                      <AvatarFallback className="bg-emerald-500 text-white text-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "F"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:block font-medium text-sm">{user?.name?.split(" ")[0] || "Farmer"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || "Farmer"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/farmer/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/farmer/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/10 hover:text-white p-2 h-auto"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-emerald-500/20">
            <div className="pt-4 space-y-2">
              {/* User Info */}
              <div className="flex items-center space-x-3 px-3 py-2 mb-4">
                <Avatar className="h-10 w-10 border-2 border-emerald-200">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-emerald-500 text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "F"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-white">{user?.name || "Farmer"}</p>
                  <p className="text-xs text-emerald-100">{user?.email}</p>
                </div>
              </div>

              {/* Navigation Links */}
             

              {/* Mobile Actions */}
              <div className="pt-4 border-t border-emerald-500/20 space-y-2">
                <Link
                  href="/farmer/profile"
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Profile</span>
                </Link>
                <Link
                  href="/farmer/settings"
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-red-200 hover:text-red-100 hover:bg-red-500/20 transition-all duration-200 w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
