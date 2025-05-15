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
} from "lucide-react"
import { useEffect, useState } from "react"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/veterinary",
    icon: Home,
  },
  {
    title: "Appointments",
    href: "/veterinary/appointments",
    icon: Calendar,
  },
  {
    title: "Patients",
    href: "/veterinary/patients",
    icon: Users,
  },
  {
    title: "Tracking",
    href: "/veterinary/tracking",
    icon: Activity,
  },
  {
    title: "Consultations",
    href: "/veterinary/consultations",
    icon: ClipboardList,
  },
  {
    title: "Messages",
    href: "/veterinary/messages",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/veterinary/settings",
    icon: Settings,
  },
]

export function VeterinarySidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      // Auto-collapse on smaller desktop screens
      setCollapsed(window.innerWidth < 1280 && window.innerWidth >= 768)
    }

    // Initial check
    checkScreenSize()

    // Add listener for screen resize
    window.addEventListener('resize', checkScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  // Hide completely on mobile as we'll use the header dropdown instead
  if (isMobile) return null

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-background transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-14 items-center border-b px-4 justify-between">
        {!collapsed && (
          <Link href="/veterinary" className="flex items-center gap-2 font-semibold truncate">
            <span className="text-primary">Veterinary Portal</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className={cn(
            "h-8 w-8",
            collapsed && "mx-auto"
          )}
        >
          <Settings className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180"
          )} />
          <span className="sr-only">
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium gap-1">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.title : undefined}
            >
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed ? "h-10 w-10 p-0 justify-center" : "gap-2",
                  pathname === item.href && "bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {!collapsed && item.title}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
} 