"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ProductGrid } from "@/components/product-grid";
import { useProducts } from "@/hooks/use-products";

const PAGE_SIZE = 12;

export function ProductList() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const [pagination, setPagination] = useState<{
    category: string | null;
    page: number;
  }>({ category: selectedCategory, page: 1 });

  const { data: allProducts = [], isLoading, isError } = useProducts();

  const filtered = useMemo(() => {
    if (!selectedCategory) return allProducts;
    return allProducts.filter((p) => p.categoryId === selectedCategory);
  }, [allProducts, selectedCategory]);

  const page = pagination.category === selectedCategory ? pagination.page : 1;
  const setPageForCategory = (getPage: (page: number) => number) => {
    setPagination((current) => ({
      category: selectedCategory,
      page: getPage(current.category === selectedCategory ? current.page : 1),
    }));
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageProducts = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage],
  );

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div
            key={i}
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
        No products found yet. Run{" "}
        <code className="rounded bg-slate-100 px-2 py-1">npm run seed</code> after
        setting up <code className="rounded bg-slate-100 px-2 py-1">.env.local</code>.
      </div>
    );
  }

  if (!filtered.length && selectedCategory) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        No products found in this category.
      </div>
    );
  }

  const start = (safePage - 1) * PAGE_SIZE + 1;
  const end = Math.min(safePage * PAGE_SIZE, filtered.length);

  return (
    <div className="space-y-6">
      {/* Count bar */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {start}-{end}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
          product{filtered.length !== 1 ? "s" : ""}
        </p>

        {totalPages > 1 && (
          <p className="text-sm text-slate-500">
            Page {safePage} / {totalPages}
          </p>
        )}
      </div>

      <ProductGrid products={pageProducts} />

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setPageForCategory((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === totalPages || Math.abs(p - safePage) <= 1,
              )
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) {
                  acc.push("...");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 py-2 text-sm text-slate-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPageForCategory(() => p as number)}
                    className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      p === safePage
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
          </div>

          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => setPageForCategory((p) => Math.min(totalPages, p + 1))}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
