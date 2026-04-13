import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { getSession } from "@/lib/auth"
import type { RowDataPacket } from "mysql2"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM blogs WHERE id = ?",
      [params.id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ data: rows[0] })
  } catch (error: any) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { title, slug, excerpt, content, author_name } = await request.json()

    await pool.execute(
      `UPDATE blogs SET title = ?, slug = ?, excerpt = ?, content = ?, author_name = ? WHERE id = ?`,
      [title, slug, excerpt, content, author_name, params.id]
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating blog:", error)
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "A blog with this slug already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await pool.execute("DELETE FROM blogs WHERE id = ?", [params.id])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
