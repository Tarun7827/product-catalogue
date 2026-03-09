"use client";

import { getSupabaseBrowserClient } from "@/lib/supabse/browser-client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setUser } from "@/lib/store/authSlice";
import type { RootState } from "@/lib/store/store";
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";
import UserSession from "@/components/auth/UserSession";
import GoogleLoginPanel from "./GoogleLoginPanel";

type EmailPasswordProps = {
  user: User | null;
};

export default function GoogleLoginClient({ user }: EmailPasswordProps) {
  const supabase = getSupabaseBrowserClient();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state: RootState) => state.auth.user);

  // Seed Redux with the initial user from the server
  useEffect(() => {
    dispatch(setUser(user));
  }, [dispatch, user]);

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

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/google-login`,
        skipBrowserRedirect: false,
      },
    });
  }

  return (
    <div className="flex max-w-full h-full justify-center">
      <div className="rounded-[32px] w-full border border-white/10 bg-white/5 p-8 shadow-[0_25px_70px_rgba(2,6,23,0.65)] backdrop-blur">
        {!currentUser && <GoogleLoginPanel onSubmit={handleGoogleLogin} />}
        {currentUser && <UserSession user={currentUser} />}
      </div>
    </div>
  );
}
