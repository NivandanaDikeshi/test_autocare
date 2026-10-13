import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { generateToken } from "@/lib/auth";

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

    let admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    // Fallback: If no admin exists yet in database, seed default admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0 && email.toLowerCase().trim() === "admin@autocare.com" && password === "123456") {
      admin = await Admin.create({
        email: "admin@autocare.com",
        password: "123456",
        role: "admin",
      });
    }

    if (!admin) {
      // Also check fallback for demo
      if (email.toLowerCase().trim() === "admin@autocare.com" && password === "123456") {
        admin = await Admin.create({
          email: "admin@autocare.com",
          password: "123456",
          role: "admin",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid email or password",
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

    const token = generateToken(admin);

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        user: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 200 }
    );

    // Set cookies on response
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