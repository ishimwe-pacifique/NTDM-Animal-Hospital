"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { updateConsultationStatus } from "@/lib/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell } from "lucide-react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Consultation {
  _id: string
  fullName: string
  phoneNumber: string
  service: string
  date: string
  time: string
  type: string
  status: string
  createdAt: string
  doctor: any
  feedback?: string
}

interface VeterinaryConsultationsProps {
  consultations: Consultation[]
}

export default function VeterinaryConsultations({ consultations }: VeterinaryConsultationsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [feedback, setFeedback] = useState("")
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [actionType, setActionType] = useState<"accept" | "reject" | "complete" | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)

  const handleStatusUpdate = async (id: string, newStatus: string, feedbackText?: string) => {
    setIsUpdating(true)
    try {
      // Make sure we're passing valid parameters
      if (!id || !newStatus) {
        console.error("Invalid parameters for status update");
        return;
      }
      
      // Ensure feedback is a string or undefined, not null
      const sanitizedFeedback = feedbackText || undefined;
      
      const result = await updateConsultationStatus(id, newStatus, sanitizedFeedback);
      if (result.success) {
        setSelectedConsultation(null);
        setFeedback("");
        setShowFeedbackForm(false);
        setActionType(null);
        router.refresh();
      } else {
        console.error("Failed to update consultation status");
      }
    } catch (error) {
      console.error("Error updating consultation status:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  const viewConsultationDetails = (consultation: Consultation) => {
    console.log("Opening dialog for consultation:", consultation._id);
    setSelectedConsultation(consultation);
    setShowFeedbackForm(false);
    setIsDetailsDialogOpen(true);
  };

  const initiateStatusUpdate = (consultation: Consultation, type: "accept" | "reject" | "complete") => {
    setSelectedConsultation(consultation);
    setActionType(type);
    setShowFeedbackForm(true);
    setIsDetailsDialogOpen(false);
    setIsFeedbackDialogOpen(true);
  };

  const submitFeedback = () => {
    if (!selectedConsultation || !actionType) {
      console.error("Missing consultation or action type");
      return;
    }
    
    const newStatus = actionType === "accept" ? "accepted" : 
                      actionType === "reject" ? "rejected" : 
                      "completed";
    
    // Ensure we have a valid ID
    if (!selectedConsultation._id) {
      console.error("Missing consultation ID");
      return;
    }
                      
    handleStatusUpdate(selectedConsultation._id, newStatus, feedback);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const pendingConsultations = consultations.filter(c => c.status === "pending")
  const acceptedConsultations = consultations.filter(c => c.status === "accepted")
  const rejectedConsultations = consultations.filter(c => c.status === "rejected")
  const completedConsultations = consultations.filter(c => c.status === "completed")

  const ConsultationTable = ({ consultations, showActions = true }: { consultations: Consultation[], showActions?: boolean }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Farmer</TableHead>
            <TableHead>Animal</TableHead>
            <TableHead>Symptoms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultations.map((consultation) => (
            <TableRow key={consultation._id}>
              <TableCell>
                <div>
                  <div className="font-medium">{consultation.fullName}</div>
                  <div className="text-sm text-gray-500">{consultation.phoneNumber}</div>
                </div>
              </TableCell>
              <TableCell>{consultation.service}</TableCell>
              <TableCell className="max-w-xs truncate">
                {consultation.type}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(consultation.status)}>
                  {consultation.status}
                </Badge>
              </TableCell>
              <TableCell>
                {consultation.date}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewConsultationDetails(consultation)}
                  >
                    View Details
                  </Button>
                  {consultation.status === "pending" && showActions && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => initiateStatusUpdate(consultation, "accept")}
                        disabled={isUpdating}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => initiateStatusUpdate(consultation, "reject")}
                        disabled={isUpdating}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {consultation.status === "accepted" && showActions && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => initiateStatusUpdate(consultation, "complete")}
                      disabled={isUpdating}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Consultation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Pending ({pendingConsultations.length})
              </TabsTrigger>
              <TabsTrigger value="accepted" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Accepted ({acceptedConsultations.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Rejected ({rejectedConsultations.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Completed ({completedConsultations.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingConsultations.length > 0 ? (
                <ConsultationTable consultations={pendingConsultations} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No pending consultations</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="accepted">
              {acceptedConsultations.length > 0 ? (
                <ConsultationTable consultations={acceptedConsultations} showActions={true} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No accepted consultations</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rejected">
              {rejectedConsultations.length > 0 ? (
                <ConsultationTable consultations={rejectedConsultations} showActions={false} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No rejected consultations</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {completedConsultations.length > 0 ? (
                <ConsultationTable consultations={completedConsultations} showActions={false} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No completed consultations</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Debug information */}
      <div className="p-4 bg-gray-100 text-xs">
        Selected consultation: {selectedConsultation ? selectedConsultation._id : 'none'}, 
        Show feedback form: {showFeedbackForm ? 'yes' : 'no'}, 
        Details dialog open: {isDetailsDialogOpen ? 'yes' : 'no'},
        Feedback dialog open: {isFeedbackDialogOpen ? 'yes' : 'no'}
      </div>

      {/* Test button to verify dialog works */}
      <div className="p-4">
        <Button onClick={() => {
          if (consultations.length > 0) {
            viewConsultationDetails(consultations[0]);
          }
        }}>
          Test Dialog
        </Button>
      </div>

      {/* Consultation Details Dialog - Simplified logic */}
      <Dialog 
        open={isDetailsDialogOpen} 
        onOpenChange={setIsDetailsDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Consultation Details</DialogTitle>
            <DialogDescription>
              View the details of this consultation request
            </DialogDescription>
          </DialogHeader>
          
          {selectedConsultation && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-semibold">Farmer:</div>
                <div className="col-span-2">{selectedConsultation.fullName}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-semibold">Phone Number:</div>
                <div className="col-span-2">{selectedConsultation.phoneNumber}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-semibold">Animal:</div>
                <div className="col-span-2">{selectedConsultation.service}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-semibold">Symptoms:</div>
                <div className="col-span-2">{selectedConsultation.type}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-semibold">Date:</div>
                <div className="col-span-2">{selectedConsultation.date} {selectedConsultation.time}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-semibold">Status:</div>
                <div className="col-span-2">
                  <Badge className={getStatusColor(selectedConsultation.status)}>
                    {selectedConsultation.status}
                  </Badge>
                </div>
              </div>
              {selectedConsultation.feedback && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-semibold">Feedback:</div>
                  <div className="col-span-2">{selectedConsultation.feedback}</div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            {selectedConsultation?.status === "pending" && (
              <>
                <Button 
                  variant="default" 
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    initiateStatusUpdate(selectedConsultation, "accept");
                  }}
                >
                  Accept with Feedback
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    initiateStatusUpdate(selectedConsultation, "reject");
                  }}
                >
                  Reject with Feedback
                </Button>
              </>
            )}
            {selectedConsultation?.status === "accepted" && (
              <Button 
                variant="default" 
                onClick={() => {
                  setIsDetailsDialogOpen(false);
                  initiateStatusUpdate(selectedConsultation, "complete");
                }}
              >
                Mark as Complete
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Form Dialog - Simplified state logic */}
      <Dialog 
        open={isFeedbackDialogOpen} 
        onOpenChange={setIsFeedbackDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept" ? "Accept Consultation" :
               actionType === "reject" ? "Reject Consultation" :
               "Mark Consultation as Complete"}
            </DialogTitle>
            <DialogDescription>
              Provide feedback to the farmer about this consultation
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="feedback">Feedback for the farmer</Label>
              <Textarea
                id="feedback"
                placeholder="Enter your feedback, instructions, or observations here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                submitFeedback();
                setIsFeedbackDialogOpen(false);
              }}
              disabled={isUpdating}
            >
              Submit
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsFeedbackDialogOpen(false);
                setFeedback("");
                setActionType(null);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 