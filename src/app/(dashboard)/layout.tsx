import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNavbar, DashboardSidebar } from "@/features/dashboard/components";
import { profileService } from "@/features/profile/services";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: {
    template: "%s | Ravenshaw Moments Dashboard",
    default: "Dashboard | Ravenshaw Moments",
  },
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await profileService.getPrivateProfileByUserId(user.id);

  // Fetch authoritative RBAC roles (all active)
  let rbacRole = "";
  if (profile) {
    const { data: profileRoles } = await supabase
      .from("profile_roles")
      .select("roles!inner(code, name)")
      .eq("profile_id", profile.id)
      .eq("is_active", true);
    
    if (profileRoles && profileRoles.length > 0) {
      // Prioritize: SUPER_ADMIN > ADMIN > others
      const roleCodes = profileRoles.map((pr: any) => (pr.roles as any).code as string);
      if (roleCodes.includes("SUPER_ADMIN")) {
        rbacRole = "SUPER_ADMIN";
      } else if (roleCodes.includes("ADMIN")) {
        rbacRole = "ADMIN";
      } else {
        rbacRole = roleCodes[0];
      }
    }
  }

  // Determine display role
  const displayRole = rbacRole 
    ? `${profile?.profile_type || "member"} • ${rbacRole.replace("_", " ")}` 
    : (profile?.profile_type || "member");

  return (
    <div className="min-h-screen flex flex-col relative font-sans selection:bg-[#B01846] selection:text-white bg-[#FFFDF8]">
      <DashboardNavbar 
        userFullName={profile?.full_name || profile?.username || ""} 
        userRole={displayRole} 
        avatarUrl={undefined} 
      />
      <div className="flex-1 flex min-h-0">
        <DashboardSidebar 
          userRoleCode={rbacRole} 
          profileType={profile?.profile_type || ""} 
        />
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
