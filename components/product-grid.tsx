"use client";

import { memo } from "react";
import { Product } from "@/types/product";

import ProductCard from "./product-card";

type ProductGridProps = {
  products: Product[];
};

function ProductGridInner({ products }: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export const ProductGrid = memo(ProductGridInner);
ProductGrid.displayName = "ProductGrid";
