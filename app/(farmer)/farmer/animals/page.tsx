export const dynamic = "force-dynamic";

import { getAnimals } from "@/lib/actions";
import { getCurrentUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";

export default async function AnimalsPage() {
  const currentUser = await getCurrentUser();

  // Redirect if not logged in or not a farmer
  if (!currentUser || currentUser.role !== "farmer") {
    redirect("/login");
  }

  // Get animals for this farmer only
  const animals = await getAnimals(currentUser._id.toString());

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Animals</h1>
          <p className="text-gray-600 text-sm mt-1">
            Registered Animals: <span className="font-semibold">{animals.length}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          <Button asChild size="sm">
            <Link href="/farmer/animals/add">Register New Animal</Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Animals Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {animals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>You don't have any registered animals yet.</p>
              <p className="mt-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/farmer/animals/add">Register an Animal</Link>
                </Button>
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {animals.map((animal) => (
                  <TableRow key={animal._id}>
                    <TableCell className="font-medium">{animal.name}</TableCell>
                    <TableCell>{animal.type}</TableCell>
                    <TableCell>{animal.breed}</TableCell>
                    <TableCell>{animal.district}, {animal.sector}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>RWF {animal.price}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/farmer/animals/${animal._id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/farmer/animals/${animal._id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}