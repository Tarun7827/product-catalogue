import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getEnvironmentVariables } from "@/lib/utils/env";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const { supabaseUrl, supabaseKey } = getEnvironmentVariables();

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Write cookies onto the outgoing response so the browser stores the refreshed session.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refreshes the session if expired — must be called before any Server Component reads auth state.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
