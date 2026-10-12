import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Vehicle from "@/models/Vehicle";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = {};
    if (status && status !== "All") {
      query.status = status;
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

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

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const booking = await Booking.create(body);

    // Also register vehicle if not existing
    if (body.vehicleNumber) {
      const existingVehicle = await Vehicle.findOne({
        number: body.vehicleNumber.toUpperCase().trim(),
      });
      if (!existingVehicle) {
        await Vehicle.create({
          ownerName: body.fullName || "",
          ownerPhone: body.phone || "",
          model: body.vehicleModel || "Standard",
          number: body.vehicleNumber.toUpperCase().trim(),
          status: "In Service",
        });
      }
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}