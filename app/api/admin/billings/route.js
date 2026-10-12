import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Billing from "@/models/Billing";

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
        { invoiceNumber: new RegExp(search.trim(), "i") },
      ];
    }

    const bills = await Billing.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      bills,
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

    const invoiceNumber = body.invoiceNumber || "INV-" + Date.now();
    const amount = Number(body.amount || body.totalAmount) || 0;

    const bill = await Billing.create({
      invoiceNumber,
      customerName: body.customerName,
      customerEmail: body.email || body.customerEmail || "",
      customerPhone: body.phone || body.customerPhone || "",
      vehicleNumber: (body.vehicle || body.vehicleNumber || "").toUpperCase().trim(),
      vehicleModel: body.vehicleModel || "",
      serviceType: body.service || body.serviceType || "General Service",
      amount,
      totalAmount: amount,
      status: body.status || "Unpaid",
      paymentStatus: body.status || "Unpaid",
      dueDate: body.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: body.notes || "",
    });

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
