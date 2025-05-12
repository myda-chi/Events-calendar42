import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Admin protection
  if (path.startsWith("/admin")) {
    // Get the admin token from cookies
    const adminToken = request.cookies.get("admin_token")?.value || ""

    // Check if the admin token is valid
    const isValidAdminToken = adminToken === "admin-token-42"

    // If not authorized, redirect to login
    if (!isValidAdminToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*"],
}
