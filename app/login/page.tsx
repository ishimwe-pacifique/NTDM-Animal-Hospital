import type { Metadata } from "next"
import LoginForm from "@/components/auth/login-form"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Login - NTDM Animal Hospital",
  description: "Log in to your NTDM Animal Hospital account to access your dashboard and manage your animals.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1568572933382-74d440642117?w=1200&h=1600&fit=crop&crop=focalpoint&auto=format&q=80"
          alt="Veterinarian with animals"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="p-12 max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6">Welcome Back to NTDM Animal Hospital</h1>
            <p className="text-white/90 text-lg">
              Log in to access your dashboard, track your animals, and manage your consultations.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
