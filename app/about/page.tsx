import type { Metadata } from "next"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us - NTDM Animal Hospital",
  description: "Learn about NTDM Animal Hospital's mission, vision, and our team of expert veterinarians.",
}

export default function AboutPage() {
  return (
    <>
      <div className="bg-gradient-to-r from-primary to-primary/80 py-20 mb-12">
        <div className="container-custom">
          <h1 className="heading-xl text-white text-center mb-4">About NTDM Animal Hospital</h1>
          <p className="text-xl text-white/90 text-center max-w-2xl mx-auto">
            Discover our story, our passion for animal health, and our commitment to innovation.
          </p>
        </div>
      </div>
      <div className="container-custom mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="heading-lg mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2020, NTDM Animal Hospital has been at the forefront of veterinary innovation in Rwanda. Our
              journey began with a simple vision: to revolutionize animal health management through technology and
              expert care.
            </p>
            <p className="text-gray-600 mb-4">
              Over the years, we've grown from a small local clinic to a comprehensive animal health service provider,
              thanks to our commitment to excellence and our passionate team of skilled veterinarians and technologists.
            </p>
            <Button asChild className="mt-4">
              <Link href="/booking">Book a Consultation</Link>
            </Button>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=focalpoint&auto=format&q=80"
              alt="NTDM Animal Hospital Team"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="bg-primary/5 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700">
                NTDM Animal Hospital aims to revolutionize animal health and management by providing innovative tracking
                devices, veterinary consultations, and disease prevention solutions, connecting farmers with the market,
                empowering livestock farmers and pet owners to ensure the well-being of their animals.
              </p>
            </div>
            <div className="bg-secondary/5 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-700">
                At NTDM Animal Hospital, we want to become a leading animal health service provider in Rwanda and
                beyond, leveraging technology to enhance productivity, public health, and sustainable agriculture.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="heading-lg text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image:
                  "/WhatsApp Image 2025-03-28 at 12.07.22_620388c5.jpg",
                name: "Dr. Theophile Niyonizeye",
                role: "Chief Veterinarian",
                specialty: "Large Animal Medicine",
              },
              {
                image:
                  "/NEW PHOTO.jpg",
                name: "Dr. Charline Rutagengwa",
                role: "Senior Veterinarian",
                specialty: "Small Animal Medicine",
              },
              {
                image:
                  "/sano2.jpg",
                name: "Dr. Gerard Sano",
                role: "Technology Director",
                specialty: "Animal Tracking Systems",
              },
                 {
                image:
                  "/WhatsApp Image 2025-05-15 at 15.48.58_74fbf054.jpg",
                name: "Dr. Benitte Ikuzwe",
                role: "Managing Director",
                specialty: "Veterinanry Technician",
              },
            ].map((member, index) => (
              <div key={index} className="salon-card text-center p-6">
                <div className="relative w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 mb-4">Specialist in {member.specialty}</p>
                <Link href="/booking" className="text-primary hover:text-primary/80 transition-colors">
                  Book a consultation
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="heading-lg mb-6">Experience the NTDM Difference</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We invite you to visit NTDM Animal Hospital and experience our commitment to animal health, innovation, and
            exceptional service firsthand.
          </p>
          <Button asChild size="lg">
            <Link href="/booking">Book Your Consultation Today</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
