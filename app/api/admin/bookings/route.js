import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Booking from "../../../../models/Booking";

export async function GET() {
  try {
    await connectDB();

    const bookings = await Booking.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}