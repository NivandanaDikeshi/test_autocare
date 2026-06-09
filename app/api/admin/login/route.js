import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Demo admin credentials
    const ADMIN_EMAIL = "admin@autocare.com";
    const ADMIN_PASSWORD = "123456";

    // Check credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: true,
          message: "Login successful",
          user: {
            email,
            role: "admin",
          },
        },
        { status: 200 }
      );
    }

    // Invalid login
    return NextResponse.json(
      {
        success: false,
        message: "Invalid email or password",
      },
      { status: 401 }
    );

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