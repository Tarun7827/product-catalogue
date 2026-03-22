"use client";

import { API_ROUTES } from "@/lib/api-routes";
import { useProducts } from "@/hooks/use-products";
import { orderItem } from "@/types/Order";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function OrdersHistory() {
  const [orders, setOrders] = useState<orderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: allProducts = [], isLoading: productsLoading, isError: productsError } =
    useProducts();

  const ordersWithProducts = useMemo(() => {
    return orders.map((row) => {
      const product = allProducts.find((p) => p._id === row.product_id);
      return { ...row, product };
    });
  }, [orders, allProducts]);

  const fetchOrders = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ROUTES.orders, { signal });
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data: orderItem[] = await response.json();
      setOrders(data);
    } catch (err) {
      if (signal.aborted) {
        return;
      }
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchOrders(controller.signal);
    return () => controller.abort();
  }, [fetchOrders]);

  const imageUrl = (images: string[] | undefined) => {
    const first = images?.[0];
    return first?.includes("https")
      ? first
      : "https://placehold.co/120x120/png?text=Product";
  };

  return (
    <div className="flex w-full flex-col gap-5 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Orders History</h1>
      {loading && <p className="text-slate-600">Loading orders…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {productsError && (
        <p className="text-amber-700">Could not load product details for some items.</p>
      )}
      {productsLoading && orders.length > 0 && (
        <p className="text-sm text-slate-500">Loading product details…</p>
      )}
      <div>
        {ordersWithProducts.length > 0 && (
          <ul className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            {ordersWithProducts.map((order) => (
              <li
                key={order._id}
                className="flex w-full items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                {order.product ? (
                  <Image
                    className="h-20 w-20 shrink-0 rounded-md object-cover"
                    src={imageUrl(order.product.images)}
                    alt={order.product.name}
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-500">
                    {productsLoading ? "…" : "?"}
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h2 className="truncate font-semibold text-slate-900">
                    {order.product?.name ?? (productsLoading ? "Loading…" : "Product unavailable")}
                  </h2>
                  <p className="text-sm text-slate-600">
                    Price: ${order.price?.toFixed(2) ?? "0.00"}
                  </p>
                  <p className="text-sm text-slate-600">Quantity: {order.quantity ?? 0}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!loading && orders.length === 0 && (
          <p className="text-slate-500">You have no orders yet.</p>
        )}
      </div>
    </div>
  );
}
