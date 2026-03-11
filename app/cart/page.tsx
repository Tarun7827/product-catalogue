"use client";

import { useAppSelector } from "@/lib/store/hooks";
import type { RootState } from "@/lib/store/store";
import CartItem from "./CartItem";

export default function CartPage() {
  const cartItems = useAppSelector((state: RootState) => state.cart?.items ?? []);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  console.log(cartItems);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <div className="mb-10 space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg text-slate-500">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Total</h2>
              <p className="text-2xl font-bold text-slate-900">${totalAmount.toFixed(2)}</p>
            </div>
            <button className="mt-6 w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}