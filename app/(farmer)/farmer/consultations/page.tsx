export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { getConsultations } from "@/lib/actions"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bell } from "lucide-react"

export const metadata: Metadata = {
  title: "My Consultations - Farmer Dashboard",
  description: "Manage your veterinary consultations.",
}

export default async function FarmerConsultationsPage() {
  const currentUser = await getCurrentUser()
  
  // Redirect if not logged in or not a farmer
  if (!currentUser || currentUser.role !== "farmer") {
    redirect("/login")
  }

  // Get consultations for this farmer only
  const consultations = await getConsultations(undefined, currentUser._id.toString())

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Consultations</h1>
        <div className="flex space-x-2">
          <Button asChild size="sm">
            <Link href="/farmer/consultations/new">New Consultation</Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Consultation History</CardTitle>
        </CardHeader>
        <CardContent>
          {consultations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>You don't have any consultations yet.</p>
              <p className="mt-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/farmer/consultations/new">Book a Consultation</Link>
                </Button>
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((consultation) => (
                  <TableRow key={consultation._id}>
                    <TableCell>{consultation.service}</TableCell>
                    <TableCell>{consultation.doctor || "-"}</TableCell>
                    <TableCell>{consultation.date}</TableCell>
                    <TableCell>{consultation.time}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {consultation.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          consultation.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : consultation.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : consultation.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {consultation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="flex-shrink-0" asChild>
                          <Link href={`/farmer/consultations/${consultation._id}`}>
                            View Details
                          </Link>
                        </Button>
                        {consultation.status === "pending" && (
                          <>
                            <Button variant="secondary" size="sm" className="flex-shrink-0" asChild>
                              <Link href={`/farmer/consultations/${consultation._id}/edit`}>
                                Edit
                              </Link>
                            </Button>
                            <Button variant="destructive" size="sm" className="flex-shrink-0" asChild>
                              <Link href={`/farmer/consultations/${consultation._id}/delete`}>
                                Delete
                              </Link>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
