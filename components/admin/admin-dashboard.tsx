"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, Calendar, MessageSquare, TrendingUp, AlertCircle, Plus, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

type DashboardData = {
  stats: {
    totalUsers: number
    activeUsers: number
    growthPercentage: number
    consultations: number
    supportTickets: number
    contentItems: number
  }
  recentAlerts: Array<{
    id: string
    type: string
    title: string
    description: string
    priority: string
    createdAt: string
  }>
  performance: {
    userSatisfaction: number
    responseTime: string
    resolutionRate: number
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin-dashboard')
      const result = await response.json()
      
      if (response.ok) {
        setData(result)
      } else {
        setError(result.error || 'Failed to fetch data')
      }
    } catch (error) {
      setError('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || 'No data available'}</p>
        <Button onClick={fetchDashboardData} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100">Here's what's happening in your region today</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="secondary" asChild>
              <Link href="/admin/users">
                <Plus className="h-4 w-4 mr-2" />
                Add New User
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regional Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+{data.stats.growthPercentage}% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">{data.stats.totalUsers - data.stats.activeUsers} inactive</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.supportTickets}</div>
            <p className="text-xs text-muted-foreground">All resolved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recentAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                Recent Alerts
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/support">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentAlerts.length > 0 ? (
                data.recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-blue-800">{alert.title}</p>
                      <p className="text-xs text-blue-600 mt-1">{alert.description}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-200" asChild>
                      <Link href="/admin/users">
                        View
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent alerts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">User Satisfaction</span>
                  <span className="text-sm font-medium text-green-600">{data.performance.userSatisfaction}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${data.performance.userSatisfaction}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Response Time</span>
                  <span className="text-sm font-medium text-blue-600">{data.performance.responseTime}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Resolution Rate</span>
                  <span className="text-sm font-medium text-green-600">{data.performance.resolutionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${data.performance.resolutionRate}%`}}></div>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" asChild>
              <Link href="/admin/reports">
                View Detailed Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/admin/users" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <Users className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Manage Users</h3>
                  <p className="text-sm text-gray-500">Add, edit, or suspend users</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/admin/appointments" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <Calendar className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Appointments</h3>
                  <p className="text-sm text-gray-500">Schedule and manage visits</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/admin/support" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <MessageSquare className="h-8 w-8 text-orange-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Support</h3>
                  <p className="text-sm text-gray-500">Handle tickets and issues</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/admin/content" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <FileText className="h-8 w-8 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Content</h3>
                  <p className="text-sm text-gray-500">Manage posts and services</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}