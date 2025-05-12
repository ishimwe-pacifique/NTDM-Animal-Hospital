import type { Metadata } from "next"
import AddAnimalForm from "@/components/dashboard/add-animal-form"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Add Animal - NTDM Animal Hospital",
  description: "Register a new animal in the NTDM Animal Hospital system.",
}

export default async function AddAnimalPage() {
  const currentUser = await getCurrentUser()
  
  // Redirect if not logged in or not a farmer
  if (!currentUser || currentUser.role !== "farmer") {
    redirect("/login")
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Register New Animal</h1>
      <AddAnimalForm userId={currentUser._id.toString()} />
    </div>
  )
}
