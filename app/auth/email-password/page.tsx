import { createSupabseServerClient } from "@/lib/supabse/server-client";
import EmailPasswordClient from "./EmailPasswordClient";
import { AuthPageDescription } from "@/components/auth/AuthPageDescription";

export default async function EmailPasswordPage(){
    const supabase = await createSupabseServerClient()
    const {
        data: { user},
    } = await supabase.auth.getUser();
 
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AuthPageDescription
            title="Email + Password"
            intro="Classic credentials—users enter details, Supabase secures the rest while getSession + onAuthStateChange keep the UI live."
            steps={[
              "Toggle between sign up and sign in.",
              "Submit to watch the session card refresh instantly.",
              "Sign out to reset the listener.",
            ]}
          >
          <EmailPasswordClient user={user} />
        </AuthPageDescription>
      </div>
    );
}