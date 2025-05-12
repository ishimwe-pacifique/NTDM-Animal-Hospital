export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { VeterinaryHeader } from "./veterinary/components/veterinary-header"
import { VeterinarySidebar } from "./veterinary/components/veterinary-sidebar"

export default async function VeterinaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user || user.role !== "doctor") {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <VeterinaryHeader />
      <div className="flex flex-1">
        <VeterinarySidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 