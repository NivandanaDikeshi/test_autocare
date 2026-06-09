import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { status } = await req.json();

    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}