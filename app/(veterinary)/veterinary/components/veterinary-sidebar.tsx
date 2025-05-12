"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  ClipboardList,
  Home,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react"

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

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/veterinary" className="flex items-center gap-2 font-semibold">
          <span>Veterinary Portal</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
            >
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href && "bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
} 