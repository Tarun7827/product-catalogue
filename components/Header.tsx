"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import LogoSK from "./icons/LogoSK";
import CartIcon from "./icons/CartIcon";
import SearchIcon from "./icons/SearchIcon";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setUser } from "@/lib/store/authSlice";
import { getSupabaseBrowserClient } from "@/lib/supabse/browser-client";
import type { RootState } from "@/lib/store/store";
import { User } from "@supabase/supabase-js";

function getDisplayName(user: User | null): string | null {
  if (!user) return null;
  console.log(user.user_metadata);
  const name =
    user.user_metadata?.displayName ??
    user.user_metadata?.name ??
    user.email?.split("@")[0];
  return name ?? "Profile";
}

export default function Header() {
  const cartCount = useAppSelector((state: RootState) => state.cart?.items?.length ?? 0);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const displayName = getDisplayName(user);
  const supabase = getSupabaseBrowserClient();

  // Keep Redux user state in sync with Supabase auth events
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(setUser(session?.user ?? null));
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase, dispatch]);

  const handleSearch = () => {
    console.log("Search clicked");
  };

  const handleLogin = () => {
    router.push("/auth");
  };

  const handleCartClick = () => {
    console.log("Cart clicked");
    router.push("/cart");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80"
        >
          <LogoSK />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            ShopKart
          </h1>
        </Link>

        {/* Search Bar */}
        <div className="relative hidden flex-1 max-w-md md:block">
          <Input
            type="text"
            placeholder="Search products..."
            className="pr-10"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Icon */}
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
            aria-label="Search"
          >
            <SearchIcon />
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={handleCartClick}
            className="relative rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100"
            aria-label="Shopping cart"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-2 sm:flex">
            {user ? (
              <Link
                href="/profile"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
              >
                {displayName ?? "Profile"}
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
              >
                Login/Register
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}