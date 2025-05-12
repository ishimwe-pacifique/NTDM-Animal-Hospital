import type { Metadata } from "next"
import RegisterForm from "@/components/auth/register-form"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Register - NTDM Animal Hospital",
  description: "Create an account with NTDM Animal Hospital to access our services.",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1605152276897-4f618f831968?w=1200&h=1600&fit=crop&crop=focalpoint&auto=format&q=80"
          alt="Veterinarian with animals"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="p-12 max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6">Join NTDM Animal Hospital</h1>
            <p className="text-white/90 text-lg">
              Create an account to access our services, track your animals, and manage your consultations.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
