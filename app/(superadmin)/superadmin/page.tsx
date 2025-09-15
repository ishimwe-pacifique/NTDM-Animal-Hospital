import { getSystemStats } from "@/lib/actions/superadmin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Activity,
  Server,
  Mail,
  Database,
  Shield,
  Settings,
  ArrowUpRight,
  MoreVertical
} from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function SuperAdminDashboard() {
  const stats = await getSystemStats()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500'
      case 'warning':
        return 'bg-amber-500'
      case 'offline':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  const recentActivities = [
    {
      id: 1,
      type: 'user',
      message: 'New farmer registered',
      time: '2 minutes ago',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'consultation',
      message: 'Consultation approved by Dr. Smith',
      time: '5 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'system',
      message: 'Database backup completed',
      time: '1 hour ago',
      icon: Database,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'consultation',
      message: 'New consultation request submitted',
      time: '2 hours ago',
      icon: FileText,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-base">
                Manage users, consultations, and system settings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                System Healthy
              </Badge>
              <Button variant="outline" size="sm" className="gap-2">
                <MoreVertical className="h-4 w-4" />
                Actions
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Total Users</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {stats.totalUsers.toLocaleString()}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-700">
                  Farmers: {stats.userStats.farmer || 0} | Doctors: {stats.userStats.doctor || 0}
                </span>
                <TrendingUp className="h-3 w-3 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Total Consultations</CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {stats.totalConsultations.toLocaleString()}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-700">All time consultations</span>
                <ArrowUpRight className="h-3 w-3 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900">Approved</CardTitle>
              <div className="p-2 bg-emerald-500 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 mb-1">
                {(stats.consultationStats.accepted || 0).toLocaleString()}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-700">Approved consultations</span>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5">
                  +12%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100/50 hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-900">Rejected</CardTitle>
              <div className="p-2 bg-red-500 rounded-lg">
                <XCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900 mb-1">
                {(stats.consultationStats.rejected || 0).toLocaleString()}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-red-700">Rejected consultations</span>
                <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs px-2 py-0.5">
                  -3%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity - Takes 2 columns on xl screens */}
          <Card className="xl:col-span-2 border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                  <CardDescription>Latest system activities and events</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50/80 transition-colors duration-150">
                    <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-5">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health - Takes 1 column on xl screens */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">System Health</CardTitle>
                  <CardDescription>Current system status</CardDescription>
                </div>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Database className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">Database</span>
                      <p className="text-xs text-gray-500">Primary & Backup</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      Online
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">Authentication</span>
                      <p className="text-xs text-gray-500">Auth Server</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      Online
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">Email Service</span>
                      <p className="text-xs text-gray-500">SMTP Gateway</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      Online
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Server className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Server Performance</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-600">CPU Usage</span>
                      <div className="font-medium text-blue-900">23%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Memory</span>
                      <div className="font-medium text-blue-900">67%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200">
            <Users className="h-5 w-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-sm">Manage Users</div>
              <div className="text-xs text-gray-500">Add, edit, or remove users</div>
            </div>
          </Button>

          <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2 hover:bg-green-50 hover:border-green-200 transition-all duration-200">
            <FileText className="h-5 w-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-sm">Review Consultations</div>
              <div className="text-xs text-gray-500">Monitor consultation quality</div>
            </div>
          </Button>

          <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200">
            <Activity className="h-5 w-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-sm">System Analytics</div>
              <div className="text-xs text-gray-500">View detailed reports</div>
            </div>
          </Button>

          <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2 hover:bg-gray-50 hover:border-gray-200 transition-all duration-200">
            <Settings className="h-5 w-5 text-gray-600" />
            <div className="text-left">
              <div className="font-medium text-sm">Settings</div>
              <div className="text-xs text-gray-500">Configure system settings</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}