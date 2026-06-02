import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

import { connectToDatabase } from "../lib/mongodb";
import Category from "../models/Category";
import Product from "../models/Product";

type EscuelaCategory = {
  id: number;
  name: string;
  slug: string;
  image?: string;
};

type EscuelaProduct = {
  id: number;
  title: string;
  slug?: string;
  price: number;
  description: string;
  category: EscuelaCategory;
  images: string[];
  rating: number;
  reviewCount: number;
  tags: string[];
  source: string;
  externalId: number;
  createdAt: string;
  updatedAt: string;
};

const MAX_IMAGES_PER_PRODUCT = 3;
const FALLBACK_IMAGE = "https://placehold.co/640x480/png?text=Product";
const BLOCKED_IMAGE_HOSTS = new Set([
  "placehold.co",
  "placeimg.com",
  "picsum.photos",
  "placehol1d.co",
]);

function toTags(input: string): string[] {
  return Array.from(
    new Set(
      input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter((token) => token.length >= 3)
        .slice(0, 8),
    ),
  );
}

function isUsableRemoteImage(image: string): boolean {
  try {
    const url = new URL(image);
    return url.protocol === "https:" && !BLOCKED_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function toOptimizedImageUrl(image: string): string {
  const url = new URL(image);

  if (url.hostname === "i.imgur.com") {
    url.pathname = url.pathname.replace(
      /\/([^/.]+)(\.(?:jpe?g|png|webp))$/i,
      "/$1l$2",
    );
  }

  return url.toString();
}

function normalizeImages(images: unknown): string[] {
  const normalized = Array.isArray(images)
    ? images
        .filter((img): img is string => typeof img === "string" && isUsableRemoteImage(img))
        .slice(0, MAX_IMAGES_PER_PRODUCT)
        .map(toOptimizedImageUrl)
    : [];

  return normalized.length ? normalized : [FALLBACK_IMAGE];
}

async function fetchEscuelaProducts(): Promise<EscuelaProduct[]> {
  const res = await fetch("https://api.escuelajs.co/api/v1/products", {
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch EscuelaJS products: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error("Unexpected EscuelaJS response shape (expected array).");
  }
  return data as EscuelaProduct[];
}

async function seedDatabase() {
  // The seed script resets catalogue collections so every local setup
  // starts from the same predictable sample data.
  await connectToDatabase();

  await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);

  const escuelaProducts = await fetchEscuelaProducts();

  const escuelaCategories = Array.from(
    new Map(
      escuelaProducts
        .filter((p) => p?.category?.slug && p?.category?.name)
        .map((p) => [
          p.category.slug.toLowerCase(),
          { name: p.category.name, slug: p.category.slug.toLowerCase(), parentCategory: null as string | null },
        ]),
    ).values(),
  );

  const createdCategories = await Category.insertMany(escuelaCategories);
  const categoryMap = new Map(
    createdCategories.map((category) => [category.slug, category._id.toString()]),
  );

  const products = escuelaProducts
    .filter((p) => p && typeof p.id === "number" && typeof p.title === "string")
    .map((p) => {
      const categorySlug = p.category?.slug?.toLowerCase() ?? "uncategorized";
      const mappedCategoryId =
        categoryMap.get(categorySlug) ??
        // Fallback: store the slug string if category insert was skipped.
        categorySlug;

      return {
        name: p.title,
        description: p.description ?? "",
        price: typeof p.price === "number" ? p.price : 0,
        categoryId: mappedCategoryId,
        brand: p.category?.name ?? "EscuelaJS",
        images: normalizeImages(p.images),
        stock: 50,
        rating: 0,
        reviewCount: 0,
        tags: toTags(`${p.title} ${p.category?.name ?? ""}`),
        source: "escuelajs",
        externalId: p.id,
      };
    });

  await Product.insertMany(products);

  console.log(`Seeded ${createdCategories.length} categories and ${products.length} products from EscuelaJS.`);
}

seedDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exit(1);
  });
