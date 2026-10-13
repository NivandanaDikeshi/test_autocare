import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import User from "@/models/User";
import { generateAdminToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const cleanEmail = email.toLowerCase().trim();

    // 1. Strict Role Enforcement: Prevent Customer accounts from logging into Admin Panel
    const customerAccount = await User.findOne({ email: cleanEmail });
    if (customerAccount && customerAccount.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          isCustomerAccount: true,
          message:
            "Access denied: Customer accounts cannot log in through the Admin Panel. Please use the Customer Login portal.",
        },
        { status: 403 }
      );
    }

    // 2. Also check if customer demo email was entered
    if (cleanEmail === "customer@autocare.com") {
      return NextResponse.json(
        {
          success: false,
          isCustomerAccount: true,
          message:
            "Access denied: Customer accounts cannot log in through the Admin Panel. Please use the Customer Login portal.",
        },
        { status: 403 }
      );
    }

    let admin = await Admin.findOne({ email: cleanEmail });

    // Fallback: If no admin exists yet in database, seed default admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0 && cleanEmail === "admin@autocare.com" && password === "123456") {
      admin = await Admin.create({
        email: "admin@autocare.com",
        password: "123456",
        role: "admin",
      });
    }

    if (!admin) {
      // Also check fallback for demo
      if (cleanEmail === "admin@autocare.com" && password === "123456") {
        admin = await Admin.create({
          email: "admin@autocare.com",
          password: "123456",
          role: "admin",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid administrator email or password",
          },
          { status: 401 }
        );
      }
    }

    // Verify password
    let isMatch = false;
    if (typeof admin.comparePassword === "function") {
      isMatch = await admin.comparePassword(password);
    }
    if (!isMatch && admin.password === password) {
      isMatch = true;
    }

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const token = generateAdminToken(admin);

    const response = NextResponse.json(
      {
        success: true,
        message: "Administrator login successful",
        token,
        user: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 200 }
    );

    // Set admin cookies on response and clear user cookies
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    response.cookies.set("user_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}