"use client";

import { useState } from "react";
import Link from "next/link";

import { Input } from "./ui/input";
import LogoSK from "./icons/LogoSK";
import CartIcon from "./icons/CartIcon";
import SearchIcon from "./icons/SearchIcon";

export default function Header() {
  const [cartCount] = useState(3);

  const handleSearch = () => {
    console.log("Search clicked");
  };

  const handleLogin = () => {
    console.log("Login");
  };

  const handleRegister = () => {
    console.log("Register");
  };

  const handleCartClick = () => {
    console.log("Cart clicked");
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
            <button
              type="button"
              onClick={handleLogin}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}