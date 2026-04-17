import { NextRequest, NextResponse } from "next/server"
import { signToken, COOKIE_NAME } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Hardcoded admin check
    const adminEmail = process.env.ADMIN_EMAIL || "admin@finix.com"
    const adminPassword = process.env.ADMIN_PASSWORD || "password"

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: "Invalid login credentials" }, { status: 401 })
    }

    const admin = {
      id: 1,
      name: "Admin",
      email: adminEmail,
    }

    // Create JWT token
    const token = await signToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    })

    // Set cookie
    const response = NextResponse.json({ success: true, user: { id: admin.id, email: admin.email, name: admin.name } })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
