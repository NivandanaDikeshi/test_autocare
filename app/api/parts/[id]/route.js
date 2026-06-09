import connectDB from "../../lib/mongodb";
import Part from "../../models/Part";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connectDB();

  const data = await req.json();

  const part = await Part.findByIdAndUpdate(
    params.id,
    data,
    { new: true }
  );

  return NextResponse.json({
    success: true,
    part,
  });
}

export async function DELETE(req, { params }) {
  await connectDB();

  await Part.findByIdAndDelete(
    params.id
  );

  return NextResponse.json({
    success: true,
  });
}