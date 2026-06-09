import connectDB from "../../lib/mongodb";
import Part from "../../models/Part";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const parts = await Part.find();

  return NextResponse.json({
    success: true,
    parts,
  });
}

export async function POST(req) {
  await connectDB();

  const data = await req.json();

  const part = await Part.create(data);

  return NextResponse.json({
    success: true,
    part,
  });
}