import { getAllConsultations } from "@/lib/actions/superadmin"
import ConsultationsManagement from "@/components/superadmin/consultations-management"

export const dynamic = 'force-dynamic'
export default async function ConsultationsManagementPage() {
  const consultations = await getAllConsultations()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Consultation Management</h1>
        <p className="text-gray-600 mt-2">Review and monitor all consultations</p>
      </div>

      <ConsultationsManagement consultations={consultations} />
    </div>
  )
}
