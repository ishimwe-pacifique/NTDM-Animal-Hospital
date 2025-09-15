"use client"

import { useState, useEffect } from "react"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  Shield,
  Activity
} from "lucide-react"
import { logoutUser } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import SuperAdminSidebar from "@/components/superadmin/super-admin-sidebar"

interface SuperAdminHeaderProps {
  user: {
    _id: string
    name: string
    email: string
    role: string
  }
}

export default function SuperAdminHeader({ user }: SuperAdminHeaderProps) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New consultation request",
      message: "Dr. John Smith received a new consultation from Farmer Mike",
      time: "2 minutes ago",
      unread: true
    },
    {
      id: 2,
      title: "User registration",
      message: "New farmer registered: Sarah Johnson",
      time: "15 minutes ago",
      unread: true
    },
    {
      id: 3,
      title: "System update",
      message: "Database backup completed successfully",
      time: "1 hour ago",
      unread: false
    }
  ])

  const [isOnline, setIsOnline] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Track online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="w-full h-full">
      <div className="flex h-full items-center justify-between px-3 sm:px-6">
        {/* Left side - Mobile menu + Logo */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile menu button - Only visible on mobile/tablet */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden p-2"
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="px-4 py-4 border-b">
                <SheetTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span>Super Admin</span>
                </SheetTitle>
                <SheetDescription>
                  System Control Panel
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <SuperAdminSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo and title */}
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <div className="hidden sm:block">
              <h1 className="text-base sm:text-lg font-semibold text-gray-900">Super Admin</h1>
              <p className="text-xs text-gray-500 hidden md:block">System Control Panel</p>
            </div>
            {/* Mobile title - shorter version */}
            <div className="block sm:hidden">
              <h1 className="text-sm font-semibold text-gray-900">Admin</h1>
            </div>
          </div>
        </div>

        {/* Right side - Status, Notifications and profile */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Online status - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Notifications */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-80 max-w-sm">
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  System alerts and updates
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.unread 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                </div>
                {/* User info - Hidden on mobile */}
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium truncate max-w-32">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-32">{user.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 font-normal">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              {/* Mobile-only online status */}
              <div className="md:hidden">
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className={`mr-2 w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  Status: {isOnline ? 'Online' : 'Offline'}
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}