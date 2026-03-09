"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";

export default function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const { data: categories = [], isLoading } = useCategories();

  const handleCategoryClick = (categoryId: string | null) => {
    // Update the URL query param to filter products by category.
    if (categoryId) {
      router.push(`/?category=${categoryId}`);
    } else {
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="border-b border-slate-200 bg-white rounded-2xl">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex gap-3 overflow-x-auto">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-24 animate-pulse rounded-full bg-slate-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex gap-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleCategoryClick(null)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
              !selectedCategory
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200",
            )}
          >
            All Products
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => handleCategoryClick(category._id)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                selectedCategory === category._id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
