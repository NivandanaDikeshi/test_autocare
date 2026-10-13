import { NextResponse } from "next/server";

export function proxy(req) {
  const adminToken =
    req.cookies.get("admin_token")?.value || req.cookies.get("token")?.value;
  const userToken = req.cookies.get("user_token")?.value;
  const url = req.nextUrl;
  const pathname = url.pathname;

  // 1. Admin Login Page: /admin/login
  if (pathname === "/admin/login") {
    // If switch, force, or relogin is requested, flush existing admin tokens
    if (
      url.searchParams.has("switch") ||
      url.searchParams.has("force") ||
      url.searchParams.has("logout")
    ) {
      const response = NextResponse.next();
      response.cookies.delete("admin_token");
      response.cookies.delete("token");
      return response;
    }
    if (adminToken) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // 2. Protected Admin Routes: /admin and /admin/*
  // Only users with admin_token can access Admin Panel
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      const adminLoginUrl = new URL("/admin/login", req.url);
      adminLoginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
    return NextResponse.next();
  }

  // 3. Customer Auth Pages: /login and /register
  if ((pathname === "/login" || pathname === "/register") && userToken) {
    // If customer is already authenticated, redirect to their garage profile
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // 4. Protected Customer Profile: /profile
  // Admins are directed to /admin; unauthenticated users to /login
  if (pathname === "/profile") {
    if (!userToken) {
      if (adminToken) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register", "/profile"],
};
