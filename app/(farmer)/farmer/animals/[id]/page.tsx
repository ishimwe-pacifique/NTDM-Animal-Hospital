import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { deleteAnimal } from "@/lib/actions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function AnimalDetailsPage({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  
  // Redirect if not logged in or not a farmer
  if (!currentUser || currentUser.role !== "farmer") {
    redirect("/login");
  }

  // Fetch animal details from the database
  const client = await clientPromise;
  const db = client.db("ntdm_animal_hospital");
  
  const animal = await db.collection("animals").findOne({
    _id: new ObjectId(params.id),
    $or: [
      { ownerId: currentUser._id.toString() },
      { 'owner._id': currentUser._id.toString() },
      { 'owner': currentUser._id.toString() }
    ]
  });

  // If animal not found or doesn't belong to this farmer, redirect
  if (!animal) {
    redirect("/farmer/animals");
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Animal Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/farmer/animals">Back to Animals</Link>
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <div className="flex justify-between items-center">
            <CardTitle>
              {animal.name}
              <Badge className="ml-2">{animal.type}</Badge>
            </CardTitle>
            <Badge 
              variant="outline"
              className={
                animal.status === "Healthy"
                  ? "bg-green-100 text-green-800"
                  : animal.status === "Sick"
                  ? "bg-yellow-100 text-yellow-800"
                  : animal.status === "Under Treatment"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {animal.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Breed</h3>
              <p>{animal.breed}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Class</h3>
              <p>{animal.class}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p>{animal.district}, {animal.sector}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Price</h3>
              <p>RWF {animal.price}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Owner</h3>
              <p>{animal.ownerName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p>{animal.phoneNumber}</p>
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Registered On</h3>
              <p>{new Date(animal.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 flex justify-between">
          <form action={async () => {
            "use server";
            await deleteAnimal(params.id);
            redirect("/farmer/animals");
          }}>
            <Button type="submit" variant="destructive">Delete Animal</Button>
          </form>
          <Button variant="outline" asChild>
            <Link href={`/farmer/animals/edit/${params.id}`}>Edit Animal</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 