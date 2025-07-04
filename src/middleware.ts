import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  // Admin sayfalarına erişim kontrolü
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }
  
  // Profil sayfalarına erişim kontrolü
  if (request.nextUrl.pathname.startsWith("/profile")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }
  
  // Appointments sayfalarına erişim kontrolü
  if (request.nextUrl.pathname.startsWith("/appointments")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/appointments/:path*"]
};
