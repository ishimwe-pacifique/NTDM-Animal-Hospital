export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { getConsultations } from "@/lib/actions"
import VeterinaryConsultations from "@/components/dashboard/veterinary-consultations"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import ClientWrapper from "../components/client-wrapper"

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
    <ClientWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-orange-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Clinical Consultations</h1>
              <p className="text-orange-600 font-medium">Patient Case Management</p>
            </div>
          </div>
          <p className="text-gray-600 ml-14">Review, diagnose, and manage animal health consultations</p>
        </div>
        <VeterinaryConsultations consultations={consultations} />
      </div>
    </ClientWrapper>
  )
} 