import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Billing from "@/models/Billing";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const bill = await Billing.findById(id);
    if (!bill) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, bill });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (body.status) {
      body.paymentStatus = body.status;
    }
    if (body.amount && !body.totalAmount) {
      body.totalAmount = body.amount;
    }

    const bill = await Billing.findByIdAndUpdate(id, body, { new: true });

    if (!bill) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      bill,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  return PATCH(req, { params });
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const bill = await Billing.findByIdAndDelete(id);
    if (!bill) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}