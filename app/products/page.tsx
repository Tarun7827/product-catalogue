import { ProductList } from "@/components/product-list";
import CategoryBar from "@/components/CategoryBar";
import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Product catalogue
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          Browse products
        </h1>
      </div>
      <div className="w-full mt-10 mb-10bg-white p-4">
        <Suspense fallback={<div className="h-12 w-full rounded-2xl bg-slate-100" />}>
          <CategoryBar />
        </Suspense>
      </div>
      <Suspense fallback={<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>}>
        <ProductList />
      </Suspense>
    </main>
  );
}
