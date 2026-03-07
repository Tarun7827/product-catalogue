"use client";

import { useQuery } from "@tanstack/react-query";

import { Product } from "@/types/product";

async function fetchProducts(): Promise<Product[]> {
  // Frontend fetching is isolated in a hook so product pages can reuse
  // the same loading, caching, and error handling behavior.
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products.");
  }

  return response.json();
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}
