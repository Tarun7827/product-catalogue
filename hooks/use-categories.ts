"use client";

import { useQuery } from "@tanstack/react-query";

import { API_ROUTES } from "@/lib/api-routes";
import { Category } from "@/types/product";

async function fetchCategories(): Promise<Category[]> {
  // Fetch categories from the API for filtering and navigation.
  const response = await fetch(API_ROUTES.categories);

  if (!response.ok) {
    throw new Error("Failed to fetch categories.");
  }

  return response.json();
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    // Categories rarely change — cache aggressively
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}
