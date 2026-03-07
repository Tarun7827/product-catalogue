import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

import { connectToDatabase } from "../lib/mongodb";
import { sampleCategories, sampleProducts } from "../lib/sample-data";
import Category from "../models/Category";
import Product from "../models/Product";

async function seedDatabase() {
  // The seed script resets catalogue collections so every local setup
  // starts from the same predictable sample data.
  await connectToDatabase();

  await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);

  const createdCategories = await Category.insertMany(sampleCategories);
  const categoryMap = new Map(createdCategories.map((category) => [category.slug, category._id.toString()]));

  const products = sampleProducts.map((product) => ({
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: categoryMap.get(product.categorySlug) ?? product.categorySlug,
    brand: product.brand,
    images: product.images,
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    tags: product.tags,
  }));

  await Product.insertMany(products);

  console.log(`Seeded ${createdCategories.length} categories and ${products.length} products.`);
}

seedDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exit(1);
  });
