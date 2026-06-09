import connectDB from "../../lib/mongodb";
import Service from "../../models/Service";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const services = await Service.find().sort({
    createdAt: -1,
  });

  return NextResponse.json({
    success: true,
    services,
  });
}

export async function POST(req) {
  await connectDB();

  const data = await req.json();

  const service =
    await Service.create(data);

  return NextResponse.json({
    success: true,
    service,
  });
}