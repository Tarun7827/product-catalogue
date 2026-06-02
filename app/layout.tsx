import type { Metadata } from "next";

import { QueryProvider } from "@/components/providers/query-provider";
import Header from "@/components/Header";

import "./globals.css";
import { ReduxProvider } from "./ReduxProvider";

export const metadata: Metadata = {
  title: "Product Catalogue",
  description: "Production-ready Next.js starter for a product catalogue app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <ReduxProvider>
          <Header />
          <QueryProvider>
            {children}
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
