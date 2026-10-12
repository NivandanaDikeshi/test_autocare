import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    await Invoice.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}