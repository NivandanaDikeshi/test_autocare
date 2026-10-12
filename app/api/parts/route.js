import connectDB from "@/lib/mongodb";
import Part from "@/models/Part";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    let query = {};
    if (category && category !== "All") {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { partName: new RegExp(search.trim(), "i") },
        { category: new RegExp(search.trim(), "i") },
        { supplier: new RegExp(search.trim(), "i") },
      ];
    }

    const parts = await Part.find(query).sort({ partName: 1 });

    return NextResponse.json({
      success: true,
      parts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    if (!data.partName || data.price === undefined || data.stock === undefined) {
      return NextResponse.json(
        { success: false, message: "Part name, price, and stock are required" },
        { status: 400 }
      );
    }

    const part = await Part.create({
      partName: data.partName.trim(),
      category: data.category ? data.category.trim() : "General",
      stock: Number(data.stock) || 0,
      price: Number(data.price) || 0,
      supplier: data.supplier ? data.supplier.trim() : "",
    });

    return NextResponse.json({
      success: true,
      part,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}