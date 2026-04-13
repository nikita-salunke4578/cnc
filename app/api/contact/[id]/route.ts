import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    await pool.execute(
      "UPDATE contact_messages SET status = ? WHERE id = ?",
      [status, id]
    );

    return NextResponse.json({ success: true, message: "Status updated successfully" });
  } catch (error: any) {
    console.error("Error updating contact message status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
