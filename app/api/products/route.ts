import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    // API routes connect on demand so serverless and local development
    // both use the same database access flow.
    await connectToDatabase();

    const products = await Product.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    if (
      !body.name ||
      !body.description ||
      typeof body.price !== "number" ||
      !body.categoryId ||
      !body.brand ||
      typeof body.stock !== "number"
    ) {
      return NextResponse.json(
        { message: "Missing required product fields." },
        { status: 400 },
      );
    }

    const product = await Product.create({
      name: body.name,
      description: body.description,
      price: body.price,
      categoryId: body.categoryId,
      brand: body.brand,
      images: body.images ?? [],
      stock: body.stock,
      rating: body.rating ?? 0,
      reviewCount: body.reviewCount ?? 0,
      tags: body.tags ?? [],
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { message: "Failed to create product." },
      { status: 500 },
    );
  }
}
