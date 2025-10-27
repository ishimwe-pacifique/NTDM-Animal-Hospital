"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

interface ServiceCardProps {
  service: {
    id: string
    name: string
    description: string
    price: number | string
    duration: string
    image: string
    link?: string
    category?: string
  }
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const handleClick = () => {
    if (service.link) {
      // Open external link in new tab
      window.open(service.link, "_blank", "noopener,noreferrer")
    } else if (service.category) {
      // Navigate to category page
      window.location.href = `/services/${service.category}/${service.id}`
    } else {
      // Navigate to service details
      window.location.href = `/services/${service.id}`
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-primary">
              {typeof service.price === "number" ? `RWF ${service.price.toLocaleString()}` : service.price}
            </p>
            {service.duration && <p className="text-sm text-muted-foreground">{service.duration}</p>}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleClick} className="w-full" variant={service.link ? "default" : "outline"}>
          {service.link ? (
            <>
              Access RVSMS
              <ExternalLink className="ml-2 h-4 w-4" />
            </>
          ) : service.category ? (
            "View Items"
          ) : (
            "Book Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
