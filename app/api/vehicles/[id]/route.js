import connectDB from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();

    if (data.number) {
      data.number = data.number.toUpperCase().trim();
    }

    const vehicle = await Vehicle.findByIdAndUpdate(id, data, { new: true });

    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  return PUT(req, { params });
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    await Vehicle.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}