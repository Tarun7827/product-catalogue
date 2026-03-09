declare module "@tarun/auth-supabase-library" {
  import type { JSX } from "react";

  export type AuthMode = "signup" | "signin";
  export type EmailPasswordFormData = {
    mode: AuthMode;
    email: string;
    password: string;
  };
  export type SupabaseConfig = {
    supabaseUrl: string;
    supabaseKey: string;
  };

  export function EmailPasswordForm(props: {
    onSubmit: (data: EmailPasswordFormData) => void | Promise<void>;
    onForgetPassword: (email: string) => void | Promise<void>;
    status: string | null;
  }): JSX.Element;

  export function GoogleLoginPanel(props: {
    onSubmit: () => void | Promise<void>;
  }): JSX.Element;

  export function createSupabaseBrowserClient(
    config: SupabaseConfig
  ): import("@supabase/supabase-js").SupabaseClient;

  export function getSupabaseBrowserClient(
    config: SupabaseConfig
  ): import("@supabase/supabase-js").SupabaseClient;
  export function resetSupabaseBrowserClient(): void;
  export function createSupabaseServerClient(
    config: SupabaseConfig,
    cookieHandler: {
      getAll: () => Array<{ name: string; value: string }>;
      setAll: (cookies: Array<{ name: string; value: string; options?: unknown }>) => void;
    }
  ): Promise<import("@supabase/supabase-js").SupabaseClient>;

  export function createAuthStore(): unknown;
  export const setUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<
    import("@supabase/supabase-js").User | null,
    string
  >;
  export function useAppDispatch(): unknown;
  export const useAppSelector: import("react-redux").TypedUseSelectorHook<unknown>;
}
