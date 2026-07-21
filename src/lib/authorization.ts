"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Authorization result returned by verify functions.
 */
export interface AuthResult {
  authorized: boolean;
  userId: string;
  profileId: string;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  error?: string;
}

const UNAUTHORIZED_RESULT: AuthResult = {
  authorized: false,
  userId: "",
  profileId: "",
  isSuperAdmin: false,
  isAdmin: false,
  error: "Authentication required.",
};

const FORBIDDEN_RESULT: AuthResult = {
  authorized: false,
  userId: "",
  profileId: "",
  isSuperAdmin: false,
  isAdmin: false,
  error: "Insufficient privileges.",
};

/**
 * Fetches the authenticated user's platform admin role information.
 * Does NOT enforce any access level — use verifyPlatformAdmin or verifySuperAdmin instead.
 */
async function getAuthContext(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return UNAUTHORIZED_RESULT;
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, profile_type")
    .eq("auth_user_id", user.id)
    .single();

  if (!profile) {
    return { ...UNAUTHORIZED_RESULT, userId: user.id, error: "Profile not found." };
  }

  // Fetch RBAC roles
  const { data: profileRoles } = await supabase
    .from("profile_roles")
    .select("roles!inner(code)")
    // @ts-ignore
    .eq("profile_id", profile.id)
    .eq("is_active", true);

  const roleCodes = (profileRoles || []).map((pr: any) => (pr.roles as any).code as string);

  const isSuperAdmin =
    // @ts-ignore
    roleCodes.includes("SUPER_ADMIN") || profile.profile_type === "super_admin";
  // @ts-ignore
  const isAdmin = roleCodes.includes("ADMIN") || profile.profile_type === "admin";

  return {
    authorized: true,
    userId: user.id,
    // @ts-ignore
    profileId: profile.id,
    isSuperAdmin,
    isAdmin: isSuperAdmin || isAdmin, // SUPER_ADMIN inherits ADMIN
  };
}

/**
 * Verifies that the current user holds an active SUPER_ADMIN or ADMIN role.
 * Use for standard platform administration operations.
 */
export async function verifyPlatformAdmin(): Promise<AuthResult> {
  const ctx = await getAuthContext();
  if (!ctx.authorized) return ctx;

  if (!ctx.isAdmin) {
    return {
      ...ctx,
      authorized: false,
      error: "Platform Admin privileges required.",
    };
  }

  return ctx;
}

/**
 * Verifies that the current user holds an active SUPER_ADMIN role.
 * Use for protected owner-level operations like role management.
 */
export async function verifySuperAdmin(): Promise<AuthResult> {
  const ctx = await getAuthContext();
  if (!ctx.authorized) return ctx;

  if (!ctx.isSuperAdmin) {
    return {
      ...ctx,
      authorized: false,
      error: "Super Admin privileges required.",
    };
  }

  return ctx;
}

/**
 * Returns basic auth context without enforcing any role.
 * Useful for dashboard pages that need to know roles for display.
 */
export async function getAuthInfo(): Promise<AuthResult> {
  return getAuthContext();
}
