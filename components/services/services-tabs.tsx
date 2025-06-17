"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ServiceCard from "@/components/services/service-card"
import { Activity, Video, ShieldAlert, ShoppingBag, Pill, Wheat, FileText } from "lucide-react"

// Service data
const services = {
  tracking: [
    {
      id: "t1",
      name: "Basic GPS Tracking",
      description: "Real-time location tracking for your livestock with mobile app access.",
      price: 15000,
      duration: "Device + 3 months service",
      image: "/tracking/track2.png",
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
      image: "/tracking/track3.png",
    },
  ],
  consultations: [
    {
      id: "c1",
      name: "General Veterinary Consultation",
      description: "Comprehensive health check-up and consultation for any animal.",
      price: 5000,
      duration: "30 min",
      image: "/consultations/cons1.png",
    },
    {
      id: "c2",
      name: "Virtual Consultation",
      description: "Connect with our veterinarians remotely via video call.",
      price: 3000,
      duration: "20 min",
      image: "/consultations/cons2.jpg",
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
      image: "/consultations/cons3.jpg",
    },
  ],
  monitoring: [
    {
      id: "m1",
      name: "Disease Screening",
      description: "Comprehensive testing for common livestock and pet diseases.",
      price: 7000,
      duration: "Results in 48 hours",
      image: "/monitoring/vac2.jpg",
    },
    {
      id: "m2",
      name: "Vaccination Program",
      description: "Scheduled vaccinations with reminders and health tracking.",
      price: 10000,
      duration: "Annual program",
      image: "/monitoring/vac1.png",
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
      image: "/services/pet4.jpg",
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
      image: "/services/pet2.jpg",
    },
  ],
  drugs: [
    {
      id: "d1",
      name: "Basic Veterinary Kit",
      description: "Essential medications for common animal health issues.",
      price: 8000,
      duration: "30 day supply",
      image:
        "https://th.bing.com/th/id/OIP.uvzZ5gbvONhZ_Iej4Q11TAHaEo?r=0&pid=ImgDet&w=199&h=124&c=7&dpr=1.5",
    },
    {
      id: "d2",
      name: "Antibiotics Package",
      description: "Wide range of antibiotics for bacterial infections in livestock.",
      price: 12000,
      duration: "Various sizes available",
      image:
        "https://jpabs.org/800/600/http/images.jdmagicbox.com/comp/sangli/h1/9999px233.x233.130402132127.i2h1/catalogue/basawant-pharma-islampur-sangli-sangli-veterinary-medicine-retailers-ksnqys2.jpg",
    },
    {
      id: "d3",
      name: "Vaccines Package",
      description: "Preventative vaccines for common livestock diseases.",
      price: 15000,
      duration: "10 doses",
      image:
        "https://5.imimg.com/data5/FB/QY/MY-4841311/veterinary-vaccines-500x500.jpg",
    },
    {
      id: "d4",
      name: "Pet Care Package",
      description: "Medications and supplements specifically for dogs and cats.",
      price: 6000,
      duration: "Monthly supply",
      image:
        "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
    {
      id: "d5",
      name: "Dewormers",
      description: "Effective deworming medications for all types of animals.",
      price: 5000,
      duration: "10 treatments",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
  ],
  feeds: [
    {
      id: "f1",
      name: "Premium Cattle Feed",
      description: "High-nutrition feed for dairy and beef cattle.",
      price: 8000,
      duration: "50kg bag",
      image:
        "https://ruralhq.co.nz/wp-content/uploads/2019/03/shutterstock_659176180.jpg",
    },
    {
      id: "f2",
      name: "Poultry Feed",
      description: "Balanced feed for layers and broilers.",
      price: 6000,
      duration: "25kg bag",
      image:
        "https://th.bing.com/th/id/OIP.Qmi6sQ8jivUD_KCoVs-O6wHaEz?r=0&pid=ImgDet&w=199&h=128&c=7&dpr=1.5",
    },
    {
      id: "f3",
      name: "Goat & Sheep Feed",
      description: "Specially formulated for small ruminants.",
      price: 5500,
      duration: "25kg bag",
      image:
        "https://th.bing.com/th/id/OIP.gc7yiDLMGglfb9tM-ZZegwHaE7?r=0&pid=ImgDet&w=199&h=132&c=7&dpr=1.5",
    },
    {
      id: "f4",
      name: "Organic Feed Supplement",
      description: "Natural additives to boost animal health and productivity.",
      price: 3000,
      duration: "5kg package",
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
    {
      id: "f5",
      name: "Pet Food",
      description: "High-quality food for dogs and cats.",
      price: 4000,
      duration: "10kg bag",
      image:
        "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
     {
      id: "f6",
      name: "Pig",
      description: "High-quality food for pig.",
      price: 10000,
      duration: "10kg bag",
      image:
        "https://www.pigprogress.net/app/uploads/2021/12/001_198_IMG_PPR_25_EXPERT_FM_Feedstructureinswinediets-1024x683.jpg",
    },
  ],
  government: [
    {
      id: "g1",
      name: "Farm Registration Assistance",
      description: "Help with all government farm registration requirements.",
      price: 10000,
      duration: "Complete package",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
    {
      id: "g2",
      name: "Export Certification",
      description: "Preparation of all documents for animal product exports.",
      price: 15000,
      duration: "Per certification",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
    {
      id: "g3",
      name: "Inspection Preparation",
      description: "Get your farm ready for government inspections.",
      price: 12000,
      duration: "Includes follow-up",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
    {
      id: "g4",
      name: "Subsidy Application",
      description: "Assistance with agricultural subsidy applications.",
      price: 8000,
      duration: "Per application",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
    {
      id: "g5",
      name: "Disease Reporting",
      description: "Proper documentation and reporting of notifiable diseases.",
      price: 5000,
      duration: "Per report",
      image:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&h=350&fit=crop&crop=focalpoint&auto=format&q=80",
    },
  ],
Ai: [

  "Coming Soon"
   
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
            <TabsTrigger value="drugs" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              <span>Pharmacy</span>
            </TabsTrigger>
            <TabsTrigger value="feeds" className="flex items-center gap-2">
              <Wheat className="h-4 w-4" />
              <span>Feeds</span>
            </TabsTrigger>
            <TabsTrigger value="government" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Gov Support</span>
            </TabsTrigger>
           
            <TabsTrigger value="Ai" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>AI-based disease prediction</span>
            </TabsTrigger>

          </TabsList>
        </div>

        <TabsContent value="tracking" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.tracking.map((service) => (
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

        <TabsContent value="drugs" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.drugs.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feeds" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.feeds.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="government" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.government.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
