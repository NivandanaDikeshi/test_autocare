import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    await Invoice.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}