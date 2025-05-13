export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { VeterinaryHeader } from "./veterinary/components/veterinary-header"
import { VeterinarySidebar } from "./veterinary/components/veterinary-sidebar"
import ClientManifestHelper from "./page-client-manifest"

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
    <div className="flex min-h-screen flex-col bg-background">
      <VeterinaryHeader />
      <div className="flex flex-1 overflow-hidden">
        <VeterinarySidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <ClientManifestHelper />
          {children}
        </main>
      </div>
    </div>
  )
} 