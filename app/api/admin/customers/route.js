import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Booking from "@/models/Booking";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let query = {};
    if (search) {
      query.$or = [
        { fullName: new RegExp(search.trim(), "i") },
        { phone: new RegExp(search.trim(), "i") },
        { email: new RegExp(search.trim(), "i") },
      ];
    }

    let customers = await Customer.find(query).sort({ createdAt: -1 });

    // If customer table is empty, auto-populate from bookings
    if (customers.length === 0 && !search) {
      const bookings = await Booking.find();
      const map = new Map();

      for (const b of bookings) {
        if (!b.phone) continue;
        if (!map.has(b.phone)) {
          map.set(b.phone, {
            fullName: b.fullName,
            phone: b.phone,
            email: b.email || "",
            vehicles: [
              {
                vehicleNumber: b.vehicleNumber,
                vehicleModel: b.vehicleModel,
              },
            ],
            totalBookings: 1,
          });
        } else {
          const item = map.get(b.phone);
          item.totalBookings += 1;
          if (
            !item.vehicles.some((v) => v.vehicleNumber === b.vehicleNumber)
          ) {
            item.vehicles.push({
              vehicleNumber: b.vehicleNumber,
              vehicleModel: b.vehicleModel,
            });
          }
        }
      }

      const seedList = Array.from(map.values());
      if (seedList.length > 0) {
        customers = await Customer.insertMany(seedList);
      }
    }

    return NextResponse.json({
      success: true,
      customers,
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

    if (!body.fullName || !body.phone) {
      return NextResponse.json(
        { success: false, message: "Full Name and Phone are required" },
        { status: 400 }
      );
    }

    const customer = await Customer.create({
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      email: body.email ? body.email.trim() : "",
      address: body.address ? body.address.trim() : "",
      vehicles: Array.isArray(body.vehicles) ? body.vehicles : [],
      notes: body.notes || "",
    });

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
