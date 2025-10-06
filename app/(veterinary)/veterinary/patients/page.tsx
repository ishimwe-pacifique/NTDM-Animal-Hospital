export const dynamic = "force-dynamic"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getCurrentUser } from "@/lib/actions/auth"
import { getConsultations } from "@/lib/actions"
import { redirect } from "next/navigation"
import clientPromise from "@/lib/db"
import { MessageSquare, Phone, MapPin, Calendar, User } from "lucide-react"
import Link from "next/link"
import { ObjectId } from "mongodb"

interface Patient {
  id: string
  name: string
  phone: string
  district: string
  sector: string
  totalConsultations: number
  lastConsultation: string
  status: 'active' | 'inactive'
  animals: string[]
  recentConsultations: any[]
}

export default async function VeterinaryPatientsPage() {
  const currentUser = await getCurrentUser()
  
  if (!currentUser || currentUser.role !== "doctor") {
    redirect("/login")
  }

  const consultations = await getConsultations(currentUser._id.toString())
  
  // Group consultations by farmer to create patient records
  const patientMap = new Map<string, Patient>()
  
  consultations.forEach(consultation => {
    const farmerId = consultation.farmerId
    if (!farmerId) return
    
    if (!patientMap.has(farmerId)) {
      patientMap.set(farmerId, {
        id: farmerId,
        name: consultation.fullName,
        phone: consultation.phoneNumber,
        district: '',
        sector: '',
        totalConsultations: 0,
        lastConsultation: consultation.createdAt,
        status: 'inactive',
        animals: [],
        recentConsultations: []
      })
    }
    
    const patient = patientMap.get(farmerId)!
    patient.totalConsultations++
    patient.recentConsultations.push(consultation)
    
    // Update last consultation date
    if (new Date(consultation.createdAt) > new Date(patient.lastConsultation)) {
      patient.lastConsultation = consultation.createdAt
    }
    
    // Add unique animals
    if (consultation.service && !patient.animals.includes(consultation.service)) {
      patient.animals.push(consultation.service)
    }
  })

  // Get additional patient data from database
  const patients: Patient[] = []
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")
    
    for (const [farmerId, patient] of patientMap) {
      // Get farmer details
      const farmer = await db.collection("users").findOne({ _id: new ObjectId(farmerId) })
      if (farmer) {
        patient.district = farmer.district || ''
        patient.sector = farmer.sector || ''
      }
      
      // Determine if patient is active (consulted in last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      patient.status = new Date(patient.lastConsultation) > thirtyDaysAgo ? 'active' : 'inactive'
      
      // Sort recent consultations by date
      patient.recentConsultations.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      patient.recentConsultations = patient.recentConsultations.slice(0, 3)
      
      patients.push(patient)
    }
  } catch (error) {
    console.error('Error fetching patient details:', error)
  }

  // Sort patients by last consultation date
  patients.sort((a, b) => new Date(b.lastConsultation).getTime() - new Date(a.lastConsultation).getTime())

  const activePatients = patients.filter(p => p.status === 'active')
  const totalAnimals = patients.reduce((sum, p) => sum + p.animals.length, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Patients</h1>
        <p className="text-muted-foreground">
          Manage your patient records and consultation history
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePatients.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnimals}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <div className="grid gap-6">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <Card key={patient.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{patient.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {patient.phone}
                        </div>
                        {patient.district && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {patient.district}, {patient.sector}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                      {patient.status}
                    </Badge>
                    <Link href={`/veterinary/messages`}>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Animals</h4>
                    <div className="flex flex-wrap gap-1">
                      {patient.animals.length > 0 ? (
                        patient.animals.map((animal, index) => (
                          <Badge key={index} variant="outline">{animal}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No animals recorded</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Consultation Stats</h4>
                    <div className="text-sm space-y-1">
                      <div>Total: {patient.totalConsultations}</div>
                      <div>Last: {new Date(patient.lastConsultation).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Recent Consultations</h4>
                    <div className="space-y-1">
                      {patient.recentConsultations.map((consultation, index) => (
                        <div key={index} className="text-sm flex justify-between">
                          <span>{consultation.service}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              consultation.status === 'completed' ? 'bg-green-50 text-green-700' :
                              consultation.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                              'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {consultation.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Patients Yet</h3>
              <p className="text-muted-foreground">
                Patients will appear here once farmers start consulting with you.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}