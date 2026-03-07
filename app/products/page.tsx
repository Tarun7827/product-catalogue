import { ProductList } from "@/components/product-list";

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
        <p className="max-w-2xl text-base leading-7 text-slate-600">
          This page fetches products from the API route and renders them in a responsive
          grid using React Query for client-side loading and caching.
        </p>
      </div>

      <ProductList />
    </main>
  );
}
