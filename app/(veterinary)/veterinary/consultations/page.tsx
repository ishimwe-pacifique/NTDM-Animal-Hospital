export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { getConsultations } from "@/lib/actions"
import VeterinaryConsultations from "@/components/dashboard/veterinary-consultations"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Consultation Management - Veterinary Dashboard",
  description: "Manage and respond to veterinary consultation requests.",
}

export default async function ConsultationManagementPage() {
  const currentUser = await getCurrentUser()
  
  // Redirect if not logged in or not a doctor
  if (!currentUser || currentUser.role !== "doctor") {
    redirect("/login")
  }

  const consultations = await getConsultations(currentUser._id.toString())

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Consultation Management</h1>
        <div className="text-sm text-gray-500">
          Manage your consultation requests and appointments
        </div>
      </div>
      <VeterinaryConsultations consultations={consultations} />
    </div>
  )
} 