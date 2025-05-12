import Image from "next/image"
import { Award, Zap, Globe } from "lucide-react"

const features = [
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Expert Veterinarians",
    description:
      "Our team of certified veterinarians brings years of experience and specialized knowledge to every case.",
    image:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&h=400&fit=crop&crop=focalpoint&auto=format&q=80",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Innovative Technology",
    description: "We use cutting-edge tracking devices and diagnostic tools to provide the best care for your animals.",
    image:
      "https://images.unsplash.com/photo-1581092921461-7d65ca45393a?w=600&h=400&fit=crop&crop=focalpoint&auto=format&q=80",
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Comprehensive Care",
    description:
      "From preventive care to emergency services, we offer a complete range of solutions for all your animal needs.",
    image:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&h=400&fit=crop&crop=focalpoint&auto=format&q=80",
  },
]

export default function WhyChooseUsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Why Choose NTDM Animal Hospital?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference with our commitment to excellence, innovation, and comprehensive animal care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="salon-card overflow-hidden group hover-lift">
              <div className="relative h-48">
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-white/90 rounded-full mr-3">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="/about"
            className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Learn More About Us
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
