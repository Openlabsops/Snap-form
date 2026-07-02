import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard"];

const ONBOARDING_ONLY = ["/onboarding"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // BetterAuth uses a plain name in HTTP (dev) and __Secure- prefix in HTTPS (prod)
  const sessionToken =
    req.cookies.get("better-auth.session_token")?.value ??
    req.cookies.get("__Secure-better-auth.session_token")?.value;
  const isLoggedIn = Boolean(sessionToken);

  const isOnboarded = req.cookies.get("snap_onboarded")?.value === "1";


  if (ONBOARDING_ONLY.some((p) => pathname.startsWith(p))) {
    if (isLoggedIn && isOnboarded) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }


  if (PROTECTED.some((p) => pathname.startsWith(p))) {

    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!isOnboarded) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
