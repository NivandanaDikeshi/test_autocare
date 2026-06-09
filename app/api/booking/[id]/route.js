import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Booking from "../../../models/Booking";
import Billing from "../../../models/Billing";

// Invoice generator
const generateInvoice = () => "INV-" + Date.now();

export async function PATCH(req, context) {
  try {
    await connectDB();

    // ✅ FIX for Next.js dynamic params
    const { params } = await context;
    const id = params.id;

    const { status } = await req.json();

    // 1. Update booking status
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // 2. AUTO CREATE BILL when confirmed
    if (status === "Confirmed") {
      const exists = await Billing.findOne({ bookingId: id });

      if (!exists) {
        const spareParts = [
          { name: "Service Charge", price: 1000 },
          { name: "Inspection", price: 500 },
        ];

        const totalAmount = spareParts.reduce(
          (sum, item) => sum + item.price,
          0
        );

        await Billing.create({
          invoiceNumber: generateInvoice(),
          bookingId: id,
          customerName: booking.fullName,
          vehicleNumber: booking.vehicleModel,
          serviceType: booking.serviceType,
          spareParts,
          totalAmount,
          paymentStatus: "Unpaid",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}