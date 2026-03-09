"use client";
import type { ReactNode } from "react";
import Header from "./Header";

type AuthPageProps = {
  title: string;
  intro: string;
  steps: string[];
  children: ReactNode;
};

export function AuthPageDescription({
  title,
  intro,
  steps,
  children,
}: AuthPageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
        <Header title={title} />

        <main className="mx-auto w-full px-6 py-12">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[32px] h-full border border-white/10 bg-white/5 p-8 shadow-[0_25px_70px_rgba(2,6,23,0.65)]">
                <p className="text-lg font-medium text-white/90">{intro}</p>
                <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-slate-300">
                {steps.map((step) => (
                    <li key={step}>{step}</li>
                ))}
                </ol>
            </section>
            <div className="flex flex-col gap-6">{children}</div>
            </div>
        </main>
    </div>
  );
}