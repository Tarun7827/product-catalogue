"use client";

import { getSupabaseBrowserClient } from "@/lib/supabse/browser-client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setUser } from "@/lib/store/authSlice";
import type { RootState } from "@/lib/store/store";
import { User } from "@supabase/supabase-js";
import type { EmailPasswordFormData } from "./EmailPasswordForm";
import EmailPasswordForm from "./EmailPasswordForm";
import { useEffect, useState } from "react";
import UserSession from "@/components/auth/UserSession";

type EmailPasswordProps = {
  user: User | null;
};

export default function EmailPasswordClient({ user }: EmailPasswordProps) {
  const supabase = getSupabaseBrowserClient();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state: RootState) => state.auth.user);
  const [status, setStatus] = useState<string | null>(null);

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

  async function handleSubmit({ mode, email, password }: EmailPasswordFormData) {
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/email-password`,
        },
      });
      setStatus(error ? error.message : "Check your inbox for confirmation");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setStatus(error ? error.message : "Successfully logged in");
    }
  }

  async function handleForgotPassword(email: string) {
    await supabase.auth.resetPasswordForEmail(email);
  }

  return (
    <div className="flex max-w-full justify-center">
      <div className="rounded-[32px] w-full border border-white/10 bg-white/5 p-8 shadow-[0_25px_70px_rgba(2,6,23,0.65)] backdrop-blur">
        {currentUser && <UserSession user={currentUser} />}
        {!currentUser && (
          <EmailPasswordForm
            onSubmit={handleSubmit}
            onForgetPassword={handleForgotPassword}
            status={status}
          />
        )}
      </div>
    </div>
  );
}
