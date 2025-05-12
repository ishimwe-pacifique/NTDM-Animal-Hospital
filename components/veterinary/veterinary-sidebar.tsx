"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Calendar,
  ClipboardList,
  Home,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/veterinary", icon: Home },
  { name: "Appointments", href: "/veterinary/appointments", icon: Calendar },
  { name: "Patients", href: "/veterinary/patients", icon: Users },
  { name: "Consultations", href: "/veterinary/consultations", icon: MessageSquare },
  { name: "Reports", href: "/veterinary/reports", icon: ClipboardList },
  { name: "Settings", href: "/veterinary/settings", icon: Settings },
]

export default function VeterinarySidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r h-[calc(100vh-4rem)]">
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 