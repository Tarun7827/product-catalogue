"use client";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabse/browser-client";

type UserSessionProps = {
  user: User | null;
};

export default function UserSession({ user }: UserSessionProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const lastSignIn = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString()
    : "—";

  return (
    <section>
      <p className="text-lg font-medium text-white/90">Session details</p>
      {!user && (
        <p className="mt-5 text-sm text-slate-400">
          Session details will show up after login
        </p>
      )}
      {user && (
        <>
          <dl className="mt-5 space-y-2 text-sm text-slate-300">
            <div>
              <dt className="font-medium text-white/80">ID</dt>
              <dd className="mt-0.5 break-all font-mono text-xs">{user.id}</dd>
            </div>
            <div>
              <dt className="font-medium text-white/80">Email</dt>
              <dd className="mt-0.5">{user.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-white/80">Last sign in</dt>
              <dd className="mt-0.5">{lastSignIn}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="mt-6 w-full rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Sign out
          </button>
        </>
      )}
    </section>
  );
}