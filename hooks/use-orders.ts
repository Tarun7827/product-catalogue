"use client";

import { useQuery } from "@tanstack/react-query";

import { API_ROUTES } from "@/lib/api-routes";
import type { orderItem } from "@/types/Order";

export const ordersQueryKey = ["orders"] as const;

async function fetchOrders(): Promise<orderItem[]> {
  const response = await fetch(API_ROUTES.orders);

  if (!response.ok) {
    throw new Error("Failed to fetch orders.");
  }

  return response.json();
}

export function useOrders() {
  return useQuery({
    queryKey: ordersQueryKey,
    queryFn: fetchOrders,
    staleTime: 60_000,
  });
}
