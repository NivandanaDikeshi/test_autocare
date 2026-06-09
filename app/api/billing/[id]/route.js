import connectDB from "../../../lib/mongodb";
import Booking from "../../../models/Booking";
import Billing from "../../../models/Billing";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { status } = await req.json();

    const booking = await Booking.findById(params.id);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    booking.status = status;
    await booking.save();

    // ✅ Create invoice only when completed
    if (status === "Completed") {
      const existingBill = await Billing.findOne({
        bookingId: booking._id,
      });

      if (!existingBill) {
        await Billing.create({
          bookingId: booking._id,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          vehicleNumber: booking.vehicleNumber,
          serviceType: booking.serviceType,
          amount: booking.totalAmount || booking.amount,
          status: "Paid",
        });
      }
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}