import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Vehicle from "@/models/Vehicle";

// GET BOOKINGS (Supports search by vehicleNumber, phone, or all)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const vehicleNumber = searchParams.get("vehicleNumber");
    const phone = searchParams.get("phone");

    let query = {};
    if (vehicleNumber) {
      query.vehicleNumber = new RegExp(vehicleNumber.trim(), "i");
    }
    if (phone) {
      query.phone = new RegExp(phone.trim(), "i");
    }

    const bookings = await Booking.find(query).sort({
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

    if (!body.fullName || !body.phone || !body.vehicleNumber || !body.serviceType) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields (Full Name, Phone, Vehicle Number, Service)",
        },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      email: body.email ? body.email.trim() : "",
      vehicleModel: body.vehicleModel ? body.vehicleModel.trim() : "Standard",
      vehicleNumber: body.vehicleNumber.toUpperCase().trim(),
      serviceType: body.serviceType,
      preferredDate: body.preferredDate || new Date().toISOString().split("T")[0],
      preferredTime: body.preferredTime || "10:00",
      notes: body.notes ? body.notes.trim() : "",
      status: "Pending",
      estimatedAmount: Number(body.estimatedAmount) || 5000,
    });

    // Auto-register vehicle in Vehicle collection
    try {
      const existingVehicle = await Vehicle.findOne({
        number: booking.vehicleNumber,
      });

      if (!existingVehicle) {
        await Vehicle.create({
          ownerName: booking.fullName,
          ownerPhone: booking.phone,
          model: booking.vehicleModel,
          number: booking.vehicleNumber,
          status: "In Service",
        });
      }
    } catch (vErr) {
      console.warn("Vehicle auto-create note:", vErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Booking submitted successfully",
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