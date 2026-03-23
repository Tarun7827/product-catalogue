"use client";

import type { CartItem as CartItemType } from "@/types/CartItem";
import Image from "next/image";
import ItemQuantityButton from "@/components/ui/ItemQuantityButton";

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const { product, quantity } = item;

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-slate-100">
          <Image
            src={product.images[0] ?? "https://placehold.co/600x400/png?text=Product"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-900">{product.name}</h3>
          <p className="text-sm text-slate-500">{product.brand}</p>
          <p className="text-sm font-medium text-slate-700">${product.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ItemQuantityButton productId={product._id} quantity={quantity} />
        <p className="min-w-[5rem] text-right text-sm font-bold text-slate-900">
          ${(product.price * quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}