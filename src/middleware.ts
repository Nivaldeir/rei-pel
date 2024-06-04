import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("__Secure-next-auth.session-token") ?? request.cookies.get("next-auth.session-token");
  const pathname = request.nextUrl.pathname;
  if (pathname === "/sign-in" && token) {
    return NextResponse.rewrite(new URL("/", request.url));
  }
  if (pathname.includes("/") && !token) {
    return NextResponse.rewrite(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
