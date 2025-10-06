export const dynamic = "force-dynamic"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Activity, MessageSquare } from "lucide-react"
import { getCurrentUser } from "@/lib/actions/auth"
import { getConsultations } from "@/lib/actions"
import { redirect } from "next/navigation"
import clientPromise from "@/lib/db"

export default async function VeterinaryDashboard() {
  const currentUser = await getCurrentUser()
  
  // Redirect if not logged in or not a doctor
  if (!currentUser || currentUser.role !== "doctor") {
    redirect("/login")
  }

  const consultations = await getConsultations(currentUser._id.toString())
  const pendingConsultations = consultations.filter(c => c.status === "pending")
  const completedCases = consultations.filter(c => c.status === "completed")
  const recentAppointments = consultations.slice(0, 2)

  // Get unread messages count
  let unreadMessages = 0
  let recentMessages: any[] = []
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")
    
    // Get conversations where current user is a participant
    const userConversations = await db.collection("conversations")
      .find({ participants: currentUser._id.toString() })
      .toArray()
    
    const conversationIds = userConversations.map(conv => conv._id.toString())
    
    // Count unread messages from other users in user's conversations only
    if (conversationIds.length > 0) {
      const allUnreadMessages = await db.collection("messages")
        .find({
          conversationId: { $in: conversationIds },
          senderId: { $ne: currentUser._id.toString() },
          $or: [
            { readBy: { $exists: false } },
            { readBy: { $not: { $elemMatch: { userId: currentUser._id.toString() } } } }
          ]
        })
        .toArray()
      
      unreadMessages = allUnreadMessages.length
    }
    
    // Get recent conversations for recent messages
    const conversations = await db.collection("conversations")
      .find({ participants: currentUser._id.toString() })
      .sort({ updatedAt: -1 })
      .limit(3)
      .toArray()
    
    for (const conv of conversations) {
      const messages = await db.collection("messages")
        .find({ conversationId: conv._id.toString() })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray()
      
      if (messages.length > 0) {
        const lastMessage = messages[0]
        
        const otherUser = await db.collection("users")
          .findOne({ _id: { $in: conv.participants.filter((p: string) => p !== currentUser._id.toString()) } })
        
        if (otherUser) {
          recentMessages.push({
            id: lastMessage._id.toString(),
            senderName: otherUser.name,
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            initials: otherUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
          })
        }
      }
    }
  } catch (error) {
    console.error('Error fetching messages:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. {currentUser.name}</h1>
        <p className="text-gray-600">Here's what's happening with your practice today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Consultations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingConsultations.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Cases</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCases.length}</div>
            <p className="text-xs text-muted-foreground">Successfully treated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessages}</div>
            <p className="text-xs text-muted-foreground">Unread</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{appointment.service} - Consultation</p>
                      <p className="text-sm text-gray-500">{appointment.fullName} - {appointment.date}</p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent appointments</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.length > 0 ? (
                recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{message.initials}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{message.senderName}</p>
                      <p className="text-sm text-gray-500 truncate">{message.content}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent messages</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}