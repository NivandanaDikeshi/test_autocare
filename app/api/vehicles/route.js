import connectDB from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    let query = {};
    if (status && status !== "All") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { ownerName: new RegExp(search.trim(), "i") },
        { model: new RegExp(search.trim(), "i") },
        { number: new RegExp(search.trim(), "i") },
      ];
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      vehicles,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.model || !data.number) {
      return NextResponse.json(
        { success: false, message: "Vehicle model and license plate number are required" },
        { status: 400 }
      );
    }

    const vehicle = await Vehicle.create({
      ownerName: data.ownerName ? data.ownerName.trim() : "",
      ownerPhone: data.ownerPhone ? data.ownerPhone.trim() : "",
      name: data.name ? data.name.trim() : data.model,
      model: data.model.trim(),
      number: data.number.toUpperCase().trim(),
      year: data.year || "",
      status: data.status || "Active",
    });

    return NextResponse.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}