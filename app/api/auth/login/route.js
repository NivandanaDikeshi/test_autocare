import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Admin from "@/models/Admin";
import { generateUserToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, emailOrPhone, password } = await req.json();
    const identifier = (emailOrPhone || email || "").trim();

    if (!identifier || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your email/phone and password.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const cleanId = identifier.toLowerCase();

    // 1. Strict Role Enforcement: Prevent Administrators from logging in via Customer portal
    const adminCheck = await Admin.findOne({ email: cleanId });
    if (adminCheck) {
      return NextResponse.json(
        {
          success: false,
          isAdminAccount: true,
          message:
            "Admin accounts cannot log in through the Customer portal. Please sign in via the dedicated Admin Panel.",
        },
        { status: 403 }
      );
    }

    // 2. Find user by email OR phone
    let user = await User.findOne({
      $or: [{ email: cleanId }, { phone: identifier }],
    });

    // If user has role admin in User model, also reject
    if (user && user.role === "admin") {
      return NextResponse.json(
        {
          success: false,
          isAdminAccount: true,
          message:
            "Admin accounts cannot log in through the Customer portal. Please sign in via the dedicated Admin Panel.",
        },
        { status: 403 }
      );
    }

    // 3. Demo fallback for customer
    if (
      !user &&
      cleanId === "customer@autocare.com" &&
      password === "123456"
    ) {
      user = await User.create({
        name: "Ravini Amaya",
        email: "customer@autocare.com",
        phone: "0770254687",
        password: "123456",
        address: "12 Peradeniya Road, Kandy",
        vehicles: [{ vehicleNumber: "VZR-5467", vehicleModel: "Honda Vezel" }],
        role: "customer",
      });
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email/phone or password.",
        },
        { status: 401 }
      );
    }

    // 4. Verify password
    let isMatch = false;
    if (typeof user.comparePassword === "function") {
      isMatch = await user.comparePassword(password);
    }
    if (!isMatch && user.password === password) {
      isMatch = true;
    }

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email/phone or password.",
        },
        { status: 401 }
      );
    }

    // 5. Generate JWT
    const token = generateUserToken(user);

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address || "",
      vehicles: user.vehicles || [],
      role: user.role || "customer",
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Logged in successfully!",
        token,
        user: userResponse,
      },
      { status: 200 }
    );

    // 6. Set HTTP-only cookie for customer and clear any admin cookies
    response.cookies.set("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("User Login API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error during login. Please try again.",
      },
      { status: 500 }
    );
  }
}
