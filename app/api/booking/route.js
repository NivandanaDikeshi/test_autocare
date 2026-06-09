import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Booking from "../../../models/Booking";

// GET ALL BOOKINGS
export async function GET() {
  try {
    await connectDB();

    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("GET Booking Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// CREATE BOOKING
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    console.log("Received Data:", body);

    const booking = await Booking.create({
      fullName: body.fullName,
      phone: body.phone,
      vehicleModel: body.vehicleModel,
      vehicleNumber: body.vehicleNumber,
      serviceType: body.serviceType,
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
      notes: body.notes,
      status: "Pending",
    });

    console.log("Saved Booking:", booking);

    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("POST Booking Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}