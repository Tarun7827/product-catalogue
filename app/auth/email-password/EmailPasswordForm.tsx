"use client";

import { type FormEventHandler, useState } from "react";

export type AuthMode = "signup" | "signin";

const PASSWORD_RULES = [
  "Minimum 8 characters",
  "At least 1 uppercase letter",
  "At least 1 lowercase letter",
  "At least 1 special character (!@#$%^&* etc.)",
];

function validatePassword(value: string): { valid: boolean; message?: string } {
  if (value.length < 8) return { valid: false, message: "Password must be at least 8 characters" };
  if (!/[A-Z]/.test(value)) return { valid: false, message: "Password must contain at least one uppercase letter" };
  if (!/[a-z]/.test(value)) return { valid: false, message: "Password must contain at least one lowercase letter" };
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) return { valid: false, message: "Password must contain at least one special character" };
  return { valid: true };
}

export type EmailPasswordFormData = {
  mode: AuthMode;
  email: string;
  password: string;
};

type EmailPasswordFormProps = {
  onSubmit: (data: EmailPasswordFormData) => void | Promise<void>;
  onForgetPassword: (email: string) => void | Promise<void>;
  status: string | null;
};

export default function EmailPasswordForm({ onSubmit, onForgetPassword, status }: EmailPasswordFormProps) {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showRulesTooltip, setShowRulesTooltip] = useState(false);

  const title = mode === "signup" ? "Create an account" : "Log In";

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    if (mode === "signup") {
      const result = validatePassword(password);
      if (!result.valid) {
        setPasswordError(result.message ?? "Invalid password");
        return;
      }
    }
    await onSubmit({ mode, email, password });
  };

  const handleForgotPassword = async () => {
    if (!email) return;
    await onForgetPassword(email);
    alert("Check you email for REset password link");
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-md border-1 border-zinc-100 p-1 text-xs font-medium text-zinc-700">
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-md px-4 py-1 transition ${mode === "signup"
                      ? "bg-emerald-700 text-white shadow shadow-emerald-500/20"
                      : "text-slate-400 hover:bg-emerald-500/30"
                      }`}
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={() => setMode("signin")}
         className={`flex-1 rounded-md px-4 py-1 transition ${mode === "signin"
                      ? "bg-emerald-700 text-white shadow shadow-emerald-500/20"
                      : "text-slate-400 hover:bg-emerald-500/30"
                      }`}
        >
          Log in
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-base mt-4 font-semibold text-white/90">{title}</h2>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-white/90">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-offset-0 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <label className="block text-xs font-medium text-white/90">
              Password
            </label>
            <div
              className="relative"
              onMouseEnter={() => setShowRulesTooltip(true)}
              onMouseLeave={() => setShowRulesTooltip(false)}
            >
              <button
                type="button"
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                aria-label="Password rules"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 12H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
              </button>
              {showRulesTooltip && (
                <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-normal text-zinc-700 shadow-lg">
                  <p className="mb-1.5 font-semibold text-zinc-900">Password must have:</p>
                  <ul className="list-inside list-disc space-y-0.5">
                    {PASSWORD_RULES.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(null);
            }}
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none ring-offset-0 focus:ring-2 focus:ring-zinc-300 ${passwordError ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-zinc-300 focus:border-zinc-500"}`}
            placeholder="••••••••"
          />
          {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
          {mode === "signin" &&
            <button
              type="button"
              onClick={handleForgotPassword}
              className="cursor-pointer text-xs text-white/80 underline hover:text-white/90"
            >
              forgot password?
            </button>
          }
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          {mode === "signup" ? "Create account" : "Log in"}
        </button>

        {status &&
          <div>
            {status}
          </div>}
      </form>
    </>
  );
}
