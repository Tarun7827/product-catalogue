"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setUser } from "@/lib/store/authSlice";
import { getSupabaseBrowserClient } from "@/lib/supabse/browser-client";
import type { RootState } from "@/lib/store/store";
import { User } from "@supabase/supabase-js";
import UserProfile from "./UserProfile";
import OrdersHistory from "./OrdersHistory";

function getDisplayName(user: User | null): string | null {
  if (!user) return null;
  return (
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    null
  );
}

const TABS = [
  { id: "profile",   label: "My Profile"     },
  { id: "orders",    label: "Order History"  },
] as const;

type ProfileTab = (typeof TABS)[number]["id"];

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const displayName = getDisplayName(user);
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.replace("/auth");
    }
  }, [user, router]);

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    dispatch(setUser(null));
    router.push("/");
  };

  if (user === undefined || !user) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
        <div className="flex items-center justify-center py-24">
          <p className="text-slate-500">Loading…</p>
        </div>
      </main>
    );
  }

  const lastSignIn = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString()
    : "—";

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <div className="flex rounded-xl w-full gap-8">
        {/* Left: tab navigation */}
        <aside className="w-1/4 shrink-0">
          <nav className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right: active tab content */}
        <div className="w-full border border-slate-200 rounded-xl flex-1">
          {activeTab === "profile" && displayName && user.email && (
            <UserProfile
              displayName={displayName}
              email={user.email}
              lastSignIn={lastSignIn}
              handleSignOut={handleSignOut}
            />
          )}
          {activeTab === "orders" && <OrdersHistory />}
        </div>
      </div>
    </main>
  );
}
