import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Contact from "../../../models/Contact";

// SAVE MESSAGE
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const contact = await Contact.create(body);

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}

// GET MESSAGES (ADMIN DASHBOARD)
export async function GET() {
  try {
    await connectDB();

    const contacts = await Contact.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, contacts });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}