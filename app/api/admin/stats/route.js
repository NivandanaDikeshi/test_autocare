import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Billing from "@/models/Billing";
import Service from "@/models/Service";
import Part from "@/models/Part";
import Vehicle from "@/models/Vehicle";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await connectDB();

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      customers,
      servicesCount,
      partsCount,
      vehiclesCount,
      contactsCount,
      bills,
      recentBookings,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "Pending" }),
      Booking.countDocuments({ status: "Confirmed" }),
      Booking.countDocuments({ status: "Completed" }),
      Booking.distinct("phone"),
      Service.countDocuments(),
      Part.countDocuments(),
      Vehicle.countDocuments(),
      Contact.countDocuments(),
      Billing.find(),
      Booking.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const paidBills = bills.filter((b) => b.status === "Paid");
    const unpaidBills = bills.filter((b) => b.status === "Unpaid");

    const paidRevenue = paidBills.reduce(
      (sum, b) => sum + (Number(b.amount || b.totalAmount) || 0),
      0
    );

    const totalRevenue =
      paidRevenue > 0
        ? paidRevenue
        : totalBookings * 5000;

    return NextResponse.json({
      success: true,
      stats: {
        bookings: totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        customers: customers.length,
        services: servicesCount || 6,
        parts: partsCount,
        vehicles: vehiclesCount,
        contacts: contactsCount,
        billsCount: bills.length,
        unpaidBillsCount: unpaidBills.length,
        revenue: totalRevenue,
      },
      recentBookings,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard stats",
        error: error.message,
      },
      { status: 500 }
    );
  }
}