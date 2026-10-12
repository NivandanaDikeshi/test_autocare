import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Billing from "@/models/Billing";

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
    const { status, ...rest } = await req.json();

    const updateData = { ...rest };
    if (status) updateData.status = status;

    const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // When status changes to Confirmed or Completed, auto-create Billing invoice
    if (status === "Confirmed" || status === "Completed") {
      const exists = await Billing.findOne({
        $or: [{ bookingId: id }, { vehicleNumber: booking.vehicleNumber }],
      });

      if (!exists) {
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
          spareParts: [
            { name: "Service Labor", price: baseAmount - 1500, quantity: 1 },
            { name: "Workshop Inspection", price: 1500, quantity: 1 },
          ],
          status: status === "Completed" ? "Paid" : "Unpaid",
          paymentStatus: status === "Completed" ? "Paid" : "Unpaid",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking PATCH Error:", error);
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

    await Booking.findByIdAndDelete(id);

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