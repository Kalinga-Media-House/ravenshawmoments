import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  Building2,
  Home,
  Users,
  Image as ImageIcon,
  Calendar,
  Award,
  ShieldCheck,
  Settings,
  ChevronRight,
  UserCheck,
  Trophy,
  UserCog,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { profileService } from "@/features/profile/services";
import {
  Widget,
  WidgetHeader,
  WidgetBody,
} from "@/features/shared/components/dashboard/Widget";
import { StatGrid } from "@/features/shared/components/statistics/StatGrid";
import { StatCard } from "@/features/shared/components/statistics/StatCard";

export const metadata: Metadata = {
  title: "Dashboard | Ravenshaw Moments",
  description: "Your personal Ravenshaw Moments dashboard.",
};

function calculateProfileCompletion(profile: any) {
  const fields = [
    { name: "Full Name", value: profile?.full_name },
    { name: "Bio", value: profile?.bio },
    { name: "Gender", value: profile?.gender },
    { name: "Date of Birth", value: profile?.date_of_birth },
    { name: "Profile Photo", value: profile?.profile_media_id },
    {
      name: "Profile Claimed",
      value: profile?.profile_type === "student" ? profile?.is_profile_claimed : true,
    },
  ];

  const completedCount = fields.filter((f) => !!f.value).length;
  const percentage = Math.round((completedCount / fields.length) * 100);

  return {
    percentage,
    isComplete: percentage === 100,
    missing: fields.filter((f) => !f.value).map((f) => f.name),
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await profileService.getPrivateProfileByUserId(user.id);
  if (!profile) {
    return (
      <main className="container max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Widget variant="elevated" className="max-w-lg mx-auto text-center p-8 space-y-6">
          <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <UserCheck className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
              Profile Setup Required
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your authenticated account does not have an associated profile record. Please complete your setup to access the dashboard.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/dashboard/profile/edit"
              className="px-6 py-3 bg-primary hover:bg-[#760020] text-primary-foreground text-sm font-bold rounded-xl transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              Complete Setup
            </Link>
          </div>
        </Widget>
      </main>
    );
  }

  const completion = calculateProfileCompletion(profile);
  const safeName = profile?.full_name?.trim() || profile?.username?.trim() || "";
  const firstName = safeName.length > 0 ? safeName.split(/\s+/)[0] : "";

  const getInitials = (name: string) => {
    if (!name?.trim()) return "U";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };
  const initials = getInitials(safeName);

  // Fetch authoritative RBAC roles (all active)
  let rbacRole = "";
  if (profile) {
    const { data: profileRoles } = await supabase
      .from("profile_roles")
      .select("roles!inner(code, name)")
      .eq("profile_id", profile.id)
      .eq("is_active", true);

    if (profileRoles && profileRoles.length > 0) {
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

  const identityDisplay = profile?.profile_type
    ? profile.profile_type.replace("_", " ").toUpperCase()
    : "MEMBER";
  const roleDisplay = rbacRole
    ? `${identityDisplay} • ${rbacRole.replace("_", " ").toUpperCase()}`
    : identityDisplay;

  const hasRbacAdmin = rbacRole === "SUPER_ADMIN" || rbacRole === "ADMIN";
  const hasLegacyAdmin = profile.profile_type
    ? ["admin", "super_admin"].includes(profile.profile_type)
    : false;
  const isAdmin = hasRbacAdmin || hasLegacyAdmin;
  const isSuperAdmin = rbacRole === "SUPER_ADMIN" || profile.profile_type === "super_admin";

  const quickLinks = [
    { name: "Explore Departments", href: "/departments", icon: Building2 },
    { name: "Explore Hostels", href: "/hostels", icon: Home },
    { name: "Organizations", href: "/organizations", icon: Users },
    { name: "University Events", href: "/events", icon: Calendar },
    { name: "Moments Gallery", href: "/gallery", icon: ImageIcon },
    { name: "Community Hub", href: "/community", icon: Users },
  ];

  return (
    <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 animate-in fade-in duration-500">
      {/* ── Welcome Hero ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A050B] via-[#2D0B16] to-[#4D1225] text-white border border-white/10 shadow-xl">
        <div className="absolute right-0 top-0 size-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute left-0 bottom-0 size-48 bg-primary/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
              {firstName ? `Welcome back, ${firstName}` : "Welcome to Ravenshaw Moments"}
            </h1>
            <p className="text-white/80 max-w-xl text-sm sm:text-base leading-relaxed">
              Your Ravenshaw journey, memories, achievements, and community—all in one place.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              <ShieldCheck className="size-4 text-[#D4AF37]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {roleDisplay}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center shrink-0">
            <div className="relative size-24 rounded-full border-2 border-[#D4AF37]/80 shadow-[0_0_24px_rgba(212,175,55,0.25)] overflow-hidden bg-[#3A000E] flex items-center justify-center group">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={safeName || "Profile Photo"}
                  fill
                  className="object-cover relative z-10 transition-transform duration-500 group-hover:scale-105"
                  sizes="96px"
                  priority
                />
              ) : (
                <span className="text-3xl font-bold text-[#D4AF37] uppercase tracking-wider relative z-10">
                  {initials}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Dashboard Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Completion Widget */}
          {!completion.isComplete && (
            <Widget variant="default" className="border-l-4 border-l-[#D4AF37]">
              <WidgetHeader
                icon={<UserCheck className="size-5 text-[#D4AF37]" />}
                title="Complete your profile"
                subtitle="Preserve your Ravenshaw journey and become part of its digital legacy."
                actions={
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-2xl font-black text-primary">
                        {completion.percentage}%
                      </span>
                      <span className="block text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        Complete
                      </span>
                    </div>
                  </div>
                }
              />
              <WidgetBody className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {completion.missing.length > 0 && (
                    <div className="flex items-center flex-wrap gap-1.5 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Missing fields:</span>
                      {completion.missing.map((m) => (
                        <span
                          key={m}
                          className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/dashboard/profile/edit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-primary text-primary-foreground hover:bg-[#760020] text-sm font-bold rounded-xl transition-colors inline-flex justify-center items-center gap-2 shadow-sm shrink-0"
                  >
                    <span>Edit Profile</span>
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </WidgetBody>
            </Widget>
          )}

          {/* Community Activity Widget */}
          <Widget variant="default">
            <WidgetHeader
              icon={<Award className="size-5 text-[#D4AF37]" />}
              title="Your Community Activity"
              subtitle="Recent contributions, published moments, and event involvement."
            />
            <WidgetBody className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Award className="size-7 text-[#D4AF37]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">No activity recorded yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Your Ravenshaw journey will appear here as you contribute to the community, participate in events, and share moments.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/dashboard/profile"
                  className="px-4 py-2 text-sm font-bold text-primary hover:text-[#6A001E] transition-colors inline-flex items-center gap-1 group"
                >
                  <span>View full profile</span>
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </WidgetBody>
          </Widget>

          {/* Role-Aware Leadership Widget */}
          {["department_cr", "hostel_bmc", "organization_admin"].includes(profile.profile_type) && (
            <Widget variant="default">
              <WidgetHeader
                icon={<ShieldCheck className="size-5 text-[#D4AF37]" />}
                title={
                  profile.profile_type === "department_cr"
                    ? "Department Management"
                    : profile.profile_type === "hostel_bmc"
                    ? "Hostel Management"
                    : "Organization Management"
                }
                subtitle="Tools to manage members, verify achievements, and moderate content."
              />
              <WidgetBody className="pt-4">
                <Link
                  href={
                    profile.profile_type === "department_cr"
                      ? "/dashboard/departments"
                      : profile.profile_type === "hostel_bmc"
                      ? "/dashboard/hostels"
                      : "/dashboard/organizations"
                  }
                  className="px-5 py-2.5 bg-[#3A000E] text-white hover:bg-[#6A001E] text-sm font-bold rounded-xl transition-colors inline-flex justify-center items-center gap-2 shadow-sm border border-[#E8B83F]/30 hover:border-[#E8B83F]/60"
                >
                  <span>Open Management Portal</span>
                  <ChevronRight className="size-4" />
                </Link>
              </WidgetBody>
            </Widget>
          )}

          {/* Recruiter Widget */}
          {(rbacRole === "RECRUITER" || (profile.profile_type as string) === "recruiter") && (
            <Widget variant="default">
              <WidgetHeader
                icon={<Building2 className="size-5 text-[#D4AF37]" />}
                title="Recruitment Portal"
                subtitle="Manage placement drives, shortlist candidates, and coordinate with the placement cell."
              />
              <WidgetBody className="pt-4">
                <Link
                  href="/dashboard/recruiter"
                  className="px-5 py-2.5 bg-[#3A000E] text-white hover:bg-[#6A001E] text-sm font-bold rounded-xl transition-colors inline-flex justify-center items-center gap-2 shadow-sm border border-[#E8B83F]/30 hover:border-[#E8B83F]/60"
                >
                  <span>Go to Recruitment Dashboard</span>
                  <ChevronRight className="size-4" />
                </Link>
              </WidgetBody>
            </Widget>
          )}
        </div>

        {/* Right Column — 1/3 width */}
        <div className="space-y-6">
          {/* Quick Links Widget */}
          <Widget variant="default">
            <WidgetHeader title="Quick Links" subtitle="Navigate across campus communities" />
            <WidgetBody className="space-y-2 pt-2">
              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:border-[#D4AF37]/60 hover:bg-muted/40 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="size-4 text-[#D4AF37]" />
                      </div>
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {link.name}
                      </span>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                );
              })}
            </WidgetBody>
          </Widget>

          {/* Administrative Management Widget */}
          {isAdmin && (
            <Widget variant="elevated" className="border-primary/30">
              <WidgetHeader
                icon={<ShieldCheck className="size-5 text-[#D4AF37]" />}
                title="Admin Control Center"
                subtitle="High-privilege platform management"
              />
              <WidgetBody className="space-y-2 pt-2">
                <Link
                  href="/admin/competitions"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border/80 hover:border-primary/60 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                      <Trophy className="size-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Competitions & Results
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Manage evaluations & ties
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/donations"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border/80 hover:border-primary/60 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                        <Settings className="size-5" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          Manage Donations
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Offline & manual contributions
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                )}

                {isSuperAdmin && (
                  <Link
                    href="/admin/roles"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border/80 hover:border-primary/60 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                        <UserCog className="size-5" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          Platform Role Management
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Assign & audit administrative roles
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                )}
              </WidgetBody>
            </Widget>
          )}
        </div>
      </div>
    </main>
  );
}