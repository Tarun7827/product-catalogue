"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/cartSlice";
import type { RootState } from "@/lib/store/store";
import ItemQuantityButton from "./ui/ItemQuantityButton";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector((state: RootState) =>
    state.cart?.items?.find((item) => item.product._id === product._id)
  );

  console.log(`Product ${product.name} - In cart:`, !!cartItem);

  const imageUrl = product.images[0]?.includes("https")
    ? product.images[0]
    : "https://placehold.co/600x400/png?text=Product";

  const handleAddToCart = () => {
    console.log("=== Add to Cart Clicked ===");
    console.log("Product:", product);
    console.log("Cart items before:", cartItem);
    try {
      dispatch(addItem({ product, quantity: 1 }));
      console.log("Item added successfully");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      <div className="space-y-3 p-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{product.brand}</p>
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            Stock: {product.stock}
          </span>
        </div>

        <div className="pt-2">
          {cartItem ? (
            <ItemQuantityButton product={product} quantity={cartItem.quantity} />
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 active:bg-slate-700"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
