import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const contact = await Contact.findByIdAndUpdate(id, body, { new: true });
    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contact inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contact inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
