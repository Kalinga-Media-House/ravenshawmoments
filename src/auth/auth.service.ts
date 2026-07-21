import { createClient } from "../lib/supabase/server";
import { AuthenticationError } from "../lib/errors";

export class AuthService {
  async signIn(email: string, redirectTo?: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      throw new AuthenticationError("Failed to sign in");
    }

    return data;
  }

  async signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new AuthenticationError("Failed to sign out");
    }

    return true;
  }

  async resetPasswordForEmail(email: string, redirectTo?: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      throw new AuthenticationError("Failed to initiate password reset");
    }

    return data;
  }
}
