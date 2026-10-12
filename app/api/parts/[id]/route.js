import connectDB from "@/lib/mongodb";
import Part from "@/models/Part";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const part = await Part.findById(id);
    if (!part) {
      return NextResponse.json(
        { success: false, message: "Part not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, part });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();

    const part = await Part.findByIdAndUpdate(id, data, { new: true });

    if (!part) {
      return NextResponse.json(
        { success: false, message: "Part not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      part,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  return PUT(req, { params });
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    await Part.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Part deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}