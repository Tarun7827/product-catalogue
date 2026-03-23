"use client";

import Image from "next/image";
import { memo, useCallback, useMemo } from "react";
import { Product } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/cartSlice";
import type { RootState } from "@/lib/store/store";
import ItemQuantityButton from "./ui/ItemQuantityButton";

type ProductCardProps = {
  product: Product;
};

function selectCartQuantity(state: RootState, productId: string): number {
  const items = state.cart?.items;
  if (!items?.length) return 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].product._id === productId) {
      return items[i].quantity;
    }
  }
  return 0;
}

function ProductCardInner({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const quantity = useAppSelector((state: RootState) =>
    selectCartQuantity(state, product._id),
  );

  const imageUrl = useMemo(() => {
    const first = product.images[0];
    return first?.includes("https")
      ? first
      : "https://placehold.co/600x400/png?text=Product";
  }, [product.images]);

  const handleAddToCart = useCallback(() => {
    dispatch(addItem({ product, quantity: 1 }));
  }, [dispatch, product]);

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
          {quantity > 0 ? (
            <ItemQuantityButton productId={product._id} quantity={quantity} />
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

const ProductCard = memo(ProductCardInner);
ProductCard.displayName = "ProductCard";

export default ProductCard;
