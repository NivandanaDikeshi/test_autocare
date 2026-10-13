import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Billing from "@/models/Billing";
import Customer from "@/models/Customer";
import Vehicle from "@/models/Vehicle";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const token =
      req.cookies.get("user_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Fetch user's bookings and invoices matching user's phone or email
    const [bookings, billings] = await Promise.all([
      Booking.find({
        $or: [{ phone: user.phone }, { email: user.email }],
      }).sort({ createdAt: -1 }),
      Billing.find({
        $or: [{ customerPhone: user.phone }, { customerEmail: user.email }],
      }).sort({ createdAt: -1 }),
    ]);

    return NextResponse.json({
      success: true,
      user,
      bookings,
      billings,
    });
  } catch (error) {
    console.error("GET /api/auth/me Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const token =
      req.cookies.get("user_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { name, address, vehicles } = body;

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (name?.trim()) user.name = name.trim();
    if (address !== undefined) user.address = address.trim();
    if (Array.isArray(vehicles)) {
      user.vehicles = vehicles;
    }

    // Support password update
    if (body.newPassword) {
      if (!body.currentPassword) {
        return NextResponse.json(
          { success: false, message: "Please provide your current password." },
          { status: 400 }
        );
      }
      const isMatch = await user.comparePassword(body.currentPassword);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Current password is incorrect." },
          { status: 400 }
        );
      }
      if (body.newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: "New password must be at least 6 characters." },
          { status: 400 }
        );
      }
      user.password = body.newPassword;
    }

    await user.save();

    // Sync changes to Customer & Vehicle records
    try {
      await Customer.findOneAndUpdate(
        { phone: user.phone },
        {
          fullName: user.name,
          address: user.address,
          vehicles: user.vehicles,
        }
      );

      // Register any new vehicles in Vehicle collection
      for (const veh of user.vehicles || []) {
        if (veh.vehicleNumber) {
          const exists = await Vehicle.findOne({ number: veh.vehicleNumber });
          if (!exists) {
            await Vehicle.create({
              ownerName: user.name,
              ownerPhone: user.phone,
              model: veh.vehicleModel || "Standard",
              number: veh.vehicleNumber,
              status: "Active",
            });
          }
        }
      }
    } catch (syncErr) {
      console.warn("Sync error:", syncErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        vehicles: user.vehicles,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("PUT /api/auth/me Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
