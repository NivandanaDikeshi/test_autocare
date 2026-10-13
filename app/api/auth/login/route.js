import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
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

    // 1. Find user by email OR phone
    let user = await User.findOne({
      $or: [{ email: cleanId }, { phone: identifier }],
    });

    // 2. Demo fallback if user count is 0 or demo login used
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

    // 3. Verify password
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

    // 4. Generate JWT
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

    // 5. Set HTTP-only cookie
    response.cookies.set("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
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
