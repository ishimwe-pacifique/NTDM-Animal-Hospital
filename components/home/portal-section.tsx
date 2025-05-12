import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Laptop, MessageSquare, Bell, FileText } from "lucide-react"

const portalFeatures = [
  {
    icon: <Laptop className="h-6 w-6 text-primary" />,
    title: "Animal Management",
    description: "Register and track all your animals in one place with detailed health records and location data.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    title: "Veterinary Consultations",
    description: "Book and manage virtual consultations with our expert veterinarians from anywhere.",
  },
  {
    icon: <Bell className="h-6 w-6 text-primary" />,
    title: "Real-time Alerts",
    description:
      "Receive instant notifications about your animals' health, location changes, or appointment reminders.",
  },
  {
    icon: <FileText className="h-6 w-6 text-primary" />,
    title: "Health Records",
    description: "Access complete medical history, prescriptions, and treatment plans for all your registered animals.",
  },
]

export default function PortalSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-lg mb-6">Customer Portal</h2>
            <p className="text-xl text-gray-600 mb-8">
              Our comprehensive customer portal gives you complete control over your animals' health and management.
              Track, consult, and care for your animals effortlessly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {portalFeatures.map((feature, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 mt-1">
                    <div className="p-2 bg-primary/10 rounded-full">{feature.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/login">Login to Portal</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>

          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=1000&fit=crop&crop=focalpoint&auto=format&q=80"
              alt="Farmer using tablet to track animals"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Track Your Animals Anywhere</h3>
                <p className="text-gray-700">
                  Access real-time data and health information from your phone or computer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
