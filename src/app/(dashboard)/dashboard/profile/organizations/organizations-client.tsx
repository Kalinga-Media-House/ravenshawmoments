"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  joinOrganization,
  leaveOrganization,
} from "@/actions/student/organization.actions";
import { Plus, Users, LogOut, Loader2, X, Shield, Award, Flag } from "lucide-react";

const joinSchema = z.object({
  organizationId: z.string().min(1, "Select an organization"),
  role: z.string().max(100).optional(),
  joinDate: z.string().optional(),
});

type JoinFormData = z.infer<typeof joinSchema>;

interface Membership {
  id: string;
  organization_name: string;
  organization_type: string;
  role?: string;
  join_date?: string;
  leave_date?: string;
  logo_url?: string;
}

const orgTypeIcons: Record<string, typeof Shield> = {
  ncc: Shield,
  nss: Flag,
  society: Users,
  club: Award,
  union: Users,
};

const orgTypeColors: Record<string, string> = {
  ncc: "bg-green-500/10 text-green-500 border-green-500/20",
  nss: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  society: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  club: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  union: "bg-red-500/10 text-red-500 border-red-500/20",
};

interface Props {
  profileId: string;
  initialMemberships: Membership[];
}

export function OrganizationsPageClient({ profileId, initialMemberships }: Props) {
  const [memberships, setMemberships] = useState<Membership[]>(initialMemberships);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [leaveTarget, setLeaveTarget] = useState<string | null>(null);

  const form = useForm<JoinFormData>({
    resolver: zodResolver(joinSchema),
    defaultValues: { organizationId: "", role: "", joinDate: "" },
  });

  const handleJoin = (data: JoinFormData) => {
    startTransition(async () => {
      const result = await joinOrganization(data);
      if (result.success) {
        // @ts-ignore
        setMemberships((prev) => [result.data, ...prev]);
        toast.success("Joined organization");
        setShowJoinForm(false);
        form.reset();
      } else {
        toast.error(result.error || "Failed to join");
      }
    });
  };

  const handleLeave = (id: string) => {
    startTransition(async () => {
      const result = await leaveOrganization(id);
      if (result.success) {
        setMemberships((prev) => prev.filter((m) => m.id !== id));
        toast.success("Left organization");
        setLeaveTarget(null);
      } else {
        toast.error(result.error || "Failed to leave");
      }
    });
  };

  const activeMemberships = memberships.filter((m) => !m.leave_date);
  const pastMemberships = memberships.filter((m) => m.leave_date);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Organizations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            NCC, NSS, Student Union, Societies & Clubs
          </p>
        </div>
        <button
          onClick={() => setShowJoinForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus size={16} />
          Join Organization
        </button>
      </div>

      {/* Join Form */}
      {showJoinForm && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Join an Organization</h2>
            <button
              onClick={() => setShowJoinForm(false)}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={form.handleSubmit(handleJoin)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Organization *</label>
                <select
                  {...form.register("organizationId")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select organization</option>
                  <option value="ncc">NCC</option>
                  <option value="nss">NSS</option>
                  <option value="student-union">Student Union</option>
                  <option value="drama-society">Drama Society</option>
                  <option value="literary-society">Literary Society</option>
                  <option value="science-club">Science Club</option>
                  <option value="photography-club">Photography Club</option>
                  <option value="music-society">Music Society</option>
                  <option value="debate-society">Debate Society</option>
                  <option value="sports-club">Sports Club</option>
                </select>
                {form.formState.errors.organizationId && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.organizationId.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Role</label>
                <input
                  {...form.register("role")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="e.g. Member, Secretary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Join Date</label>
                <input
                  type="date"
                  {...form.register("joinDate")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isPending && <Loader2 size={16} className="animate-spin" />}
                Join
              </button>
              <button
                type="button"
                onClick={() => setShowJoinForm(false)}
                className="rounded-lg border border-input px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Memberships */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Active ({activeMemberships.length})
        </h2>
        {activeMemberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-border bg-card">
            <Users size={32} className="text-muted-foreground" />
            <h3 className="mt-3 text-lg font-semibold text-foreground">No active memberships</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Join an organization to start building your extracurricular profile.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMemberships.map((m) => {
              const type = m.organization_type?.toLowerCase() || "club";
              const IconComp = orgTypeIcons[type] || Users;
              const colorClass = orgTypeColors[type] || orgTypeColors.club;

              return (
                <div
                  key={m.id}
                  className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border ${colorClass}`}
                      >
                        <IconComp size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{m.organization_name}</h3>
                        {m.role && (
                          <p className="text-sm text-muted-foreground">{m.role}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ${colorClass}`}
                          >
                            {m.organization_type}
                          </span>
                          {m.join_date && (
                            <span className="text-xs text-muted-foreground">
                              Joined {new Date(m.join_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setLeaveTarget(m.id)}
                      className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Leave organization"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>

                  {leaveTarget === m.id && (
                    <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 flex items-center justify-between">
                      <p className="text-sm text-destructive">Leave this organization?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setLeaveTarget(null)}
                          className="rounded-md px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleLeave(m.id)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1 rounded-md bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                        >
                          {isPending && <Loader2 size={12} className="animate-spin" />}
                          Leave
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Memberships */}
      {pastMemberships.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Past ({pastMemberships.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastMemberships.map((m) => {
              const type = m.organization_type?.toLowerCase() || "club";
              const IconComp = orgTypeIcons[type] || Users;

              return (
                <div
                  key={m.id}
                  className="rounded-xl border border-border bg-card/50 p-5 opacity-70"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-muted/20">
                      <IconComp size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{m.organization_name}</h3>
                      {m.role && <p className="text-sm text-muted-foreground">{m.role}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {m.join_date && new Date(m.join_date).toLocaleDateString()} –{" "}
                        {m.leave_date && new Date(m.leave_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
