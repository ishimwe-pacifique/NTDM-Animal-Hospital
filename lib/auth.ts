"use server"

import clientPromise from "./db"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"

interface User {
  _id: string
  role: string
  name: string
  email: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value
    
    if (!sessionId) {
      return null
    }

    // First, find the session in the sessions collection
    const session = await db.collection("sessions").findOne({
      sessionId,
      expiresAt: { $gt: new Date() },
    })

    if (!session) {
      // Session expired or doesn't exist, clear the cookie
      cookieStore.delete("session")
      return null
    }

    // Then, find the user using the userId from the session
    const user = await db.collection("users").findOne({ 
      _id: session.userId
    })

    if (!user) {
      // User doesn't exist, clear the session
      await db.collection("sessions").deleteOne({ sessionId })
      cookieStore.delete("session")
      return null
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = user
    return { ...userWithoutPassword, _id: user._id.toString() } as User
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
