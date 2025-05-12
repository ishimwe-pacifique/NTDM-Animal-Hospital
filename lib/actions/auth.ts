"use server"
import clientPromise from "../db"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Register a new user
export async function registerUser(formData: FormData) {
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital") // Explicitly specify database name

    const role = formData.get("role") as "farmer" | "doctor" | "admin"

    // Create base user data
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"), // In a real app, this would be hashed
      phone: formData.get("phone"),
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Add role-specific data
    if (role === "doctor") {
      Object.assign(userData, {
        licenseNumber: formData.get("licenseNumber"),
        specialization: formData.get("specialization"),
        availability: {
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          hours: {
            start: "08:00",
            end: "17:00",
          },
        },
        consultations: [],
      })
    } else if (role === "farmer") {
      Object.assign(userData, {
        district: formData.get("district"),
        sector: formData.get("sector"),
        animals: [],
      })
    }

    // Check if email already exists
    const existingUser = await db.collection("users").findOne({ email: userData.email })
    if (existingUser) {
      return { success: false, message: "Email already in use" }
    }

    // Insert user into database
    const result = await db.collection("users").insertOne(userData)

    return {
      success: true,
      message: "User registered successfully",
      userId: result.insertedId.toString(),
    }
  } catch (error) {
    console.error("Error registering user:", error)
    if (error instanceof Error) {
      return { success: false, message: `Registration failed: ${error.message}` }
    }
    return { success: false, message: "Failed to register user" }
  }
}

// Login user
export async function loginUser(formData: FormData) {
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // In a real app, you would hash the password and compare with the stored hash
    const user = await db.collection("users").findOne({
      email,
      password, // This is insecure - in a real app, use proper password hashing
    })

    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    // Set a session cookie
    const sessionId = crypto.randomUUID()
    const cookieStore = await cookies()
    cookieStore.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Store session in database
    await db.collection("sessions").insertOne({
      sessionId,
      userId: user._id,
      role: user.role, // Store role for quick access
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
    })

    // Return success with redirect path instead of using redirect directly
    return {
      success: true,
      message: "Login successful",
      redirectPath: user.role === "doctor" ? "/veterinary" : user.role === "farmer" ? "/farmer" : "/"
    }
  } catch (error) {
    console.error("Error logging in:", error)
    if (error instanceof Error) {
      return { success: false, message: `Login failed: ${error.message}` }
    }
    return { success: false, message: "Failed to log in" }
  }
}

// Logout user
export async function logoutUser() {
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")
    
    // Get the session ID from cookies
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value

    if (sessionId) {
      // Delete the session from database
      await db.collection("sessions").deleteOne({ sessionId })
    }

    // Delete the session cookie
    cookieStore.delete("session")
    
    return { success: true }
  } catch (error) {
    console.error("Error during logout:", error)
    // Even if there's an error, try to clear the cookie
    const cookieStore = await cookies()
    cookieStore.delete("session")
    return { success: false, error: "Failed to logout" }
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const client = await clientPromise
    const db = client.db("ntdm_animal_hospital")

    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value
    if (!sessionId) {
      return null
    }

    const session = await db.collection("sessions").findOne({
      sessionId,
      expiresAt: { $gt: new Date() },
    })

    if (!session) {
      cookieStore.delete("session")
      return null
    }

    const user = await db.collection("users").findOne({ _id: session.userId })
    if (!user) {
      cookieStore.delete("session")
      return null
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = user
    // Attach role for easy access
    userWithoutPassword.role = session.role || user.role
    return userWithoutPassword
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

const handleLogout = async () => {
  try {
    await logoutUser();
    // Do NOT do anything else here. The server will redirect.
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return;
    }
    // Optionally handle logout errors
  }
};
