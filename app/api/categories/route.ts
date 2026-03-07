import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  try {
    // Categories are returned in name order so forms and filters
    // have a stable, user-friendly default sort.
    await connectToDatabase();

    const categories = await Category.find().sort({ name: 1 }).lean();

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { message: "Failed to fetch categories." },
      { status: 500 },
    );
  }
}
