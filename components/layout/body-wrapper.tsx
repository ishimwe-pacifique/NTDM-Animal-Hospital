'use client'

import { usePathname } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import WhatsAppWidget from "@/components/widgets/whatsapp-widget"
import { Suspense } from "react"

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/farmer") || pathname?.startsWith("/veterinary")

  return (
    <Suspense>
      {!isDashboard && <Header />}
      <main>{children}</main>
      {!isDashboard && <Footer />}
      <WhatsAppWidget />
    </Suspense>
  )
} 