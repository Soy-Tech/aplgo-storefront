import { NextRequest, NextResponse } from "next/server"

const DISTRIBUIDOR_ROUTES = ["/distribuidor"]
const AUTH_ROUTES = ["/mi-cuenta", "/distribuidor"]

function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get("_medusa_jwt")?.value ?? null
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const requiresAuth = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  if (!requiresAuth) return NextResponse.next()

  const token = getTokenFromRequest(req)
  if (!token) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("returnUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role check for distribuidor routes is enforced server-side in the page
  // (double-layer protection per blueprint rule #3)
  const isDistribuidorRoute = DISTRIBUIDOR_ROUTES.some((r) =>
    pathname.startsWith(r)
  )
  if (isDistribuidorRoute) {
    // Pass role validation to the page component — middleware only checks auth
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/mi-cuenta/:path*", "/distribuidor/:path*"],
}
