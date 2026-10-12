import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Billing from "@/models/Billing";
import Service from "@/models/Service";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, booking });
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

    const booking = await Booking.findByIdAndUpdate(id, body, { new: true });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // Auto-create bill if status is Confirmed or Completed and no bill exists yet
    if (booking.status === "Confirmed" || booking.status === "Completed") {
      const existingBill = await Billing.findOne({
        $or: [{ bookingId: id }, { vehicleNumber: booking.vehicleNumber }],
      });

      if (!existingBill) {
        const baseAmount = booking.estimatedAmount || 5000;
        await Billing.create({
          invoiceNumber: "INV-" + Date.now(),
          bookingId: String(booking._id),
          customerName: booking.fullName,
          customerEmail: booking.email || "",
          customerPhone: booking.phone || "",
          vehicleModel: booking.vehicleModel || "",
          vehicleNumber: booking.vehicleNumber,
          serviceType: booking.serviceType,
          amount: baseAmount,
          totalAmount: baseAmount,
          status: booking.status === "Completed" ? "Paid" : "Unpaid",
          paymentStatus: booking.status === "Completed" ? "Paid" : "Unpaid",
          spareParts: [
            { name: "Labor & Service Charge", price: baseAmount - 1500, quantity: 1 },
            { name: "Inspection & Diagnostics", price: 1500, quantity: 1 },
          ],
        });
      }

      // Also ensure Service record is created/linked if not yet existing
      const existingService = await Service.findOne({
        vehicleNumber: booking.vehicleNumber,
      });
      if (!existingService) {
        await Service.create({
          customerName: booking.fullName,
          vehicleNumber: booking.vehicleNumber,
          serviceType: booking.serviceType,
          status: booking.status === "Completed" ? "Completed" : "Checking",
          mechanic: "Lead Mechanic",
          notes: booking.notes || "Auto-created from customer booking",
        });
      }
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, ctx) {
  return PATCH(req, ctx);
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}