import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import type { RowDataPacket } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const { name, phone, course } = await request.json();

    if (!name || !phone || !course) {
      return NextResponse.json({ error: "Name, phone, and course are required" }, { status: 400 });
    }

    // Insert into database
    const [result] = await pool.execute(
      "INSERT INTO enquiries (name, phone, course) VALUES (?, ?, ?)",
      [name, phone, course]
    );

    // Send email notification to admin
    await sendEmail(
      `New Quick Enquiry: ${name}`,
      `<h3>New Enquiry Received</h3>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Course:</strong> ${course}</p>`
    );

    return NextResponse.json({ success: true, message: "Enquiry submitted successfully" });
  } catch (error: any) {
    console.error("Error submitting enquiry:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM enquiries ORDER BY created_at DESC"
    );

    return NextResponse.json({ enquiries: rows });
  } catch (error: any) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
