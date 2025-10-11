export const dynamic = "force-dynamic"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getCurrentUser } from "@/lib/actions/auth"
import { getConsultations } from "@/lib/actions"
import { redirect } from "next/navigation"
import clientPromise from "@/lib/db"
import { MessageSquare, Phone, MapPin, Heart, User, Stethoscope, Activity, PawPrint } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-red-500 rounded-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Patient Registry</h1>
            <p className="text-red-600 font-medium">Animal Care Records</p>
          </div>
        </div>
        <p className="text-gray-600 ml-14">Comprehensive patient management and medical history</p>
      </div>

      {/* Clinical Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Patients</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{patients.length}</div>
            <p className="text-xs text-gray-500 mt-1">Registered farmers</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Active Patients</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <Heart className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activePatients.length}</div>
            <p className="text-xs text-gray-500 mt-1">Recent consultations</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Animals Under Care</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <PawPrint className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{totalAnimals}</div>
            <p className="text-xs text-gray-500 mt-1">Different species</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Cases</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Stethoscope className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{consultations.length}</div>
            <p className="text-xs text-gray-500 mt-1">Medical consultations</p>
          </CardContent>
        </Card>
      </div>

      {/* Patient Records */}
      <div className="grid gap-6">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <Card key={patient.id} className="shadow-md border-0 bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-blue-200">
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold">
                          {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        patient.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{patient.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-blue-500" />
                          <span>{patient.phone}</span>
                        </div>
                        {patient.district && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-green-500" />
                            <span>{patient.district}, {patient.sector}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={`px-3 py-1 font-medium ${
                      patient.status === 'active' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {patient.status === 'active' ? '🟢 Active' : '⚪ Inactive'}
                    </Badge>
                    <Link href={`/veterinary/messages`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <PawPrint className="h-4 w-4 text-purple-600" />
                      <h4 className="font-semibold text-gray-700">Animals Under Care</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {patient.animals.length > 0 ? (
                        patient.animals.map((animal, index) => (
                          <Badge key={index} className="bg-purple-100 text-purple-700 border border-purple-200">
                            {animal}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 italic">No animals recorded</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-orange-600" />
                      <h4 className="font-semibold text-gray-700">Medical Summary</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Cases:</span>
                        <span className="font-semibold text-orange-600">{patient.totalConsultations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Visit:</span>
                        <span className="font-semibold text-gray-700">
                          {new Date(patient.lastConsultation).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-gray-700">Recent Cases</h4>
                    </div>
                    <div className="space-y-2">
                      {patient.recentConsultations.map((consultation, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">{consultation.service}</span>
                          <Badge className={`text-xs ${
                            consultation.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                            consultation.status === 'pending' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                            'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}>
                            {consultation.status.toUpperCase()}
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
          <Card className="shadow-md border-0 bg-white">
            <CardContent className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Patients Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Your patient registry will appear here once farmers start consulting with you. 
                Each consultation creates a comprehensive medical record.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}