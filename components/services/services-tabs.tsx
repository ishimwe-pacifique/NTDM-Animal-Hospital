"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ServiceCard from "@/components/services/service-card"
import { Activity, Video, ShieldAlert, ShoppingBag } from "lucide-react"

// Service data
const services = {
  tracking: [
    {
      id: "t1",
      name: "Basic GPS Tracking",
      description: "Real-time location tracking for your livestock with mobile app access.",
      price: 15000,
      duration: "Device + 3 months service",
      image:
        "/tracking/track2.png",
    },
    {
      id: "t2",
      name: "Advanced Health Monitoring",
      description: "Track vital signs, activity levels, and health indicators in real-time.",
      price: 25000,
      duration: "Device + 3 months service",
      image:
        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
    {
      id: "t3",
      name: "Herd Management System",
      description: "Comprehensive tracking solution for large herds with analytics dashboard.",
      price: 100000,
      duration: "10 devices + 6 months service",
      image:
        "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
    {
      id: "t4",
      name: "Pet Tracking Collar",
      description: "Lightweight GPS collar for dogs and cats with geofencing alerts.",
      price: 12000,
      duration: "Device + 3 months service",
      image:
        "/tracking/track3.png",
    },
  ],
  consultations: [
    {
      id: "c1",
      name: "General Veterinary Consultation",
      description: "Comprehensive health check-up and consultation for any animal.",
      price: 5000,
      duration: "30 min",
      image:
        "/consultations/cons1.png",
    },
    {
      id: "c2",
      name: "Virtual Consultation",
      description: "Connect with our veterinarians remotely via video call.",
      price: 3000,
      duration: "20 min",
      image:
        "/consultations/cons2.jpg",
    },
    {
      id: "c3",
      name: "Emergency Consultation",
      description: "Immediate attention for urgent animal health issues.",
      price: 8000,
      duration: "Priority service",
      image:
        "https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
    {
      id: "c4",
      name: "Farm Visit",
      description: "Our veterinarians come to your farm for on-site consultations and treatments.",
      price: 15000,
      duration: "2 hours + travel",
      image:
        "/consultations/cons3.jpg",
    },
  ],
  monitoring: [
    {
      id: "m1",
      name: "Disease Screening",
      description: "Comprehensive testing for common livestock and pet diseases.",
      price: 7000,
      duration: "Results in 48 hours",
      image:
        "/monitoring/vac2.jpg",
    },
    {
      id: "m2",
      name: "Vaccination Program",
      description: "Scheduled vaccinations with reminders and health tracking.",
      price: 10000,
      duration: "Annual program",
      image:
        "/monitoring/vac1.png",
    },
    {
      id: "m3",
      name: "Parasite Control",
      description: "Regular monitoring and treatment for internal and external parasites.",
      price: 6000,
      duration: "Quarterly treatment",
      image:
        "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
    {
      id: "m4",
      name: "Reproductive Health Monitoring",
      description: "Track breeding cycles, pregnancy, and reproductive health.",
      price: 8000,
      duration: "Per animal",
      image:
        "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
  ],
  sales: [
    {
      id: "s1",
      name: "Dairy Cattle",
      description: "High-yielding dairy cows with health certification and follow-up care.",
      price: "Variable",
      duration: "Includes delivery",
      image:
        "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
    {
      id: "s2",
      name: "Poultry",
      description: "Healthy chickens for egg production or meat with vaccination history.",
      price: "Variable",
      duration: "Bulk discounts available",
      image:
        "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
    {
      id: "s3",
      name: "Goats and Sheep",
      description: "Quality small ruminants for dairy or meat production.",
      price: "Variable",
      duration: "Health guaranteed",
      image:
        "/services/pet4.jpg",
    },
    {
      id: "s4",
      name: "Pet Adoption",
      description: "Adopt a healthy, vaccinated pet with ongoing veterinary support.",
      price: "Variable",
      duration: "Includes initial check-up",
      image:
        "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
        {
      id: "s5",
      name: "Porks",
      description: "The Best pork Breed and veterinary support.",
      price: "Variable",
      duration: "Includes initial check-up",
      image:
        "/services/pet2.jpg",
    },
  ],
}

export default function ServicesTabs() {
  const [activeTab, setActiveTab] = useState("tracking")

  // Filter services based on active tab
  const getFilteredServices = () => {
    return services[activeTab as keyof typeof services] || []
  }

  return (
    <>
      <Tabs defaultValue="tracking" onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="consultations" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Consultations</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>Monitoring</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Animal Sales</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tracking" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredServices().map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="consultations" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.consultations.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.monitoring.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sales" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.sales.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
