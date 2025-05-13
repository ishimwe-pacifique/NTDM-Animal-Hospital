"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "./user-nav"
import { Bell, User } from "lucide-react"
import { useState } from "react"

export function VeterinaryHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/veterinary" },
    { name: "Appointments", href: "/veterinary/appointments" },
    { name: "Patients", href: "/veterinary/patients" },
    { name: "Consultations", href: "/veterinary/consultations" },
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Button
          variant="ghost"
          onClick={toggleMobileMenu}
          className="mr-2 px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <User className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="mr-4 hidden lg:flex flex-1">
          <Link href="/veterinary" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-primary">
              Veterinary Portal
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === item.href ? "text-foreground font-semibold" : "text-foreground/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile title - show only on small devices */}
        <div className="lg:hidden flex-1 flex justify-center">
          <Link href="/veterinary" className="font-bold text-primary text-sm sm:text-base truncate max-w-[200px]">
            Veterinary Portal
          </Link>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <UserNav />
        </div>
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border">
          <nav className="grid divide-y divide-border">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 px-4 ${
                  pathname === item.href 
                    ? "bg-muted font-medium" 
                    : "hover:bg-muted/50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
} 