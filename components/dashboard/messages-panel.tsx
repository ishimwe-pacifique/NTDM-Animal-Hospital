"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send } from "lucide-react"

interface MessagesPanelProps {
  userId?: string;
}

// Sample data - in a real app, this would come from your database
const conversations = [
  {
    id: "1",
    contact: "Dr. Smith",
    avatar: "DS",
    lastMessage: "Your cow is doing well after the treatment.",
    time: "10:30 AM",
    unread: true,
  },
  {
    id: "2",
    contact: "Dr. Johnson",
    avatar: "DJ",
    lastMessage: "Please bring your sheep for a follow-up next week.",
    time: "Yesterday",
    unread: false,
  },
]

const messages = [
  { id: "1", content: "Hello, how is my cow doing?", time: "10:15 AM", isMe: true },
  {
    id: "2",
    content: "Your cow is responding well to treatment. The antibiotics are working effectively.",
    time: "10:20 AM",
    isMe: false,
  },
  { id: "3", content: "That's great news! When can I pick her up?", time: "10:25 AM", isMe: true },
  {
    id: "4",
    content: "You can come tomorrow morning. We just want to monitor her for one more day.",
    time: "10:30 AM",
    isMe: false,
  },
]

export function MessagesPanel({ userId }: MessagesPanelProps) {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    // In a real app, you would save the message to your database here
    // For now, we'll just clear the input
    setNewMessage("")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
      {/* Conversations List */}
      <Card className="md:col-span-1 overflow-hidden">
        <div className="p-4 border-b">
          <Input placeholder="Search messages..." className="w-full" />
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation.id === conversation.id ? "bg-primary/5" : ""
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-start space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt={conversation.contact} />
                  <AvatarFallback>{conversation.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold truncate">{conversation.contact}</h4>
                    <div className="flex items-center">
                      {conversation.unread && <Badge className="mr-2 bg-primary text-white">New</Badge>}
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Messages */}
      <Card className="md:col-span-2 flex flex-col">
        <div className="p-4 border-b flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt={selectedConversation.contact} />
            <AvatarFallback>{selectedConversation.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{selectedConversation.contact}</h3>
            <p className="text-xs text-gray-500">Last active: 5 minutes ago</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isMe ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.isMe ? "text-primary-foreground/70" : "text-gray-500"}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
