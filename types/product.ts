export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  brand: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
