// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import GoogleAnalytics from "@/components/analytics/google-analytics"
import BodyWrapper from "@/components/layout/body-wrapper" // 👈 add this line

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "NTDM Animal Hospital - Track, Consult, and Care",
  description:
    "Leading animal hospital in Rwanda offering tracking devices, veterinary consultations, disease monitoring, and animal sales.",
  keywords: "animal hospital, veterinary care, animal tracking, disease monitoring, pet care, livestock management",
  openGraph: {
    title: "NTDM Animal Hospital - Track, Consult, and Care",
    description:
      "Leading animal hospital in Rwanda offering tracking devices, veterinary consultations, disease monitoring, and animal sales.",
    images: ["/images/og-image.jpg"],
    type: "website",
    locale: "en_RW",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <GoogleAnalytics />
        <BodyWrapper>{children}</BodyWrapper>
      </body>
    </html>
  )
}
