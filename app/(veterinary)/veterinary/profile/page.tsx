"use client"

import { useState } from "react"
import Image from "next/image"

export default function ProfileEditPage() {
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "Dr. User",
    email: "doctor@example.com",
    phone: "",
    specialty: "",
    bio: "",
    clinic: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setProfilePic(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic here
    alert("Profile updated!")
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20">
            <Image
              src={profilePic || "/avatars/01.png"}
              alt="Profile Picture"
              fill
              className="rounded-full object-cover border"
            />
          </div>
          <label className="cursor-pointer px-3 py-2 bg-primary text-white rounded shadow hover:bg-primary/80">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Specialty</label>
          <input
            type="text"
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Surgery, Dermatology"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={3}
            placeholder="Tell us about yourself"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Clinic Address</label>
          <input
            type="text"
            name="clinic"
            value={form.clinic}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary/90"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}