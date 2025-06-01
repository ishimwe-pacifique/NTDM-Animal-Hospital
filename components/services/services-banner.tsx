import Image from "next/image"

export default function ServicesBanner() {
  return (
    <section className="relative pt-32 pb-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/variety-farm-animals-front-white-background_191971-14972.avif?w=1920&h=600&fit=crop&crop=focalpoint&auto=format&q=80"
          alt="Veterinary services"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-2xl text-white">
          <h1 className="heading-xl mb-4 text-blue-600">Our Services</h1>
          <p className="text-lg md:text-xl text-white/90">
            Discover our comprehensive range of animal health and management services designed for both livestock
            farmers and pet owners.
          </p>
        </div>
      </div>
    </section>
  )
}
