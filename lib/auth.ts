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
    const session = cookieStore.get("session")
    
    if (!session) return null
    
    const user = await db.collection("users").findOne({ 
      _id: new ObjectId(session.value)
    })
    return user ? { ...user, _id: user._id.toString() } as User : null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
} 