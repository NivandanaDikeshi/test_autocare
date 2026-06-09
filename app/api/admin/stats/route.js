import { NextResponse } from "next/server";

import connectDB from "../../../../lib/mongodb";
import Booking from "../../../../models/Booking";

export async function GET() {
  try {
    await connectDB();

    // Total bookings
    const totalBookings = await Booking.countDocuments();

    // Unique customers
    const customers = await Booking.distinct("phone");

    // Revenue example
    const revenue = totalBookings * 5000;

    return NextResponse.json({
      success: true,

      stats: {
        bookings: totalBookings,
        customers: customers.length,
        services: 6,
        revenue,
      },
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load stats",
      },
      { status: 500 }
    );
  }
}