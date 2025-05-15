import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
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
  ];

  // Check if route is protected and user is not authenticated
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated user from login/register to farmer (default)
  if ((pathname === "/login" || pathname === "/register") && session) {
    return NextResponse.redirect(new URL("/farmer", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/farmer/:path*",
    "/veterinary/:path*",
    "/login",
    "/register",
  ],
};