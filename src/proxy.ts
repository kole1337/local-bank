import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "vb_session";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

async function readSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.userId !== "string" || typeof payload.role !== "string") {
      return null;
    }
    return { userId: payload.userId, role: payload.role as "CUSTOMER" | "EMPLOYEE" };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSession(request);

  const isCustomerPath = pathname.startsWith("/dashboard") || pathname.startsWith("/profile");
  const isEmployeePath = pathname.startsWith("/admin");
  const isLoginPath = pathname === "/login";

  if (isLoginPath && session) {
    const home = session.role === "EMPLOYEE" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (isCustomerPath) {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));
    if (session.role !== "CUSTOMER") return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isEmployeePath) {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));
    if (session.role !== "EMPLOYEE") return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*", "/login"],
};
