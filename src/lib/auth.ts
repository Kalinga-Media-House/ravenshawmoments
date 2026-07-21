import { createClient } from "./supabase/server";
import { AuthenticationError } from "./errors";
import { ROLES } from "./constants";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Call the existing RPC in the DB to check super admin status
  const { data: isAdmin, error } = await supabase.rpc("is_admin_or_super");

  if (error || !isAdmin) {
    throw new AuthenticationError("Admin access required");
  }

  return user;
}
