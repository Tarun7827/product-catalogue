import Link from "next/link";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-slate-950/40 backdrop-blur">
        <div className="mx-auto flex w-full items-center justify-between px-6 py-5">
            <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                    Supabase Auth Demo
                </p>
                <h1 className="text-2xl font-semibold text-white">{title}</h1>
            </div>
            <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
            >
                Back home →
            </Link>
        </div>
    </header>
  );
}