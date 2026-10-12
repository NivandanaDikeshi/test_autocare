import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Booking from "@/models/Booking";
import Billing from "@/models/Billing";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    // Fetch complete service history for this customer
    const [bookings, billings] = await Promise.all([
      Booking.find({
        $or: [
          { phone: customer.phone },
          { fullName: new RegExp("^" + customer.fullName + "$", "i") },
        ],
      }).sort({ createdAt: -1 }),
      Billing.find({
        $or: [
          { customerPhone: customer.phone },
          { customerName: new RegExp("^" + customer.fullName + "$", "i") },
        ],
      }).sort({ createdAt: -1 }),
    ]);

    return NextResponse.json({
      success: true,
      customer,
      serviceHistory: {
        bookings,
        billings,
      },
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
    const body = await req.json();

    const customer = await Customer.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    await Customer.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
