import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
export async function POST(request: NextRequest) {
  try {
    const { name, phone, course } = await request.json();

    if (!name || !phone || !course) {
      return NextResponse.json({ error: "Name, phone, and course are required" }, { status: 400 });
    }

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

