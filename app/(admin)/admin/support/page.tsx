import AdminSupport from "@/components/admin/admin-support"

export const dynamic = 'force-dynamic'

export default function AdminSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Support & Communication</h1>
        <p className="text-gray-600 mt-2">Handle user support tickets and communications</p>
      </div>
      <AdminSupport />
    </div>
  )
}