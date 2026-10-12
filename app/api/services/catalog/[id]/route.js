import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ServiceItem from "@/models/ServiceItem";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    let service = null;
    // Check if ID is a valid Mongo ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await ServiceItem.findById(id);
    }
    // Otherwise look up by slug
    if (!service) {
      service = await ServiceItem.findOne({ slug: id.toLowerCase() });
    }

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, service });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (body.price) body.price = Number(body.price);
    if (typeof body.features === "string") {
      body.features = body.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);
    }

    let query = { _id: id };
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { slug: id.toLowerCase() };
    }

    const service = await ServiceItem.findOneAndUpdate(query, body, {
      new: true,
    });

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, service });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    let query = { _id: id };
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { slug: id.toLowerCase() };
    }

    const service = await ServiceItem.findOneAndDelete(query);
    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
