import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { getSession } from "@/lib/auth"
import type { RowDataPacket } from "mysql2"

export async function GET() {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM blogs ORDER BY published_date DESC"
    )
    return NextResponse.json({ data: rows })
  } catch (error: any) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { title, slug, excerpt, content, author_name } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const blogId = crypto.randomUUID()

    await pool.execute(
      `INSERT INTO blogs (id, title, slug, excerpt, content, author_name, author_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [blogId, title, slug, excerpt, content, author_name || "Finix CNC Training", user.id]
    )

    return NextResponse.json({ success: true, id: blogId }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating blog:", error)
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "A blog with this slug already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}
