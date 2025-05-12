import type { Metadata } from "next"
import MessagesInbox from "@/components/dashboard/messages-inbox"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Messages - NTDM Animal Hospital",
  description: "Communicate with NTDM Animal Hospital veterinarians and staff.",
}

export default async function MessagesPage() {
  const currentUser = await getCurrentUser()
  
  // Redirect if not logged in or not a farmer
  if (!currentUser || currentUser.role !== "farmer") {
    redirect("/login")
  }
  
  return (
    <div className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">Messages</h1>
      <MessagesInbox userId={currentUser._id.toString()} />
    </div>
  )
}
