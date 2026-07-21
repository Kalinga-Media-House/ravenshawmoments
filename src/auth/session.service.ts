import { createClient } from "../lib/supabase/server";
import { AuthenticationError } from "../lib/errors";

export class SessionService {
  async getCurrentUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  }

  async getCurrentProfile() {
    const user = await this.getCurrentUser();
    
    if (!user) {
      return null;
    }

    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (error) {
      return null;
    }

    return profile;
  }

  async refreshSession() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      throw new AuthenticationError("Failed to refresh session");
    }

    return data.session;
  }
}
