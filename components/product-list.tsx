"use client";

import { useSearchParams } from "next/navigation";

import { ProductGrid } from "@/components/product-grid";
import { useProducts } from "@/hooks/use-products";

export function ProductList() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const { data: allProducts = [], isLoading, isError } = useProducts();

  // Filter products based on the selected category from URL query param.
  const products = selectedCategory
    ? allProducts.filter((product) => product.categoryId === selectedCategory)
    : allProducts;

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Unable to load products right now. Make sure your API and database are configured.
      </div>
    );
  }

  if (!allProducts.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        No products found yet. Run <code className="rounded bg-slate-100 px-2 py-1">npm run seed</code>{" "}
        after setting up <code className="rounded bg-slate-100 px-2 py-1">.env.local</code>.
      </div>
    );
  }

  if (!products.length && selectedCategory) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        No products found in this category.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{products.length}</span> product{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
