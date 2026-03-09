import { ProductList } from "@/components/product-list";
import CategoryBar from "@/components/CategoryBar";

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
      <div className="w-full mt-10 mb-10 rounded-full overflow-hidden border border-slate-200 bg-white p-4">
        <CategoryBar />
      </div>
      <ProductList />
    </main>
  );
}
