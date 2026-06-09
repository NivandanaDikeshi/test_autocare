import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import connectDB from "../lib/mongodb.js";
import Admin from "../models/Admin.js";

async function createAdmin() {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    await Admin.deleteMany({});

    const admin = await Admin.create({
      email: "admin@autocare.com",
      password: "123456",
      role: "admin",
    });

    console.log("✅ Admin Created Successfully");
    console.log({
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:");
    console.error(error);

    process.exit(1);
  }
}

createAdmin();