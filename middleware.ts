import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value
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

    "/superadmin",
    "/superadmin/users",
    "/superadmin/consultations",
    "/superadmin/dashboard",
  ]

  // If trying to access a protected route without a session, redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Let login and register pages handle their own redirects
  // This allows the login form to properly redirect based on user role

  return NextResponse.next()
}

export const config = {
  matcher: ["/farmer/:path*", "/veterinary/:path*", "/superadmin/:path*", "/login", "/register"],
}
