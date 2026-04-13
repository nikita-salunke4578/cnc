import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { comparePassword, signToken, COOKIE_NAME } from "@/lib/auth"
import type { RowDataPacket } from "mysql2"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find admin by email
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id, email, password_hash, name FROM admins WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Invalid login credentials" }, { status: 401 })
    }

    const admin = rows[0]

    // Compare password
    const isValid = await comparePassword(password, admin.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid login credentials" }, { status: 401 })
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
