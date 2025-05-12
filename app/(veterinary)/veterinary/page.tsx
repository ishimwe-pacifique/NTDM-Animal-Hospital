export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getConsultations } from "@/lib/actions"
import VeterinaryConsultations from "@/components/dashboard/veterinary-consultations"
import ClientWrapper from "./components/client-wrapper"

export default async function VeterinaryDashboard() {
  const currentUser = await getCurrentUser()
  
  // Redirect if not logged in or not a doctor
  if (!currentUser || currentUser.role !== "doctor") {
    redirect("/login")
  }

  const consultations = await getConsultations(currentUser._id.toString())
  const pendingConsultations = consultations.filter(c => c.status === "pending")

  return (
    <ClientWrapper>
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Veterinary Dashboard</h1>
          <div className="text-sm text-gray-500">
            Welcome back, Dr. {currentUser.name}
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingConsultations.length}</div>
            <p className="text-xs text-muted-foreground">
              New consultation requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.length}</div>
            <p className="text-xs text-muted-foreground">
              All time consultations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {consultations.filter(c => c.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully treated cases
            </p>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Consultations</h2>
          <VeterinaryConsultations consultations={consultations.slice(0, 5)} />
        </div>
      </div>
    </ClientWrapper>
  )
} 