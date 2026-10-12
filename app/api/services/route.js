import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
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
        { customerName: new RegExp(search.trim(), "i") },
        { vehicleNumber: new RegExp(search.trim(), "i") },
        { mechanic: new RegExp(search.trim(), "i") },
      ];
    }

    const services = await Service.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      services,
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
    const data = await req.json();

    if (!data.customerName || !data.vehicleNumber || !data.serviceType) {
      return NextResponse.json(
        { success: false, message: "Customer name, vehicle number, and service type are required" },
        { status: 400 }
      );
    }

    const service = await Service.create({
      customerName: data.customerName.trim(),
      vehicleNumber: data.vehicleNumber.toUpperCase().trim(),
      serviceType: data.serviceType.trim(),
      mechanic: data.mechanic ? data.mechanic.trim() : "Unassigned",
      notes: data.notes ? data.notes.trim() : "",
      status: data.status || "Received",
      cost: Number(data.cost) || 0,
      spareParts: Array.isArray(data.spareParts) ? data.spareParts : [],
    });

    return NextResponse.json({
      success: true,
      service,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}