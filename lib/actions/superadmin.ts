"use server"

import clientPromise from "../db"
import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"

// Get all users for super admin management
export async function getAllUsers() {
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")

    const users = await db.collection("users").find({}).toArray()

    // Get active sessions to determine online status
    const activeSessions = await db.collection("sessions").find({
      expiresAt: { $gt: new Date() }
    }).toArray()

    const onlineUserIds = new Set(activeSessions.map(session => session.userId.toString()))

    return users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status || "active",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt || null,
      isOnline: onlineUserIds.has(user._id.toString()),
      // Include role-specific fields
      district: user.district || null,
      sector: user.sector || null,
      licenseNumber: user.licenseNumber || null,
      specialization: user.specialization || null,
    }))
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Update user status (suspend/activate)
export async function updateUserStatus(userId: string, status: "active" | "suspended" | "inactive") {
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    )

    if (result.modifiedCount > 0) {
      revalidatePath("/superadmin/users")
      return { success: true, message: `User ${status} successfully` }
    }

    return { success: false, message: "User not found" }
  } catch (error) {
    console.error("Error updating user status:", error)
    return { success: false, message: "Failed to update user status" }
  }
}

// Update user information
export async function updateUser(userId: string, formData: FormData) {
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")

    const updateData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      role: formData.get("role"),
      updatedAt: new Date()
    }

    // Add password if provided
    // const newPassword = formData.get("password")
    // if (newPassword && newPassword.toString().trim() !== "") {
    //   updateData.password = newPassword.toString()
    // }

    // Add role-specific fields
    if (updateData.role === "farmer") {
      Object.assign(updateData, {
        district: formData.get("district"),
        sector: formData.get("sector"),
      })
    } else if (updateData.role === "doctor") {
      Object.assign(updateData, {
        licenseNumber: formData.get("licenseNumber"),
        specialization: formData.get("specialization"),
      })
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    )

    if (result.modifiedCount > 0) {
      revalidatePath("/superadmin/users")
      return { success: true, message: "User updated successfully" }
    }

    return { success: false, message: "User not found" }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, message: "Failed to update user" }
  }
}

// Update user password
export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          password: newPassword,
          updatedAt: new Date()
        }
      }
    )

    if (result.modifiedCount > 0) {
      revalidatePath("/superadmin/users")
      return { success: true, message: "Password updated successfully" }
    }

    return { success: false, message: "User not found" }
  } catch (error) {
    console.error("Error updating password:", error)
    return { success: false, message: "Failed to update password" }
  }
}

// Delete user
export async function deleteUser(userId: string) {
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")

    const result = await db.collection("users").deleteOne(
      { _id: new ObjectId(userId) }
    )

    if (result.deletedCount > 0) {
      revalidatePath("/superadmin/users")
      return { success: true, message: "User deleted successfully" }
    }

    return { success: false, message: "User not found" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, message: "Failed to delete user" }
  }
}
function safeObjectId(id: any): ObjectId | null {
  if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
    return null
  }
  return new ObjectId(id)
}
// Get all consultations for super admin review
export async function getAllConsultations() {
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")

    const consultations = await db.collection("consultations").find({}).sort({ createdAt: -1 }).toArray()

    // Get all unique doctor IDs and farmer IDs from consultations - with validation
    const doctorIds = [...new Set(consultations.map((c) => c.doctor).filter(id => id && ObjectId.isValid(id)))]
    const farmerIds = [...new Set(consultations.map((c) => c.farmerId).filter(id => id && ObjectId.isValid(id)))]

    // Fetch doctor and farmer information - now safe to convert
    const [doctors, farmers] = await Promise.all([
      doctorIds.length > 0 ? db.collection("users").find({
        _id: { $in: doctorIds.map((id) => new ObjectId(id)) },
        role: "doctor",
      }).toArray() : [],
      farmerIds.length > 0 ? db.collection("users").find({
        _id: { $in: farmerIds.map((id) => new ObjectId(id)) },
        role: "farmer",
      }).toArray() : []
    ])

    // Create maps for quick lookup
    const doctorMap = new Map()
    doctors.forEach((doctor) => {
      doctorMap.set(doctor._id.toString(), doctor.name)
    })

    const farmerMap = new Map()
    farmers.forEach((farmer) => {
      farmerMap.set(farmer._id.toString(), farmer.name)
    })

    return consultations.map((c) => ({
      _id: c._id.toString(),
      fullName: c.fullName,
      phoneNumber: c.phoneNumber,
      service: c.service,
      date: c.date,
      time: c.time,
      type: c.type,
      status: c.status.toLowerCase(),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt?.toISOString() || null,
      doctor: doctorMap.get(c.doctor) || c.doctor || "Unassigned",
      farmer: farmerMap.get(c.farmerId) || "Unknown Farmer",
      farmerId: c.farmerId || null,
      feedback: c.feedback || null,
    }))
  } catch (error) {
    console.error("Error fetching consultations:", error)
    return []
  }
}

// Get system statistics
export async function getSystemStats() {
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")

    const [userStats, consultationStats] = await Promise.all([
      db.collection("users").aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 }
          }
        }
      ]).toArray(),
      db.collection("consultations").aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]).toArray()
    ])

    const totalUsers = userStats.reduce((sum, stat) => sum + stat.count, 0)
    const totalConsultations = consultationStats.reduce((sum, stat) => sum + stat.count, 0)

    return {
      totalUsers,
      totalConsultations,
      userStats: userStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count
        return acc
      }, {} as Record<string, number>),
      consultationStats: consultationStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count
        return acc
      }, {} as Record<string, number>)
    }
  } catch (error) {
    console.error("Error fetching system stats:", error)
    return {
      totalUsers: 0,
      totalConsultations: 0,
      userStats: {},
      consultationStats: {}
    }
  }
}
