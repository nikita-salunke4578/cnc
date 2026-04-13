import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import type { RowDataPacket } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, course, message } = await request.json();

    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    // Insert into database
    const [result] = await pool.execute(
      "INSERT INTO contact_messages (first_name, last_name, email, phone, course, message) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, phone, course || null, message]
    );

    // Send email notification to admin
    await sendEmail(
      `New Contact Message: ${firstName} ${lastName}`,
      `<h3>New Contact Message Received</h3>
       <p><strong>Name:</strong> ${firstName} ${lastName}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Course:</strong> ${course || "None specified"}</p>
       <br/>
       <p><strong>Message:</strong><br/>${message}</p>`
    );

    return NextResponse.json({ success: true, message: "Contact message sent successfully" });
  } catch (error: any) {
    console.error("Error submitting contact message:", error);
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
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );

    return NextResponse.json({ messages: rows });
  } catch (error: any) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
