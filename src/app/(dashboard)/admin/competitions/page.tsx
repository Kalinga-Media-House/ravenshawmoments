import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Trophy,
  Award,
  ShieldAlert,
  ExternalLink,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Manage Competitions | Admin Dashboard",
  description: "Administrative directory for managing university competitions, evaluations, and official result publication.",
};

export default async function AdminCompetitionsDirectoryPage() {
  const supabase = await createClient();

  // 1. Verify Authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/competitions");
  }

  // 2. Fetch competitions where user has administrative access or fetch all if super admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, profile_type, full_name")
    .eq("id", user.id)
    .single();

  // Authoritative RBAC check via profile_roles
  const { data: profileRoles } = await supabase
    .from("profile_roles")
    .select("roles!inner(code)")
    // @ts-ignore
    .eq("profile_id", profile?.id || "")
    .eq("is_active", true)
    .in("roles.code", ["SUPER_ADMIN", "ADMIN"]);

  const hasRbacAdmin = profileRoles && profileRoles.length > 0;
  // @ts-ignore
  const hasLegacyAdmin = ["admin", "super_admin"].includes(profile?.profile_type || "");
  const isAdmin = hasRbacAdmin || hasLegacyAdmin;

  if (!isAdmin) {
    return (
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="p-8 rounded-2xl bg-card border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-serif font-bold text-foreground">Admin Access Required</h1>
          <p className="text-sm text-muted-foreground">
            You must have administrative privileges to access the Competition Management Directory.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-bold inline-block hover:bg-stone-800 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Fetch Competitions ordered by start_date desc
  const { data: competitions } = await supabase
    .from("competitions")
    .select(`
      id,
      slug,
      title,
      category,
      level,
      status,
      start_date,
      organizer_name
    `)
    .order("start_date", { ascending: false });

  const list = competitions || [];

  return (
    <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
            <Trophy className="w-4 h-4" />
            Admin Competition Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Competitions & Result Evaluation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select a competition below to enter participant marks, resolve ties, and publish official results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl border border-stone-300 text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/competitions/new"
            className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Competition
          </Link>
        </div>
      </section>

      {/* Competitions Table */}
      <section className="rounded-2xl bg-card border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-6">Competition</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4">Organizer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No competitions found in the registry.
                  </td>
                </tr>
              ) : (
                list.map((c: any) => (
                  <tr
                    // @ts-ignore
                    key={c.id}
                    className="hover:bg-stone-50/60 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-foreground group-hover:text-red-700 transition-colors">
                        // @ts-ignore
                        {c.title}
                      </div>
                      // @ts-ignore
                      <div className="text-xs text-muted-foreground">Slug: {c.slug}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                        // @ts-ignore
                        {c.category || "General"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-muted-foreground font-medium">
                      // @ts-ignore
                      {c.level || "University"}
                    </td>

                    <td className="py-4 px-4 text-muted-foreground">
                      // @ts-ignore
                      {c.organizer_name || "Ravenshaw University"}
                    </td>

                    <td className="py-4 px-4 text-xs text-muted-foreground">
                      // @ts-ignore
                      {c.start_date
                        // @ts-ignore
                        ? new Date(c.start_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          // @ts-ignore
                          href={`/competitions/${c.slug}`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-xs font-medium text-stone-700 inline-flex items-center gap-1 transition-colors"
                        >
                          Public Page
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </Link>

                        <Link
                          // @ts-ignore
                          href={`/admin/competitions/${c.id}`}
                          className="px-4 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-colors"
                        >
                          Manage
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
