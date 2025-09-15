import { getAllUsers } from "@/lib/actions/superadmin"
import UsersManagement from "@/components/superadmin/users-management"

export const dynamic = 'force-dynamic'
export default async function UsersManagementPage() {
  const users = await getAllUsers()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage all users in the system</p>
      </div>

      <UsersManagement users={users} />
    </div>
  )
}
