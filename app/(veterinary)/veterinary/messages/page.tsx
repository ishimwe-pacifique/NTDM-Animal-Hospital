import { MessagesPanel } from "@/components/dashboard/messages-panel"

export default function VeterinaryMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with farmers and pet owners about their animals
        </p>
      </div>
      
      <MessagesPanel />
    </div>
  )
}