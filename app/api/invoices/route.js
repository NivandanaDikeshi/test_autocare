import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let query = {};
    if (search) {
      query.$or = [
        { customerName: new RegExp(search.trim(), "i") },
        { vehicleNumber: new RegExp(search.trim(), "i") },
        { invoiceNumber: new RegExp(search.trim(), "i") },
      ];
    }

    const invoices = await Invoice.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      invoices,
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

    const body = await req.json();

    const invoiceNumber = body.invoiceNumber || "INV-" + Date.now();
    const amount = Number(body.amount || body.totalAmount) || 0;

    const invoice = await Invoice.create({
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
      invoice,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}