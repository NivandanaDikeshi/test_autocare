import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Customer from "@/models/Customer";
import Vehicle from "@/models/Vehicle";
import { generateUserToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      password,
      address = "",
      vehicleNumber = "",
      vehicleModel = "",
    } = body;

    // 1. Validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name, email, phone number, and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();
    const cleanName = name.trim();

    await connectDB();

    // 2. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return NextResponse.json(
          {
            success: false,
            message: "An account with this email address already exists.",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: "An account with this phone number already exists.",
        },
        { status: 409 }
      );
    }

    // 3. Prepare vehicles array
    const vehicles = [];
    if (vehicleNumber?.trim()) {
      vehicles.push({
        vehicleNumber: vehicleNumber.toUpperCase().trim(),
        vehicleModel: vehicleModel.trim() || "Standard",
      });
    }

    // 4. Create user
    const newUser = await User.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password,
      address: address.trim(),
      vehicles,
      role: "customer",
    });

    // 5. Sync / Upsert with Customer model for Admin CRM visibility
    try {
      const existingCustomer = await Customer.findOne({ phone: cleanPhone });
      if (existingCustomer) {
        existingCustomer.fullName = cleanName;
        existingCustomer.email = cleanEmail;
        if (address.trim()) existingCustomer.address = address.trim();
        if (vehicles.length > 0) {
          const hasVeh = existingCustomer.vehicles.some(
            (v) => v.vehicleNumber === vehicles[0].vehicleNumber
          );
          if (!hasVeh) {
            existingCustomer.vehicles.push(vehicles[0]);
          }
        }
        await existingCustomer.save();
      } else {
        await Customer.create({
          fullName: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          address: address.trim(),
          vehicles,
          totalBookings: 0,
          notes: "Registered through Customer Portal",
        });
      }
    } catch (crmErr) {
      console.warn("CRM Customer sync notice:", crmErr.message);
    }

    // 6. Auto-register vehicle in Vehicle collection if provided
    if (vehicles.length > 0) {
      try {
        const existingVehicle = await Vehicle.findOne({
          number: vehicles[0].vehicleNumber,
        });
        if (!existingVehicle) {
          await Vehicle.create({
            ownerName: cleanName,
            ownerPhone: cleanPhone,
            model: vehicles[0].vehicleModel,
            number: vehicles[0].vehicleNumber,
            status: "Active",
          });
        }
      } catch (vehErr) {
        console.warn("Vehicle auto-create notice:", vehErr.message);
      }
    }

    // 7. Generate JWT
    const token = generateUserToken(newUser);

    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      vehicles: newUser.vehicles,
      role: newUser.role,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Customer account created successfully!",
        token,
        user: userResponse,
      },
      { status: 201 }
    );

    // 8. Set HTTP-only cookie
    response.cookies.set("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("User Register API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create account. Please try again.",
      },
      { status: 500 }
    );
  }
}
