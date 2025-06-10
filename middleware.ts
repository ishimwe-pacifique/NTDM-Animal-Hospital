import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value
  const role = request.cookies.get("role")?.value
  const { pathname } = request.nextUrl

  const protectedRoutes = [
    "/farmer",
    "/farmer/animals",
    "/farmer/consultations",
    "/farmer/messages",
    "/farmer/tracking",

    "/veterinary",
    "/veterinary/animals",
    "/veterinary/consultations",
    "/veterinary/messages",
    "/veterinary/tracking",
  ]

  // If trying to access a protected route without a session, redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user is authenticated, check role-based access
  if (session && role) {
    // Prevent farmers from accessing veterinary routes
    if (role === "farmer" && pathname.startsWith("/veterinary")) {
      return NextResponse.redirect(new URL("/farmer", request.url))
    }

    // Prevent veterinarians from accessing farmer routes
    if (role === "veterinary" && pathname.startsWith("/farmer")) {
      return NextResponse.redirect(new URL("/veterinary", request.url))
    }
  }

  // If user is already authenticated and tries to access login or register, redirect based on role
  if ((pathname === "/login" || pathname === "/register") && session) {
    if (role === "farmer") {
      return NextResponse.redirect(new URL("/farmer", request.url))
    } else if (role === "veterinary") {
      return NextResponse.redirect(new URL("/veterinary", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/farmer/:path*", "/veterinary/:path*", "/login", "/register"],
}
