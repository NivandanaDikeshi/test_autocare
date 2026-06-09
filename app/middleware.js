import { NextResponse } from "next/server";

export function middleware(req) {
  const token =
    req.cookies.get("token");

  const url = req.nextUrl;

  if (
    url.pathname.startsWith(
      "/admin"
    ) &&
    !token &&
    url.pathname !==
      "/login"
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        req.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};