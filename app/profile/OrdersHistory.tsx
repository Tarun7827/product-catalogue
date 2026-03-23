"use client";

import { useOrders } from "@/hooks/use-orders";
import { useProducts } from "@/hooks/use-products";
import Image from "next/image";
import { useMemo } from "react";

export default function OrdersHistory() {
  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersQueryError,
  } = useOrders();
  const { data: allProducts = [], isLoading: productsLoading, isError: productsError } =
    useProducts();

  const ordersWithProducts = useMemo(() => {
    return orders.map((row) => {
      const product = allProducts.find((p) => p._id === row.product_id);
      return { ...row, product };
    });
  }, [orders, allProducts]);

  const imageUrl = (images: string[] | undefined) => {
    const first = images?.[0];
    return first?.includes("https")
      ? first
      : "https://placehold.co/120x120/png?text=Product";
  };

  return (
    <div className="flex w-full flex-col gap-5 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Orders History</h1>
      {ordersLoading && <p className="text-slate-600">Loading orders…</p>}
      {ordersError && (
        <p className="text-red-600">
          Error: {ordersQueryError instanceof Error ? ordersQueryError.message : "Failed to load orders"}
        </p>
      )}
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
              order.product && <li
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
                    {order.product != undefined ? order.product.name : (productsLoading ? "Loading…" : "Product unavailable")}
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
        {!ordersLoading && orders.length === 0 && (
          <p className="text-slate-500">You have no orders yet.</p>
        )}
      </div>
    </div>
  );
}
