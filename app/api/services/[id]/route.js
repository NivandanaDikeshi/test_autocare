import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import { NextResponse } from "next/server";

export async function PUT(
  req,
  { params }
) {
  await connectDB();

  const data = await req.json();

  const service =
    await Service.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    );

  return NextResponse.json({
    success: true,
    service,
  });
}

export async function DELETE(
  req,
  { params }
) {
  await connectDB();

  await Service.findByIdAndDelete(
    params.id
  );

  return NextResponse.json({
    success: true,
  });
}