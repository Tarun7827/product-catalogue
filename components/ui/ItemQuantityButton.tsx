"use client";

import { incrementItem, decrementItem, removeItem } from "@/lib/store/cartSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { Product } from "@/types/product";

type ItemQuantityButtonProps = {
  product: Product;
  quantity: number;
};

export default function ItemQuantityButton({ product, quantity }: ItemQuantityButtonProps) {
  const dispatch = useAppDispatch();

  const handleIncrement = () => {
    dispatch(incrementItem(product._id));
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      dispatch(decrementItem(product._id));
    } else {
      dispatch(removeItem(product._id));
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white">
      <button
        className="px-3 py-1 text-lg font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        onClick={handleDecrement}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-900">
        {quantity}
      </span>
      <button
        className="px-3 py-1 text-lg font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        onClick={handleIncrement}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}