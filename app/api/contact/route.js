import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

// SAVE MESSAGE FROM CONTACT FORM
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.fullName || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: "Please provide your name, email, and message." },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      phone: body.phone ? body.phone.trim() : "",
      message: body.message.trim(),
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