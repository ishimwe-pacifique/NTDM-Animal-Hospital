import { MessagesPanel } from "@/components/dashboard/messages-panel"

export default function VeterinaryMessagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-purple-600 rounded-lg">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Patient Communications</h1>
            <p className="text-purple-600 font-medium">Secure Messaging System</p>
          </div>
        </div>
        <p className="text-gray-600 ml-14">Communicate securely with farmers about their animals' health</p>
      </div>
      
      <MessagesPanel />
    </div>
  )
}