import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM blogs WHERE slug = ?",
      [params.slug]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ data: rows[0] })
  } catch (error: any) {
    console.error("Error fetching blog by slug:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}
