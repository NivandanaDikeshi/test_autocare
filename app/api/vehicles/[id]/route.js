import connectDB from "../../../lib/mongodb";
import Vehicle from "../../../models/Vehicle";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const vehicle = await Vehicle.findById(
      params.id
    );

    return NextResponse.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const data = await req.json();

    const vehicle =
      await Vehicle.findByIdAndUpdate(
        params.id,
        data,
        { new: true }
      );

    return NextResponse.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req,
  { params }
) {
  try {
    await connectDB();

    await Vehicle.findByIdAndDelete(
      params.id
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}