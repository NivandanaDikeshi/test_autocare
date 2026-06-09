import connectDB from "../../../lib/mongodb";
import Billing from "../../../models/Billing";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const bills = await Billing.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      bills,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}