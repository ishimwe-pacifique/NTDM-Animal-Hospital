export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { getConsultations } from "@/lib/actions"
import VeterinaryConsultations from "@/components/dashboard/veterinary-consultations"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import ClientWrapper from "../components/client-wrapper"

export const metadata: Metadata = {
  title: "Appointments - Veterinary Dashboard",
  description: "Manage and respond to veterinary consultation requests.",
}

export default async function AppointmentsPage() {
  const currentUser = await getCurrentUser()
  
  // Redirect if not logged in or not a doctor
  if (!currentUser || currentUser.role !== "doctor") {
    redirect("/login")
  }

  const consultations = await getConsultations(currentUser._id.toString())

  return (
    <ClientWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <div className="text-sm text-gray-500">
            Manage your consultation requests and appointments
          </div>
        </div>
        <VeterinaryConsultations consultations={consultations} />
      </div>
    </ClientWrapper>
  )
} 