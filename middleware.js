import { NextResponse } from "next/server";

export function middleware(req) {
  const adminToken =
    req.cookies.get("admin_token")?.value || req.cookies.get("token")?.value;
  const userToken = req.cookies.get("user_token")?.value;
  const url = req.nextUrl;
  const pathname = url.pathname;

  // 1. Admin Login Page: /admin/login
  if (pathname === "/admin/login") {
    // If admin is already authenticated, redirect to /admin dashboard
    if (adminToken) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // 2. Protected Admin Routes: /admin and /admin/*
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      const adminLoginUrl = new URL("/admin/login", req.url);
      adminLoginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  // 3. Customer Auth Pages: /login and /register
  if ((pathname === "/login" || pathname === "/register") && userToken) {
    // If customer is already authenticated, redirect to their profile/dashboard
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // 4. Protected Customer Profile: /profile
  if (pathname === "/profile" && !userToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register", "/profile"],
};
