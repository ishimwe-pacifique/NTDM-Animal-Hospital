import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, MessageCircle } from "lucide-react"

interface ServiceProps {
  service: {
    id: string
    name: string
    description: string
    price: number | string
    duration: string
    image: string
  }
}

export default function ServiceCard({ service }: ServiceProps) {
  const whatsappNumber = "+250780519960"

  const generateWhatsAppMessage = () => {
    const priceText = typeof service.price === "number" ? `RWF ${service.price.toLocaleString()}` : service.price

    return encodeURIComponent(
      `🐾 *VETERINARY SERVICE BOOKING REQUEST* 🐾\n\n` +
        `📋 *Service Details:*\n` +
        `• *Service Name:* ${service.name}\n` +
        `• *Description:* ${service.description}\n` +
        `• *Price:* ${priceText}\n` +
        `• *Duration/Package:* ${service.duration}\n` +
        `• *Service ID:* ${service.id}\n\n` +
        `📞 *Next Steps:*\n` +
        `Please confirm availability and provide:\n` +
        `• Preferred appointment date/time\n` +
        `• Location details (if applicable)\n` +
        `• Any specific requirements\n\n` +
        `Thank you for choosing our veterinary services! 🙏`,
    )
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`

  return (
    <div className="salon-card overflow-hidden shadow-salon hover:shadow-salon-hover transition-all group">
      <div className="relative h-48">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-primary font-semibold">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>{typeof service.price === "number" ? `RWF ${service.price.toLocaleString()}` : service.price}</span>
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{service.duration}</span>
          </div>
        </div>

        <Button
          asChild
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full shadow-md"
        >
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Book via WhatsApp</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
