"use client";

import { memo, useCallback } from "react";
import { incrementItem, decrementItem, removeItem } from "@/lib/store/cartSlice";
import { useAppDispatch } from "@/lib/store/hooks";

type ItemQuantityButtonProps = {
  productId: string;
  quantity: number;
};

function ItemQuantityButtonInner({ productId, quantity }: ItemQuantityButtonProps) {
  const dispatch = useAppDispatch();

  const handleIncrement = useCallback(() => {
    dispatch(incrementItem(productId));
  }, [dispatch, productId]);

  const handleDecrement = useCallback(() => {
    if (quantity > 1) {
      dispatch(decrementItem(productId));
    } else {
      dispatch(removeItem(productId));
    }
  }, [dispatch, productId, quantity]);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        className="px-3 py-1 text-lg font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        onClick={handleDecrement}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-900">
        {quantity}
      </span>
      <button
        type="button"
        className="px-3 py-1 text-lg font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        onClick={handleIncrement}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

const ItemQuantityButton = memo(ItemQuantityButtonInner);
ItemQuantityButton.displayName = "ItemQuantityButton";

export default ItemQuantityButton;
