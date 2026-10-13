import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

// SAVE MESSAGE FROM CONTACT FORM
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const fullName = (body.fullName || body.name || "").trim();
    const email = (body.email || "").trim();
    const message = (body.message || "").trim();

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Please provide your name, email, and message." },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      fullName,
      email,
      phone: body.phone ? body.phone.trim() : "",
      message,
      status: "New",
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET ALL MESSAGES FOR ADMIN
export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      contacts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}