import { Product } from "@/types/product";

export interface orderItem {
  _id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  createdAt: string;
  /** Filled client-side from the product catalog (e.g. useProducts). */
  product?: Product;
}