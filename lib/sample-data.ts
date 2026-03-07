type SampleCategory = {
  name: string;
  slug: string;
  parentCategory?: string | null;
};

type SampleProduct = {
  name: string;
  description: string;
  price: number;
  categorySlug: string;
  brand: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
};

export const sampleCategories: SampleCategory[] = [
  { name: "Electronics", slug: "electronics", parentCategory: null },
  { name: "Audio", slug: "audio", parentCategory: "electronics" },
  { name: "Wearables", slug: "wearables", parentCategory: "electronics" },
  { name: "Office", slug: "office", parentCategory: null },
];

export const sampleProducts: SampleProduct[] = [
  {
    name: "Nova Wireless Headphones",
    description: "Over-ear wireless headphones with active noise cancellation.",
    price: 129.99,
    categorySlug: "audio",
    brand: "NovaSound",
    images: ["https://placehold.co/600x400/png?text=Headphones"],
    stock: 24,
    rating: 4.6,
    reviewCount: 148,
    tags: ["audio", "wireless", "noise-cancelling"],
  },
  {
    name: "PixelView 4K Monitor",
    description: "27-inch 4K monitor built for designers and developers.",
    price: 319.99,
    categorySlug: "office",
    brand: "PixelView",
    images: ["https://placehold.co/600x400/png?text=4K+Monitor"],
    stock: 12,
    rating: 4.7,
    reviewCount: 89,
    tags: ["monitor", "4k", "office"],
  },
  {
    name: "SwiftCharge Power Bank",
    description: "High-capacity USB-C power bank for travel and daily use.",
    price: 49.99,
    categorySlug: "electronics",
    brand: "SwiftCharge",
    images: ["https://placehold.co/600x400/png?text=Power+Bank"],
    stock: 64,
    rating: 4.4,
    reviewCount: 231,
    tags: ["battery", "travel", "usb-c"],
  },
  {
    name: "Orbit Smartwatch",
    description: "Fitness-focused smartwatch with heart-rate and sleep tracking.",
    price: 199.99,
    categorySlug: "wearables",
    brand: "Orbit",
    images: ["https://placehold.co/600x400/png?text=Smartwatch"],
    stock: 30,
    rating: 4.3,
    reviewCount: 102,
    tags: ["watch", "fitness", "wearable"],
  },
  {
    name: "Aero Mechanical Keyboard",
    description: "Compact mechanical keyboard with hot-swappable switches.",
    price: 109.99,
    categorySlug: "office",
    brand: "AeroKeys",
    images: ["https://placehold.co/600x400/png?text=Keyboard"],
    stock: 40,
    rating: 4.8,
    reviewCount: 315,
    tags: ["keyboard", "mechanical", "office"],
  },
  {
    name: "Luma Desk Lamp",
    description: "Minimal LED desk lamp with adjustable brightness levels.",
    price: 39.99,
    categorySlug: "office",
    brand: "Luma",
    images: ["https://placehold.co/600x400/png?text=Desk+Lamp"],
    stock: 52,
    rating: 4.5,
    reviewCount: 76,
    tags: ["lighting", "desk", "office"],
  },
  {
    name: "Trail Bluetooth Speaker",
    description: "Portable speaker with waterproof design and long battery life.",
    price: 79.99,
    categorySlug: "audio",
    brand: "Trail",
    images: ["https://placehold.co/600x400/png?text=Speaker"],
    stock: 18,
    rating: 4.2,
    reviewCount: 154,
    tags: ["speaker", "portable", "bluetooth"],
  },
  {
    name: "Zen Webcam Pro",
    description: "1080p webcam with autofocus for meetings and streaming.",
    price: 69.99,
    categorySlug: "electronics",
    brand: "ZenVision",
    images: ["https://placehold.co/600x400/png?text=Webcam"],
    stock: 27,
    rating: 4.1,
    reviewCount: 58,
    tags: ["webcam", "video", "streaming"],
  },
  {
    name: "Arc Laptop Stand",
    description: "Aluminum laptop stand designed for clean desktop ergonomics.",
    price: 34.99,
    categorySlug: "office",
    brand: "Arc",
    images: ["https://placehold.co/600x400/png?text=Laptop+Stand"],
    stock: 71,
    rating: 4.6,
    reviewCount: 129,
    tags: ["laptop", "stand", "office"],
  },
  {
    name: "Pulse Fitness Earbuds",
    description: "Sweat-resistant earbuds tuned for workouts and commuting.",
    price: 89.99,
    categorySlug: "wearables",
    brand: "Pulse",
    images: ["https://placehold.co/600x400/png?text=Earbuds"],
    stock: 36,
    rating: 4.4,
    reviewCount: 198,
    tags: ["earbuds", "fitness", "wireless"],
  },
];
