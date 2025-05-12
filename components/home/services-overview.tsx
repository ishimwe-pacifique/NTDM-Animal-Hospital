import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, Video, ShieldAlert, ShoppingBag } from "lucide-react"

const services = [
  {
    icon: <Activity className="h-6 w-6 text-primary" />,
    title: "Animal Tracking Devices",
    description: "Monitor your livestock and pets with our advanced GPS tracking technology.",
    link: "/services#tracking",
  },
  {
    icon: <Video className="h-6 w-6 text-primary" />,
    title: "Veterinary Consultations",
    description: "Connect with expert veterinarians through in-person or virtual consultations.",
    link: "/services#consultations",
  },
  {
    icon: <ShieldAlert className="h-6 w-6 text-primary" />,
    title: "Disease Monitoring",
    description: "Early detection and prevention of diseases through regular health monitoring.",
    link: "/services#monitoring",
  },
  {
    icon: <ShoppingBag className="h-6 w-6 text-primary" />,
    title: "Animal Sales",
    description: "Purchase healthy livestock and pets through our verified marketplace.",
    link: "/services#sales",
  },
]

export default function ServicesOverview() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Our Featured Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive solutions for animal health, tracking, and management to ensure the well-being of your
            livestock and pets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="salon-card p-8 text-center hover-lift transition-all duration-300 hover:bg-primary/5"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <Link
                href={service.link}
                className="text-primary font-medium hover:text-primary/80 transition-colors inline-flex items-center"
              >
                Learn More
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button asChild size="lg" className="btn-primary">
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
