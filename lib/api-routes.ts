/**
 * Paths for Next.js App Router API routes under `app/api/`.
 * Use these for client-side fetch and server rewrites instead of string literals.
 */
export const API_ROUTES = {
  products: "/api/products",
  categories: "/api/categories",
  orders: "/api/orders",
} as const;
