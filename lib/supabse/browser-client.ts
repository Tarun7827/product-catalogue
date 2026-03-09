import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { getEnvironmentVariables } from "@/lib/utils/env";

// Browser-only Supabase client factory + singleton.
// Use this from Client Components when you need to call Supabase directly in the browser.

export function createSupabaseBrowserClient() {
  // Creates a fresh client instance (useful for tests or one-off usage).
  const { supabaseUrl, supabaseKey } = getEnvironmentVariables();
  return createBrowserClient(supabaseUrl, supabaseKey);
}

type SupabaseSchema = Record<string, never>;

// Keep a single client instance per browser session to avoid recreating it on every render.
let client: SupabaseClient<SupabaseSchema> | null = null;

export function getSupabaseBrowserClient(): SupabaseClient<SupabaseSchema> {
  if (client) return client;

  client = createSupabaseBrowserClient();
  return client;
}

