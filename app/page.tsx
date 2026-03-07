import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
      <div className="max-w-3xl space-y-8">
        <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-medium text-slate-600">
          Next.js 16 + MongoDB Atlas + Mongoose
        </span>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Product Catalogue starter for scalable ecommerce apps.
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            This starter includes typed API routes, MongoDB models, React Query
            fetching, and a responsive Tailwind product grid that is ready for local
            development and production deployment.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          >
            View Products
          </Link>
          <a
            href="https://www.mongodb.com/atlas/database"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Set up MongoDB Atlas
          </a>
        </div>
      </div>
    </main>
  );
}
