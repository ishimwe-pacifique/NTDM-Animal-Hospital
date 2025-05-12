"use client"

import { Button } from "@/components/ui/button"
import { logoutUser } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import { Bell, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface VeterinaryHeaderProps {
  user: {
    _id: any;
    name?: string;
    email?: string;
    [key: string]: any;
  }
}

export default function VeterinaryHeader({ user }: VeterinaryHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutUser()
    router.push("/login")
  }

  return (
    <header className="bg-white border-b">
      <div className="flex h-16 items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Veterinary Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{user.name}</DropdownMenuItem>
              <DropdownMenuItem>{user.email}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
} 