import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { RoleManagementClient } from "./RoleManagementClient";

export const metadata: Metadata = {
  title: "Role Management | Admin Dashboard",
  description: "Manage platform admin roles. Super Admin access required.",
  robots: { index: false, follow: false },
};

export default async function AdminRolesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/roles");
  }

  // ── Authorization: canonical RBAC check ──
  // Uses the same profile_roles + roles query as dashboard/page.tsx
  // and the centralized authorization.ts helper (getAuthContext).
  let isSuperAdmin = false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, profile_type")
    .eq("auth_user_id", user.id)
    .single();

  if (profile) {
    // RBAC: query profile_roles joined with roles (canonical source)
    const { data: roleAssignments } = await supabase
      .from("profile_roles")
      .select("roles!inner(code)")
      // @ts-ignore
      .eq("profile_id", profile.id)
      .eq("is_active", true);

    if (roleAssignments && roleAssignments.length > 0) {
      const roleCodes = roleAssignments.map(
        (ra: any) => (ra.roles as any).code as string
      );
      isSuperAdmin = roleCodes.includes("SUPER_ADMIN");
    }

    // Legacy fallback: profiles.profile_type
    // @ts-ignore
    if (!isSuperAdmin && profile.profile_type === "super_admin") {
      isSuperAdmin = true;
    }
  }

  if (!isSuperAdmin) {
    return (
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="p-8 rounded-2xl bg-white border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-serif font-bold text-[#171214]">Super Admin Access Required</h1>
          <p className="text-sm text-[#756A6E]">
            Only Super Admins can access role management. This restriction is enforced at the database level.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-[#8F0028] text-white text-sm font-bold inline-block hover:bg-[#760020] transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-in fade-in duration-500">
      <section>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8F0028] mb-1">
          <ShieldAlert className="w-4 h-4" />
          Super Admin Only
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171214]">
          Platform Role Management
        </h1>
        <p className="text-sm text-[#756A6E] mt-1">
          Search users and assign or revoke the Admin role. Community identity roles (Student, Alumni, Teacher) are preserved independently.
        </p>
      </section>

      <RoleManagementClient />
    </main>
  );
}
