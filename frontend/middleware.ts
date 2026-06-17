import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isChat = req.nextUrl.pathname.startsWith("/chat")
  const isLogin = req.nextUrl.pathname.startsWith("/login")

  if (isChat && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (isLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/chat", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}