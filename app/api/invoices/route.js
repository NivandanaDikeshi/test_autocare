import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function GET() {
  try {
    await connectDB();

    const invoices = await Invoice.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const invoice = await Invoice.create(body);

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}