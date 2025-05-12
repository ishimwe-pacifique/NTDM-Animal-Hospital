import AddConsultationForm from "@/components/dashboard/add-consultation-form";
import { getDoctorsList } from "@/lib/actions";
import { getCurrentUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function NewConsultationPage() {
  const currentUser = await getCurrentUser();
  
  // Redirect if not logged in or not a farmer
  if (!currentUser || currentUser.role !== "farmer") {
    redirect("/login");
  }
  
  const doctors = await getDoctorsList();

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Consultation</h1>
      <AddConsultationForm doctors={doctors} farmerId={currentUser._id.toString()} />
    </div>
  );
} 