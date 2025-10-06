"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  ClipboardList,
  Activity,
  Home,
  MessageSquare,
  Settings,
  Users,
  X
} from "lucide-react"

const sidebarNavItems = [
  { title: "Dashboard", href: "/veterinary", icon: Home },
  { title: "Appointments", href: "/veterinary/appointments", icon: Calendar },
  { title: "Patients", href: "/veterinary/patients", icon: Users },
  { title: "Tracking", href: "/veterinary/tracking", icon: Activity },
  { title: "Consultations", href: "/veterinary/consultations", icon: ClipboardList },
  { title: "Messages", href: "/veterinary/messages", icon: MessageSquare },
  { title: "Settings", href: "/veterinary/settings", icon: Settings },
]

interface VeterinarySidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

export function VeterinarySidebar({ isOpen, onClose, isMobile }: VeterinarySidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out",
      isMobile ? (
        isOpen ? "translate-x-0" : "-translate-x-full"
      ) : (
        "translate-x-0"
      )
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <Link href="/veterinary" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-600">VetPortal</span>
        </Link>
        
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}