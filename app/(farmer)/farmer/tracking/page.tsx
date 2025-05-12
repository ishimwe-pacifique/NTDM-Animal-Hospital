import type { Metadata } from "next"
import TrackingDashboard from "@/components/dashboard/tracking-dashboard"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Tracking Data - NTDM Animal Hospital",
  description: "Monitor your animals' location and health data in real-time.",
}

export default async function TrackingPage() {
  const currentUser = await getCurrentUser()
  
  // Redirect if not logged in or not a farmer
  if (!currentUser || currentUser.role !== "farmer") {
    redirect("/login")
  }
  
  return (
    <div className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">Animal Tracking Data</h1>
      <TrackingDashboard userId={currentUser._id.toString()} />
    </div>
  )
}
