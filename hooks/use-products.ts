"use client";

import { useQuery } from "@tanstack/react-query";

import { API_ROUTES } from "@/lib/api-routes";
import { Product } from "@/types/product";

async function fetchProducts(): Promise<Product[]> {
  // Frontend fetching is isolated in a hook so product pages can reuse
  // the same loading, caching, and error handling behavior.
  const response = await fetch(API_ROUTES.products);

  if (!response.ok) {
    throw new Error("Failed to fetch products.");
  }

  return response.json();
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    // Keep data fresh for 5 minutes to avoid re-fetching on every tab focus.
    staleTime: 5 * 60 * 1000,
    // Hold cached data for 10 minutes after all subscribers unmount
    gcTime: 10 * 60 * 1000,
  });
}
