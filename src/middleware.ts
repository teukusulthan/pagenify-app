import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth/jwt";
import { COOKIE_NAME } from "@/lib/constants/app";

const protectedPaths = ["/dashboard"];
const authPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  let user = null;

  if (token) {
    user = await verifyJwt(token);
  }

  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from auth pages
  if (user && authPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login for protected paths
  if (!user && protectedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
