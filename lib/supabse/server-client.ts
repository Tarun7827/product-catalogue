import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getEnvironmentVariables } from "@/lib/utils/env";

export async function createSupabseServerClient() {
  const { supabaseUrl, supabaseKey} = getEnvironmentVariables();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey , {
    cookies: {
      getAll(){
        return cookieStore.getAll();
      },
      setAll(cookesToSet) {
        try { cookesToSet.forEach(({name, value, options}) => 
        cookieStore.set(name, value, options)
      );
    }catch(error) {
      console.log(error)
    }
      }
    }
  });

  
}

