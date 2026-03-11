"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/CartItem";

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [] as CartItem[],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
console.log(action.payload);
        const index = state.items.findIndex(
        (item) => item.product._id === action.payload.product._id
      );
      if (index !== -1) {
        state.items[index].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      const index = state.items.findIndex((item) => item.product._id === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    incrementItem(state, action: PayloadAction<string>) {
      const index = state.items.findIndex((item) => item.product._id === action.payload);
      if (index !== -1) {
        state.items[index].quantity += 1;
      }
    },
    decrementItem(state, action: PayloadAction<string>) {
      const index = state.items.findIndex((item) => item.product._id === action.payload);
      if (index !== -1) {
        if (state.items[index].quantity > 1) {
          state.items[index].quantity -= 1;
        } else {
          state.items.splice(index, 1);
        }
      }
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const index = state.items.findIndex(
        (item) => item.product._id === action.payload.productId
      );
      if (index !== -1) {
        if (action.payload.quantity <= 0) {
          state.items.splice(index, 1);
        } else {
          state.items[index].quantity = action.payload.quantity;
        }
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, incrementItem, decrementItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;