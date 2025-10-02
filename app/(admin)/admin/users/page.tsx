import AdminUsersManagement from "@/components/admin/admin-users-management"

export const dynamic = 'force-dynamic'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage farmers and doctors in your region</p>
      </div>
      <AdminUsersManagement />
    </div>
  )
}