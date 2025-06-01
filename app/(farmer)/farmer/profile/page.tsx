"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";

export default function FarmerProfilePage() {
  const [user, setUser] = useState<{ name?: string; email?: string; image?: string; phone?: string; location?: string; bio?: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getCurrentUser();
      setUser(userData);
    }
    fetchUser();
  }, []);

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-28 h-28 mb-3">
          <Image
            src="/avatars/01.png" // Always show avatar image
            alt="Profile"
            fill
            className="rounded-full object-cover border-4 border-green-200 bg-white"
          />
        </div>
        <h2 className="text-xl font-semibold">{user?.name || "Farmer"}</h2>
        <p className="text-gray-600">{user?.email || "your@email.com"}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={user?.name || ""}
            disabled
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={user?.phone || ""}
            disabled
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={user?.location || ""}
            disabled
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={user?.bio || ""}
            disabled
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}