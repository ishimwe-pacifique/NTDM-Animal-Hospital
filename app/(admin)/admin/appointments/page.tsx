import AdminAppointments from "@/components/admin/admin-appointments"

export const dynamic = 'force-dynamic'

export default function AdminAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Appointment Management</h1>
        <p className="text-gray-600 mt-2">Manage appointments and doctor availability</p>
      </div>
      <AdminAppointments />
    </div>
  )
}